<template>
  <div class="px-20 py-5">
    <TopBar
      name="Täze media goşmak"
      :routes="[
        { name: 'user', title: 'Medialar' },
        { name: 'media-create', title: 'Täze media goşmak' },
      ]"
    />

    <div class="bg-white py-4 px-6 rounded-lg shadow-md mt-3">
      <a-form
        :model="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 24 }"
        autocomplete="off"
        :rules="rules"
        :loading="isPending"
        @finish="handleSubmit"
      >
        <!-- FILE UPLOAD -->
        <a-form-item label="Degişli media" name="file">
          <div class="flex flex-col gap-2">
            <div class="flex gap-5 items-center">
              <a-upload
                accept=".mp4,.webm,.avi,.mkv"
                :before-upload="beforeUpload"
                :show-upload-list="false"
                :customRequest="customUpload"
              >
                <a-button>
                  <UploadOutlined />
                  Ýükle
                </a-button>
              </a-upload>

              <span class="text-gray-500">
                Degişli formatlar:
                {{ ['.mp4', '.webm', '.avi', '.mkv'].join(', ') }}
              </span>
            </div>

            <!-- PROGRESS -->
            <div v-if="uploadProgress.percent > 0" class="w-1/2 mt-2">
              <a-progress :percent="uploadProgress.percent" />
            </div>
          </div>

          <!-- PREVIEW -->
          <div v-if="form.fileId" class="relative group mt-3 w-full">
            <div class="w-1/2 rounded-md overflow-hidden">
              <VideoPlayer :path="getStreamUrl(form.fileId)" />
            </div>

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
        <a-form-item :wrapper-col="{ offset: 3, span: 24 }">
          <a-button
            type="primary"
            html-type="submit"
            class="h-11 font-semibold"
          >
            Goşmak
          </a-button>

          <a-button class="ml-4 h-11 font-semibold" @click="$router.go(-1)">
            Ýatyrmak
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
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

let uploadController = null;

/* VALIDATION */
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
  const isVideo = file.type.startsWith('video/');
  if (!isVideo) {
    notification.error({
      message: 'Diňe wideo faýllar rugsat berilýär',
    });
  }
  return isVideo;
};

/* CANCEL UPLOAD */
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
    }, 1000);

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
