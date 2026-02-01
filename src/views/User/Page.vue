<template>
  <div class="px-20 py-5">
    <PageHeader
      pageName="Ulanyjylaryň sanawy"
      btnName="Täze ulanyjy video ýükle"
      btnHref="media-create"
      :selectedRows="selectedRows"
      :isDeleteSources="isDeleteQrs"
      :isSuccess="isSuccess"
      :filteredTagsCount="isSuccess ? data.count : 0"
      @delete="deleteRowSelections"
    ></PageHeader>

    <Error v-if="isError" :error="error" />
    <template v-else-if="!isError">
      <section class="bg-white py-2 px-3 rounded shadow mt-3">
        <a-table
          :loading="isFetching"
          :pagination="false"
          bordered
          :dataSource="data?.data || []"
          rowKey="id"
          class="mt-4 shadow rounded"
          @change="onTableChange"
          :scroll="{ x: 'max-content', y: '650px' }"
          :row-selection="rowSelection"
          size="small"
        >
          <a-table-column title="T/b" key="index" fixed="left" width="2rem">
            <template #default="{ index }">
              {{ (currentPage - 1) * pageSize + (index + 1) }}
            </template>
          </a-table-column>

          <a-table-column
            title="Faýlyň ady "
            dataIndex="file"
            fixed="left"
            width="12rem"
          >
            <template #default="{ text }">
              {{ text ? text.originalName : '-----' }}
            </template>
          </a-table-column>

          <a-table-column
            title="Görlen sany  "
            :sorter="true"
            :sortOrder="sortField === 'count' ? sortOrder : null"
            dataIndex="count"
            width="12rem"
          >
          </a-table-column>

          <a-table-column
            title="Goşmaça"
            fixed="right"
            width="7rem"
            dataIndex="id"
          >
            <template #default="{ text, record }">
              <div class="flex items-center gap-2">
                <a-popconfirm
                  title="Siz çyndanam maglumaty pozmakçymy？"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="() => handleDelete(text)"
                >
                  <DeleteOutlined class="text-lg cursor-pointer" />
                </a-popconfirm>

                <QrcodeOutlined
                  v-if="record?.file"
                  class="text-lg cursor-pointer text-blue-500 hover:text-blue-700"
                  @click="openQr(text)"
                />
              </div>
            </template>
          </a-table-column>
        </a-table>
        <div
          class="bg-white mt-3 py-2 px-3 rounded shadow flex justify-end gap-4"
        >
          <a-pagination
            :total="isSuccess ? data.count : 0"
            @change="onChange"
            show-size-changer
            :current="currentPage"
            :pageSize="pageSize"
          />
        </div>
      </section>
    </template>
  </div>
  <a-modal
    v-model:open="showQrModal"
    title="Video QR Code"
    :footer="false"
    centered
  >
    <div class="flex flex-col items-center gap-4">
      <a-qrcode :value="qrValue" :size="220" />

      <!-- <a
        :href="qrValue"
        target="_blank"
        class="text-blue-600 underline break-all text-center"
      >
        {{ qrValue }}
      </a> -->
    </div>
  </a-modal>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import PageHeader from '../../components/PageHeader.vue';
import { useDeleteQr, useDeleteQrs, useGetQrs } from './useQrs';
import { computed, onMounted, ref } from 'vue';
import Error from '../../components/Error.vue';
import { DeleteOutlined, QrcodeOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();

const showQrModal = ref(false);
const qrValue = ref('');

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

const { isFetching, isError, error, data, isSuccess } = useGetQrs(queryKeys);

const { mutate: deleteQr } = useDeleteQr();
const { mutate: deleteQrs, isPending: isDeleteQrs } = useDeleteQrs();

const onChange = (page, limit) => {
  currentPage.value = page;
  pageSize.value = limit;
  router.push({ query: { ...route.query, page, limit } });
};

const handleDelete = (id) => {
  deleteQr(id);
};
const openQr = (id) => {
  qrValue.value = `${window.location.origin}/video/${id}`;
  showQrModal.value = true;
};
const deleteRowSelections = () => {
  deleteQrs(selectedRows.value, {
    onSuccess: () => {
      selectedRows.value = [];
    },
  });
};

const rowSelection = {
  checkStrictly: false,
  onChange: (keys, rows) => {
    selectedRows.value = rows.map((row) => row.id);
  },
};

onMounted(() => {
  document.title = 'Admin tarap | Medialar';
});
</script>
