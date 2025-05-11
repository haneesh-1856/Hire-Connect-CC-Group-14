export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'job_seeker' | 'recruiter';
  phone?: string;
  location?: string;
  bio?: string;
  resumeUrl?: string;
  company?: string;
  jobTitle?: string;
  skills?: string[];
  education?: Education[];
  experience?: WorkExperience[];
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean, message?: string }>;
  register: (userData: { name: string; email: string; password: string; role: string }) => Promise<{ success: boolean, message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}