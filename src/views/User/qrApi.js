import axios from 'axios';

const server = `${import.meta.env.VITE_API_URL}/api`;

const createMedia = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${server}/qr/`, data, { withCredentials: true })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        // // console.log(err);
        reject(err?.response?.data?.message || 'Serwerde näsazlyk bar');
      });
  });
};

const deleteMedia = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${server}/qr/${id}`, { withCredentials: true })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err?.response?.data?.message || 'Serwerde näsazlyk bar');
      });
  });
};

const deleteMedias = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${server}/qr`, { data: { ids: data }, withCredentials: true })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err?.response?.data?.message || 'Serwerde näsazlyk bar');
      });
  });
};

const getQrs = (params = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${server}/qr`, { params, withCredentials: true })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err?.response?.data?.message || 'Serwerde näsazlyk bar');
      });
  });
};

const getQr = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${server}/qr/${id}`, { withCredentials: true })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        // // console.log(err);
        // console.log(err)
        reject(err?.response?.data?.message || 'Serwerde näsazlyk bar');
      });
  });
};

export { createMedia, deleteMedia, deleteMedias, getQr, getQrs };
