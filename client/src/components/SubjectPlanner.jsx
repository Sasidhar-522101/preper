import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubjectPlanner = () => {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get('/auth/profile');
      setContent(response.data.subjectPlanner || '');
    } catch (error) {
      console.error('Error fetching subject planner:', error);
    }
  };

  const saveContent = async () => {
    try {
      await axios.put('/auth/profile', { subjectPlanner: content });
      setIsEditing(false);
      setMessage('Subject Planner saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving subject planner:', error);
      setMessage('Error saving subject planner');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchContent();
    setMessage('');
  };

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>📋 Subject Planner</h2>
      
      <div className="clipboard-container">
        <div className="clipboard">
          <textarea
            className="clipboard-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Plan your subject-wise study strategy here...

Example:
📚 Data Structures & Algorithms:
   - Arrays, Linked Lists, Stacks, Queues (Week 1-2)
   - Trees, Graphs, Hashing (Week 3-4)
   - Sorting & Searching Algorithms (Week 5)
   - Dynamic Programming (Week 6-7)
   - Resources: GeeksforGeeks, CLRS Book

📚 Computer Networks:
   - OSI Model, TCP/IP (Week 1)
   - Routing Protocols (Week 2)
   - Network Security (Week 3)
   - Resources: Tanenbaum Book, Gate Lectures

📚 Operating Systems:
   - Process Management (Week 1-2)
   - Memory Management (Week 3)
   - File Systems (Week 4)
   - Resources: Galvin Book, YouTube

Add your subject breakdown, topics, and resources!"
            disabled={!isEditing}
            style={{ 
              color: isEditing ? 'inherit' : 'rgba(0,0,0,0.7)',
              cursor: isEditing ? 'text' : 'default'
            }}
          />
        </div>
        
        <div className="clipboard-buttons">
          {message && (
            <div className={`clipboard-message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          {isEditing ? (
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button className="btn" onClick={saveContent}>
                💾 Save Planner
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                ❌ Cancel
              </button>
            </div>
          ) : (
            <button className="btn" onClick={handleEdit}>
              ✏️ Edit Planner
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectPlanner;
