import api from '../../lib/axios';

export const progressApi = {
  getMe: () => api.get('/progress/me').then((r) => r.data.data),
};
