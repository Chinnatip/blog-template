import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const secret = process.env.JWT_SECRET || 'secret_key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send({ message: 'Access denied' });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).send({ message: 'Invalid token' });
    // req.user = user;
    next();
  });
};