import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const deleteHistoryItem = async (id) => {
    try {
      await axios.delete(`/history/${id}`);
      fetchHistory();
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>📜 History</h2>
      
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Completed Tasks</h3>
        {history.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No completed tasks yet. Complete some daily plans to see them here!
          </p>
        ) : (
          <div>
            {history.map(item => (
              <div key={item._id} className="todo-item">
                <div className="todo-text">
                  <strong>{item.subject}</strong> - {item.hoursCompleted}h, {item.lecturesCompleted} lectures
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Completed on {new Date(item.completedDate).toLocaleDateString()}
                  </div>
                </div>
                <button className="icon-btn" onClick={() => deleteHistoryItem(item._id)}>🗑️</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
