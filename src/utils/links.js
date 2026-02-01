const getStreamUrl = (id) => {
  const baseUrl =
    import.meta.env.MODE === 'production' ? '' : import.meta.env.VITE_IMG_URL;
  return id ? `${baseUrl}/api/stream/${id}` : '';
};

const getImageUrl = (path) => {
  const baseUrl =
    import.meta.env.MODE === 'production' ? '' : import.meta.env.VITE_IMG_URL;

  return path ? `${baseUrl}/${path.replace(/\\/g, '/')}` : '';
};

export { getImageUrl, getStreamUrl };
