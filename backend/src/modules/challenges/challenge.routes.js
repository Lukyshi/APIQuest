'use strict';
const { Router } = require('express');
const controller = require('./challenge.controller');
const { authenticate, optionalAuthenticate } = require('../../middlewares/auth.middleware');

const router = Router();

router.get('/',         optionalAuthenticate, controller.list);
router.get('/:id',      controller.getById);
router.post('/:id/submit', authenticate, controller.submit);

module.exports = router;
