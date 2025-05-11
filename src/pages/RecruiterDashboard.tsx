import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getRecruiterJobs } from '../services/jobService';
import { Job } from '../types/job';
import { Search, Plus, Users, Briefcase, TrendingUp, Clock, ExternalLink, MoreHorizontal } from 'lucide-react';

const RecruiterDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getRecruiterJobs();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesFilter = filter === 'all' || 
                          (filter === 'referral' && job.isReferral) || 
                          (filter === 'non-referral' && !job.isReferral);
    
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Count total applications across all jobs
  const totalApplications = jobs.reduce((sum, job) => sum + job.applications.length, 0);

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">Manage your job postings and view applicants all in one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-500 mb-1">Active Jobs</h3>
              <p className="text-3xl font-bold">{jobs.length}</p>
            </div>
            <Briefcase className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-500 mb-1">Total Applicants</h3>
              <p className="text-3xl font-bold">{totalApplications}</p>
            </div>
            <Users className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-500 mb-1">Referral Jobs</h3>
              <p className="text-3xl font-bold">
                {jobs.filter(job => job.isReferral).length}
              </p>
            </div>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-500 mb-1">Recent Views</h3>
              <p className="text-3xl font-bold">214</p>
            </div>
            <Clock className="text-amber-500" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-bold">My Job Postings</h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Jobs</option>
                <option value="referral">Referral Jobs</option>
                <option value="non-referral">Non-Referral Jobs</option>
              </select>
              
              <Link
                to="/post-job"
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md flex items-center btn"
              >
                <Plus size={18} className="mr-1" />
                Post New Job
              </Link>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicants
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md">
                          {job.companyLogo ? (
                            <img src={job.companyLogo} alt={job.company} className="h-8 w-8 object-contain" />
                          ) : (
                            <Briefcase size={20} className="text-gray-500" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">{job.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.applications.length}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.isReferral 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {job.isReferral ? 'Referral' : 'Direct'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-4">
                        <Link 
                          to={`/jobs/${job._id}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          View
                          <ExternalLink size={14} className="ml-1" />
                        </Link>
                        <div className="relative group">
                          <button className="text-gray-500 hover:text-gray-700">
                            <MoreHorizontal size={18} />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 invisible group-hover:visible">
                            <div className="py-1">
                              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit Job</a>
                              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Pause Listing</a>
                              <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="bg-gray-50 inline-block rounded-full p-3 mb-4">
              <Briefcase size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? "You haven't posted any jobs yet." 
                : `You don't have any ${filter === 'referral' ? 'referral' : 'non-referral'} jobs.`}
            </p>
            <Link
              to="/post-job"
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md inline-flex items-center btn"
            >
              <Plus size={18} className="mr-1" />
              Post a New Job
            </Link>
          </div>
        )}
      </div>

      {/* Recent applicants preview */}
      {totalApplications > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Applicants</h2>
            <a href="#" className="text-blue-700 hover:text-blue-900 text-sm font-medium">View All</a>
          </div>
          
          <div className="space-y-4">
            {jobs.flatMap(job => 
              job.applications.slice(0, 1).map(app => (
                <div key={app._id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center">
                    <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center text-gray-700 font-medium">
                      {app.user.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{app.user.name}</p>
                      <p className="text-sm text-gray-500">Applied for {job.title}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ).slice(0, 3)}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;