import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TimeTable = () => {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get('/auth/profile');
      setContent(response.data.timeTable || '');
    } catch (error) {
      console.error('Error fetching timetable:', error);
    }
  };

  const saveContent = async () => {
    try {
      await axios.put('/auth/profile', { timeTable: content });
      setIsEditing(false);
      setMessage('Timetable saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving timetable:', error);
      setMessage('Error saving timetable');
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
    <div className="timetable-page-container">
      <h2 className="page-title">📅 Time Table</h2>

      <div className="clipboard-container">
        <div className="clipboard">
          <textarea
            className="clipboard-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Create your daily/weekly study timetable here...

Example Weekly Timetable:
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│    TIME     │    MONDAY   │   TUESDAY   │  WEDNESDAY  │   THURSDAY  │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ 06:00-08:00 │ DSA Practice│ OS Theory   │ CN Theory   │ DBMS Theory │
│ 08:00-09:00 │ Breakfast   │ Breakfast   │ Breakfast   │ Breakfast   │
│ 09:00-11:00 │ DSA Theory  │ OS Practice │ CN Practice │ DBMS Pract. │
│ 11:00-11:30 │ Break       │ Break       │ Break       │ Break       │
│ 11:30-13:00 │ Math/Disc.  │ Compiler    │ TOC Theory  │ Arch/Org    │
│ 13:00-14:00 │ Lunch       │ Lunch       │ Lunch       │ Lunch       │
│ 14:00-16:00 │ Revision    │ PYQ Solve   │ Mock Test   │ Revision    │
│ 16:00-18:00 │ Break/Relax │ Break/Relax │ Break/Relax │ Break/Relax │
│ 18:00-20:00 │ Weak Topics │ Weak Topics │ Weak Topics │ Weak Topics │
│ 20:00-21:00 │ Dinner      │ Dinner      │ Dinner      │ Dinner      │
│ 21:00-22:00 │ Daily Review│ Daily Review│ Daily Review│ Daily Review│
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘

FRIDAY: Mock Test & Analysis
SATURDAY: Revision & PYQ
SUNDAY: Rest & Light Study

Customize your schedule based on your peak hours!`}
            disabled={!isEditing}
            style={{
              backgroundColor: isEditing ? '' : '#f1f1f1',
              color: isEditing ? '' : 'rgba(0,0,0,0.7)',
              cursor: isEditing ? 'text' : 'default',
            }}
          />

          <div className="clipboard-buttons">
            {message && (
              <div
                className={`clipboard-message ${
                  message.includes('success') ? 'success' : 'error'
                }`}
              >
                {message}
              </div>
            )}

            {isEditing ? (
              <div className="clipboard-action-group">
                <button className="btn" onClick={saveContent}>
                  💾 Save Timetable
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                  ❌ Cancel
                </button>
              </div>
            ) : (
              <button className="btn" onClick={handleEdit}>
                ✏️ Edit Timetable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTable;

