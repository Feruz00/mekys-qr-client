<template>
  <VueQueryDevtools />
  <div class="font-sans">
    <RouterView />
  </div>
</template>
<script setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';

import { RouterView } from 'vue-router';
</script>
