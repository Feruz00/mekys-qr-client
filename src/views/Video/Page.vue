<template>
  <div class="min-h-screen bg-black flex items-center justify-center">
    <div class="w-full max-w-5xl px-4">
      <!-- Loading -->
      <div v-if="isLoading" class="text-white text-center py-20">
        Video ýüklenýär...
      </div>

      <!-- Video -->
      <video
        v-else
        class="w-full rounded-lg shadow-lg"
        controls
        autoplay
        playsinline
      >
        <source :src="videoUrl" type="video/mp4" />
        Siziň brauzeriňiz wideo goldamaýar.
      </video>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const isLoading = ref(true);

// video id from QR → /video/:id
const videoId = computed(() => route.params.id);

// 🔥 CHANGE this if backend path differs
const videoUrl = computed(() => {
  return `${import.meta.env.VITE_API_URL}/api/video/${videoId.value}`;
});

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 300);

  document.title = 'Video';
});
</script>
