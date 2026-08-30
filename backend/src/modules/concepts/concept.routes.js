'use strict';
const { Router } = require('express');
const controller = require('./concept.controller');

const router = Router();
router.get('/',       controller.getAll);
router.get('/:slug',  controller.getBySlug);

module.exports = router;
