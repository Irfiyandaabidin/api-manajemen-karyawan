const { check, validationResult } = require('express-validator');
const route = require('express').Router();
const registerController = require('../controllers/register-controller');

route.post('/', [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please fill in a valid email').isEmail(),
    check('password', "The password must be at least 6 characters or more.").isLength({min: 6})
], registerController.register);

module.exports = route;