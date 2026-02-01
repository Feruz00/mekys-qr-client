import axios from 'axios';
const server = `${import.meta.env.VITE_API_URL}/api`;

const createFile = async (data, onProgress) => {
  try {
    const res = await axios.post(`${server}/upload`, data, {
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        onProgress?.(percent);
      },
    });

    return res.data;
  } catch (err) {
    // 🎯 centralized error handling
    const message =
      err.response?.data?.message ||
      err.response?.data?.error || // fallback (old backend)
      'Serwerde näsazlyk bar';

    throw new Error(message);
  }
};

const deleteFile = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${server}/upload/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        const { data } = res;
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        reject(err?.response?.data?.message || 'Serwerde näsazlyk bar');
      });
  });
};

export { createFile, deleteFile };
