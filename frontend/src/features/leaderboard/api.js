import api from '../../lib/axios';

export const leaderboardApi = {
  get: () => api.get('/leaderboard').then((r) => r.data.data),
};
