import express, { Request } from 'express';
import bcrypt from 'bcryptjs';
import { authenticateToken, verifyAdmin } from '../lib/auth'
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create a new user
router.post('/', authenticateToken, verifyAdmin , async (req: Request, res: any) => {
  const { name, email, password, adminRole = false } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, 
        adminRole,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch a single user by ID
router.get('/:id', authenticateToken, verifyAdmin , async (req: Request, res: any) => {
  const { id } = req.params;

  try {
      const user = await prisma.user.findUnique({
          where: { id: Number(id) }
      });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
  } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});

// Show users by page
router.get('/page/:pageNumber', authenticateToken, verifyAdmin , async (req: Request, res: any) => {
  const { pageNumber } = req.params;
  const pageSize = 10;
  const page = Number(pageNumber);
  if (isNaN(page) || page < 1) {
    return res.status(400).json({ error: 'Invalid page number.' });
  }

  try {
    const users = await prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true,
        adminRole: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });
    const totalUsers = await prisma.user.count();
    return res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit user information
router.put('/:id', authenticateToken, verifyAdmin, async (req: Request, res: any) => {
  const { id } = req.params;
  const { name, password, adminRole } = req.body;
  console.log(req.body)

  try {
    const updatedData: any = {};
    if (name) updatedData.name = name;
    if (password) updatedData.password = password; // hashed password
    if (adminRole != undefined) updatedData.adminRole = adminRole;

    console.log(`update parcel >>>`, {
      where: { id: Number(id) },
      data: updatedData,
    })

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updatedData,
    });

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
router.delete('/:id', authenticateToken, verifyAdmin, async (req: Request, res: any) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting user:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
