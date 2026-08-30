import api from '../../lib/axios';

export const sandboxApi = {
  rest:    (payload) => api.post('/sandbox/rest', payload).then((r) => r.data.data),
  graphql: (payload) => api.post('/sandbox/graphql', payload).then((r) => r.data.data),
  soap:    (payload) => api.post('/sandbox/soap', payload).then((r) => r.data.data),
};
