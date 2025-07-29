import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RevisionPYQ = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [activeTab, setActiveTab] = useState('revision');
  const [revisionData, setRevisionData] = useState({ count: 0 });
  const [pyqData, setPyqData] = useState({ solved: 0, year: '' });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const updateRevision = async () => {
    if (!selectedSubject) return;
    try {
      await axios.put(`/subjects/${selectedSubject}`, { 
        revisionCount: revisionData.count 
      });
      fetchSubjects();
      setRevisionData({ count: 0 });
      setSelectedSubject('');
    } catch (error) {
      console.error('Error updating revision:', error);
    }
  };

  const updatePYQ = async () => {
    if (!selectedSubject) return;
    try {
      await axios.put(`/subjects/${selectedSubject}`, { 
        pyqsSolved: pyqData.solved,
        pyqsYear: pyqData.year
      });
      fetchSubjects();
      setPyqData({ solved: 0, year: '' });
      setSelectedSubject('');
    } catch (error) {
      console.error('Error updating PYQ:', error);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>📝 Revision & PYQ</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>📚 Revision Tracker</h3>
          
          <div className="form-group">
            <label className="form-label">Select Subject</label>
            <select
              className="form-input"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Choose a subject</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>{subject.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Revision Count</label>
            <input
              type="number"
              className="form-input"
              value={revisionData.count}
              onChange={(e) => setRevisionData({ count: parseInt(e.target.value) || 0 })}
              placeholder="Number of revisions"
            />
          </div>
          
          <button className="btn" onClick={updateRevision} style={{ width: '100%' }}>
            Update Revision
          </button>
          
          <div style={{ marginTop: '20px' }}>
            <h4>Current Revisions:</h4>
            {subjects.map(subject => (
              <div key={subject._id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid rgba(0,0,0,0.1)'
              }}>
                <span>{subject.name}</span>
                <span>{subject.revisionCount} times</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>📄 PYQ Tracker</h3>
          
          <div className="form-group">
            <label className="form-label">Select Subject</label>
            <select
              className="form-input"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Choose a subject</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>{subject.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">PYQs Solved</label>
            <input
              type="number"
              className="form-input"
              value={pyqData.solved}
              onChange={(e) => setPyqData({ ...pyqData, solved: parseInt(e.target.value) || 0 })}
              placeholder="Number of questions"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Year Range</label>
            <input
              type="text"
              className="form-input"
              value={pyqData.year}
              onChange={(e) => setPyqData({ ...pyqData, year: e.target.value })}
              placeholder="e.g., 2018-2023"
            />
          </div>
          
          <button className="btn" onClick={updatePYQ} style={{ width: '100%' }}>
            Update PYQ
          </button>
          
          <div style={{ marginTop: '20px' }}>
            <h4>PYQ Progress:</h4>
            {subjects.map(subject => (
              <div key={subject._id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid rgba(0,0,0,0.1)'
              }}>
                <span>{subject.name}</span>
                <span>{subject.pyqsSolved} ({subject.pyqsYear})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevisionPYQ;
