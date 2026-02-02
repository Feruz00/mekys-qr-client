<template>
  <div
    class="bg-white rounded shadow px-3 py-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:text-sm md:text-base"
  >
    <!-- LEFT: title -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-5">
      <slot />

      <div class="font-medium leading-tight">
        {{ pageName }}
        <span
          v-if="isSuccess"
          class="block sm:inline text-gray-500 text-xs sm:text-sm"
        >
          (Jemi {{ filteredTagsCount }} sany)
        </span>
      </div>
    </div>

    <!-- RIGHT: actions -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
      <a-button
        v-if="selectedRows.length"
        danger
        type="primary"
        size="small"
        :loading="isDeleteSources"
        :disabled="isDeleteSources"
        @click.prevent="$emit('delete')"
        class="w-full sm:w-auto"
      >
        Delete ({{ selectedRows.length }})
      </a-button>

      <router-link :to="{ name: btnHref }" v-if="btn">
        <a-button type="primary" size="small" class="w-full sm:w-auto">
          {{ btnName }}
        </a-button>
      </router-link>

      <a-button
        size="small"
        :loading="isLoading"
        :disabled="isLoading"
        class="w-full sm:w-auto"
        @click="signout"
      >
        Ulgamdan çykmak
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { useLogout } from '../views/Login/useLogin';

defineProps({
  pageName: {
    type: String,
    required: true,
  },
  btnName: {
    type: String,
    required: true,
  },
  btnHref: {
    type: String,
    required: true,
  },
  btn: {
    type: Boolean,
    default: true,
  },
  selectedRows: {
    type: Array,
    default: () => [],
  },
  isDeleteSources: {
    type: Boolean,
    default: false,
  },
  isSuccess: {
    type: Boolean,
    default: false,
  },
  filteredTagsCount: {
    type: Number,
    default: 0,
  },
});

defineEmits(['delete']);

const { signout, isLoading } = useLogout();
</script>
