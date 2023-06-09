const { check, validationResult } = require('express-validator');
const router = require('express').Router();
const loginController = require('../controllers/login-controller');
const logoutController = require('../controllers/logout-controller');

router.post('/login', [
    check('email', 'Please fill in a valid email.').isEmail(),
    check('password', 'Password is required.').exists()
], loginController)

router.post('/logout', logoutController)

module.exports = router;