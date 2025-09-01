import express from "express";
import Idea from "../models/Idea.js";
import mongoose from "mongoose";

const router = express.Router();

// @route GET /api/ideas
// @description Get all ideas
// @access Public

router.get("/", async (req, res, next) => {
  try {
    const ideas = await Idea.find({});
    res.json(ideas);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// @route GET /api/ideas/:id
// @description Get single idea
// @access Public

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

// @route POST /api/ideas
// @description Create new ideas
// @access Public

router.post("/", async (req, res, next) => {
  try {
    const { title, description, summary, tags } = req.body;

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
    });

    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

// @route DELETE /api/ideas/:id
// @description Delete idea
// @access Public

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Idea not found");
    }

    const idea = await Idea.findByIdAndDelete(id);
    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }
    res.json({ message: "Idea deleted successfully" });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

// @route PUT /api/ideas/:id
// @description Update idea
// @access Public

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Idea not found");
    }

    const { title, description, summary, tags } = req.body;

    if (!title?.trim() || !description?.trim() || !summary?.trim()) {
      res.status(400);
      throw new Error("Please fill in all required fields");
    }

    const updatedIdea = await Idea.findByIdAndUpdate(
      id,
      {
        title,
        description,
        summary,
        tags: Array.isArray(tags)
          ? tags
          : tags.split(",").map((tag) => tag.trim()),
      },
      { new: true, runValidators: true }
    );

    if (!updatedIdea) {
      res.status(404);
      throw new Error("Idea not found");
    }

    res.json(updatedIdea);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

export default router;
