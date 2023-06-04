const { check, validationResult } = require('express-validator');
const router = require('express').Router();
const loginController = require('../controllers/login-controller');

router.post('/', [
    check('email', 'Please fill in a valid email.').isEmail(),
    check('password', 'Password is required.').exists()
], loginController.login)

module.exports = router;