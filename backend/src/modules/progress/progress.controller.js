'use strict';
const progressService = require('./progress.service');
const asyncHandler = require('../../utils/asyncHandler');

const getMe = asyncHandler(async (req, res) => {
  const data = await progressService.getMe(req.user.id);
  res.json({ success: true, data });
});

module.exports = { getMe };
