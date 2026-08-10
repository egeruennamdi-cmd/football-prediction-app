import jwt from 'jsonwebtoken';
import { config } from '../../config/env';

export interface RegisterDTO {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

// In-memory User Store for instant testing (synced with Prisma Schema)
const mockUserDb: Map<string, { id: string; email: string; passwordHash: string; fullName: string; role: string; coinsBalance: number; createdAt: string }> = new Map();

// Seed initial admin/demo accounts
mockUserDb.set('demo@deeppredictbet.com', {
  id: 'usr_demo123',
  email: 'demo@deeppredictbet.com',
  passwordHash: 'password123',
  fullName: 'DeepPredictBet Punters',
  role: 'PRO',
  coinsBalance: 500,
  createdAt: new Date().toISOString()
});

export class AuthService {
  public async register(dto: RegisterDTO) {
    const { email, password, fullName } = dto;
    const cleanEmail = email.trim().toLowerCase();

    if (mockUserDb.has(cleanEmail)) {
      throw new Error('User with this email already exists.');
    }

    const userId = `usr_${Math.random().toString(36).substring(2, 9)}`;
    const newUser = {
      id: userId,
      email: cleanEmail,
      passwordHash: password,
      fullName: fullName || cleanEmail.split('@')[0],
      role: 'USER',
      coinsBalance: 50,
      createdAt: new Date().toISOString()
    };

    mockUserDb.set(cleanEmail, newUser);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return {
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        coinsBalance: newUser.coinsBalance,
        createdAt: newUser.createdAt
      }
    };
  }

  public async login(dto: LoginDTO) {
    const { email, password } = dto;
    const cleanEmail = email.trim().toLowerCase();

    let user = mockUserDb.get(cleanEmail);

    if (!user || user.passwordHash !== password) {
      throw new Error('Invalid email or password.');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return {
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        coinsBalance: user.coinsBalance,
        createdAt: user.createdAt
      }
    };
  }

  public async getAllUsers() {
    const usersList = Array.from(mockUserDb.values()).map(u => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      coinsBalance: u.coinsBalance,
      createdAt: u.createdAt
    }));

    return {
      success: true,
      totalUsers: usersList.length,
      users: usersList
    };
  }
}
