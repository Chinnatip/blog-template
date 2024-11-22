import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Fetch all posts
router.get('/posts', async (req: Request, res: any) => {
    try {
      const posts = await prisma.post.findMany({
        include: { author: true }, // Fetch the author details for each post
      });
  
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

// Create a new post
router.post('/posts', async (req: Request, res: any) => {
  try {

    const { title, content, authorId } = req.body;

    console.log(title, content, authorId)

    // Validate input
    if (!title || !content || !authorId) {
      return res.status(400).json({ error: 'Title, content, and authorId are required.' });
    }

    // Create the post in the database
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// router.post('/', async (req, res) => {
//   const { title, content } = req.body;
//   const post = await prisma.post.create({
//     data: { title, content },
//   });
//   res.status(201).json(post);
// });

// // Get all posts
// router.get('/', async (req, res) => {
//   const posts = await prisma.post.findMany();
//   res.json(posts);
// });

// // Get a single post
// router.get('/:id', async (req, res) => {
//   const { id } = req.params;
//   const post = await prisma.post.findUnique({
//     where: { id: Number(id) },
//   });
//   res.json(post);
// });

// // Update a post
// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { title, content } = req.body;
//   const post = await prisma.post.update({
//     where: { id: Number(id) },
//     data: { title, content },
//   });
//   res.json(post);
// });

// // Delete a post
// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;
//   await prisma.post.delete({
//     where: { id: Number(id) },
//   });
//   res.status(204).send();
// });

export default router;



