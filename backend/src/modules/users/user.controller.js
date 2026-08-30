'use strict';
const userService = require('./user.service');
const asyncHandler = require('../../utils/asyncHandler');

const getMe = asyncHandler(async (req, res) => {
  const data = await userService.getMe(req.user.id);
  res.json({ success: true, data });
});

module.exports = { getMe };
