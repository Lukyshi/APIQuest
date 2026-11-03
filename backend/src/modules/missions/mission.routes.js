'use strict';
const { Router } = require('express');
const controller = require('./mission.controller');
const { authenticate, optionalAuthenticate } = require('../../middlewares/auth.middleware');

const router = Router();

router.get('/',          optionalAuthenticate, controller.list);
router.get('/:id',       optionalAuthenticate, controller.getById);
router.post('/:id/hint', authenticate,         controller.getHint);
router.post('/:id/submit', authenticate,       controller.submit);

module.exports = router;
