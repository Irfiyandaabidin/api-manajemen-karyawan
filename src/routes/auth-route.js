const { check, validationResult } = require('express-validator');
const router = require('express').Router();
const loginController = require('../application/controllers/login-controller');
const logoutController = require('../application/controllers/logout-controller');
const registerController = require('../application/controllers/register-controller');

router.post('/login', [
    check('email', 'Please fill in a valid email.').isEmail(),
    check('password', 'Password is required.').exists()
], loginController)

router.post('/logout', logoutController)

router.post('/register', registerController)

module.exports = router;