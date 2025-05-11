import React, { useState } from 'react';
import { Search, Filter, MapPin, Briefcase, DollarSign } from 'lucide-react';

interface JobFilterProps {
  onFilter: (filters: any) => void;
}

const JobFilter: React.FC<JobFilterProps> = ({ onFilter }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    isReferral: 'all',
    salary: {
      min: '',
      max: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFilters({
        ...filters,
        [parent]: {
          ...filters[parent as keyof typeof filters] as object,
          [child]: value
        }
      });
    } else {
      setFilters({
        ...filters,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const resetFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      jobType: '',
      isReferral: 'all',
      salary: {
        min: '',
        max: ''
      }
    });
    
    onFilter({
      keyword: '',
      location: '',
      jobType: '',
      isReferral: 'all',
      salary: {
        min: '',
        max: ''
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        {/* Basic search */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="Job title or keyword"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 md:w-auto"
          >
            <Filter size={18} />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
          
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md btn"
          >
            Search Jobs
          </button>
        </div>
        
        {/* Advanced filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 animate-fade-in">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="Location"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                name="jobType"
                value={filters.jobType}
                onChange={handleChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Job Type (Any)</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            
            <div>
              <select
                name="isReferral"
                value={filters.isReferral}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Jobs</option>
                <option value="true">Referral Jobs</option>
                <option value="false">Non-Referral Jobs</option>
              </select>
            </div>
            
            <div className="md:col-span-2 flex items-center gap-4">
              <DollarSign className="text-gray-400" size={18} />
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="number"
                  name="salary.min"
                  value={filters.salary.min}
                  onChange={handleChange}
                  placeholder="Min Salary"
                  className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  name="salary.max"
                  value={filters.salary.max}
                  onChange={handleChange}
                  placeholder="Max Salary"
                  className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="md:col-span-1 flex justify-end">
              <button
                type="button"
                onClick={resetFilters}
                className="text-gray-600 hover:text-gray-800 underline px-4 py-2"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default JobFilter;