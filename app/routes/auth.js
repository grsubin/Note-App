
const router = require('express').Router();
const authController = require('../controllers/auth.controller');


//POST (api/auth/login)
router.post('/login', authController.signin);




module.exports = router;