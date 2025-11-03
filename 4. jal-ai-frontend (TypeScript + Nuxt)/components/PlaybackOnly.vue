<template>
  <div class="voice-recorder">
    <!-- Кнопка play / pause -->
    <button
        class="button__default"
        @click="isPlaying ? pauseAudio() : playAudio()"
    >
      <TriangleIcon v-if="!isPlaying" />
      <span v-else class="button__pause"></span>
    </button>

    <!-- Waveform -->
    <div
        ref="waveformRef"
        class="waveform"
        :class="{ clickable: hasDuration }"
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
        :src="audioSrc"
        preload="metadata"
        @ended="onAudioEnded"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import TriangleIcon from '@/assets/images/triangle.svg'

const props = defineProps<{ audioSrc: string }>()

// состояния
const isPlaying    = ref(false)
const playbackTime = ref(0)
const levels       = ref<number[]>([])
const decodedDur   = ref(0)

// refs
const audioRef    = ref<HTMLAudioElement|null>(null)
const waveformRef = ref<HTMLElement|null>(null)

// параметры
const MAX_BARS   = 30
const MIN_HEIGHT = 5
const SCALE      = 7.5

// длительность известна?
const hasDuration = computed(() => decodedDur.value > 0)
const trackDur    = computed(() => decodedDur.value)

// формат времени
const formatTime = (t: number) => {
  const m = Math.floor(t/60), s = Math.floor(t%60)
  return `${m}:${s<10?'0'+s:s}`
}
const displayTime = computed(() => formatTime(playbackTime.value))

// прогресс-бар
const playedIndex = computed(() => {
  if (!hasDuration.value) return -1
  return Math.floor((playbackTime.value / trackDur.value) * levels.value.length)
})

let audioCtx: AudioContext|null = null

function onAudioEnded() {
  isPlaying.value = false
}

onMounted(async () => {
  // 1) Fetch & decode
  const resp = await fetch(props.audioSrc)
  const buf  = await resp.arrayBuffer()
  audioCtx    = new AudioContext()
  const audioBuf = await audioCtx.decodeAudioData(buf)
  decodedDur.value = audioBuf.duration

  // 2) Build RMS levels
  const data      = audioBuf.getChannelData(0)
  const blockSize = Math.floor(data.length / MAX_BARS)
  const tmp: number[] = []
  for (let i = 0; i < MAX_BARS; i++) {
    let sum = 0
    const start = i * blockSize
    for (let j = start; j < start + blockSize; j++) {
      const v = data[j] ?? 0
      sum += v*v
    }
    tmp.push(Math.sqrt(sum / blockSize))
  }
  levels.value = tmp

  // 3) timeupdate
  await new Promise(r => setTimeout(r, 0))
  const a = audioRef.value!
  a.ontimeupdate = () => { playbackTime.value = a.currentTime }
})

onBeforeUnmount(() => {
  audioCtx?.close()
})

// play / pause
function playAudio() {
  const a = audioRef.value!
  a.play()
  isPlaying.value = true
}
function pauseAudio() {
  const a = audioRef.value!
  a.pause()
  isPlaying.value = false
}

// seek по клику
function seek(e: MouseEvent) {
  const a  = audioRef.value!
  const wf = waveformRef.value!
  if (!hasDuration.value) return

  const rect = wf.getBoundingClientRect()
  const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  const t = frac * trackDur.value

  a.currentTime      = t
  playbackTime.value = t
}

// высота бара
function barHeight(lvl: number) {
  const raw = lvl * 40 * SCALE
  return Math.min(Math.max(raw, MIN_HEIGHT), 50)
}
</script>


<style scoped lang="scss">
.waveform.clickable { cursor: pointer; }
.bar {
  width:3px;
  background: $default-white !important;
  border-radius:1px;
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
    transition: all 0.3s ease;
    background-color: transparent;
    position: relative;

    &:hover {
      opacity: 0.8;
    }
  }

  &__pause {
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

  &__send {
    margin-right: 0 !important;
    svg {
      transform: rotate(-90deg);
    }
  }
}

.voice-recorder {
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
}

.time {
  padding: 0 16px;
  font-size: 15px;
  font-family: $Inter-Regular;
  font-weight: 400;
  color: $default-white;
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

