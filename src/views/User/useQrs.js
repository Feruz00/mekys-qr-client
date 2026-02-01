import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import { notification } from 'ant-design-vue';
import { createMedia, deleteMedia, deleteMedias, getQr, getQrs } from './qrApi';

const useGetQr = (id) => {
  return useQuery({
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    queryKey: ['qr', id],
    queryFn: () => getQr(id?.value),
  });
};

const useGetQrs = (keys) => {
  const { isFetching, isLoading, isError, isSuccess, data, error } = useQuery({
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    queryKey: ['qrs', keys],
    queryFn: () => getQrs(keys ? keys.value : {}),
    retry: false,
  });
  return { isError, isLoading, isSuccess, data, isFetching, error };
};

const useCreateQr = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: createMedia,
    onSuccess: () => {
      queryClient.invalidateQueries(['qrs']);
      notification.success({
        message: 'Media döretmek',
        description: 'Media üstünlikli döredildi',
      });
    },
    onError: (err) => {
      notification.error({
        message: 'Media döretmek',
        description: err,
      });
    },
  });

  return { mutate, isPending, isSuccess, isError };
};

const useDeleteQr = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (id) => deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['qrs']);

      notification.success({
        message: 'Media pozmak',
        description: 'Media üstünlikli pozuldy',
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
const useDeleteQrs = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (data) => deleteMedias(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['qrs']);
      notification.success({
        message: 'Medialary pozmak',
        description: 'Medialar üstünlikli pozuldy',
      });
    },
    onError: (err) => {
      notification.error({
        message: 'Medialary pozmak',
        description: err,
      });
    },
  });
  return { mutate, isPending, isSuccess, isError };
};

export { useCreateQr, useDeleteQr, useGetQr, useGetQrs, useDeleteQrs };
