import api from '../../lib/axios';

export const challengesApi = {
  listByConcept: (slug) => api.get(`/challenges?concept=${slug}`).then((r) => r.data.data),
  getById:       (id) => api.get(`/challenges/${id}`).then((r) => r.data.data),
  submit:        (id, optionId) => api.post(`/challenges/${id}/submit`, { optionId }).then((r) => r.data.data),
};
