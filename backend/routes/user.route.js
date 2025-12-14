import express from "express"
import{editProfile, followOrUnfollow, getProfile, getsuggestedUsers, register,login,logout} from "../controllers/user.controller.js"
import upload from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"

const router = express.Router();

// router.route('/register').post(register);
// router.route('/login').post(login);
// router.route('/logout').get(logout);
// router.route('/:id/profile').get(isAuthenticated,getProfile);
// router.route('/profile/edit').post(isAuthenticated,getProfile,upload.single('profilePicture'),editProfile);
// router.route('/suggested').get(isAuthenticated,getsuggestedUsers);
// router.route('/followorunfollow/:id').post(isAuthenticated,followOrUnfollow);

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/:id/profile", isAuthenticated, getProfile);

router.post(
  "/profile/edit",
  isAuthenticated,
  upload.single("profilePicture"),
  editProfile
);

router.get("/suggested", isAuthenticated, getsuggestedUsers);
router.post("/followorunfollow/:id", isAuthenticated, followOrUnfollow);

export default router;