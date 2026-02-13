<template>
  <div class="min-h-screen bg-black flex items-center justify-center">
    <div class="w-full max-w-5xl px-4">
      <!-- LOADING -->
      <div v-if="isLoading" class="text-white text-center py-20">
        Media ýüklenýär...
      </div>

      <!-- ERROR -->
      <div v-else-if="isError" class="text-center text-white py-20">
        <h1 class="text-2xl font-semibold mb-4">Media tapylmady</h1>

        <p class="opacity-70">Bu faýl pozulan ýa-da elýeterli däl.</p>
      </div>

      <!-- VIDEO -->
      <video
        v-else-if="isVideo"
        autoplay
        playsinline
        controls
        class="w-full rounded-lg shadow-lg"
        @error="handleStreamError"
      >
        <source :src="mediaUrl" :type="mimeType" />
      </video>

      <!-- AUDIO -->
      <audio v-else class="w-full" controls autoplay @error="handleStreamError">
        <source :src="mediaUrl" :type="mimeType" />
      </audio>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();

const isLoading = ref(true);
const isError = ref(false);
const mimeType = ref('');

const mediaId = computed(() => route.params.id);

const mediaUrl = computed(() => {
  return `${import.meta.env.VITE_API_URL}/api/video/${mediaId.value}`;
});

const isVideo = computed(() => mimeType.value?.startsWith('video'));

const handleStreamError = () => {
  isError.value = true;
};

onMounted(async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/qr/${mediaId.value}`
    );

    const file = data.data?.file;

    mimeType.value = file.mimetype;
    document.title = isVideo.value ? 'Video' : 'Audio';
  } catch (err) {
    console.error(err);

    // if 404 OR network error
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
});
</script>
