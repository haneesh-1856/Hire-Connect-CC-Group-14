import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, Clock } from 'lucide-react';
import { Job } from '../types/job';
import { formatDate, calculateTimeAgo } from '../utils/dateUtils';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="job-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start">
          {/* Company logo or placeholder */}
          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 mr-4">
            {job.companyLogo ? (
              <img 
                src={job.companyLogo} 
                alt={`${job.company} logo`} 
                className="w-10 h-10 object-contain"
              />
            ) : (
              <Briefcase size={24} />
            )}
          </div>
          
          <div className="flex-1">
            <Link to={`/jobs/${job._id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-700 transition">
                {job.title}
              </h3>
            </Link>
            <p className="text-gray-600 mt-1">{job.company}</p>
            
            {/* Job meta info */}
            <div className="mt-3 flex flex-wrap gap-y-2">
              <div className="flex items-center text-sm text-gray-500 mr-4">
                <MapPin size={16} className="mr-1" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mr-4">
                <Briefcase size={16} className="mr-1" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={16} className="mr-1" />
                <span>Posted {formatDate(job.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {/* Job type badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.isReferral 
              ? 'bg-amber-100 text-amber-800' 
              : 'bg-teal-100 text-teal-800'
          }`}>
            {job.isReferral ? 'Referral' : 'Direct'}
          </div>
        </div>
        
        {/* Job description preview */}
        <div className="mt-4">
          <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>{calculateTimeAgo(job.createdAt)}</span>
          </div>
          
          <Link 
            to={`/jobs/${job._id}`}
            className="text-blue-700 hover:text-blue-900 text-sm font-medium flex items-center"
          >
            View Details
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;