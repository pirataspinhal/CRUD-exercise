const express = require('express');
const {UserController} = require('../Provider/ControllerDependencyInjection');
const router = express.Router();

router.get('/users', UserController.getUserById);

module.exports = router;
