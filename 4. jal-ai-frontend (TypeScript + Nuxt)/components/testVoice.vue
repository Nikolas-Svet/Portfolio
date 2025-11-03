<template>
  <div :class="{ 'voice-recorder--active': props.isStartRecording }" class="voice-recorder">
    <!-- Кнопки управления -->
    <button class="button__cancel" @click="cancelRecording"><DeleteIcon/></button>
    <button
        v-if="isRecording"
        class="button__default button__pause"
        @click="stopRecording"
    ></button>
    <button
        v-else-if="audioUrl && !isPlaying"
        class="button__default"
        @click="playAudio"
    ><TriangleIcon/></button>
    <button
        v-else-if="audioUrl && isPlaying"
        class="button__default button__pause"
        @click="pauseAudio"
    ></button>

    <!-- Волновая форма -->
    <div
        ref="waveformRef"
        class="waveform"
        :class="{ clickable: hasDuration && !isRecording }"
        @click="seek"
    >
      <div
          v-for="(lvl, i) in levels"
          :key="i"
          class="bar"
          :class="{ played: hasDuration && i <= playedIndex }"
          :style="{ height: barHeight(lvl) + 'px' }"
      ></div>
    </div>

    <!-- Таймер -->
    <div class="time">{{ displayTime }}</div>

    <!-- Скрытый аудиоплеер -->
    <audio
        ref="audioRef"
        v-if="audioUrl"
        :src="audioUrl"
        preload="metadata"
        @loadedmetadata="onLoadedMetadata"
    ></audio>

    <!-- Кнопка отправки -->
    <button
        class="button__default button__send"
        @click="sendVoiceMessage"
    ><ArrowIcon/></button>
  </div>
</template>

<script setup lang="ts">
import ArrowIcon from '@/assets/images/arrow.svg'
import DeleteIcon from '@/assets/images/delete.svg'
import TriangleIcon from '@/assets/images/triangle.svg'
import { botMessageApi } from '@/api/botMessage'
import { useMessagesStore } from '@/stores/messages'
import type { IMessagePayload} from "@/composition/message";
import Message from "@/composition/message"

const messagesStore = useMessagesStore()
const props = defineProps<{ isStartRecording: boolean }>()
const emit = defineEmits<{ (e: 'stop-recording'): void }>()

// Состояния и данные
let mediaRecorder: MediaRecorder | null = null
const isRecording = ref(false)
const isPlaying = ref(false)
const levels = ref<number[]>([])
const elapsed = ref(0)
const playbackTime = ref(0)
let recordTimerId: number | null = null

const audioBlob = ref<Blob | null>(null)
const audioUrl = ref<string | null>(null)
const decodedDuration = ref(0)

const audioRef = ref<HTMLAudioElement | null>(null)
const waveformRef = ref<HTMLElement | null>(null)

// Визуализация
let audioCtx: AudioContext | null = null
let analyser: AnalyserNode | null = null
let sampleTimer: number | null = null
const MAX_BARS = 30
const MIN_HEIGHT = 5
const SCALE = 7.5
const SAMPLE_MS = 200

// Компоненты вычисления
const formatTime = (t: number) => {
  const m = Math.floor(t / 60), s = Math.floor(t % 60)
  return `${m}:${s < 10 ? '0' + s : s}`
}
const displayTime = computed(() =>
    audioUrl.value ? formatTime(playbackTime.value) : formatTime(elapsed.value)
)
const hasDuration = computed(() => !!decodedDuration.value || (audioRef.value?.duration ?? 0) > 0)
const trackDuration = computed(() =>
    (audioRef.value?.duration && isFinite(audioRef.value.duration))
        ? audioRef.value.duration
        : decodedDuration.value
)
const playedIndex = computed(() =>
    hasDuration.value
        ? Math.floor((playbackTime.value / trackDuration.value) * levels.value.length)
        : -1
)

// Полифилл
onMounted(async () => {
  if (typeof window !== 'undefined') {
    await import('webrtc-adapter')
    if (!(window as any).MediaRecorder) {
      const mod = await import('audio-recorder-polyfill')
      ;(window as any).MediaRecorder = mod.default
    }
  }
})

// Запись
watch(() => props.isStartRecording, v => v && startRecording())
async function startRecording() {
  clearInterval(recordTimerId!)
  elapsed.value = 0
  recordTimerId = window.setInterval(() => elapsed.value++, 1000)
  levels.value = []
  audioBlob.value = null
  audioUrl.value = null
  decodedDuration.value = 0
  isPlaying.value = false
  isRecording.value = true

  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (e) {
    console.error('getUserMedia error', e)
    isRecording.value = false
    return
  }

  const options: MediaRecorderOptions = {}
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) options.mimeType = 'audio/webm;codecs=opus'
  else if (MediaRecorder.isTypeSupported('audio/webm')) options.mimeType = 'audio/webm'

  mediaRecorder = new MediaRecorder(stream, options)
  const chunks: BlobPart[] = []
  mediaRecorder.ondataavailable = e => chunks.push(e.data)
  mediaRecorder.onstop = async () => {
    if (!chunks.length) return
    const mime = options.mimeType?.split(';')[0] || 'audio/webm'
    const blob = new Blob(chunks, { type: mime })
    audioBlob.value = blob
    audioUrl.value = URL.createObjectURL(blob)
    try {
      const buf = await new AudioContext().decodeAudioData(await blob.arrayBuffer())
      decodedDuration.value = buf.duration
    } catch {}
    await nextTick()
    audioRef.value?.load()
  }
  mediaRecorder.start()

  try {
    audioCtx = new AudioContext()
    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 2048
    const src = audioCtx.createMediaStreamSource(stream)
    src.connect(analyser)
    sampleTimer = window.setInterval(sampleLevel, SAMPLE_MS)
  } catch {}
}

// Остановка записи
async function stopRecording() {
  mediaRecorder?.stop()
  cleanupRecording()
}

// Воспроизведение
function playAudio() {
  audioRef.value?.play()
  isPlaying.value = true
  audioRef.value!.onended = () => isPlaying.value = false
}
function pauseAudio() {
  audioRef.value?.pause()
  isPlaying.value = false
}

// Перемотка
function seek(e: MouseEvent) {
  const a = audioRef.value, wf = waveformRef.value
  if (!a || !wf || isRecording.value || !hasDuration.value) return
  const rect = wf.getBoundingClientRect()
  a.currentTime = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1) * trackDuration.value
  playbackTime.value = a.currentTime
}

// Отмена
function cancelRecording() {
  mediaRecorder?.stop()
  cleanupRecording()
  clearInterval(recordTimerId!)
  elapsed.value = 0; levels.value = []; audioBlob.value = null; audioUrl.value = null; decodedDuration.value = 0
  isRecording.value = false
  emit('stop-recording')
}

// Очистка
function cleanupRecording() {
  isRecording.value = false
  clearInterval(sampleTimer!)
  if (audioCtx && audioCtx.state !== 'closed') audioCtx.close()
  analyser = null
  clearInterval(recordTimerId!)
}

// Волна
function sampleLevel() {
  if (!analyser) return
  const data = new Uint8Array(analyser.fftSize)
  analyser.getByteTimeDomainData(data)
  let sum = 0; data.forEach(v => { const d = v - 128; sum += d * d })
  levels.value.push(Math.min(Math.sqrt(sum / data.length) / 128, 1))
  if (levels.value.length > MAX_BARS) levels.value.shift()
}

// Высота полосы
function barHeight(lvl: number) {
  const raw = lvl * 40 * SCALE
  return Math.min(Math.max(raw, MIN_HEIGHT), 50)
}

// Отправка
async function sendVoiceMessage() {
  await stopRecording()
  await nextTick()
  setTimeout(async () => {
    const blob = audioBlob.value
    if (!(blob instanceof Blob)) {
      console.error('No valid audio blob to send')
      return
    }
    try {
      const data: IMessagePayload = {
        sessionId: Number(localStorage.getItem('sessionId')),
        messageId: messagesStore.currentMessageId,
        text: '',
        file: blob as any
      }
      const message = new Message(data)
      const response = await message.sendMessage()
      if (response) {
        cleanupRecording()
        emit('stop-recording')
      } else {
        cleanupRecording()
        emit('stop-recording')
      }
    } catch (err) {
      console.error('Error sending voice message:', err)
    }
  }, 100)
}

onBeforeUnmount(cleanupRecording)
</script>



<style scoped>
.waveform.clickable { cursor: pointer; }
.bar {
  width:3px; background:#444; border-radius:1px;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}
.bar.played {
  opacity: 1;
}
.time {
  font-family: monospace;
  min-width: 36px;
  text-align: center;
}
</style>

<style scoped>
.waveform.clickable { cursor: pointer; }
.bar {
  min-width: 3px;
  max-width: 3px;
  background: #444;
  border-radius: 1px;
  transition: opacity 0.2s ease;
}
.time {
  font-family: monospace;
  min-width: 36px;
  text-align: center;
}
</style>

<style lang="scss" scoped>
.button {
  $size_button: 32px;

  &__cancel {
    border: none;
    height: $size_button;
    min-width: $size_button;
    border-radius: 50%;
    margin-right: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #EEEEEE;
    transition: all 0.3s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  &__default {
    border: none;
    height: $size_button;
    min-width: $size_button;
    border-radius: 50%;
    margin-right: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $primary-background-color-bot;
    transition: all 0.3s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  &__pause {
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

  &__send {
    margin-right: 0 !important;
    svg {
      transform: rotate(-90deg);
    }
  }
}

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
}

.time {
  padding: 0 16px;
  font-size: 15px;
  font-family: $Inter-Regular;
  font-weight: 400;
  color: $default-black;
}

.waveform {
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 3px;
  flex: 1;
  height: 40px;
  padding: 2px;
  border-radius: 4px;
}

/* Заполненные полоски */
.bar {
  max-height: 20px;
  width: 3px;
  //background: #444;
  border-radius: 1px;
}

/* Пустые «фоллбэк»-полоски */
.bar__empty {
  min-width: 3px;
  height: 5px;
  background: #50505033;
  border-radius: 1px;
}

/* Аудиоплеер и кнопка отправки */
.playback {
  margin-left: 8px;
}

.send-btn {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
}
</style>
