import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Subjects from './components/Subjects';
import Progress from './components/Progress';
import History from './components/History';
import Account from './components/Account';
import TargetTimeline from './components/TargetTimeline';
import SubjectPlanner from './components/SubjectPlanner';
import TimeTable from './components/TimeTable';
import RevisionPYQ from './components/RevisionPYQ';

// Production API URL
axios.defaults.baseURL = 'https://prep-tracker-server.onrender.com/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedTheme);
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/auth/profile');
      setUser(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'subjects': return <Subjects />;
      case 'progress': return <Progress />;
      case 'history': return <History />;
      case 'account': return <Account user={user} setUser={setUser} />;
      case 'target-timeline': return <TargetTimeline />;
      case 'subject-planner': return <SubjectPlanner />;
      case 'timetable': return <TimeTable />;
      case 'revision-pyq': return <RevisionPYQ />;
      default: return <Dashboard user={user} />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  return (
    <div className="app">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Right-side User Profile */}
      {user && (
        <div className="user-profile-right">
          <div className="profile-pic">
            {user.profilePic ? (
              <img src={user.profilePic} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
              user.username?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <span className="username">{user.username}</span>
        </div>
      )}
      
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
