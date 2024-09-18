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

const getUserProfile = async (user_id) => {
  try {
    const user = await knex('users')
      .join('user_profile', 'users.user_id', 'user_profile.user_id')
      .where({ 'users.user_id': user_id })
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    const user_profile = {
      user_id: user.user_id,
      username: user.username,
      img: user.profile_picture ? `image/${user.profile_picture}` : null,
      birthdate: user.birthdate,
      estimated_death_date: user.estimated_death_date,
      motto: user.motto,
      goals: user.goals
    };

    return user_profile;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateUserProfile = async (user_id, data) => {
  try {
    const { username, birthdate, estimated_death_date, motto, goals } = data;
    
    // Update username in users table
    if (username) {
      await knex('users')
        .update({ username })
        .where('user_id', user_id);
    }

    // Prepare profile data for user_profile table
    const profileData = {
      birthdate: birthdate ? new Date(birthdate).toISOString().split('T')[0] : undefined,
      estimated_death_date: estimated_death_date ? new Date(estimated_death_date).toISOString().split('T')[0] : undefined,
      motto,
      goals: goals ? goals : undefined
    };

    // Remove undefined values
    Object.keys(profileData).forEach(key => profileData[key] === undefined && delete profileData[key]);

    // Update user_profile table
    if (Object.keys(profileData).length > 0) {
      await knex('user_profile')
        .update(profileData)
        .where('user_id', user_id);
    }

    console.log('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    throw error;
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

export { register, login,upload_img,getUserInfo,getUserProfile,updateUserProfile };
