<template>
  <div :class="{ 'voice-recorder--active': props.isStartRecording }" class="voice-recorder">
    <button
      class="voice-recorder__button voice-recorder__button--cancel"
      type="button"
      @click="cancelRecording"
    >
      <DeleteIcon />
    </button>

    <button
      v-if="isRecording"
      class="voice-recorder__button voice-recorder__button--pause"
      type="button"
      @click="stopRecording"
    >
      <span class="voice-recorder__pause-indicator"></span>
    </button>

    <button
      v-else-if="audioUrl && !isPlaying"
      class="voice-recorder__button voice-recorder__button--play"
      type="button"
      @click="playAudio"
    >
      <TriangleIcon />
    </button>

    <button
      v-else-if="audioUrl && isPlaying"
      class="voice-recorder__button voice-recorder__button--pause"
      type="button"
      @click="pauseAudio"
    >
      <span class="voice-recorder__pause-indicator"></span>
    </button>

    <div
      ref="waveformRef"
      class="voice-recorder__waveform"
      :class="{ 'voice-recorder__waveform--clickable': hasDuration && !isRecording }"
      @click="seek"
    >
      <div
        v-for="(lvl, i) in levels"
        :key="i"
        class="voice-recorder__bar"
        :class="{ 'voice-recorder__bar--played': hasDuration && i <= playedIndex }"
        :style="{ height: barHeight(lvl) + 'px' }"
      ></div>
    </div>

    <div class="voice-recorder__time">{{ displayTime }}</div>

    <audio
      v-if="audioUrl"
      ref="audioRef"
      :src="audioUrl"
      preload="metadata"
      @loadedmetadata="onLoadedMetadata"
    ></audio>

    <button
      class="voice-recorder__button voice-recorder__button--send"
      type="button"
      @click="sendVoiceMessage"
    >
      <ArrowIcon />
    </button>
  </div>
</template>

<script setup lang="ts">
import ArrowIcon from '@/assets/images/arrow.svg'
import DeleteIcon from '@/assets/images/delete.svg'
import TriangleIcon from '@/assets/images/triangle.svg'
import BotConversationService, { type BotMessagePayload } from '@/services/bot-conversation.service'
import { useMessagesStore } from '@/stores/messages'

const messagesStore = useMessagesStore()
const props = defineProps<{ isStartRecording: boolean }>()
const emit = defineEmits<{ (e: 'stop-recording'): void }>()

let mediaRecorder: MediaRecorder | null = null
let activeStream: MediaStream | null = null
let stopRecordingResolver: (() => void) | null = null
let discardRecordedBlob = false

const isRecording = ref(false)
const isPlaying = ref(false)
const levels = ref<number[]>([])
const elapsed = ref(0)
const playbackTime = ref(0)
const audioBlob = ref<Blob | null>(null)
const audioUrl = ref<string | null>(null)
const decodedDuration = ref(0)
const audioRef = ref<HTMLAudioElement | null>(null)
const waveformRef = ref<HTMLElement | null>(null)

let recordTimerId: number | null = null
let audioCtx: AudioContext | null = null
let analyser: AnalyserNode | null = null
let sampleTimer: number | null = null

const MAX_BARS = 30
const MIN_HEIGHT = 5
const SCALE = 7.5
const SAMPLE_MS = 200

const formatTime = (t: number) => {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s < 10 ? '0' + s : s}`
}

const displayTime = computed(() =>
  audioUrl.value ? formatTime(playbackTime.value) : formatTime(elapsed.value)
)

const hasDuration = computed(() => !!decodedDuration.value || (audioRef.value?.duration ?? 0) > 0)
const trackDuration = computed(() =>
  audioRef.value?.duration && isFinite(audioRef.value.duration)
    ? audioRef.value.duration
    : decodedDuration.value
)

const playedIndex = computed(() =>
  hasDuration.value
    ? Math.floor((playbackTime.value / (trackDuration.value || 1)) * levels.value.length)
    : -1
)

const onLoadedMetadata = () => {
  playbackTime.value = audioRef.value?.currentTime ?? 0
}

onMounted(async () => {
  if (typeof window === 'undefined') {
    return
  }

  await import('webrtc-adapter')

  if (!window.MediaRecorder) {
    const mod = await import('audio-recorder-polyfill')
    window.MediaRecorder = mod.default as unknown as typeof MediaRecorder
  }
})

watch(() => props.isStartRecording, (value) => {
  if (value) {
    void startRecording()
  }
})

async function startRecording() {
  if (isRecording.value) {
    return
  }

  discardRecordedBlob = false
  clearInterval(recordTimerId ?? undefined)
  elapsed.value = 0
  recordTimerId = window.setInterval(() => {
    elapsed.value += 1
  }, 1000)
  levels.value = []
  audioBlob.value = null
  audioUrl.value = null
  decodedDuration.value = 0
  isPlaying.value = false
  isRecording.value = true

  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    activeStream = stream
  } catch (error) {
    console.error('getUserMedia error', error)
    isRecording.value = false
    clearInterval(recordTimerId ?? undefined)
    return
  }

  const options: MediaRecorderOptions = {}
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
    options.mimeType = 'audio/webm;codecs=opus'
  } else if (MediaRecorder.isTypeSupported('audio/webm')) {
    options.mimeType = 'audio/webm'
  }

  mediaRecorder = new MediaRecorder(stream, options)
  const chunks: BlobPart[] = []

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data)
    }
  }

  mediaRecorder.onstop = async () => {
    try {
      if (!discardRecordedBlob && chunks.length) {
        const mime = options.mimeType?.split(';')[0] || 'audio/webm'
        const blob = new Blob(chunks, { type: mime })
        audioBlob.value = blob
        audioUrl.value = URL.createObjectURL(blob)

        try {
          const decoderContext = new AudioContext()
          const buffer = await decoderContext.decodeAudioData(await blob.arrayBuffer())
          decodedDuration.value = buffer.duration
          await decoderContext.close()
        } catch {
          decodedDuration.value = 0
        }

        await nextTick()
        audioRef.value?.load()
      } else {
        audioBlob.value = null
        audioUrl.value = null
        decodedDuration.value = 0
      }
    } finally {
      activeStream?.getTracks().forEach((track) => track.stop())
      activeStream = null
      mediaRecorder = null
      const resolve = stopRecordingResolver
      stopRecordingResolver = null
      resolve?.()
    }
  }

  mediaRecorder.start()

  try {
    audioCtx = new AudioContext()
    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 2048
    const source = audioCtx.createMediaStreamSource(stream)
    source.connect(analyser)
    sampleTimer = window.setInterval(sampleLevel, SAMPLE_MS)
  } catch (error) {
    console.error('AudioContext error', error)
  }
}

async function stopRecording() {
  if (!mediaRecorder || mediaRecorder.state !== 'recording') {
    return
  }

  const completion = new Promise<void>((resolve) => {
    stopRecordingResolver = resolve
  })

  mediaRecorder.stop()
  cleanupRecording()
  await completion
}

function cancelRecording() {
  discardRecordedBlob = true

  void stopRecording().finally(() => {
    elapsed.value = 0
    levels.value = []
    audioBlob.value = null
    audioUrl.value = null
    decodedDuration.value = 0
    isPlaying.value = false
    emit('stop-recording')
  })
}

function cleanupRecording() {
  isRecording.value = false
  clearInterval(sampleTimer ?? undefined)
  clearInterval(recordTimerId ?? undefined)
  sampleTimer = null
  recordTimerId = null
  if (audioCtx && audioCtx.state !== 'closed') {
    void audioCtx.close()
  }
  audioCtx = null
  analyser = null
  activeStream?.getTracks().forEach((track) => track.stop())
  activeStream = null
}

function playAudio() {
  const audio = audioRef.value
  if (!audio) {
    return
  }

  void audio.play()
  isPlaying.value = true
  audio.onended = () => {
    isPlaying.value = false
  }
}

function pauseAudio() {
  audioRef.value?.pause()
  isPlaying.value = false
}

function seek(event: MouseEvent) {
  const audio = audioRef.value
  const waveform = waveformRef.value

  if (!audio || !waveform || isRecording.value || !hasDuration.value) {
    return
  }

  const rect = waveform.getBoundingClientRect()
  const fraction = Math.min(Math.max(0, (event.clientX - rect.left) / rect.width), 1)
  const time = fraction * trackDuration.value

  audio.currentTime = time
  playbackTime.value = time
}

function sampleLevel() {
  if (!analyser) {
    return
  }

  const data = new Uint8Array(analyser.fftSize)
  analyser.getByteTimeDomainData(data)

  let sum = 0
  data.forEach((value) => {
    const delta = value - 128
    sum += delta * delta
  })

  levels.value.push(Math.min(Math.sqrt(sum / data.length) / 128, 1))
  if (levels.value.length > MAX_BARS) {
    levels.value.shift()
  }
}

function barHeight(level: number) {
  const raw = level * 40 * SCALE
  return Math.min(Math.max(raw, MIN_HEIGHT), 50)
}

async function sendVoiceMessage() {
  await stopRecording()
  await nextTick()

  const blob = audioBlob.value
  if (!(blob instanceof Blob)) {
    console.error('No valid audio blob to send')
    return
  }

  try {
    const data: BotMessagePayload = {
      sessionId: Number(localStorage.getItem('sessionId')),
      messageId: messagesStore.currentMessageId,
      text: '',
      file: blob
    }

    const service = new BotConversationService(data)
    const response = await service.sendMessage()
    if (response) {
      cleanupRecording()
      emit('stop-recording')
    } else {
      cleanupRecording()
      emit('stop-recording')
    }
  } catch (error) {
    console.error('Error sending voice message:', error)
  }
}

onBeforeUnmount(cleanupRecording)
</script>

<style lang="scss" scoped>
.voice-recorder {
  background-color: $default-white;
  border-radius: 25px;
  padding: 0 8px;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  clip-path: inset(0 0 0 100%);
  transition: all 0.1s ease;

  &--active {
    clip-path: inset(0 0 0 0) !important;
  }

  &__button {
    $size_button: 32px;

    border: none;
    height: $size_button;
    min-width: $size_button;
    border-radius: 50%;
    margin-right: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    background-color: $primary-background-color-bot;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &--cancel {
      background-color: #EEEEEE;
    }

    &--play {
      background-color: $primary-background-color-bot;
    }

    &--pause {
      position: relative;
    }

    &--send {
      margin-right: 0 !important;

      svg {
        transform: rotate(-90deg);
      }
    }
  }

  &__pause-indicator {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 45%;
      height: 45%;
      border-radius: 3px;
      background-color: $default-white;
    }
  }

  &__waveform {
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 3px;
    flex: 1;
    height: 40px;
    padding: 2px;
    border-radius: 4px;

    &--clickable {
      cursor: pointer;
    }
  }

  &__bar {
    min-width: 3px;
    max-width: 3px;
    background: #444;
    border-radius: 1px;
    opacity: 0.5;
    transition: opacity 0.2s ease;
    max-height: 20px;

    &--played {
      opacity: 1;
    }
  }

  &__time {
    padding: 0 16px;
    font-size: 15px;
    font-family: $Inter-Regular;
    font-weight: 400;
    color: $default-black;
    min-width: 36px;
    text-align: center;
  }
}
</style>
