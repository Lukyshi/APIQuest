'use strict';
const missionService = require('./mission.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');

const list = asyncHandler(async (req, res) => {
  const data = await missionService.list(req.user?.id);
  res.json({ success: true, data });
});

const getById = asyncHandler(async (req, res) => {
  const data = await missionService.getById(req.params.id, req.user?.id);
  res.json({ success: true, data });
});

const getHint = asyncHandler(async (req, res) => {
  const { hintIndex } = req.body;
  if (hintIndex == null) throw ApiError.badRequest('hintIndex is required');
  const data = await missionService.getHint(req.params.id, hintIndex, req.user.id);
  res.json({ success: true, data });
});

const submit = asyncHandler(async (req, res) => {
  const { submission, hintsUsed = 0 } = req.body;
  if (!submission) throw ApiError.badRequest('submission object is required');
  const data = await missionService.submit(req.params.id, { ...submission, hintsUsed }, req.user.id);
  res.json({ success: true, data });
});

module.exports = { list, getById, getHint, submit };
