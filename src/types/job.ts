export interface Job {
  _id: string;
  title: string;
  company: string;
  companyLogo?: string;
  companyDescription?: string;
  location: string;
  type: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  salary?: {
    min: string;
    max: string;
  };
  experience?: string;
  isReferral: boolean;
  createdBy: string;
  applications: any[];
  createdAt: string;
  updatedAt: string;
}