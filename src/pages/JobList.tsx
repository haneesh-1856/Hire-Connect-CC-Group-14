import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import JobFilter from '../components/JobFilter';
import { getJobs } from '../services/jobService';
import { Job } from '../types/job';
import { Briefcase } from 'lucide-react';

const JobList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 10;

  // Get initial filter from URL if available
  const initialFilters = {
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('type') || '',
    isReferral: searchParams.get('referral') || 'all',
    salary: {
      min: searchParams.get('minSalary') || '',
      max: searchParams.get('maxSalary') || ''
    }
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Convert filters to API parameters
        const params = {
          page: currentPage,
          limit: jobsPerPage,
          keyword: filters.keyword,
          location: filters.location,
          jobType: filters.jobType,
          isReferral: filters.isReferral !== 'all' ? filters.isReferral : undefined,
          minSalary: filters.salary.min,
          maxSalary: filters.salary.max
        };
        
        const response = await getJobs(params);
        setJobs(response.jobs);
        setTotalJobs(response.totalJobs);
        setTotalPages(Math.ceil(response.totalJobs / jobsPerPage));
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Job Listings</h1>
        <p className="text-gray-600">
          {loading ? 'Loading jobs...' : `Found ${totalJobs} jobs matching your criteria`}
        </p>
      </div>

      {/* Filter section */}
      <JobFilter onFilter={handleFilterChange} />

      {/* Job listings */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
        </div>
      ) : jobs.length > 0 ? (
        <div className="space-y-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, i, array) => {
                    // Add ellipsis
                    if (i > 0 && array[i - 1] !== page - 1) {
                      return (
                        <span 
                          key={`ellipsis-${page}`}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="bg-gray-50 inline-block rounded-full p-4 mb-4">
            <Briefcase size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            We couldn't find any jobs matching your search criteria. Try adjusting your filters or search query.
          </p>
          <button
            onClick={() => handleFilterChange(initialFilters)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md btn"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default JobList;