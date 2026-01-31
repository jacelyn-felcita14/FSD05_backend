import express from "express";

import {
    acceptUserRole,
    getUser,
    loginUser,
    logoutUser,
    registerAdmin
} from "../Controller/authController.js";

import { adminMiddleware, authMiddleware } from "../Middleware/authMiddleware.js";

const authRouter = express.Router();

/* =========================
   GET ROUTES
========================= */
authRouter.get("/user", authMiddleware, adminMiddleware, getUser);

authRouter.get("/role-setup/:id", acceptUserRole);

/* =========================
   POST ROUTES
========================= */
authRouter.post("/register-admin", registerAdmin);

authRouter.post("/login", loginUser);

authRouter.post("/logout", logoutUser);

/* =========================
   EXPORT
========================= */
export default authRouter;
