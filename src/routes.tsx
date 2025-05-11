import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SeekerDashboard from './pages/SeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<JobList />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      
      <Route path="/seeker-dashboard" element={
        <ProtectedRoute role="job_seeker">
          <SeekerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/recruiter-dashboard" element={
        <ProtectedRoute role="recruiter">
          <RecruiterDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/post-job" element={
        <ProtectedRoute role="recruiter">
          <PostJob />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute role="any">
          <Profile />
        </ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;