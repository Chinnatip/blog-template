import express, { Request } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Fetch all posts
router.get('/', async (req: Request, res: any) => {
  try {
      const posts = await prisma.post.findMany({
          include: { author: true },
      });
      return res.status(200).json(posts);
  } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch a single post by ID
router.get('/:id', async (req: Request, res: any) => {
    const { id } = req.params;

    try {
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: { author: true },
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new post
router.post('/', async (req: Request, res: any) => {
    const { title, content, authorId } = req.body;

    try {
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

// Update a post
router.put('/:id', async (req: Request, res: any) => {
    const { id } = req.params;
    const { title, content, published } = req.body;
  
    try {
      // Validate input if `title` or `content` are provided
      if (title === '' || content === '') {
        return res.status(400).json({ error: 'Title and content cannot be empty.' });
      }
  
      // Construct the update data dynamically
      const updateData: any = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (published !== undefined) updateData.published = published;
  
      // Ensure there is at least one field to update
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No valid fields provided for update.' });
      }
  
      const updatedPost = await prisma.post.update({
        where: { id: Number(id) },
        data: updateData,
      });
  
      return res.status(200).json(updatedPost);
    } catch (error: any) {
      console.error('Error updating post:', error);
  
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Delete a post
router.delete('/:id', async (req: Request, res: any) => {
    const { id } = req.params;

    try {
        await prisma.post.delete({
            where: { id: Number(id) },
        });

        return res.status(204).send();
    } catch (error: any) {
        console.error('Error deleting post:', error);

        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Post not found' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch posts by page (pagination)
router.get('/page/:pageNumber', async (req: Request, res: any) => {
    const { pageNumber } = req.params;
    const { authorId } = req.query; // Get authorId from query
    const pageSize = 10; // Number of posts per page
    const page = Number(pageNumber);
  
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: 'Invalid page number' });
    }
  
    try {
      if (!authorId) {
        return res.status(400).json({ error: 'Author ID is required.' });
      }
  
      // Fetch the user's role based on authorId
      const user = await prisma.user.findUnique({
        where: { id: Number(authorId) },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Check if the user is an admin
      const isAdmin = user.adminRole;
  
      // Build the filter condition
      const filterCondition = isAdmin ? {} : { authorId: Number(authorId) };
  
      // Fetch posts with pagination and filtering
      const posts = await prisma.post.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { author: true },
        where: filterCondition,
        orderBy: {
          updatedAt: 'desc',
        },
      });
  
      // Count total posts with the same filter condition
      const totalPosts = await prisma.post.count({
        where: filterCondition,
      });
  
      return res.status(200).json({
        posts,
        totalPosts,
        totalPages: Math.ceil(totalPosts / pageSize),
        currentPage: page,
      });
    } catch (error) {
      console.error('Error fetching posts by page:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
});
  
router.get('/publish/page', async (req: Request, res: any) => {
    const pageSize = 10; // Number of posts per page

    try {
  
      const posts = await prisma.post.findMany({
        take: pageSize,
        include: { author: true },
        where: {
          published: true
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
  
      return res.status(200).json({
        posts
      });
    } catch (error) {
      console.error('Error fetching posts by page:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  

export default router;