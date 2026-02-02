<template>
  <div class="px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-5">
    <PageHeader
      pageName="Ulanyjylaryň sanawy"
      btnName="Täze ulanyjy goş"
      btnHref="create-user"
      :selectedRows="selectedRows"
      :isDeleteSources="isDeleteUsers"
      :isSuccess="isSuccess"
      :filteredTagsCount="isSuccess ? data.count : 0"
      @delete="deleteRowSelections"
    />

    <Error v-if="isError" :error="error" />

    <template v-else>
      <section class="bg-white p-3 sm:p-4 rounded shadow mt-3">
        <!-- IMPORTANT: wrapper fixes mobile scroll -->
        <div class="overflow-x-auto">
          <a-table
            :loading="isFetching"
            :pagination="false"
            bordered
            :dataSource="data?.data || []"
            rowKey="id"
            size="small"
            :scroll="{ x: 'max-content', y: isMobile ? 400 : 650 }"
            :row-selection="rowSelection"
            @change="onTableChange"
            class="min-w-[900px]"
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

            <!-- Username -->
            <a-table-column
              title="Ulanyjynyň ady"
              dataIndex="username"
              width="200"
              :sorter="true"
              :sortOrder="sortField === 'username' ? sortOrder : null"
              :fixed="!isMobile ? 'left' : false"
            />

            <!-- QR Limit -->
            <a-table-column
              title="QR limit"
              dataIndex="qr_limit"
              width="150"
              :sorter="true"
              :sortOrder="sortField === 'qr_limit' ? sortOrder : null"
            >
              <template #default="{ record, text }">
                {{ record.used }}/{{ text }}
              </template>
            </a-table-column>

            <!-- Role -->
            <a-table-column title="Role" dataIndex="role" width="120" />

            <!-- Status -->
            <a-table-column title="Status" dataIndex="status" width="140">
              <template #default="{ text }">
                <span
                  class="px-3 py-1 rounded-full text-xs sm:text-sm"
                  :class="
                    text === 'active'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  "
                >
                  {{ text }}
                </span>
              </template>
            </a-table-column>

            <!-- Actions -->
            <a-table-column
              title="Sazlamalar"
              width="110"
              :fixed="!isMobile ? 'right' : false"
            >
              <template #default="{ record }">
                <div
                  v-if="record.id !== auth.user.id"
                  class="flex items-center gap-2"
                >
                  <router-link
                    :to="{ name: 'edit-user', params: { id: record.id } }"
                  >
                    <EditOutlined class="text-lg text-gray-700" />
                  </router-link>

                  <a-popconfirm
                    title="Pozmak isleýäňizmi?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="handleDelete(record.id)"
                  >
                    <DeleteOutlined
                      class="text-lg text-red-500 cursor-pointer"
                    />
                  </a-popconfirm>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-end mt-4">
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
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWindowSize } from '@vueuse/core';
import PageHeader from '../../components/PageHeader.vue';
import Error from '../../components/Error.vue';
import { useGetUsers, useDeleteUser, useDeleteUsers } from './useUsers';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import useAuthStore from '../../store/auth';

/* responsive */
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);

/* router */
const route = useRoute();
const router = useRouter();

/* auth */
const auth = useAuthStore();

/* pagination & sorting */
const currentPage = ref(Number(route.query.page) || 1);
const pageSize = ref(Number(route.query.limit) || 10);
const sortField = ref(route.query.sort || '');
const sortOrder = ref(route.query.order || '');

/* selections */
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

const { data, isFetching, isError, error, isSuccess } = useGetUsers(queryKeys);

const { mutate: deleteUser } = useDeleteUser();
const { mutate: deleteUsers, isPending: isDeleteUsers } = useDeleteUsers();

/* handlers */
const onChange = (page, limit) => {
  currentPage.value = page;
  pageSize.value = limit;
  router.push({ query: { ...route.query, page, limit } });
};

const onTableChange = (_, __, sorter) => {
  if (sorter?.field && sorter?.order) {
    sortField.value = sorter.field;
    sortOrder.value = sorter.order;
  } else {
    sortField.value = '';
    sortOrder.value = '';
  }
};

const handleDelete = (id) => deleteUser(id);

const deleteRowSelections = () => {
  deleteUsers(selectedRows.value, {
    onSuccess: () => (selectedRows.value = []),
  });
};

const rowSelection = {
  onChange: (_, rows) => {
    selectedRows.value = rows.map((r) => r.id);
  },
};

onMounted(() => {
  document.title = 'Admin tarap | Ulanyjylar';
});
</script>
