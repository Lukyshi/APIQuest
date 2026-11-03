import api from '../../lib/axios';

export const missionsApi = {
  list:    ()        => api.get('/missions').then((r) => r.data.data),
  getById: (id)      => api.get(`/missions/${id}`).then((r) => r.data.data),
  getHint: (id, hintIndex) =>
    api.post(`/missions/${id}/hint`, { hintIndex }).then((r) => r.data.data),
  submit:  (id, submission, hintsUsed) =>
    api.post(`/missions/${id}/submit`, { submission, hintsUsed }).then((r) => r.data.data),
};
