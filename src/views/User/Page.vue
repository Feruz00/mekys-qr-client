<template>
  <div class="px-3 py-3 sm:px-6 md:px-10 lg:px-20">
    <PageHeader
      pageName="Ulanyjylaryň sanawy"
      btnName="Täze ulanyjy video ýükle"
      btnHref="media-create"
      :selectedRows="selectedRows"
      :isDeleteSources="isDeleteQrs"
      :isSuccess="isSuccess"
      :filteredTagsCount="isSuccess ? data.count : 0"
      @delete="deleteRowSelections"
    />

    <Error v-if="isError" :error="error" />

    <template v-else>
      <section class="bg-white p-2 sm:p-3 rounded shadow mt-3">
        <!-- TABLE WRAPPER (VERY IMPORTANT) -->
        <div class="overflow-x-auto">
          <a-table
            :loading="isFetching"
            :pagination="false"
            bordered
            :dataSource="data?.data || []"
            rowKey="id"
            size="small"
            class="mt-4 shadow rounded text-xs sm:text-sm min-w-[800px]"
            :scroll="{ x: 'max-content', y: isMobile ? 400 : '60vh' }"
            @change="onTableChange"
          >
            <!-- Index -->
            <a-table-column
              title="T/b"
              width="60"
              :fixed="!isMobile ? 'left' : false"
            >
              <template #default="{ index }">
                {{ (currentPage - 1) * pageSize + index + 1 }}
              </template>
            </a-table-column>

            <!-- File name -->
            <a-table-column
              title="Faýlyň ady"
              dataIndex="file"
              width="220"
              :fixed="!isMobile ? 'left' : false"
            >
              <template #default="{ text }">
                <span class="truncate block max-w-[200px]">
                  {{ text ? text.originalName : '-----' }}
                </span>
              </template>
            </a-table-column>

            <!-- View count -->
            <a-table-column
              title="Status"
              dataIndex="file"
              width="15rem"
              align="center"
            >
              <template #default="{ record }">
                <div class="flex flex-col items-center gap-1">
                  <!-- Status Tag + Icon -->
                  <a-tooltip placement="top">
                    <template #title>
                      <span v-if="record.file?.status === 'processing'">
                        Optimizing media... {{ record.file?.progress || 0 }}%
                      </span>
                      <span v-else-if="record.file?.status === 'ready'">
                        Ready for playback & QR code
                      </span>
                      <span v-else-if="record.file?.status === 'failed'">
                        Failed – try re-uploading
                      </span>
                      <span v-else>Unknown</span>
                    </template>

                    <a-tag
                      :color="
                        record.file?.status === 'processing'
                          ? 'processing'
                          : record.file?.status === 'ready'
                            ? 'success'
                            : record.file?.status === 'failed'
                              ? 'error'
                              : 'default'
                      "
                    >
                      <span class="font-medium">
                        {{
                          record.file?.status === 'processing'
                            ? ` Processing ${record.file?.progress || 0}%`
                            : record.file?.status === 'ready'
                              ? ' Ready'
                              : record.file?.status === 'failed'
                                ? ' Failed'
                                : ' Unknown'
                        }}
                      </span>
                    </a-tag>
                  </a-tooltip>

                  <!-- Horizontal progress line – only when processing -->

                  <a-progress
                    v-if="record.file?.status === 'processing'"
                    :percent="record.file?.progress || 0"
                    :show-info="false"
                    size="small"
                    status="active"
                    :strokeColor="{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }"
                    class="flex-1"
                  />

                  <!-- Percentage on the right -->
                </div>
              </template>
            </a-table-column>
            <a-table-column
              title="Görlen sany"
              dataIndex="count"
              width="160"
              :sorter="true"
              :sortOrder="sortField === 'count' ? sortOrder : null"
            />

            <!-- Actions -->
            <a-table-column
              title="Goşmaça"
              width="120"
              :fixed="!isMobile ? 'right' : false"
            >
              <template #default="{ record }">
                <div class="flex items-center justify-center gap-2">
                  <QrcodeOutlined
                    v-if="record?.file"
                    class="text-lg cursor-pointer text-blue-500 hover:text-blue-700"
                    @click="openQr(record.id)"
                  />
                </div>
              </template>
            </a-table-column>
          </a-table>
        </div>

        <!-- Pagination -->
        <div
          class="bg-white mt-3 py-2 px-2 sm:px-3 rounded shadow flex flex-col sm:flex-row justify-center sm:justify-end gap-3"
        >
          <a-pagination
            :total="isSuccess ? data.count : 0"
            :current="currentPage"
            :pageSize="pageSize"
            show-size-changer
            @change="onChange"
          />
        </div>
      </section>
    </template>
  </div>

  <!-- QR MODAL -->
  <a-modal
    v-model:open="showQrModal"
    title="Video QR Code"
    :footer="false"
    centered
  >
    <div class="flex flex-col items-center gap-4">
      <a-qrcode
        ref="qrRef"
        :value="qrValue"
        :size="220"
        color="#000000"
        bgColor="#ffffff"
      />
      <a-button type="primary" @click="downloadQr"> Download QR </a-button>
    </div>
  </a-modal>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWindowSize } from '@vueuse/core';
import PageHeader from '../../components/PageHeader.vue';
import Error from '../../components/Error.vue';
import { useDeleteQr, useDeleteQrs, useGetQrs } from './useQrs';
import { QrcodeOutlined } from '@ant-design/icons-vue';
import { useSocketStore } from '../../store/socket';
import { useQueryClient } from '@tanstack/vue-query';

const queryClient = useQueryClient();
/* responsive */
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);
const socketStore = useSocketStore();
/* router */
const route = useRoute();
const router = useRouter();

/* qr */
const qrRef = ref(null);
const showQrModal = ref(false);
const qrValue = ref('');

/* table state */
const currentPage = ref(Number(route.query.page) || 1);
const pageSize = ref(Number(route.query.limit) || 10);
const sortField = ref(route.query.sort || '');
const sortOrder = ref(route.query.order || '');
const selectedRows = ref([]);

const queryKeys = computed(() => ({
  page: currentPage.value,
  limit: pageSize.value,
  sort: sortField.value || undefined,
  order:
    sortOrder.value === 'ascend'
      ? 'asc'
      : sortOrder.value === 'descend'
        ? 'desc'
        : undefined,
}));

const { data, isFetching, isError, error, isSuccess } = useGetQrs(queryKeys);

const { mutate: deleteQrs, isPending: isDeleteQrs } = useDeleteQrs();

/* handlers */
const onChange = (page, limit) => {
  currentPage.value = page;
  pageSize.value = limit;
  router.push({ query: { ...route.query, page, limit } });
};

const openQr = (id) => {
  qrValue.value = `${window.location.origin}/video/${id}`;
  showQrModal.value = true;
};

const downloadQr = () => {
  const canvas = qrRef.value?.$el?.querySelector('canvas');
  if (!canvas) return;

  const size = canvas.width;
  const newCanvas = document.createElement('canvas');
  newCanvas.width = size;
  newCanvas.height = size;

  const ctx = newCanvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(canvas, 0, 0);

  const link = document.createElement('a');
  link.href = newCanvas.toDataURL('image/png');
  link.download = 'qr-code.png';
  link.click();
};

const deleteRowSelections = () => {
  deleteQrs(selectedRows.value, {
    onSuccess: () => (selectedRows.value = []),
  });
};

watch(
  () => socketStore.socket,
  (socket) => {
    if (!socket) return;

    // Listen for progress → update cache
    socket.on('progress', ({ fileId, percent }) => {
      queryClient.setQueryData(['qrs', queryKeys.value], (oldData) => {
        if (!oldData?.data) return oldData;

        const newData = oldData.data.map((item) =>
          item.file?.id === fileId
            ? { ...item, file: { ...item.file, progress: percent } }
            : item
        );

        return { ...oldData, data: newData };
      });
    });

    // Listen for done → update status
    socket.on('processing-done', ({ fileId, status }) => {
      queryClient.setQueryData(['qrs', queryKeys.value], (oldData) => {
        if (!oldData?.data) return oldData;

        const newData = oldData.data.map((item) =>
          item.file?.id === fileId
            ? { ...item, file: { ...item.file, status } }
            : item
        );

        return { ...oldData, data: newData };
      });

      if (status === 'ready') {
        notification.success({
          message: 'Success',
          description: 'Media processing completed!',
        });
      } else if (status === 'failed') {
        notification.error({
          message: 'Error',
          description: 'Media processing failed. Please try again.',
        });
      }
    });
  },
  { immediate: true }
);

onMounted(() => {
  document.title = 'Admin tarap | Medialar';
});
</script>
