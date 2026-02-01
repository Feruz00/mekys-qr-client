import { useMutation } from '@tanstack/vue-query';

import { createFile, deleteFile } from './filesApi';
import { ref } from 'vue';
import { notification } from 'ant-design-vue';

const useCreateFile = () => {
  const uploadProgress = ref(0);

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (data) => {
      return new Promise((resolve, reject) => {
        createFile(data, (progress) => {
          uploadProgress.value = progress;
        })
          .then(resolve)
          .catch(reject);
      });
    },
    onSuccess: () => {
      notification.success({
        message: 'Media ýüklemek',
        description: 'Media üstünliki ýüklenildi',
      });

      setTimeout(() => {
        uploadProgress.value = 0;
      }, 3000);
    },
    onError: (err) => {
      notification.error({
        message: 'Media ýüklemek',
        description: err,
      });
    },
  });

  return { mutate, isPending, isSuccess, isError, uploadProgress };
};
const useDeleteFile = () => {
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (id) => deleteFile(id),
    onSuccess: () => {
      notification.success({
        message: 'Media pozmak',
        description: 'Media maglumatlary üstünlikli pozuldy',
      });
    },
    onError: (err) => {
      notification.error({
        message: 'Media pozmak',
        description: err,
      });
    },
  });
  return { mutate, isPending, isSuccess, isError };
};

export { useCreateFile, useDeleteFile };
