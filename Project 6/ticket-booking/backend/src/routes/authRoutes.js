import express from "express";
import { protect } from "../middleware/authMiddleware.js"; 
import { 
    registerUser,
    loginUser,
    getUserProfile,
    forgotPassword,
    resetPassword,
} from "../controller/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);     
router.post("/forgotpassword", forgotPassword); 
router.put("/resetpassword/:resettoken", resetPassword); 

router.get("/me", protect, getUserProfile); 

export default router;
