import express from "express";
import Idea from "../models/Idea.js";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route             GET /api/ideas
// @description       Get all ideas
// @access            Public
// @query             _limit (optional limit for ideas returned)

router.get("/", async (req, res, next) => {
  try {
    const limit = parseInt(req.query._limit);
    const query = Idea.find().sort({ createdAt: -1 });

    if (!isNaN(limit) && limit > 0) {
      query.limit(limit);
    }

    const ideas = await query.exec();
    res.json(ideas);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// @route             GET /api/ideas/:id
// @description       Get single idea
// @access            Public

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Idea not found");
    }

    const idea = await Idea.findById(id);
    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }
    res.json(idea);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

// @route             POST /api/ideas
// @description       Create new idea
// @access            Public

router.post("/", protect, async (req, res, next) => {
  try {
    const { title, description, summary, tags } = req.body || {};

    if (!title?.trim() || !description?.trim() || !summary?.trim()) {
      res.status(400);
      throw new Error("Please fill in all required fields");
    }

    const newIdea = new Idea({
      title,
      description,
      summary,
      tags:
        typeof tags === "string"
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray(tags)
          ? tags
          : [],
      user: req.user.id,
    });

    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

// @route             DELETE /api/ideas/:id
// @description       Delete idea
// @access            Public

router.delete("/:id", protect, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Idea not found");
    }

    const idea = await Idea.findById(id);

    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }

    // Check if user owns idea
    if (idea.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error("Not authorized to delete this idea");
    }

    await idea.deleteOne();

    res.json({ message: "Idea deleted successfully" });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

// @route             PUT /api/ideas/:id
// @description       Update idea
// @access            Public

router.put("/:id", protect, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Idea not found");
    }

    const idea = await Idea.findById(id);

    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }

    // Check if user owns idea
    if (idea.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error("Not authorized to update this idea");
    }

    const { title, description, summary, tags } = req.body || {};

    if (!title?.trim() || !description?.trim() || !summary?.trim()) {
      res.status(400);
      throw new Error("Please fill in all required fields");
    }

    idea.title = title;
    idea.description = description;
    idea.summary = summary;
    idea.tags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : Array.isArray(tags)
      ? tags
      : [];

    const updatedIdea = await idea.save();

    res.json(updatedIdea);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

export default router;
