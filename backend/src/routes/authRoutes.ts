import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET || 'secret_key';

// Middleware to authenticate token
const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded; // Attach decoded payload to the request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Fetch all users
router.get('/', async (req: Request, res: any) => {
  try {
    const posts = await prisma.user.findMany({
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Register a new user
router.post('/register', async (req: any, res: any) => {
  const { name, email, password } = req.body;

  // Validate inputs
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err: any ) {
    if (err.code === 'P2002') { // Handle unique constraint error
      return res.status(400).json({ error: 'Email is already in use.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login a user
router.post('/login', async (req: any, res: any) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const { id, name } = user
    const token = jwt.sign({ id, email }, secret, { expiresIn: '1h' });

    res.status(200).json({ token, user: { id, email, name } });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/me', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.user; // Extract user ID from the token payload

    // Fetch user details from the database
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
