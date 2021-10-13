const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const expressValidator = require('express-validator');
const passwordValidator = require('password-validator');

router.get('/signup', userController.getSignupPage);
router.get('/signin', userController.getSigninPage);
router.post(
    '/signup',
    expressValidator.body('city').custom(value => {
        const whitelist = ['Paris', 'Tokyo', 'Los Angeles'];
        if (whitelist.includes(value)) {
            return true;
        }
        return false;
    }),
    expressValidator.body('username').isLength({min: 4}),
    expressValidator.body('password').custom((value) => {
        const passwordValidationSchema = new passwordValidator();
        passwordValidationSchema.is().min(8);
        return passwordValidationSchema.validate(value);
    }),
    userController.signupUser
);
router.post('/signin', userController.signinUser);
router.get('/username/:username', userController.getUserPage);
router.get('/logout', userController.logoutUser);

module.exports = router;