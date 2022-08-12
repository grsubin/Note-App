import { Router } from "express";
import auth from "./auth";
import users from "./users";
import notes from "./notes";
const router = Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/notes", notes);

// router.use(function (err, req, res, next) {
//   if (err.name === "ValidationError") {
//     return res.status(422).json({
//       errors: Object.keys(err.errors).reduce(function (errors, key) {
//         errors[key] = err.errors[key].message;

//         return errors;
//       }, {}),
//     });
//   }

//   return next(err);
// });

export default router;
