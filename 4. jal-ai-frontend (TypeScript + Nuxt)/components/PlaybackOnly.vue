<template>
  <div class="voice-player">
    <button
      class="voice-player__button"
      type="button"
      @click="isPlaying ? pauseAudio() : playAudio()"
    >
      <TriangleIcon v-if="!isPlaying" />
      <span v-else class="voice-player__pause-indicator"></span>
    </button>

    <div
      ref="waveformRef"
      class="voice-player__waveform"
      :class="{ 'voice-player__waveform--clickable': hasDuration }"
      @click="seek"
    >
      <div
        v-for="(lvl, i) in levels"
        :key="i"
        class="voice-player__bar"
        :class="{ 'voice-player__bar--played': hasDuration && i <= playedIndex }"
        :style="{ height: barHeight(lvl) + 'px' }"
      ></div>
    </div>

    <div class="voice-player__time">{{ displayTime }}</div>

    <audio
      ref="audioRef"
      :src="audioSrc"
      preload="metadata"
      @ended="onAudioEnded"
      @timeupdate="onTimeUpdate"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import TriangleIcon from '@/assets/images/triangle.svg'

const props = defineProps<{ audioSrc: string }>()

const isPlaying = ref(false)
const playbackTime = ref(0)
const levels = ref<number[]>([])
const decodedDuration = ref(0)
const audioRef = ref<HTMLAudioElement | null>(null)
const waveformRef = ref<HTMLElement | null>(null)

let audioCtx: AudioContext | null = null

const MAX_BARS = 30
const MIN_HEIGHT = 5
const SCALE = 7.5

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

const hasDuration = computed(() => decodedDuration.value > 0)
const displayTime = computed(() => formatTime(playbackTime.value))
const playedIndex = computed(() => {
  if (!hasDuration.value || !decodedDuration.value) {
    return -1
  }

  return Math.floor((playbackTime.value / decodedDuration.value) * levels.value.length)
})

onMounted(async () => {
  if (!props.audioSrc) {
    return
  }

  try {
    const response = await fetch(props.audioSrc)
    const buffer = await response.arrayBuffer()
    audioCtx = new AudioContext()
    const audioBuffer = await audioCtx.decodeAudioData(buffer)
    decodedDuration.value = audioBuffer.duration

    const data = audioBuffer.getChannelData(0)
    const blockSize = Math.max(1, Math.floor(data.length / MAX_BARS))
    const waveformLevels: number[] = []

    for (let index = 0; index < MAX_BARS; index += 1) {
      let sum = 0
      const start = index * blockSize

      for (let offset = start; offset < start + blockSize; offset += 1) {
        const value = data[offset] ?? 0
        sum += value * value
      }

      waveformLevels.push(Math.sqrt(sum / blockSize))
    }

    levels.value = waveformLevels
  } catch (error) {
    console.error('Failed to prepare audio playback', error)
  }
})

onBeforeUnmount(() => {
  audioCtx?.close()
})

function onAudioEnded() {
  isPlaying.value = false
}

function onTimeUpdate(event: Event) {
  playbackTime.value = (event.target as HTMLAudioElement).currentTime
}

function playAudio() {
  const audio = audioRef.value
  if (!audio) {
    return
  }

  void audio.play()
  isPlaying.value = true
}

function pauseAudio() {
  audioRef.value?.pause()
  isPlaying.value = false
}

function seek(event: MouseEvent) {
  const audio = audioRef.value
  const waveform = waveformRef.value

  if (!audio || !waveform || !hasDuration.value) {
    return
  }

  const rect = waveform.getBoundingClientRect()
  const fraction = Math.min(Math.max(0, (event.clientX - rect.left) / rect.width), 1)
  const time = fraction * decodedDuration.value

  audio.currentTime = time
  playbackTime.value = time
}

function barHeight(level: number) {
  const raw = level * 40 * SCALE
  return Math.min(Math.max(raw, MIN_HEIGHT), 50)
}
</script>

<style scoped lang="scss">
.voice-player {
  max-width: 275px;
  width: max-content;
  background-color: $primary-background-color-bot;
  border-radius: 12px;
  padding: 8px;
  font-weight: 400;
  font-family: $Inter-Regular;
  font-size: 16px;
  color: $default-white;
  display: flex;
  align-items: center;
  transition: all 0.1s ease;

  &__button {
    border: none;
    background: transparent;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    margin-right: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  &__pause-indicator {
    display: flex;
    height: 30px;
    width: 30px;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 55%;
      height: 55%;
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
    background: $default-white;
    border-radius: 1px;
    opacity: 0.5;
    transition: opacity 0.2s ease;

    &--played {
      opacity: 1;
    }
  }

  &__time {
    padding: 0 16px;
    font-size: 15px;
    font-family: $Inter-Regular;
    font-weight: 400;
    color: $default-white;
    min-width: 36px;
    text-align: center;
  }
}
</style>
