import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../database/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Define a plain object type for user creation data
export type UserCreationData = {
  name: string;
  email: string;
  password: string;
};

export const createUser = async (userData: UserCreationData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const passwordHash = await bcrypt.hash(userData.password, 10);

  const newUser = new User({
    name: userData.name,
    email: userData.email,
    passwordHash,
  });

  await newUser.save();
  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<string> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' } // Token expires in 1 day
  );

  return token;
};