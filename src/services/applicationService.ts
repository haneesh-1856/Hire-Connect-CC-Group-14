import api from './api';
import { Application } from '../types/application';

// Mock data for development
const mockApplications: Application[] = [
  {
    _id: 'app1',
    job: {
      _id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA'
    },
    user: {
      _id: 'user1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    message: 'I am very interested in this position and believe my skills align well with your requirements.',
    resumeUrl: 'https://example.com/resume.pdf',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'app2',
    job: {
      _id: '3',
      title: 'Product Manager',
      company: 'InnovateX',
      location: 'New York, NY'
    },
    user: {
      _id: 'user1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    message: 'I have extensive experience in product management and would love to discuss this opportunity.',
    resumeUrl: 'https://example.com/resume.pdf',
    status: 'interviewing',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'app3',
    job: {
      _id: '4',
      title: 'UX Designer',
      company: 'DesignHub',
      location: 'Remote'
    },
    user: {
      _id: 'user1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    message: 'I am passionate about creating great user experiences and would be excited to join your team.',
    resumeUrl: 'https://example.com/resume.pdf',
    status: 'rejected',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'app4',
    job: {
      _id: '5',
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'Austin, TX'
    },
    user: {
      _id: 'user1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    message: 'I have been working with CI/CD pipelines for 5 years and am skilled in AWS and Docker.',
    resumeUrl: 'https://example.com/resume.pdf',
    status: 'accepted',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Get all applications for the current user
export const getApplications = async (): Promise<Application[]> => {
  try {
    // Simulate API call
    // const response = await api.get('/applications');
    // return response.data;
    
    // Mock implementation
    return mockApplications;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

// Get application by ID
export const getApplicationById = async (id: string): Promise<Application> => {
  try {
    // Simulate API call
    // const response = await api.get(`/applications/${id}`);
    // return response.data;
    
    // Mock implementation
    const application = mockApplications.find(app => app._id === id);
    if (!application) {
      throw new Error('Application not found');
    }
    return application;
  } catch (error) {
    console.error(`Error fetching application with ID ${id}:`, error);
    throw error;
  }
};

// Apply to a job
export const applyToJob = async (jobId: string, applicationData: any): Promise<Application> => {
  try {
    // Simulate API call
    // const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
    // return response.data;
    
    // Mock implementation
    const newApplication: Application = {
      _id: Math.random().toString(36).substring(2, 9),
      job: {
        _id: jobId,
        title: 'Mock Job Title',
        company: 'Mock Company',
        location: 'Mock Location'
      },
      user: {
        _id: 'currentUser',
        name: 'Current User',
        email: 'user@example.com'
      },
      message: applicationData.message,
      resumeUrl: applicationData.resumeUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockApplications.push(newApplication);
    return newApplication;
  } catch (error) {
    console.error(`Error applying to job with ID ${jobId}:`, error);
    throw error;
  }
};

// Update application status (for recruiters)
export const updateApplicationStatus = async (id: string, status: string): Promise<Application> => {
  try {
    // Simulate API call
    // const response = await api.put(`/applications/${id}/status`, { status });
    // return response.data;
    
    // Mock implementation
    const applicationIndex = mockApplications.findIndex(app => app._id === id);
    if (applicationIndex === -1) {
      throw new Error('Application not found');
    }
    
    const updatedApplication = {
      ...mockApplications[applicationIndex],
      status: status as 'pending' | 'interviewing' | 'accepted' | 'rejected',
      updatedAt: new Date().toISOString()
    };
    
    mockApplications[applicationIndex] = updatedApplication;
    return updatedApplication;
  } catch (error) {
    console.error(`Error updating application status with ID ${id}:`, error);
    throw error;
  }
};

// Withdraw an application (for job seekers)
export const withdrawApplication = async (id: string): Promise<void> => {
  try {
    // Simulate API call
    // await api.delete(`/applications/${id}`);
    
    // Mock implementation
    const applicationIndex = mockApplications.findIndex(app => app._id === id);
    if (applicationIndex === -1) {
      throw new Error('Application not found');
    }
    
    mockApplications.splice(applicationIndex, 1);
  } catch (error) {
    console.error(`Error withdrawing application with ID ${id}:`, error);
    throw error;
  }
};