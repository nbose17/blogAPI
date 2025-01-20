const express = require("express");
const router = express.Router();
const Blog = require("../db/blog");
const verifyToken = require("../helpers/helpers");

router.get("/list", verifyToken, async (req, res) => {
  try {
    let blogs = await Blog.find({
      author: req.user.id,
    }).populate("author");
    res.status(200).json({
      status: "success",
      code: 200,
      data: blogs,
      message: "Blog posts fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
  res.end();
});

router.get("/view/:id", verifyToken, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id).populate("author");
    res.status(200).json({
      status: "success",
      code: 200,
      data: blog,
      message: "Blog post fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
  res.end();
});

router.post("/create", verifyToken, async (req, res) => {
  try {
    let blog = await Blog.create({
      title: req.body.title,
      message: req.body.message,
      author: req.user.id,
    });
    res.status(200).json({
      status: "success",
      code: 200,
      data: blog,
      message: "Blog created successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
});

router.put("/edit/:id", verifyToken, async (req, res) => {
  try {
    let blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        message: req.body.message,
        author: req.user.id,
      },
      { returnDocument: "after" }
    );
    res.status(200).json({
      status: "success",
      code: 200,
      data: blog,
      message: "Blog updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    let blog = await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      code: 200,
      data: blog,
      message: "Blog deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
