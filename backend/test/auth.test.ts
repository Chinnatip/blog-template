import request from 'supertest';
import express from 'express';
import { execSync } from 'child_process';
import authRoutes from '../src/routes/authRoutes';
import { PrismaClient } from '@prisma/client';

// Initialize Express app with the routes
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock database with Prisma client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(), // Add the $disconnect mock
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const prisma = new PrismaClient();

// Test cases
describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'testuser@example.com',
      password: '$2a$10$w9YHyCBe8Yp3hd/bul/8uun42h8WQPEHLDuMJEXcgPMcwVm.1qF6a',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Test User',
      email: 'testuser@example.com',
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Test User',
        email: 'testuser@example.com',
        password: expect.any(String), // Ensure password is processed (e.g., hashed)
      },
    });
  });

  it('should handle duplicate email error', async () => {
    (prisma.user.create as jest.Mock).mockRejectedValue({
      code: 'P2002',
      message: 'Unique constraint failed on the fields: (`email`)',
    });

    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password1234567',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Email is already in use.',
    });
  });

  it('should handle missing fields', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Name, email, and password are required.',
    });
  });
});

describe('POST /api/auth/login', () => {
  it('should log in a user with valid credentials', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'testuser@example.com',
      password: '$2a$10$w9YHyCBe8Yp3hd/bul/8uun42h8WQPEHLDuMJEXcgPMcwVm.1qF6a',
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: "password123"
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      token: expect.any(String), // Ensure a token is returned
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'testuser@example.com' },
    });
  });

  it('should handle invalid credentials', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      error: 'Invalid email or password.',
    });
  });

  it('should handle missing fields', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Email and password are required.',
    });
  });
});
