import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import userRoutes from '../src/routes/userRoutes';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, verifyAdmin } from '../src/lib/auth';

// Initialize Express app with the routes
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const prisma = new PrismaClient();

// Mock `authenticateToken` and `verifyAdmin`
jest.mock('../src/lib/auth', () => ({
  authenticateToken: jest.fn((req, res, next) => next()),
  verifyAdmin: jest.fn((req, res, next) => next()),
}));

describe('User API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users', () => {
    it('should create a new user successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'New User',
        email: 'newuser@example.com',
        adminRole: false,
      };

      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue('hashedPassword');
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post('/api/users').send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'hashedPassword',
          adminRole: false,
        },
      });
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/api/users').send({
        name: 'Incomplete User',
      });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: 'Name, email, and password are required.',
      });
    });

    it('should handle server errors', async () => {
      (prisma.user.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/api/users').send({
        name: 'Error User',
        email: 'erroruser@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({ error: 'Internal server error' });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should fetch a single user by ID', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'testuser@example.com',
        adminRole: false,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).get('/api/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 404 if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/users/999');

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: 'User not found' });
    });
  });

  describe('GET /api/users/page/:pageNumber', () => {
    it('should fetch users by page', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@example.com', adminRole: false },
        { id: 2, name: 'User 2', email: 'user2@example.com', adminRole: false },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
      (prisma.user.count as jest.Mock).mockResolvedValue(20);

      const response = await request(app).get('/api/users/page/1');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        users: expect.arrayContaining([
          expect.objectContaining({ name: 'User 1' }),
          expect.objectContaining({ name: 'User 2' }),
        ]),
        totalUsers: 20,
        totalPages: 2,
        currentPage: 1,
      });
    });

    it('should return 400 for invalid page number', async () => {
      const response = await request(app).get('/api/users/page/invalidPage');

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: 'Invalid page number.' });
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user information', async () => {
      const mockUpdatedUser = {
        id: 1,
        name: 'Updated User',
        email: 'updated@example.com',
        adminRole: true,
      };

      (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const response = await request(app).put('/api/users/1').send({
        name: 'Updated User',
        adminRole: true,
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: 'Updated User',
        adminRole: true,
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Updated User', adminRole: true },
      });
    });

    it('should return 404 if user not found', async () => {
      (prisma.user.update as jest.Mock).mockRejectedValue({ code: 'P2025' });

      const response = await request(app).put('/api/users/999').send({
        name: 'Nonexistent User',
      });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: 'User not found.' });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user successfully', async () => {
      (prisma.user.delete as jest.Mock).mockResolvedValue({});

      const response = await request(app).delete('/api/users/1');

      expect(response.status).toBe(204);
    });

    it('should return 404 if user not found', async () => {
      (prisma.user.delete as jest.Mock).mockRejectedValue({ code: 'P2025' });

      const response = await request(app).delete('/api/users/999');

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: 'User not found.' });
    });
  });
});
