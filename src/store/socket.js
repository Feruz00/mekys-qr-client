// store/socket.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { io } from 'socket.io-client';
import { notification } from 'ant-design-vue';
import useAuthStore from './auth';

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null);
  const isConnected = ref(false);
  const authStore = useAuthStore();

  const connect = () => {
    if (!authStore.user?.id) return;
    socket.value = io(import.meta.env.VITE_API_URL, {
      query: { id: authStore.user.id },
      withCredentials: true,
      transports: ['polling', 'websocket'],
      autoConnect: false,
    });

    socket.value.on('connect', () => {
      isConnected.value = true;
      notification.destroy('socket-disconnect');
      console.log('✅ Socket connected');
    });

    socket.value.on('connect_error', (err) => {
      console.error('❌ Socket connect error:', err.message);
    });

    socket.value.on('disconnect', (reason) => {
      isConnected.value = false;
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // server forced disconnect → can try reconnect
        socket.value.connect();
      }
    });
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      isConnected.value = false;
    }
  };

  return { socket, isConnected, connect, disconnect };
});
