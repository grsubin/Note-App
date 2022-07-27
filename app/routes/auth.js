
const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const {auth} = require('../middleware/auth')

//POST (api/auth/login)
router.post('/login', authController.login);
router.post('/logout', [auth.verifyToken],authController.logout);




module.exports = router;