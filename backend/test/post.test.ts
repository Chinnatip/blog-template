import request from 'supertest';
import express from 'express';
import postRoutes from '../src/routes/postRoutes';
import { PrismaClient } from '@prisma/client';

// Initialize Express app with the routes
const app = express();
app.use(express.json());
app.use('/api/posts', postRoutes);

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const prisma = new PrismaClient();

describe('Post API', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('GET /api/posts', () => {
    it('should fetch all posts', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Test Post 1',
          content: 'This is the content of test post 1.',
          published: true,
          authorId: 1,
          author: { id: 1, name: 'Author Name', email: 'author@example.com' },
        },
      ];

      (prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts);

      const response = await request(app).get('/api/posts');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'Test Post 1',
            content: 'This is the content of test post 1.',
            author: expect.objectContaining({
              name: 'Author Name',
            }),
          }),
        ])
      );
    });

    it('should handle server errors', async () => {
      (prisma.post.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/posts');

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({ error: 'Internal server error' });
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should fetch a single post by ID', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'This is a test post.',
        published: true,
        authorId: 1,
        author: { id: 1, name: 'Author Name', email: 'author@example.com' },
      };

      (prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost);

      const response = await request(app).get('/api/posts/1');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: 'Test Post',
        content: 'This is a test post.',
        author: expect.objectContaining({ name: 'Author Name' }),
      });
    });

    it('should return 404 if post not found', async () => {
      (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/posts/999');

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: 'Post not found' });
    });

    it('should handle server errors', async () => {
      (prisma.post.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/posts/1');

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({ error: 'Internal server error' });
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post successfully', async () => {
      const mockPost = {
        id: 2,
        title: 'New Post',
        content: 'This is a new post.',
        authorId: 1,
        published: false,
      };

      (prisma.post.create as jest.Mock).mockResolvedValue(mockPost);

      const response = await request(app)
        .post('/api/posts')
        .send({
          title: 'New Post',
          content: 'This is a new post.',
          authorId: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: 'New Post',
        content: 'This is a new post.',
        authorId: 1,
      });
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({ title: 'Incomplete Post' });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: 'Title, content, and authorId are required.',
      });
    });

    it('should handle server errors', async () => {
      (prisma.post.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/posts')
        .send({
          title: 'Error Post',
          content: 'This will trigger an error.',
          authorId: 1,
        });

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({ error: 'Internal server error' });
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should update a post successfully', async () => {
      const mockUpdatedPost = {
        id: 1,
        title: 'Updated Post',
        content: 'Updated content.',
        published: true,
      };

      (prisma.post.update as jest.Mock).mockResolvedValue(mockUpdatedPost);

      const response = await request(app)
        .put('/api/posts/1')
        .send({
          title: 'Updated Post',
          content: 'Updated content.',
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: 'Updated Post',
        content: 'Updated content.',
      });
    });

    it('should return 404 if post not found', async () => {
      (prisma.post.update as jest.Mock).mockRejectedValue({ code: 'P2025' });

      const response = await request(app)
        .put('/api/posts/999')
        .send({
          title: 'Updated Post',
          content: 'Updated content.',
        });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: 'Post not found' });
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post successfully', async () => {
      (prisma.post.delete as jest.Mock).mockResolvedValue({});

      const response = await request(app).delete('/api/posts/1');

      expect(response.status).toBe(204);
    });

    it('should return 404 if post not found', async () => {
      (prisma.post.delete as jest.Mock).mockRejectedValue({ code: 'P2025' });

      const response = await request(app).delete('/api/posts/999');

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: 'Post not found' });
    });
  });
});
