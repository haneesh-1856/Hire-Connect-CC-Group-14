import api from './api';
import { User } from '../types/user';

// Get user profile
export const getUserProfile = async (): Promise<User> => {
  try {
    // Simulate API call
    // const response = await api.get('/users/me');
    // return response.data;
    
    // Mock implementation
    return {
      _id: 'user123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'job_seeker',
      phone: '555-123-4567',
      location: 'San Francisco, CA',
      bio: 'Experienced software developer with a passion for building great products.',
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      education: [
        {
          institution: 'University of California',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '09/2015',
          endDate: '06/2019'
        }
      ],
      experience: [
        {
          company: 'Tech Company',
          position: 'Software Engineer',
          startDate: '07/2019',
          endDate: 'Present',
          description: 'Developing frontend applications with React and TypeScript.'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (userData: any): Promise<User> => {
  try {
    // Simulate API call
    // const response = await api.put('/users/me', userData);
    // return response.data;
    
    // Mock implementation
    return {
      _id: 'user123',
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData: { currentPassword: string, newPassword: string }): Promise<void> => {
  try {
    // Simulate API call
    // await api.put('/users/me/password', passwordData);
    
    // Mock implementation
    console.log('Password changed successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Get public profile of a user
export const getPublicProfile = async (userId: string): Promise<Partial<User>> => {
  try {
    // Simulate API call
    // const response = await api.get(`/users/${userId}`);
    // return response.data;
    
    // Mock implementation
    return {
      _id: userId,
      name: 'Sample User',
      role: 'job_seeker',
      location: 'New York, NY',
      bio: 'Public profile information',
      skills: ['JavaScript', 'React', 'Node.js']
    };
  } catch (error) {
    console.error(`Error fetching public profile for user ${userId}:`, error);
    throw error;
  }
};