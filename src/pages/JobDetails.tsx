import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getJobById } from '../services/jobService';
import { applyToJob } from '../services/applicationService';
import { Job } from '../types/job';
import { formatDate } from '../utils/dateUtils';
import { 
  Briefcase, MapPin, Calendar, Clock, DollarSign, 
  Building, Share2, Bookmark, Send, AlertCircle, CheckCircle
} from 'lucide-react';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [message, setMessage] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!id) return;
        
        const jobData = await getJobById(id);
        setJob(jobData);
        
        if (isAuthenticated && user) {
          const hasApplied = jobData.applications.some(
            (app: any) => app.user === user._id
          );
          setApplied(hasApplied);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, isAuthenticated, user]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'job_seeker') {
      setError('Only job seekers can apply to jobs');
      return;
    }
    
    setShowApplyForm(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      setApplying(true);
      
      await applyToJob(id, { message });
      
      setApplied(true);
      setApplicationSuccess(true);
      setShowApplyForm(false);
    } catch (error) {
      console.error('Error applying to job:', error);
      setError('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist or has been removed.'}</p>
        <Link to="/jobs" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md btn">
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Job detail card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="bg-white rounded-lg p-3 w-16 h-16 flex items-center justify-center mr-6 mb-4 md:mb-0">
              {job.companyLogo ? (
                <img 
                  src={job.companyLogo} 
                  alt={`${job.company} logo`} 
                  className="max-w-full max-h-full"
                />
              ) : (
                <Briefcase size={28} className="text-blue-700" />
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center text-blue-100">
                <div className="flex items-center mr-4 mb-2">
                  <Building size={16} className="mr-1" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <MapPin size={16} className="mr-1" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <Calendar size={16} className="mr-1" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition text-white px-3 py-2 rounded-md flex items-center">
                <Share2 size={16} className="mr-2" />
                Share
              </button>
              
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition text-white px-3 py-2 rounded-md flex items-center">
                <Bookmark size={16} className="mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-gray-100 rounded-md px-4 py-2 flex items-center">
              <Clock size={20} className="text-gray-700 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Job Type</div>
                <div className="font-medium">{job.type}</div>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-md px-4 py-2 flex items-center">
              <DollarSign size={20} className="text-gray-700 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Salary</div>
                <div className="font-medium">
                  {job.salary ? `${job.salary.min} - ${job.salary.max}` : 'Not disclosed'}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-md px-4 py-2 flex items-center">
              <Briefcase size={20} className="text-gray-700 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Experience</div>
                <div className="font-medium">{job.experience || 'Not specified'}</div>
              </div>
            </div>
            
            <div className={`rounded-md px-4 py-2 flex items-center ${
              job.isReferral 
                ? 'bg-amber-100 text-amber-800' 
                : 'bg-teal-100 text-teal-800'
            }`}>
              <div>
                <div className="text-sm opacity-80">Job Category</div>
                <div className="font-medium">{job.isReferral ? 'Referral Job' : 'Direct Application'}</div>
              </div>
            </div>
          </div>
          
          {/* Job details */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Job Description</h2>
            <div className="prose max-w-none text-gray-700">
              {job.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Requirements</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {job.requirements?.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {job.benefits?.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Company information */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-bold mb-4">About the Company</h2>
            <p className="text-gray-700 mb-4">
              {job.companyDescription || `${job.company} is a leading company in its field with a strong focus on innovation and employee growth.`}
            </p>
          </div>
        </div>
      </div>
      
      {/* Application section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {applicationSuccess ? (
          <div className="text-center py-6">
            <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your application has been successfully submitted. You can track its status in your dashboard.
            </p>
            <Link 
              to="/seeker-dashboard" 
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md btn"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : applied ? (
          <div className="text-center py-6">
            <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
              <CheckCircle size={32} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Applied</h2>
            <p className="text-gray-600 mb-6">
              You have already applied to this job. You can view your application status in your dashboard.
            </p>
            <Link 
              to="/seeker-dashboard" 
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md btn"
            >
              View Application Status
            </Link>
          </div>
        ) : showApplyForm ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Apply for this position</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmitApplication}>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                  Why are you interested in this position?
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your relevant experience and why you'd be a great fit for this role..."
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={applying}
                  className={`bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md font-medium flex items-center ${
                    applying ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {applying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in this position?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Apply now and take the first step towards your next career opportunity. 
              Your application will be reviewed by the hiring team at {job.company}.
            </p>
            
            <button
              onClick={handleApplyClick}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-medium text-lg flex items-center mx-auto btn"
            >
              <Send size={20} className="mr-2" />
              Apply Now
            </button>
            
            {user?.role === 'recruiter' && (
              <p className="mt-4 text-amber-700 bg-amber-50 p-2 rounded">
                <AlertCircle size={16} className="inline mr-1" />
                Only job seekers can apply to job postings.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;