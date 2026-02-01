<template>
  <div
    tabindex="-1"
    ref="plyrContainer"
    class="plyr-container w-full h-full max-h-full object-contain relative object-fit"
  >
    <!-- Loading Spinner (Centered Properly) -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center z-50"
    >
      <div
        class="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"
      ></div>
    </div>

    <!-- Video Player -->
    <video
      ref="videoElement"
      controls
      playsinline
      preload="metadata"
      class="object-fit"
    >
      <source :src="props.path" type="video/mp4" />
    </video>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import plyrIcons from '@/assets/plyr.svg'

Plyr.defaults.iconUrl = plyrIcons

// Props
const props = defineProps({
  path: String,
})

const videoElement = ref(null)
let player = null
const isLoading = ref(true) // Show loader initially

const handleFullscreenChange = () => {
  const el =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement

  // Debugging logs

  if (!plyrContainer.value) return

  // Check if fullscreen element is container or inside it
  if (el && (el === plyrContainer.value || plyrContainer.value.contains(el))) {
    plyrContainer.value.classList.add('fullscreen')
  } else {
    plyrContainer.value.classList.remove('fullscreen')
  }
}
// Debugging: Log when loading state changes
const showLoading = () => {
  // console.log('LOADING STARTED')
  isLoading.value = true
}
const hideLoading = () => {
  // console.log('LOADING FINISHED')
  isLoading.value = false
}

// Initialize Plyr Player
const initPlayer = async () => {
  await nextTick() // Ensure video element is ready

  if (videoElement.value) {
    if (!player) {
      player = new Plyr(videoElement.value)

      // Add event listeners for loading states
      videoElement.value.addEventListener('loadstart', showLoading)
      videoElement.value.addEventListener('waiting', showLoading)
      videoElement.value.addEventListener('stalled', showLoading)

      videoElement.value.addEventListener('canplay', hideLoading)
      videoElement.value.addEventListener('playing', hideLoading)
    }
  }
}

const stop = () => {
  if (player) {
    player.pause()
  }
}
defineExpose({ stop })

// Watch for path changes to reload video
watch(
  () => props.path,
  async (newPath) => {
    // console.log('NEW VIDEO LOADING:', newPath)
    isLoading.value = true // Show loader when new video loads

    if (videoElement.value) {
      videoElement.value.src = newPath
      await nextTick()
      videoElement.value.load()
    }
    initPlayer()
  },
)

// Mount player on component mount
onMounted(() => {
  initPlayer()
})

// Destroy player on component unmount
onBeforeUnmount(() => {
  if (player) {
    player.destroy()
  }
})
</script>
<style>
/* Fallback spinner animation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.plyr__video-wrapper {
  max-height: 500px;
  aspect-ratio: 16 / 9;
}
</style>
