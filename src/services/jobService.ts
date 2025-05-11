import api from './api';
import { Job } from '../types/job';

// Mock data for development
const mockJobs: Job[] = [
  {
    _id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    companyLogo: 'https://via.placeholder.com/150',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'We are looking for an experienced Frontend Developer to join our team.\n\nAs a Senior Frontend Developer, you will be responsible for implementing visual elements that users see and interact with in a web application. You will be working closely with our design and backend teams.',
    requirements: [
      'At least 5 years of experience with JavaScript and modern frameworks',
      'Strong knowledge of React.js and Redux',
      'Experience with responsive design and CSS preprocessors',
      'Understanding of frontend testing frameworks'
    ],
    benefits: [
      'Competitive salary',
      'Health and dental insurance',
      'Flexible working hours',
      '401(k) matching'
    ],
    salary: {
      min: '120000',
      max: '150000'
    },
    experience: '5+ years',
    isReferral: true,
    createdBy: 'user123',
    applications: [
      {
        _id: 'app1',
        user: {
          _id: 'user1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Backend Developer',
    company: 'DataSystems',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are seeking a skilled Backend Developer to design and implement server-side logic...',
    requirements: [
      'Strong experience with Node.js',
      'Knowledge of database technologies (MongoDB, PostgreSQL)',
      'Understanding of RESTful APIs'
    ],
    benefits: [
      'Remote work',
      'Flexible schedule',
      'Professional development budget'
    ],
    isReferral: false,
    createdBy: 'user456',
    applications: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Get all jobs with filtering
export const getJobs = async (params?: any): Promise<{ jobs: Job[], totalJobs: number }> => {
  try {
    // Simulate API call
    // const response = await api.get('/jobs', { params });
    // return response.data;
    
    // Mock implementation
    let filteredJobs = [...mockJobs];
    
    // Apply filters
    if (params) {
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(keyword) || 
          job.company.toLowerCase().includes(keyword) ||
          job.description.toLowerCase().includes(keyword)
        );
      }
      
      if (params.location) {
        const location = params.location.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.location.toLowerCase().includes(location)
        );
      }
      
      if (params.jobType) {
        filteredJobs = filteredJobs.filter(job => 
          job.type === params.jobType
        );
      }
      
      if (params.isReferral !== undefined && params.isReferral !== 'all') {
        const isReferral = params.isReferral === 'true';
        filteredJobs = filteredJobs.filter(job => job.isReferral === isReferral);
      }
      
      if (params.minSalary && params.minSalary !== '') {
        filteredJobs = filteredJobs.filter(job => 
          job.salary && parseInt(job.salary.min) >= parseInt(params.minSalary)
        );
      }
      
      if (params.maxSalary && params.maxSalary !== '') {
        filteredJobs = filteredJobs.filter(job => 
          job.salary && parseInt(job.salary.max) <= parseInt(params.maxSalary)
        );
      }
    }
    
    return {
      jobs: filteredJobs,
      totalJobs: filteredJobs.length
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Get job by ID
export const getJobById = async (id: string): Promise<Job> => {
  try {
    // Simulate API call
    // const response = await api.get(`/jobs/${id}`);
    // return response.data;
    
    // Mock implementation
    const job = mockJobs.find(job => job._id === id);
    if (!job) {
      throw new Error('Job not found');
    }
    return job;
  } catch (error) {
    console.error(`Error fetching job with ID ${id}:`, error);
    throw error;
  }
};

// Get jobs posted by the recruiter
export const getRecruiterJobs = async (): Promise<Job[]> => {
  try {
    // Simulate API call
    // const response = await api.get('/recruiter/jobs');
    // return response.data;
    
    // Mock implementation
    return mockJobs;
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error);
    throw error;
  }
};

// Create a new job
export const createJob = async (jobData: any): Promise<Job> => {
  try {
    // Simulate API call
    // const response = await api.post('/jobs', jobData);
    // return response.data;
    
    // Mock implementation
    const newJob: Job = {
      _id: Math.random().toString(36).substring(2, 9),
      ...jobData,
      createdBy: 'currentUser',
      applications: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockJobs.push(newJob);
    return newJob;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// Update job
export const updateJob = async (id: string, jobData: any): Promise<Job> => {
  try {
    // Simulate API call
    // const response = await api.put(`/jobs/${id}`, jobData);
    // return response.data;
    
    // Mock implementation
    const jobIndex = mockJobs.findIndex(job => job._id === id);
    if (jobIndex === -1) {
      throw new Error('Job not found');
    }
    
    const updatedJob = {
      ...mockJobs[jobIndex],
      ...jobData,
      updatedAt: new Date().toISOString()
    };
    
    mockJobs[jobIndex] = updatedJob;
    return updatedJob;
  } catch (error) {
    console.error(`Error updating job with ID ${id}:`, error);
    throw error;
  }
};

// Delete job
export const deleteJob = async (id: string): Promise<void> => {
  try {
    // Simulate API call
    // await api.delete(`/jobs/${id}`);
    
    // Mock implementation
    const jobIndex = mockJobs.findIndex(job => job._id === id);
    if (jobIndex === -1) {
      throw new Error('Job not found');
    }
    
    mockJobs.splice(jobIndex, 1);
  } catch (error) {
    console.error(`Error deleting job with ID ${id}:`, error);
    throw error;
  }
};