export const setAccessToken = token => {
  localStorage.setItem('access_token', token);
};

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const setRefreshToken = token => {
  localStorage.setItem('refresh_token', token);
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};
