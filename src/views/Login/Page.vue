<template>
  <div
    class="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4"
  >
    <div class="w-full max-w-md">
      <!-- Card -->
      <a-card
        class="rounded-2xl shadow-2xl border-0"
        :body-style="{ padding: '32px' }"
      >
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p class="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <a-form
          layout="vertical"
          @finish="handleSubmit"
          class="space-y-4"
          :loading="isLoading"
          :rules="rules"
          :model="form"
        >
          <a-form-item label="Username" name="username">
            <a-input
              size="large"
              placeholder="Enter your username"
              class="rounded-lg"
              v-model:value="form.username"
              :maxlength="255"
              show-count
            />
          </a-form-item>

          <a-form-item label="Password" name="password">
            <a-input-password
              size="large"
              placeholder="Enter your password"
              class="rounded-lg"
              v-model:value="form.password"
              :maxlength="255"
              show-count
            />
          </a-form-item>

          <a-form-item class="pt-2">
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              block
              class="h-11 rounded-lg font-semibold"
            >
              Sign In
            </a-button>
          </a-form-item>
        </a-form>

        <div class="text-center mt-6 text-sm text-gray-500">
          © {{ new Date().getFullYear() }} Your App
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useLogin } from './useLogin';
import { onMounted, ref } from 'vue';

const { signin, isLoading } = useLogin();

const form = ref({
  username: '',
  password: '',
});

const rules = {
  username: [
    {
      required: true,
      message: 'Please enter your username',
      trigger: 'change',
    },
  ],
  password: [
    {
      required: true,
      message: 'Please enter your password',
      trigger: 'change',
    },
  ],
};

const router = useRouter();
const handleSubmit = () => {
  signin(form.value, {
    onSuccess: ({ data }) => {
      const user = data.user;
      if (user.role === 'admin') {
        router.push({ name: 'admin' });
      } else {
        router.push({ name: 'user' });
      }
    },
  });
};
onMounted(() => {
  document.title = 'Qr Code | Login';
});
</script>
