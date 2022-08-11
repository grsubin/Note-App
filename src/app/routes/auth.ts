// import router from "./index";
import { Router } from "express";
import authController from "../controllers/auth.controller";
import { auth } from "../middleware/index";
const router = Router();

//POST (api/auth/login)
router.post("/login", authController.login);
router.post("/logout", [auth.verifyToken], authController.logout);

export default router;
