import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { login, logout } from './loginApi';
import useAuthStore from '../../store/auth';
import { notification } from 'ant-design-vue';

const useLogin = () => {
  const authStore = useAuthStore();
  const queryClient = useQueryClient();

  const {
    mutate: signin,
    isPending: isLoading,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: (data) => login(data),
    onSuccess: (data) => {
      const { user } = data.data;

      authStore.setUser(user);

      queryClient.invalidateQueries(['auth']);
      notification.success({
        message: 'Ulgama giriş',
        description: 'Ulanyjy ulgama ustunlikli girdi',
      });
      return data;
    },
    onError: (err) => {
      notification.error({
        message: 'Ulgama giriş',
        description: err,
      });
    },
  });
  return { signin, isLoading, isSuccess, isError };
};

const useLogout = () => {
  const authStore = useAuthStore();
  const queryClient = useQueryClient();
  const {
    mutate: signout,
    isLoading,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      authStore.setUser(null);
      window.location.reload();
      queryClient.invalidateQueries(['auth']);
      notification.success({
        message: 'Ulanyjy çykdy',
        description: 'Ulanyjy üstünlikli çykdy',
      });
    },
    onError: (err) => {
      notification.error({
        message: 'Ulanyjy çykdy',
        description: err,
      });
    },
  });
  return { signout, isLoading, isSuccess, isError };
};

export { useLogin, useLogout };
