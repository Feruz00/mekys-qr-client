<template>
  <div class="bg-white rounded-xl shadow-sm p-6 w-full animate-pulse mt-4">
    <div class="mb-6">
      <a-skeleton-input :active="true" size="large" class="!w-1/3 h-8 rounded-md" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 6" :key="i" class="flex flex-col gap-2">
        <a-skeleton-input :active="true" size="small" class="!w-1/2 h-4 rounded-sm" />
        <a-skeleton-input :active="true" size="large" class="!w-full h-10 rounded-md" />
      </div>
    </div>

    <!-- Description / Textarea -->
    <div class="mt-6 flex flex-col gap-2">
      <a-skeleton-input :active="true" size="small" class="!w-1/4 h-4 rounded-sm" />
      <a-skeleton-input :active="true" size="large" class="!w-full h-24 rounded-md" />
    </div>

    <!-- Buttons -->
    <div class="mt-8 flex gap-3">
      <a-skeleton-button active size="large" class="!w-32 !h-10 rounded-lg" />
      <a-skeleton-button active size="large" class="!w-24 !h-10 rounded-lg" />
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-skeleton-input),
:deep(.ant-skeleton-button) {
  width: 100%;
}
</style>
