import express from "express";
const router = express.Router();

router.get("/:id", (req, res) => {
    res.json({ message: "Route funktioniert!", userId: req.params.id });
});

export default router;
