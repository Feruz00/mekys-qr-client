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
        @finish="handleSubmit"
        :loading="isPending"
        :rules="rules"
      >
        <a-form-item label="Degişli media" name="file">
          <div class="flex flex-wrap flex-col gap-2">
            <div class="flex flex-row gap-5 items-center">
              <a-upload
                :multiple="true"
                accept=".mp4,.webm,.avi,.mkv"
                :before-upload="beforeUpload"
                :show-upload-list="false"
                :customRequest="customUpload"
                class="focus:ring-2 focus:ring-blue-500"
              >
                <a-button tabindex="0"><UploadOutlined />Ýükle</a-button>
              </a-upload>

              <span>
                Degişli formatlar:
                {{ ['.mp4', '.webm', '.avi', '.mkv'].join(', ') }}
              </span>
            </div>
            <div class="mt-2 w-1/2" v-if="uploadProgress">
              <transition-group
                name="fade"
                tag="div"
                class="flex flex-row gap-4 items-center"
              >
                <a-progress :percent="uploadProgress.percent" />
                <p
                  v-if="uploadProgress.percent === 100"
                  class="whitespace-nowrap"
                >
                  Uploading...
                </p>
              </transition-group>
            </div>
          </div>
          <div class="relative group mt-3 w-full" v-if="form.fileId">
            <div class="w-1/2 h-auto rounded-md overflow-hidden">
              <VideoPlayer :path="getStreamUrl(form.fileId)" />
            </div>

            <div
              class="focus-within:opacity-100 absolute cursor-pointer top-2 right-2 flex flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <a-button
                danger
                tabindex="0"
                @click="removeImage"
                class="focus:ring-2 focus:ring-blue-500 bg-white rounded-full flex items-center justify-center box-border"
              >
                <template #icon>
                  <CloseOutlined />
                </template>
              </a-button>
            </div>
          </div>
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
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDeleteFile } from '../Files/useFiles';
import { useCreateQr } from './useQrs';
import TopBar from '../../components/TopBar.vue';
import VideoPlayer from '../../components/VideoPlayer.vue';
import { getStreamUrl } from '../../utils/links';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { createFile } from '../Files/filesApi';
import { notification } from 'ant-design-vue';

const router = useRouter();

const uploadProgress = ref(0);
const uploadedFile = ref(null);
const form = ref({
  fileId: null,
  file: null,
});

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

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('video/');
  if (!isImage) {
    message.error('You can only upload video files!');
  }
  return isImage;
};

const customUpload = async (options) => {
  const { file } = options;

  const formData = new FormData();
  formData.append('file', file);

  uploadProgress.value = 0;

  try {
    removeImage();
    const res = await createFile(formData, (percent) => {
      uploadProgress.value.percent = percent;

      onProgress({ percent });
    });

    setTimeout(() => {
      uploadProgress.value = 0;
    }, 500);

    form.value.fileId = res.id;

    form.value.file = res;

    options.onSuccess(res);
  } catch (error) {
    uploadProgress.value = 0;

    notification.error({
      description: error,
      message: 'Media ýüklemek',
    });
    options.onError(error);
  }
};

const { mutate, isPending, isSuccess } = useCreateQr();

const { mutate: deleteFile } = useDeleteFile();

const removeImage = () => {
  if (form.value.fileId) {
    deleteFile(form.value.fileId, {
      onSuccess: () => {
        form.value.file = null;
        form.value.fileId = null;
      },
    });
  }
};

const handleSubmit = () => {
  // console.log(form.value)
  mutate(form.value, {
    onSuccess: () => router.go(-1),
  });
};

onMounted(() => {
  document.title = 'Admin | Täze media ýüklemek';
});

onBeforeUnmount(async () => {
  if (!isSuccess.value) {
    removeImage();
  }
});
</script>
