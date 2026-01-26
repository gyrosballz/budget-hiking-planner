import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models';

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';

export async function POST(req) {
  try {
    await connectDB();

    const { username, password } = await req.json();

    if (!username || username.length < 3 || !password || password.length < 6) {
      return NextResponse.json(
        { message: 'Invalid username or password format' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const token = jwt.sign({ username, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    });

    return NextResponse.json({
      message: 'Login successful',
      token,
      username,
      role: user.role,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    );
  }
}
