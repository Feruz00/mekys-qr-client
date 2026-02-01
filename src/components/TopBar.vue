<template>
  <div class="bg-white items-center py-4 px-6 rounded-lg shadow-md flex flex-row gap-2">
    <ArrowLeftOutlined class="cursor-pointer" @click.prevent="$router.go(-1)" />

    <div class="flex flex-row justify-between items-center gap-2 w-full">
      <a-breadcrumb v-if="props.routes.length > 0">
        <a-breadcrumb-item v-for="route in props.routes" :key="route.name">
          <router-link
            v-if="route.name"
            :to="{ name: route.name, params: route.params ? route.params : {} }"
          >
            {{ route.title }}</router-link
          >
          <span v-else>
            {{ route.title }}
          </span>
        </a-breadcrumb-item>
      </a-breadcrumb>

      <h2 class="text-lg font-semibold">
        {{ props.name }}
      </h2>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  name: String,
  routes: {
    type: Array,
    defaultValue: [],
  },
})
</script>
