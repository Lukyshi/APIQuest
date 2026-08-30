'use strict';
const challengeService = require('./challenge.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');

const list = asyncHandler(async (req, res) => {
  const { concept } = req.query;
  if (!concept) throw ApiError.badRequest('Query param "concept" is required (e.g. ?concept=rest)');
  const data = await challengeService.listByConceptSlug(concept.toLowerCase());
  res.json({ success: true, data });
});

const getById = asyncHandler(async (req, res) => {
  const data = await challengeService.getById(req.params.id);
  res.json({ success: true, data });
});

const submit = asyncHandler(async (req, res) => {
  const { optionId } = req.body;
  if (!optionId) throw ApiError.badRequest('optionId is required');
  const data = await challengeService.submit(req.params.id, optionId, req.user?.id);
  res.json({ success: true, data });
});

module.exports = { list, getById, submit };
