const express = require("express");
const router = express.Router();
const { Blog } = require("../db/index");
const verifyToken = require("../helpers/helpers");

/**
 * @swagger
 * /api/blog/list:
 *   get:
 *     summary: Get all blogs
 *     description: Retrieve a list of all blog posts.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of blog posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The blog ID.
 *                     example: 1
 *                   title:
 *                     type: string
 *                     description: The blog title.
 *                     example: "My First Blog"
 *                   message:
 *                     type: string
 *                     description: The blog content.
 *                     example: "This is the content of the blog."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date the blog was created.
 *
 *
 * /api/blog/view/{id}:
 *   get:
 *     summary: Get a single blog
 *     description: Retrieve details of a single blog post by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The blog ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the blog.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The blog ID.
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: The blog title.
 *                   example: "My First Blog"
 *                 message:
 *                   type: string
 *                   description: The blog content.
 *                   example: "This is the content of the blog."
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date the blog was created.
 *       404:
 *         description: Blog not found.
 *
 *
 * /api/blog/create:
 *   post:
 *     summary: Create a new blog
 *     description: Add a new blog post.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: The blog title.
 *                 example: "My New Blog"
 *               message:
 *                 type: string
 *                 description: The blog content.
 *                 example: "This is the content of my new blog."
 *     responses:
 *       201:
 *         description: Blog created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the newly created blog.
 *                   example: 2
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Blog created successfully."
 *       400:
 *         description: Invalid input.
 *
 *
 * /api/blog/edit/{id}:
 *   put:
 *     summary: Update a blog
 *     description: Edit the details of an existing blog post.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The blog ID.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated blog title.
 *                 example: "Updated Blog Title"
 *               message:
 *                 type: string
 *                 description: The updated blog content.
 *                 example: "This is the updated content of the blog."
 *     responses:
 *       200:
 *         description: Blog updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the updated blog.
 *                   example: 1
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Blog updated successfully."
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Blog not found.
 *
 *
 * /api/blog/delete/{id}:
 *   delete:
 *     summary: Delete a blog
 *     description: Remove a blog post by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The blog ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blog deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Blog deleted successfully."
 *       404:
 *         description: Blog not found.
 */

router.get("/list", verifyToken, async (req, res) => {
  try {
    let blogs = await Blog.findAll({ where: { author: req.user.id } });
    res.status(200).json({
      status: "success",
      code: 200,
      data: blogs,
      message: "Blog posts fetched successfully",
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
  res.end();
});

router.get("/view/:id", verifyToken, async (req, res) => {
  try {
    let blog = await Blog.findOne({ where: { id: req.params.id } });
    // .populate(
    //   "author"
    // );
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
      author_name: req.user.name,
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
    let blog = await Blog.update(
      {
        title: req.body.title,
        message: req.body.message,
        author: req.user.id,
      },
      {
        where: { id: req.params.id },
      }
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
    let blog = await Blog.destroy({ where: { id: req.params.id } });
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
