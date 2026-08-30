import api from '../../lib/axios';

export const conceptsApi = {
  getAll:    () => api.get('/concepts').then((r) => r.data.data),
  getBySlug: (slug) => api.get(`/concepts/${slug}`).then((r) => r.data.data),
};
