import request from 'supertest';
import express from 'express';
import postRoutes from '../src/routes/postRoutes';
import { PrismaClient } from '@prisma/client';

// Initialize Express app with the routes
const app = express();
app.use(express.json());
app.use('/api/posts', postRoutes);

// Mock database with Prisma client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(), // Add the $disconnect mock
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const prisma = new PrismaClient();

// Test cases
describe('GET /api/posts', () => {
  it('should fetch all posts', async () => {
    const mockPosts = [
      {
        id: 1,
        title: 'Test Post 1',
        content: 'This is the content of test post 1.',
        published: true,
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: 1, name: 'Admin User', email: 'admin@example.com' },
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
          published: true,
          author: expect.objectContaining({
            name: 'Admin User',
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

describe('POST /api/posts', () => {
  it('should create a new post successfully', async () => {
    const mockPost = {
      id: 2,
      title: 'New Post',
      content: 'This is a new post.',
      published: false,
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
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

    expect(prisma.post.create).toHaveBeenCalledWith({
      data: {
        title: 'New Post',
        content: 'This is a new post.',
        authorId: 1,
      },
    });
  });

  it('should handle missing fields', async () => {
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
