<template>
  <div class="px-4 sm:px-6 lg:px-10 py-5 max-w-6xl mx-auto">
    <TopBar
      name="Täze media goşmak"
      :routes="[
        { name: 'user', title: 'Medialar' },
        { name: 'media-create', title: 'Täze media goşmak' },
      ]"
    />

    <div class="bg-white py-5 px-4 sm:px-6 rounded-xl shadow-md mt-4">
      <a-form
        :model="form"
        layout="vertical"
        autocomplete="off"
        :rules="rules"
        :loading="isPending"
        @finish="handleSubmit"
      >
        <!-- FILE UPLOAD -->
        <a-form-item label="Degişli media" name="file">
          <div class="flex flex-col gap-4">
            <!-- Upload Row -->
            <div
              class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
            >
              <a-upload
                :accept="allowedExtensionsString"
                :before-upload="beforeUpload"
                :show-upload-list="false"
                :customRequest="customUpload"
              >
                <a-button size="large">
                  <UploadOutlined />
                  Ýükle
                </a-button>
              </a-upload>
            </div>

            <!-- PROGRESS -->
            <div v-if="uploadProgress.percent > 0" class="w-full sm:w-2/3">
              <a-progress :percent="uploadProgress.percent" />
            </div>
          </div>

          <!-- PREVIEW -->
          <div v-if="form.fileId" class="relative group mt-5 w-full max-w-2xl">
            <div class="rounded-lg overflow-hidden border">
              <VideoPlayer v-if="isVideo" :path="getStreamUrl(form.fileId)" />

              <audio v-else controls class="w-full">
                <source
                  :src="getStreamUrl(form.fileId)"
                  :type="form.file?.mimetype"
                />
              </audio>
            </div>

            <!-- Delete Button -->
            <div
              class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
            >
              <a-button danger shape="circle" @click="removeImage">
                <CloseOutlined />
              </a-button>
            </div>
          </div>
        </a-form-item>

        <!-- ACTIONS -->
        <a-form-item>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              class="font-semibold w-full sm:w-auto"
              :disabled="uploadProgress.percent || isPending"
              :loading="isPending"
            >
              Goşmak
            </a-button>

            <a-button
              size="large"
              class="font-semibold w-full sm:w-auto"
              @click="$router.go(-1)"
              :disabled="uploadProgress.percent || isPending"
            >
              Ýatyrmak
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons-vue';

import TopBar from '../../components/TopBar.vue';
import VideoPlayer from '../../components/VideoPlayer.vue';
import { getStreamUrl } from '../../utils/links';

import { createFile } from '../Files/filesApi';
import { useDeleteFile } from '../Files/useFiles';
import { useCreateQr } from './useQrs';

const router = useRouter();

/* STATE */
const uploadProgress = ref({ percent: 0 });
const form = ref({
  fileId: null,
  file: null,
});
const allowedExtensions = [
  // video
  '.mp4',
  '.webm',
  '.avi',
  '.mkv',

  // audio
  '.mp3',
  '.wav',
  '.ogg',
  '.aac',
  '.m4a',
];
const allowedExtensionsString = allowedExtensions.join(',');

let uploadController = null;

const rules = {
  file: [
    {
      required: true,
      validator: () =>
        form.value.fileId
          ? Promise.resolve()
          : Promise.reject('Azyndan bir media ýükleň'),
      trigger: 'change',
    },
  ],
};

/* FILE TYPE CHECK */
const beforeUpload = (file) => {
  const ext = '.' + file.name.split('.').pop().toLowerCase();

  const isAllowed = allowedExtensions.includes(ext);

  if (!isAllowed) {
    notification.error({
      message: 'Diňe audio ýa-da wideo faýllar rugsat berilýär',
      description: allowedExtensions.join(', '),
    });
  }

  return isAllowed;
};
const isVideo = computed(() => form.value?.file?.mimetype?.startsWith('video'));

const cancelUpload = () => {
  if (uploadController) {
    uploadController.abort();
    uploadController = null;
  }
};

/* REMOVE OLD FILE (NO CANCEL) */
const { mutate: deleteFile } = useDeleteFile();
const removeOldFile = () => {
  if (!form.value.fileId) return;

  deleteFile(form.value.fileId, {
    onSuccess: () => {
      form.value.fileId = null;
      form.value.file = null;
    },
  });
};

/* USER REMOVE */
const removeImage = () => {
  cancelUpload();
  removeOldFile();
};

/* CUSTOM UPLOAD */
const customUpload = async ({ file, onProgress, onSuccess, onError }) => {
  uploadController = new AbortController();

  const formData = new FormData();
  formData.append('file', file);

  uploadProgress.value.percent = 0;

  try {
    removeOldFile();

    const data = await createFile(
      formData,
      (percent) => {
        uploadProgress.value.percent = percent;
        onProgress({ percent });
      },
      uploadController.signal
    );

    form.value.fileId = data.id;
    form.value.file = data;

    setTimeout(() => {
      uploadProgress.value.percent = 0;
    }, 200);

    onSuccess(data);
  } catch (err) {
    uploadProgress.value.percent = 0;

    if (err.name !== 'CanceledError') {
      notification.error({
        message: 'Media ýüklemek',
        description: err.message,
      });
    }

    onError(err);
  }
};

/* SUBMIT */
const { mutate, isPending, isSuccess } = useCreateQr();
const handleSubmit = () => {
  mutate(form.value, {
    onSuccess: () => router.go(-1),
  });
};

/* LIFECYCLE */
onMounted(() => {
  document.title = 'Admin | Täze media ýüklemek';
});

onBeforeUnmount(() => {
  cancelUpload();
  if (!isSuccess.value) {
    removeOldFile();
  }
});
</script>
