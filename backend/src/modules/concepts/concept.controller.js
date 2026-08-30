'use strict';
const conceptService = require('./concept.service');
const asyncHandler = require('../../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const data = await conceptService.getAll();
  res.json({ success: true, data });
});

const getBySlug = asyncHandler(async (req, res) => {
  const data = await conceptService.getBySlug(req.params.slug);
  res.json({ success: true, data });
});

module.exports = { getAll, getBySlug };
