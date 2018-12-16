const express = require('express');
const {CardController} = require('../Provider/ControllerDependencyInjection');
const router = express.Router();

router.post('/cards', CardController.createCardAction);

module.exports = router;
