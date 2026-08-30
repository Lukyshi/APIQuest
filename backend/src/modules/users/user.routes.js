'use strict';
const { Router } = require('express');
const controller = require('./user.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = Router();
router.get('/me', authenticate, controller.getMe);

module.exports = router;
