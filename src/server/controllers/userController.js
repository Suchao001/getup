import knex from '../config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET;
const imageDir = path.join(__dirname, '..', '..', '..', 'public', 'image');

const register = async (username, password) => {
  try {
    const existingUser = await knex('users')
      .where({ username })
      .first();

    if (existingUser) {
      throw new Error('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await knex('Users').insert({
      username,
      password_hash: hashedPassword,
      created_at: knex.fn.now(),
    });

    console.log('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw error;
  }
};


const login = async (username, password) => {
  try {
    const user = await knex('users')
      .where({ username })
      .first();
      
    if (!user) {
      throw new Error('Invalid username or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }
    const token = jwt.sign({ id: user.user_id}, JWT_SECRET, { expiresIn: '1h' });
    return { token };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserInfo = async (user_id) => {
  try {
    const user = await knex('users')
      .where({ user_id })
      .first();
    if (!user) {
      throw new Error('User not found');
    }
    const user_info = {
      user_id: user.user_id,
      username: user.username,
      img:"image/"+user.profile_picture,
    };
    return user_info;
  } catch (error) {
    throw new Error(error.message);
  }
};

const upload_img = async (user_id, filename) => {
  try {
    const user = await knex('users').select('profile_picture').where('user_id', user_id).first();
    const previousFilename = user ? user.profile_picture : null;
    await knex('users').update({
      profile_picture: filename
    }).where('user_id', user_id);
    console.log('Image uploaded successfully');
    
    if (previousFilename) {
      const previousFilePath = path.join(imageDir, previousFilename);
      fs.unlink(previousFilePath, (err) => {
        if (err) {
          console.error('Error deleting previous file:', err.message);
        }
      });
    }
  } catch (error) {
    console.error('Error uploading image:', error.message);
    throw error;
  }
}

export { register, login,upload_img,getUserInfo };
