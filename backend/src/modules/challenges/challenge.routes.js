'use strict';
const { Router } = require('express');
const controller = require('./challenge.controller');
const { authenticate, optionalAuthenticate } = require('../../middlewares/auth.middleware');

const router = Router();

router.get('/',         controller.list);
router.get('/:id',      controller.getById);
router.post('/:id/submit', optionalAuthenticate, controller.submit);

module.exports = router;
