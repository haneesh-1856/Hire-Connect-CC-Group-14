import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase as BriefcaseBusiness, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <BriefcaseBusiness size={28} />
              <span className="font-bold text-xl">JobConnect</span>
            </div>
            <p className="text-blue-100 text-sm">
              Connecting top talent with great opportunities. Find your dream job or the perfect candidate today.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-blue-100 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-blue-100 hover:text-white transition text-sm">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?type=referral" className="text-blue-100 hover:text-white transition text-sm">
                  Referral Jobs
                </Link>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition text-sm">
                  Career Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition text-sm">
                  Resume Tips
                </a>
              </li>
            </ul>
          </div>

          {/* For Recruiters */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">For Recruiters</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/post-job" className="text-blue-100 hover:text-white transition text-sm">
                  Post a Job
                </Link>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition text-sm">
                  Talent Search
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition text-sm">
                  Enterprise Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-6 text-sm text-blue-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {currentYear} JobConnect. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="hover:text-white transition">Privacy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">Terms</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">Cookies</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;