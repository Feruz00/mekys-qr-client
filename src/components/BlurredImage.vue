<template>
  <div
    class="relative w-full h-full bg-cover bg-center transition-all duration-500"
    :style="{ backgroundImage: `url(${getImageUrl(smallPath)})` }"
  >
    <img
      :src="getImageUrl(path)"
      alt="Image"
      class="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
      loading="lazy"
      :class="{ 'opacity-0': !loaded, 'opacity-100': loaded }"
      @load="loaded = true"
    />
  </div>
</template>

<script setup>
import { getImageUrl } from '@/utils/links'
import { ref } from 'vue'

const props = defineProps({
  path: String, // High-quality image
  smallPath: String, // Blurred low-quality image
})

// console.log(props)

const loaded = ref(false)
</script>

<style scoped>
.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}
</style>
<!--  -->
