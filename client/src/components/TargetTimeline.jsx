import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TargetTimeline = () => {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get('/auth/profile');
      setContent(response.data.targetTimeline || '');
    } catch (error) {
      console.error('Error fetching target timeline:', error);
    }
  };

  const saveContent = async () => {
    try {
      await axios.put('/auth/profile', { targetTimeline: content });
      setIsEditing(false);
      setMessage('Target Timeline saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving target timeline:', error);
      setMessage('Error saving target timeline');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchContent(); // Reset to original content
    setMessage('');
  };

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>🎯 Target Timeline</h2>
      
      <div className="clipboard-container">
        <div className="clipboard">
          <textarea
            className="clipboard-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Plan your GATE preparation timeline here...

Example:
📅 Month 1-2: Complete Data Structures & Algorithms
📅 Month 3-4: Computer Networks & Operating Systems  
📅 Month 5-6: Database & System Design
📅 Month 7-8: Theory of Computation & Compiler Design
📅 Month 9-10: Revision & Mock Tests
📅 Month 11-12: Final Revision & PYQ Practice

Set your milestones, deadlines, and goals!"
            disabled={!isEditing}
            style={{ 
              color: isEditing ? 'inherit' : 'rgba(0,0,0,0.7)',
              cursor: isEditing ? 'text' : 'default'
            }}
          />
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {message && (
            <div style={{ 
              color: message.includes('success') ? '#34C759' : '#FF3B30', 
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              {message}
            </div>
          )}
          
          {isEditing ? (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn" onClick={saveContent}>
                💾 Save Timeline
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                ❌ Cancel
              </button>
            </div>
          ) : (
            <button className="btn" onClick={handleEdit}>
              ✏️ Edit Timeline
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TargetTimeline;
