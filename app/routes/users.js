
const router = require('express').Router();
const userController = require('../controllers/users.controller');
const {auth} = require('../middleware/auth');



//GET (/api/users)
router.get("/",[auth.verifyToken], userController.getAllUsers);
//POST (/api/users)
router.post("/", userController.createUser);
//GET (/api/users/:username)
router.get("/:username",[auth.verifyToken], userController.findUserByUsername)
//PUT (/api/users/:username)
router.put("/:username",[auth.verifyToken], userController.updateUser);
//DELETE (/api/users/:username)
router.delete("/:username",[auth.verifyToken],userController.deleteUserByUsername);

module.exports = router;