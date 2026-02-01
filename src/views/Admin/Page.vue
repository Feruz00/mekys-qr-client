<template>
  <div class="px-20 py-5">
    <PageHeader
      pageName="Ulanyjylaryň sanawy"
      btnName="Täze ulanyjy goş"
      btnHref="create-user"
      :selectedRows="selectedRows"
      :isDeleteSources="isDeleteUsers"
      :isSuccess="isSuccess"
      :filteredTagsCount="isSuccess ? data.count : 0"
      @delete="deleteRowSelections"
    >
    </PageHeader>

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
            title="Ulanyjynyň ady "
            :sorter="true"
            :sortOrder="sortField === 'username' ? sortOrder : null"
            dataIndex="username"
            fixed="left"
            width="12rem"
          >
          </a-table-column>

          <a-table-column
            title="QrCode limit "
            :sorter="true"
            :sortOrder="sortField === 'qr_limit' ? sortOrder : null"
            dataIndex="qr_limit"
            width="12rem"
          >
            <template #default="{ text, record }">
              {{ record.used }}/{{ text }}
            </template>
          </a-table-column>

          <a-table-column title="Role " dataIndex="role" width="12rem">
          </a-table-column>

          <a-table-column title="Status " dataIndex="status" width="12rem">
            <template #default="{ text }">
              <span
                :class="{
                  'text-green-600 bg-green-100 px-3 py-1 rounded-full':
                    text === 'active',
                  'text-red-600 bg-red-100 px-3 py-1 rounded-full':
                    text === 'inactive',
                }"
              >
                {{ text }}
              </span>
            </template>
          </a-table-column>

          <a-table-column
            title="Sazlamalar"
            fixed="right"
            width="7rem"
            dataIndex="id"
          >
            <template #default="{ text }">
              <div class="flex items-center gap-2" v-if="text !== auth.user.id">
                <router-link
                  :to="{ name: 'edit-user', params: { id: text } }"
                  class="text-gray-700"
                >
                  <EditOutlined class="text-lg" />
                </router-link>
                <a-popconfirm
                  title="Siz çyndanam maglumaty pozmakçymy？"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="() => handleDelete(text)"
                >
                  <DeleteOutlined class="text-lg cursor-pointer" />
                </a-popconfirm>
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
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router';
import PageHeader from '../../components/PageHeader.vue';
import { computed, onMounted, ref } from 'vue';
import { useDeleteUser, useDeleteUsers, useGetUsers } from './useUsers';

import Error from '../../components/Error.vue';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import useAuthStore from '../../store/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
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

const { isFetching, isError, error, data, isSuccess } = useGetUsers(queryKeys);

const { mutate: deleteUser } = useDeleteUser();
const { mutate: deleteUsers, isPending: isDeleteUsers } = useDeleteUsers();

const onChange = (page, limit) => {
  currentPage.value = page;
  pageSize.value = limit;
  router.push({ query: { ...route.query, page, limit } });
};

const onTableChange = (pagination, filters, sorter) => {
  let query = {};
  let hasChanges = false;

  if (sorter?.field && sorter?.order) {
    if (sortField.value !== sorter.field || sortOrder.value !== sorter.order) {
      sortField.value = sorter.field;
      sortOrder.value = sorter.order;
      query.sort = sorter.field;
      query.order = sorter.order === 'ascend' ? 'asc' : 'desc';
      hasChanges = true;
    }
  } else {
    // Sorter is cleared, reset values
    if (sortField.value || sortOrder.value) {
      sortField.value = '';
      sortOrder.value = '';
      query.sort = undefined;
      query.order = undefined;
      hasChanges = true;
    }
  }

  if (hasChanges) {
    query.page = 1;
    query.limit = 10;

    currentPage.value = 1;
    pageSize.value = 10;
    router.push({ query: query });
  }
};

const handleDelete = (id) => {
  deleteUser(id);
};

const deleteRowSelections = () => {
  deleteUsers(selectedRows.value, {
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
  document.title = 'Admin tarap | Ulanyjylar';
});
</script>
