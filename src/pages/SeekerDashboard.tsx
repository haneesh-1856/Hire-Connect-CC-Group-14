import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getApplications } from '../services/applicationService';
import { Application } from '../types/application';
import { Clock, CheckCircle, XCircle, AlertCircle, ExternalLink, Search } from 'lucide-react';

const SeekerDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center text-yellow-700 bg-yellow-100 px-2.5 py-0.5 rounded-full text-xs font-medium">
            <Clock size={14} className="mr-1" />
            Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="flex items-center text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full text-xs font-medium">
            <CheckCircle size={14} className="mr-1" />
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full text-xs font-medium">
            <XCircle size={14} className="mr-1" />
            Rejected
          </span>
        );
      case 'interviewing':
        return (
          <span className="flex items-center text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full text-xs font-medium">
            <AlertCircle size={14} className="mr-1" />
            Interviewing
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">Manage your job applications and track your progress all in one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="font-medium text-gray-500 mb-1">Total Applications</h3>
          <p className="text-3xl font-bold">{applications.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <h3 className="font-medium text-gray-500 mb-1">Pending Review</h3>
          <p className="text-3xl font-bold">
            {applications.filter(app => app.status === 'pending').length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="font-medium text-gray-500 mb-1">Interviews Scheduled</h3>
          <p className="text-3xl font-bold">
            {applications.filter(app => app.status === 'interviewing').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold mb-4 md:mb-0">My Applications</h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="interviewing">Interviewing</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
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
                {filteredApplications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.job.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.job.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.job.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        to={`/jobs/${application.job._id}`}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        View
                        <ExternalLink size={14} className="ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="bg-gray-50 inline-block rounded-full p-3 mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? "You haven't applied to any jobs yet." 
                : `You don't have any ${filter} applications.`}
            </p>
            <Link
              to="/jobs"
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md inline-block btn"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerDashboard;