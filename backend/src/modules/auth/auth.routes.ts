import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

const router = Router();
const authService = new AuthService();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required.' });
      return;
    }
    const result = await authService.register({ email, password, fullName });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Registration failed.' });
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required.' });
      return;
    }
    const result = await authService.login({ email, password });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message || 'Authentication failed.' });
  }
});

router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.getAllUsers();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch users.' });
  }
});

export default router;
