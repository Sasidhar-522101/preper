import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    name: '',
    totalHours: '',
    totalLectures: '',
    completedHours: '',
    completedLectures: '',
    sources: ''
  });
  const [editingSubject, setEditingSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get('/subjects');
      setSubjects(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  /* ----------  ADD  ---------- */
  const addSubject = async e => {
    e.preventDefault();
    try {
      const body = {
        name: newSubject.name,
        totalHours: Number(newSubject.totalHours) || 0,
        totalLectures: Number(newSubject.totalLectures) || 0,
        completedHours: Number(newSubject.completedHours) || 0,
        completedLectures: Number(newSubject.completedLectures) || 0,
        sources: newSubject.sources
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      };
      await axios.post('/subjects', body);
      setNewSubject({
        name: '',
        totalHours: '',
        totalLectures: '',
        completedHours: '',
        completedLectures: '',
        sources: ''
      });
      fetchSubjects();
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  /* ----------  EDIT / SAVE  ---------- */
  const saveSubject = async subj => {
    try {
      const body = {
        name: subj.name,
        totalHours: Number(subj.totalHours) || 0,
        totalLectures: Number(subj.totalLectures) || 0,
        completedHours: Number(subj.completedHours) || 0,
        completedLectures: Number(subj.completedLectures) || 0,
        sources: subj.sources
      };
      await axios.put(`/subjects/${subj._id}`, body);
      setEditingSubject(null);
      fetchSubjects();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const deleteSubject = async id => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await axios.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const gateSubjects = [
    'Data Structures & Algorithms',
    'Computer Networks',
    'Operating Systems',
    'Database Management Systems',
    'Computer Organization & Architecture',
    'Theory of Computation',
    'Compiler Design',
    'Software Engineering',
    'Discrete Mathematics',
    'Digital Logic',
    'Programming & Data Structures'
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 30 }}>📚 Subjects</h2>

      {/* -------- Add form -------- */}
      <div className="card" style={{ marginBottom: 30 }}>
        <h3 style={{ marginBottom: 20 }}>Add New Subject</h3>
        <form onSubmit={addSubject}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr repeat(4, 1fr) 2fr auto',
              gap: 12,
              alignItems: 'end'
            }}
          >
            <input
              list="gate-subjects"
              className="form-input"
              placeholder="Subject"
              value={newSubject.name}
              onChange={e =>
                setNewSubject({ ...newSubject, name: e.target.value })
              }
              required
            />
            <datalist id="gate-subjects">
              {gateSubjects.map(s => (
                <option key={s} value={s} />
              ))}
            </datalist>

            <input
              type="number"
              className="form-input"
              placeholder="Total Hrs"
              value={newSubject.totalHours}
              onChange={e =>
                setNewSubject({ ...newSubject, totalHours: e.target.value })
              }
            />
            <input
              type="number"
              className="form-input"
              placeholder="Total Lect"
              value={newSubject.totalLectures}
              onChange={e =>
                setNewSubject({ ...newSubject, totalLectures: e.target.value })
              }
            />
            <input
              type="number"
              className="form-input"
              placeholder="Done Hrs"
              value={newSubject.completedHours}
              onChange={e =>
                setNewSubject({ ...newSubject, completedHours: e.target.value })
              }
            />
            <input
              type="number"
              className="form-input"
              placeholder="Done Lect"
              value={newSubject.completedLectures}
              onChange={e =>
                setNewSubject({
                  ...newSubject,
                  completedLectures: e.target.value
                })
              }
            />

            <input
              className="form-input"
              placeholder="Sources (comma-sep)"
              value={newSubject.sources}
              onChange={e =>
                setNewSubject({ ...newSubject, sources: e.target.value })
              }
            />
            <button className="btn">Add</button>
          </div>
        </form>
      </div>

      {/* -------- Subject cards -------- */}
      <div className="subjects-grid">
        {subjects.map(subj =>
          editingSubject === subj._id ? (
            /* ----- Editing mode ----- */
            <div key={subj._id} className="card subject-card">
              <input
                className="form-input"
                value={subj.name}
                onChange={e =>
                  setSubjects(
                    subjects.map(s =>
                      s._id === subj._id ? { ...s, name: e.target.value } : s
                    )
                  )
                }
                style={{ marginBottom: 10 }}
              />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 10,
                  marginBottom: 10
                }}
              >
                {['totalHours', 'totalLectures', 'completedHours', 'completedLectures'].map(
                  field => (
                    <input
                      key={field}
                      type="number"
                      className="form-input"
                      placeholder={field}
                      value={subj[field]}
                      onChange={e =>
                        setSubjects(
                          subjects.map(s =>
                            s._id === subj._id
                              ? { ...s, [field]: e.target.value }
                              : s
                          )
                        )
                      }
                      min="0"
                    />
                  )
                )}
              </div>
              <textarea
                className="form-input"
                style={{ height: 60, marginBottom: 10 }}
                placeholder="Sources"
                value={subj.sources.join(', ')}
                onChange={e =>
                  setSubjects(
                    subjects.map(s =>
                      s._id === subj._id
                        ? { ...s, sources: e.target.value.split(',').map(t => t.trim()) }
                        : s
                    )
                  )
                }
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn" onClick={() => saveSubject(subj)}>
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingSubject(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* ----- View mode ----- */
            <div key={subj._id} className="card subject-card">
              <div className="subject-header">
                <span className="subject-name">{subj.name}</span>
                <div className="action-buttons">
                  <button
                    className="icon-btn"
                    onClick={() => setEditingSubject(subj._id)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => deleteSubject(subj._id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
                <div>
                  ⏱️ <strong>{subj.completedHours}</strong> / {subj.totalHours} hrs
                </div>
                <div>
                  📺 <strong>{subj.completedLectures}</strong> /{' '}
                  {subj.totalLectures} lectures
                </div>
                {subj.sources.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    📚 Sources:&nbsp;{subj.sources.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Subjects;
