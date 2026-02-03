import express from "express";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

export default router;
