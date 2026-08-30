'use strict';
const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const controller = require('./sandbox.controller');
const validate = require('../../middlewares/validate.middleware');
const { optionalAuthenticate } = require('../../middlewares/auth.middleware');
const { restSchema, graphqlSchema, soapSchema } = require('./sandbox.validation');
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } = require('../../config/env');

const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: { success: false, message: 'Too many sandbox requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();
router.use(limiter);
router.use(optionalAuthenticate);

router.post('/rest',    validate(restSchema),    controller.rest);
router.post('/graphql', validate(graphqlSchema), controller.graphql);
router.post('/soap',    validate(soapSchema),    controller.soap);

module.exports = router;
