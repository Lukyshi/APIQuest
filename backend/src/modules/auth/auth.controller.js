'use strict';
const authService = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, message: 'Account created successfully', data: result });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ success: true, message: 'Login successful', data: result });
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body);
  res.json({ success: true, message: 'Tokens refreshed', data: result });
});

module.exports = { register, login, refresh };
