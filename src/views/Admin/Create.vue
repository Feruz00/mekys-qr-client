<template>
  <div class="px-20 py-5">
    <TopBar name="Täze ulanyjy goşmak" :routes="topBar" />
    <div class="bg-white py-6 px-6 rounded-lg shadow-md mt-3 w-full">
      <a-form
        :model="form"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 24 }"
        autocomplete="off"
        @finish="handleSubmit"
        :loading="isPending"
        :rules="rules"
      >
        <a-form-item label="Username" name="username">
          <a-input
            v-model:value="form.username"
            placeholder="Write a username"
            show-count
            :maxlength="250"
          />
        </a-form-item>
        <a-form-item label="Password" name="password">
          <a-input-password
            v-model:value="form.password"
            placeholder="Write a password"
            show-count
            :maxlength="250"
          />
        </a-form-item>
        <a-form-item label="QrCode limit" name="qr_limit">
          <a-input-number
            v-model:value="form.qr_limit"
            class="w-full"
            :min="1"
            :max="100000"
          />
        </a-form-item>
        <a-form-item label="Status" name="status">
          <a-select v-model:value="form.status" placeholder="Select status">
            <a-select-option value="active">Active</a-select-option>
            <a-select-option value="inactive">Inactive</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 3, span: 24 }">
          <a-button
            type="primary"
            html-type="submit"
            class="h-11 rounded-lg font-semibold"
          >
            Goşmak
          </a-button>
          <a-button
            class="ml-4 h-11 rounded-lg font-semibold"
            @click.prevent="$router.go(-1)"
          >
            Ýatyrmak
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import TopBar from '../../components/TopBar.vue';

import { useCreateUser } from './useUsers';
import { onMounted, ref } from 'vue';

const topBar = [
  { name: 'admin', title: 'Ulanyjylar' },
  { name: 'create-user', title: 'Täze ulanyjy goşmak' },
];

const router = useRouter();

const form = ref({
  username: '',
  password: '',
  qr_limit: 10,
  status: 'active',
});

const rules = {
  username: [
    {
      required: true,
      message: 'Please enter username',
      trigger: 'change',
    },
  ],
  password: [
    {
      required: true,
      message: 'Please enter password',
      trigger: 'change',
    },
  ],
  qr_limit: [
    {
      required: true,
      message: 'Please enter QR code limit',
      trigger: 'change',
    },
  ],
  status: [
    {
      required: true,
      message: 'Please select status',
      trigger: 'change',
    },
  ],
};

const { isPending, mutate, isSuccess } = useCreateUser();

const handleSubmit = () => {
  mutate(form.value, {
    onSuccess: () => {
      router.go(-1);
    },
  });
};
onMounted(() => {
  document.title = 'Admin | Täze  ulanyjy  goşmak';
});
</script>
