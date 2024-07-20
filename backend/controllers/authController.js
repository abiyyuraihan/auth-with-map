import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { sendOTP } from '../utils/emailService.js';


const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { email, password, name, alamat, latitude, longitude } = req.body;
  
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        alamat,
        latitude,
        longitude,
        otp,
        otpExpiry
      }
    });

    await sendOTP(email, otp)

    res.status(201).json({ message: 'User registered. Please verify your email.' });
    console.log('User created:', user);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await prisma.user.update({
      where: { email },
      data: { otp: null, otpExpiry: null }
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};



export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      req.session.userId = user.id;
      console.log('User logged in, session userId:', req.session.userId); 

      res.json({ message: 'Logged in successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
  }
};



export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
};