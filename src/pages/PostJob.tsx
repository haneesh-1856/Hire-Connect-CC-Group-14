import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createJob } from '../services/jobService';
import { 
  Briefcase, MapPin, DollarSign, Clock, 
  ListChecks, Gift, Info, AlertCircle, Building 
} from 'lucide-react';

const PostJob: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '',
    location: '',
    type: 'Full-time',
    description: '',
    isReferral: false,
    salary: {
      min: '',
      max: ''
    },
    experience: '',
    requirements: ['', ''],
    benefits: ['', ''],
    companyDescription: '',
    companyLogo: ''
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData] as object,
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: 'requirements' | 'benefits') => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const addArrayItem = (field: 'requirements' | 'benefits') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayItem = (index: number, field: 'requirements' | 'benefits') => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const validateForm = () => {
    if (!formData.title || !formData.company || !formData.location || !formData.description) {
      setError('Please fill in all required fields');
      return false;
    }
    
    // Filter out empty array items
    const requirements = formData.requirements.filter(req => req.trim() !== '');
    const benefits = formData.benefits.filter(ben => ben.trim() !== '');
    
    if (requirements.length === 0) {
      setError('Please add at least one job requirement');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Filter out empty array items
      const requirements = formData.requirements.filter(req => req.trim() !== '');
      const benefits = formData.benefits.filter(ben => ben.trim() !== '');
      
      const jobData = {
        ...formData,
        requirements,
        benefits
      };
      
      const newJob = await createJob(jobData);
      navigate(`/jobs/${newJob._id}`);
    } catch (err) {
      setError('Failed to create job posting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Post a New Job</h1>
        <p className="text-gray-600">Fill out the form below to create a new job posting.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
          <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Job Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Briefcase size={20} className="mr-2 text-blue-700" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Senior Software Engineer"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-gray-700 font-medium mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Acme Inc."
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. San Francisco, CA or Remote"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-3 top-3 text-gray-400" />
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      required
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-gray-700 font-medium mb-2">
                    Experience Level
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 3-5 years"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Salary Range (Optional)
                  </label>
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <DollarSign size={18} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="number"
                        name="salary.min"
                        value={formData.salary.min}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-l-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Min"
                      />
                    </div>
                    <div className="px-4 py-2 bg-gray-100 border-t border-b border-gray-300">to</div>
                    <input
                      type="number"
                      name="salary.max"
                      value={formData.salary.max}
                      onChange={handleChange}
                      className="flex-1 border border-gray-300 rounded-r-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isReferral"
                    checked={formData.isReferral}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-blue-700 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">
                    This is a referral job
                  </span>
                </label>
                <p className="text-gray-500 text-sm mt-1 ml-7">
                  Referral jobs encourage candidates to get a referral from existing employees.
                </p>
              </div>
            </div>
            
            {/* Job Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Info size={20} className="mr-2 text-blue-700" />
                Job Description
              </h2>
              
              <div>
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide a detailed description of the job role, responsibilities, and expectations..."
                  required
                ></textarea>
              </div>
            </div>
            
            {/* Requirements */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ListChecks size={20} className="mr-2 text-blue-700" />
                Requirements
              </h2>
              
              <div className="space-y-3">
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) => handleArrayChange(e, index, 'requirements')}
                      className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Requirement ${index + 1}`}
                    />
                    
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'requirements')}
                      className="text-red-500 hover:text-red-700 p-2"
                      disabled={formData.requirements.length <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem('requirements')}
                  className="text-blue-700 hover:text-blue-900 flex items-center mt-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Add Requirement
                </button>
              </div>
            </div>
            
            {/* Benefits */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Gift size={20} className="mr-2 text-blue-700" />
                Benefits
              </h2>
              
              <div className="space-y-3">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleArrayChange(e, index, 'benefits')}
                      className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Benefit ${index + 1}`}
                    />
                    
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'benefits')}
                      className="text-red-500 hover:text-red-700 p-2"
                      disabled={formData.benefits.length <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem('benefits')}
                  className="text-blue-700 hover:text-blue-900 flex items-center mt-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Add Benefit
                </button>
              </div>
            </div>
            
            {/* Company Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Building size={20} className="mr-2 text-blue-700" />
                Company Information
              </h2>
              
              <div>
                <label htmlFor="companyDescription" className="block text-gray-700 font-medium mb-2">
                  Company Description
                </label>
                <textarea
                  id="companyDescription"
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell potential candidates about your company, culture, and mission..."
                ></textarea>
              </div>
              
              <div className="mt-4">
                <label htmlFor="companyLogo" className="block text-gray-700 font-medium mb-2">
                  Company Logo URL (Optional)
                </label>
                <input
                  type="url"
                  id="companyLogo"
                  name="companyLogo"
                  value={formData.companyLogo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
            
            {/* Submit */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md font-medium btn ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting Job...
                    </>
                  ) : (
                    'Post Job'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;