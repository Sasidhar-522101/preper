import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Progress = () => {
  const [subjects, setSubjects] = useState([]);

  /* ---------------- fetch ---------------- */
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await axios.get('/subjects');
        setSubjects(data);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };
    fetchSubjects();
  }, []);

  /* ------------- overall totals ----------- */
  const totals = subjects.reduce(
    (acc, s) => ({
      totalHours: acc.totalHours + (Number(s.totalHours) || 0),
      completedHours: acc.completedHours + (Number(s.completedHours) || 0),
      totalLectures: acc.totalLectures + (Number(s.totalLectures) || 0),
      completedLectures: acc.completedLectures + (Number(s.completedLectures) || 0)
    }),
    { totalHours: 0, completedHours: 0, totalLectures: 0, completedLectures: 0 }
  );

  const hoursPercent = totals.totalHours
    ? Math.round((totals.completedHours / totals.totalHours) * 100)
    : 0;

  const lecturesPercent = totals.totalLectures
    ? Math.round((totals.completedLectures / totals.totalLectures) * 100)
    : 0;

  /* ---------------- render --------------- */
  return (
    <div>
      <h2 style={{ marginBottom: 30 }}>📊 Progress</h2>

      {/* -------- Overall summary card -------- */}
      <div className="card" style={{ marginBottom: 30 }}>
        <h3 style={{ marginBottom: 20 }}>Overall Progress</h3>

        {/* Hours */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
              fontWeight: 600
            }}
          >
            <span>Hours&nbsp;({totals.completedHours}/{totals.totalHours})</span>
            <span>{hoursPercent}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${hoursPercent}%` }}
            />
          </div>
        </div>

        {/* Lectures */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
              fontWeight: 600
            }}
          >
            <span>
              Lectures&nbsp;({totals.completedLectures}/{totals.totalLectures})
            </span>
            <span>{lecturesPercent}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${lecturesPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* -------- Per-subject detail -------- */}
      <div className="subjects-grid">
        {subjects.map(s => {
          const hPct = s.totalHours
            ? Math.round((s.completedHours / s.totalHours) * 100)
            : 0;
          const lPct = s.totalLectures
            ? Math.round((s.completedLectures / s.totalLectures) * 100)
            : 0;

          return (
            <div key={s._id} className="card subject-card">
              <div className="subject-header">
                <span className="subject-name">{s.name}</span>
              </div>

              {/* Hours */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6
                  }}
                >
                  <span>
                    Hours&nbsp;({s.completedHours}/{s.totalHours})
                  </span>
                  <span>{hPct}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${hPct}%` }}
                  />
                </div>
              </div>

              {/* Lectures */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6
                  }}
                >
                  <span>
                    Lectures&nbsp;({s.completedLectures}/{s.totalLectures})
                  </span>
                  <span>{lPct}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${lPct}%` }}
                  />
                </div>
              </div>

              {/* Revision / PYQ stats */}
              <div style={{ fontSize: 14, color: '#666' }}>
                <div>📚 Revisions: {s.revisionCount}</div>
                <div>📝 PYQs Solved: {s.pyqsSolved}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Progress;
