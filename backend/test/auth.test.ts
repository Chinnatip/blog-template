import request from "supertest";
import express from "express";
import authRoutes from "../src/routes/authRoutes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// Mock environment variables
process.env.JWT_SECRET = "test_secret";

// Initialize Express app with the routes
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

// Mock Prisma client
jest.mock("@prisma/client", () => {
  const actualPrisma = jest.requireActual("@prisma/client");
  return {
    PrismaClient: jest.fn(() => ({
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      $disconnect: jest.fn(),
    })),
  };
});

const prisma = new PrismaClient();

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("Auth API", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const mockUser = { id: 1, name: "John Doe", email: "john@example.com" };
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: "John Doe",
          email: "john@example.com",
          password: expect.any(String), // Ensure password is hashed
        },
      });
    });
  });

  describe("POST /api/auth/login", () => {
    it("should log in a user with valid credentials", async () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
        adminRole: true,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("mockToken");

      const response = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        token: "mockToken",
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          adminRole: true,
        },
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "john@example.com" },
      });
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return user details for a valid token", async () => {
      const mockUser = { id: 1, name: "John Doe", email: "john@example.com", adminRole: true };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer mockToken");

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ user: mockUser });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, name: true, email: true, adminRole: true },
      });
    });

    it("should return an error if the token is invalid", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalidToken");

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({ message: "Invalid or expired token" });
    });
  });
});
