import axios from 'axios';

const server = `${import.meta.env.VITE_API_URL}/api`;

const login = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${server}/auth/login`, data, { withCredentials: true })
      .then((res) => {
        const { data } = res;

        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data) {
          reject(err.response.data.message);
        } else reject('Serwerde näsazlyk bar');
      });
  });
};

const logout = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${server}/auth/logout`, {}, { withCredentials: true })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        // // console.log(err);
        reject(err?.response?.data?.message || 'Serwerde näsazlyk bar');
      });
  });
};

const currentUser = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${server}/auth`, { withCredentials: true })
      .then((res) => {
        const { data } = res;
        resolve(data);
      })
      .catch((err) => {
        // console.log(err)
        reject(err?.response?.data?.message || 'Serwerde näsazlyk bar');
      });
  });
};

const createUser = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${server}/users/`, data, { withCredentials: true })
      .then((res) => {
        resolve();
      })
      .catch((err) => {
        // // console.log(err);
        // console.log(err)
        reject(err?.response?.data?.message || 'Serwerde näsazlyk bar');
      });
  });
};

const updateUser = (id, data) => {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${server}/users/${id}`, data, { withCredentials: true })
      .then((res) => {
        resolve();
      })
      .catch((err) => {
        reject(err?.response?.data?.message || 'Serwerde näsazlyk bar');
      });
  });
};

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${server}/users/${id}`, { withCredentials: true })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err?.response?.data?.message || 'Serwerde näsazlyk bar');
      });
  });
};

const deleteUsers = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${server}/users`, { data: { ids: data }, withCredentials: true })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err?.response?.data?.message || 'Serwerde näsazlyk bar');
      });
  });
};

const getUsers = (params = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${server}/users`, { params, withCredentials: true })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err?.response?.data?.message || 'Serwerde näsazlyk bar');
      });
  });
};

const getUser = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${server}/users/${id}`, { withCredentials: true })
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

export {
  logout,
  login,
  currentUser,
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUser,
  deleteUsers,
};
