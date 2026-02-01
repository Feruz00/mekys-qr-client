<template>
  <div
    class="bg-white py-2 px-3 rounded shadow flex flex-row items-center justify-between"
  >
    <div class="flex gap-5 items-center">
      <slot />
      <div>
        {{ pageName }}
        <span v-if="isSuccess">(Jemi {{ filteredTagsCount }} sany)</span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <a-button
        v-if="selectedRows.length"
        danger
        type="primary"
        :loading="isDeleteSources"
        :disabled="isDeleteSources"
        @click.prevent="$emit('delete')"
      >
        Delete ({{ selectedRows.length }} selected)
      </a-button>

      <router-link :to="{ name: btnHref }" v-if="btn">
        <a-button type="primary">{{ btnName }}</a-button>
      </router-link>
      <a-button :loading="loading" :disabled="loading" @click="signout">
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
