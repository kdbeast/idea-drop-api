import express from "express";

const router = express.Router();

// @route GET /api/ideas
// @description Get all ideas
// @access Public

router.get("/", (req, res) => {
  const ideas = [
    { id: 1, idea: "Idea 1" },
    { id: 2, idea: "Idea 2" },
    { id: 3, idea: "Idea 3" },
  ];
  res.json(ideas);
});

// @route POST /api/ideas
// @description Create new ideas
// @access Public

router.post("/", (req, res) => {
  const { title, description } = req.body;
  res.send({ title, description });
});

export default router;
