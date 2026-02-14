<template>
  <VueQueryDevtools />
  <div class="font-sans">
    <RouterView />
  </div>
</template>
<script setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';

import { RouterView } from 'vue-router';
import { useSocketStore } from './store/socket';
import { onBeforeUnmount, onMounted } from 'vue';

const socketStore = useSocketStore();

onMounted(() => {
  console.log('geldim');
  socketStore.connect();
});
onBeforeUnmount(() => {
  socketStore.disconnect();
});
</script>
