import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase as BriefcaseBusiness, Users, Award, Rocket } from 'lucide-react';
import JobCard from '../components/JobCard';
import { getJobs } from '../services/jobService';
import { Job } from '../types/job';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await getJobs({ limit: 4, featured: true });
        setFeaturedJobs(response.jobs);
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/jobs?keyword=${encodeURIComponent(searchQuery)}`;
  };

  const features = [
    {
      icon: <BriefcaseBusiness size={36} className="text-blue-700" />,
      title: 'Thousands of Jobs',
      description: 'Access a wide variety of job opportunities from top companies across industries.'
    },
    {
      icon: <Users size={36} className="text-blue-700" />,
      title: 'Referral Network',
      description: 'Leverage the power of referrals through our network of professionals.'
    },
    {
      icon: <Award size={36} className="text-blue-700" />,
      title: 'Verified Employers',
      description: 'All employers are verified to ensure legitimate job opportunities.'
    },
    {
      icon: <Rocket size={36} className="text-blue-700" />,
      title: 'Career Growth',
      description: 'Resources and tools to help you advance your career to the next level.'
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl text-white py-16 px-6 mb-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job Today</h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and aspirations.
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job title, keywords, or company"
                  className="pl-10 pr-4 py-3 rounded-md w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md font-medium btn"
              >
                Search Jobs
              </button>
            </div>
          </form>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/jobs?type=referral"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 transition px-4 py-2 rounded-full"
            >
              Referral Jobs
            </Link>
            <Link
              to="/jobs?type=remote"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 transition px-4 py-2 rounded-full"
            >
              Remote Work
            </Link>
            <Link
              to="/jobs?type=tech"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 transition px-4 py-2 rounded-full"
            >
              Tech Jobs
            </Link>
            <Link
              to="/jobs?type=health"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 transition px-4 py-2 rounded-full"
            >
              Healthcare
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose JobConnect</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-12 bg-gray-50 rounded-xl mb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Job Opportunities</h2>
            <Link 
              to="/jobs"
              className="text-blue-700 hover:text-blue-900 font-medium flex items-center"
            >
              View All Jobs
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No featured jobs available at the moment. Check back soon!</p>
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link
              to="/register"
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-medium inline-block btn"
            >
              Create an Account to Apply
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 mb-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-xl shadow-xl p-8 md:p-12">
            <div className="md:flex md:items-center md:justify-between">
              <div className="mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Are you a recruiter?
                </h2>
                <p className="text-teal-100 text-lg max-w-2xl">
                  Post your job listings and find the perfect candidates for your organization. 
                  Get access to our database of qualified professionals.
                </p>
              </div>
              <div className="flex flex-col space-y-3 md:space-y-0 md:space-x-3 md:flex-row">
                <Link
                  to="/register?role=recruiter"
                  className="bg-white text-teal-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-center btn"
                >
                  Sign Up as Recruiter
                </Link>
                <Link
                  to="/post-job"
                  className="bg-transparent border border-white text-white hover:bg-white hover:bg-opacity-10 px-6 py-3 rounded-md font-medium text-center btn"
                >
                  Post a Job
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;