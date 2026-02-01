import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  createUser,
  deleteUser,
  deleteUsers,
  getUser,
  getUsers,
  updateUser,
} from '../Login/loginApi';
import { notification } from 'ant-design-vue';

const useGetUser = (id) => {
  return useQuery({
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    queryKey: ['user', id],
    queryFn: () => getUser(id?.value),
  });
};

const useGetUsers = (keys) => {
  const { isFetching, isLoading, isError, isSuccess, data, error } = useQuery({
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    queryKey: ['users', keys],
    queryFn: () => getUsers(keys ? keys.value : {}),
    retry: false,
  });
  return { isError, isLoading, isSuccess, data, isFetching, error };
};

const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      notification.success({
        message: 'Ulanyjy döretmek',
        description: 'Ulanyjy üstünlikli döredildi',
      });
    },
    onError: (err) => {
      notification.error({
        message: 'Ulanyjy döretmek',
        description: err,
      });
    },
  });

  return { mutate, isPending, isSuccess, isError };
};

const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);

      notification.success({
        message: 'Ulanyjy pozmak',
        description: 'Ulanyjy üstünlikli pozuldy',
      });
    },
    onError: (err) => {
      notification.error({
        message: 'Ulanyjy pozmak',
        description: err,
      });
    },
  });
  return { mutate, isPending, isSuccess, isError };
};
const useDeleteUsers = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (data) => deleteUsers(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      notification.success({
        message: 'Ulanyjylary pozmak',
        description: 'Ulanyjylar üstünlikli pozuldy',
      });
    },
    onError: (err) => {
      notification.error({
        message: 'Ulanyjylary pozmak',
        description: err,
      });
    },
  });
  return { mutate, isPending, isSuccess, isError };
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      notification.success({
        message: 'Ulanyjy maglumatlary sazlanyldy',
        description: 'Ulanyjy maglumatlary üstünlikli sazlanyldy',
      });
    },
    onError: (err) => {
      notification.error({
        message: 'Ulanyjy maglumatlary sazlanyldy',
        description: err,
      });
    },
  });
  return { mutate, isPending, isSuccess, isError };
};

export {
  useGetUser,
  useGetUsers,
  useDeleteUsers,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
};
