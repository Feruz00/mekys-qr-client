import axios from 'axios';
const server = `${import.meta.env.VITE_API_URL}/api`;

const createFile = async (data, onProgress, signal) => {
  try {
    const res = await axios.post(`${server}/upload`, data, {
      withCredentials: true,
      signal,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (e) => {
        if (!e.total) return;
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress?.(percent);
      },
    });

    return res.data;
  } catch (err) {
    if (axios.isCancel(err) || err.name === 'CanceledError') {
      throw new Error('Upload cancelled');
    }

    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
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
