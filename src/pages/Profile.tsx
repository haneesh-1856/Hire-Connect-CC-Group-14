import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../services/userService';
import { User, Mail, Phone, Briefcase, MapPin, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    resume: null as File | null,
    currentResume: user?.resumeUrl || '',
    // Recruiter-specific fields
    company: user?.company || '',
    jobTitle: user?.jobTitle || '',
    // Seeker-specific fields
    skills: user?.skills?.join(', ') || '',
    education: user?.education || [],
    experience: user?.experience || []
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resume: e.target.files[0]
      });
    }
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...formData.education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      education: newEducation
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }
      ]
    });
  };

  const removeEducation = (index: number) => {
    const newEducation = [...formData.education];
    newEducation.splice(index, 1);
    
    setFormData({
      ...formData,
      education: newEducation
    });
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperience = [...formData.experience];
    newExperience[index] = {
      ...newExperience[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      experience: newExperience
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { company: '', position: '', startDate: '', endDate: '', description: '' }
      ]
    });
  };

  const removeExperience = (index: number) => {
    const newExperience = [...formData.experience];
    newExperience.splice(index, 1);
    
    setFormData({
      ...formData,
      experience: newExperience
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setIsSubmitting(true);
      
      // Convert skills string to array
      const skills = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill !== '');
      
      // Create updated profile data
      const profileData = {
        ...formData,
        skills,
        // Remove the file object before sending to API
        resume: undefined
      };
      
      // If there's a new resume, upload it (simulated here)
      let resumeUrl = formData.currentResume;
      if (formData.resume) {
        // In a real app, this would upload the file and get a URL
        resumeUrl = URL.createObjectURL(formData.resume);
      }
      
      await updateProfile({
        ...profileData,
        resumeUrl
      });
      
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-600">Manage your personal information and profile settings.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
          <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-start">
          <CheckCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User size={20} className="mr-2 text-blue-700" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                    Location
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
                      placeholder="City, State"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
                  Bio / Summary
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell employers about yourself"
                ></textarea>
              </div>
            </div>
            
            {/* Role-specific information */}
            {user?.role === 'recruiter' ? (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Briefcase size={20} className="mr-2 text-blue-700" />
                  Professional Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-gray-700 font-medium mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="jobTitle" className="block text-gray-700 font-medium mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Briefcase size={20} className="mr-2 text-blue-700" />
                    Resume & Skills
                  </h2>
                  
                  <div className="mb-4">
                    <label htmlFor="resume" className="block text-gray-700 font-medium mb-2">
                      Upload Resume (PDF, DOC, DOCX)
                    </label>
                    <div className="border border-dashed border-gray-300 rounded-md p-4">
                      <div className="flex items-center justify-center relative">
                        {formData.resume || formData.currentResume ? (
                          <div className="text-center">
                            <CheckCircle size={24} className="mx-auto text-green-500 mb-2" />
                            <p className="text-sm text-gray-600 mb-1">Resume uploaded</p>
                            <p className="text-xs text-gray-500">
                              {formData.resume ? formData.resume.name : "Current resume"}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <FileText size={24} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, DOC, or DOCX (Max 5MB)</p>
                          </div>
                        )}
                        <input
                          type="file"
                          id="resume"
                          name="resume"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".pdf,.doc,.docx"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="skills" className="block text-gray-700 font-medium mb-2">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="JavaScript, React, Node.js, etc."
                    />
                  </div>
                </div>
                
                {/* Education */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      Education
                    </h2>
                    
                    <button
                      type="button"
                      onClick={addEducation}
                      className="text-blue-700 hover:text-blue-900 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Add Education
                    </button>
                  </div>
                  
                  {formData.education.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-md border border-dashed border-gray-300">
                      <p className="text-gray-500">No education entries yet. Click "Add Education" to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.education.map((edu, index) => (
                        <div key={index} className="border border-gray-200 rounded-md p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-medium">Education #{index + 1}</h3>
                            <button
                              type="button"
                              onClick={() => removeEducation(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1">
                                Institution
                              </label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="University name"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1">
                                Degree
                              </label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Bachelor's, Master's, etc."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1">
                                Field of Study
                              </label>
                              <input
                                type="text"
                                value={edu.fieldOfStudy}
                                onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Computer Science, Business, etc."
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                  Start Date
                                </label>
                                <input
                                  type="text"
                                  value={edu.startDate}
                                  onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="MM/YYYY"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                  End Date
                                </label>
                                <input
                                  type="text"
                                  value={edu.endDate}
                                  onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="MM/YYYY or Present"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Work Experience */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                      <Briefcase size={20} className="mr-2 text-blue-700" />
                      Work Experience
                    </h2>
                    
                    <button
                      type="button"
                      onClick={addExperience}
                      className="text-blue-700 hover:text-blue-900 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Add Experience
                    </button>
                  </div>
                  
                  {formData.experience.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-md border border-dashed border-gray-300">
                      <p className="text-gray-500">No work experience entries yet. Click "Add Experience" to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.experience.map((exp, index) => (
                        <div key={index} className="border border-gray-200 rounded-md p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-medium">Experience #{index + 1}</h3>
                            <button
                              type="button"
                              onClick={() => removeExperience(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1">
                                Company
                              </label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Company name"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1">
                                Position
                              </label>
                              <input
                                type="text"
                                value={exp.position}
                                onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Job title"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                  Start Date
                                </label>
                                <input
                                  type="text"
                                  value={exp.startDate}
                                  onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="MM/YYYY"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                  End Date
                                </label>
                                <input
                                  type="text"
                                  value={exp.endDate}
                                  onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="MM/YYYY or Present"
                                />
                              </div>
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-gray-700 text-sm font-medium mb-1">
                                Description
                              </label>
                              <textarea
                                value={exp.description}
                                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Describe your responsibilities and achievements"
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            
            {/* Submit */}
            <div className="border-t border-gray-200 pt-6">
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
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;