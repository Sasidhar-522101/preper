import React from 'react';

const Navbar = ({ currentPage, setCurrentPage, darkMode, setDarkMode, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'subjects', label: 'Subjects', icon: '📚' },
    { id: 'target-timeline', label: 'Target Timeline', icon: '🎯' },
    { id: 'subject-planner', label: 'Subject Planner', icon: '📋' },
    { id: 'timetable', label: 'Time Table', icon: '📅' },
    { id: 'revision-pyq', label: 'Revision & PYQ', icon: '📝' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'history', label: 'History', icon: '📜' },
    { id: 'account', label: 'Account', icon: '👤' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-header">
        <div className="logo">PrepTrack</div>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      <ul className="nav-menu">
        {menuItems.map(item => (
          <li key={item.id} className="nav-item">
            <button
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <span style={{ marginRight: '8px' }}>{item.icon}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
