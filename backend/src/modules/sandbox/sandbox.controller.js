'use strict';
const sandboxService = require('./sandbox.service');
const asyncHandler = require('../../utils/asyncHandler');

const rest = asyncHandler(async (req, res) => {
  const data = await sandboxService.proxyRest(req.body, req.user?.id);
  res.json({ success: true, data });
});

const graphql = asyncHandler(async (req, res) => {
  const data = await sandboxService.proxyGraphQL(req.body, req.user?.id);
  res.json({ success: true, data });
});

const soap = asyncHandler(async (req, res) => {
  const data = await sandboxService.proxySoap(req.body, req.user?.id);
  res.json({ success: true, data });
});

module.exports = { rest, graphql, soap };
