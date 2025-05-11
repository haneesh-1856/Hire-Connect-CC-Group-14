export interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  message?: string;
  resumeUrl?: string;
  status: 'pending' | 'interviewing' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}