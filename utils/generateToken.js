import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();  
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '1d',
  });
  


  return token;
};

export default generateToken;
