import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import { createPinia } from 'pinia';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

import progressBar from './includes/progress-bar';

import router from './router/router';

import 'nprogress/nprogress.css';
import './style.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
});

const app = createApp(App);
app.use(createPinia());
app.use(VueQueryPlugin, queryClient);
progressBar(router);
app.use(router);
app.mount('#app');
