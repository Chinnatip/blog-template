import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET || 'secret_key';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload; // Extend the Request type to include `user`
}

// Middleware to authenticate token
export const authenticateToken = (req: any, res: any, next: any) => {
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

export const verifyAdmin = async (req: AuthenticatedRequest, res: any, next: NextFunction) => {
  // Ensure the token has been authenticated
  if (!req.user) {
    return res.status(403).json({ message: 'User information is missing' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
    });

    if (!user || !user.adminRole) {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    next(); // User is admin; proceed to the next middleware/route
  } catch (err) {
    console.error('Error in verifyAdmin:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};