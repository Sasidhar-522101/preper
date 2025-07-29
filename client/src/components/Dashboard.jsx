import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user }) => {
  const [dailyPlans, setDailyPlans] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [todos, setTodos] = useState([]);
  const [newPlan, setNewPlan] = useState({ subject: '', targetHours: '', targetLectures: '' });
  const [newTodo, setNewTodo] = useState('');
  const [gateDate, setGateDate] = useState('');
  const [quote] = useState("Success is not final, failure is not fatal!");

  useEffect(() => {
    fetchDailyPlans();
    fetchSubjects();
    if (user?.gateDate) setGateDate(user.gateDate);
  }, [user]);

  const fetchDailyPlans = async () => {
    try {
      const response = await axios.get('/dailyplan');
      setDailyPlans(response.data);
    } catch (error) {
      console.error('Error fetching daily plans:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const addDailyPlan = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/dailyplan', {
        subject: newPlan.subject,
        targetHours: Number(newPlan.targetHours),
        targetLectures: Number(newPlan.targetLectures)
      });
      setNewPlan({ subject: '', targetHours: '', targetLectures: '' });
      fetchDailyPlans();
    } catch (error) {
      console.error('Error adding daily plan:', error);
      alert('Error adding daily plan');
    }
  };

  const togglePlanCompletion = (id) => {
    setDailyPlans(dailyPlans.map(plan => 
      plan._id === id ? { ...plan, completed: !plan.completed } : plan
    ));
  };

  const saveCompletedTask = async (plan) => {
    if (!plan.completed) {
      alert('Please mark the task as completed first by checking the checkbox.');
      return;
    }

    try {
      console.log('Saving task:', plan);
      
      // Save to history with explicit data conversion
      const historyData = {
        subject: plan.subject,
        hoursCompleted: Number(plan.targetHours) || 0,
        lecturesCompleted: Number(plan.targetLectures) || 0
      };
      
      console.log('History data:', historyData);
      
      const historyResponse = await axios.post('/history', historyData);
      console.log('History saved:', historyResponse.data);
      
      // Update subject progress
      const subject = subjects.find(s => s.name === plan.subject);
      if (subject) {
        const updatedData = {
          completedHours: Number(subject.completedHours) + Number(plan.targetHours),
          completedLectures: Number(subject.completedLectures) + Number(plan.targetLectures)
        };
        
        await axios.put(`/subjects/${subject._id}`, updatedData);
        console.log('Subject progress updated');
      }
      
      alert('Task saved to history successfully!');
      fetchSubjects();
    } catch (error) {
      console.error('Error saving completed task:', error.response?.data || error.message);
      alert(`Error saving task to history: ${error.response?.data?.message || error.message}`);
    }
  };

  const deletePlan = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/dailyplan/${id}`);
        fetchDailyPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateGateDate = async () => {
    try {
      await axios.put('/auth/profile', { gateDate });
      alert('GATE date updated successfully!');
    } catch (error) {
      console.error('Error updating GATE date:', error);
    }
  };

  const getDaysLeft = () => {
    if (!gateDate) return 0;
    const today = new Date();
    const gate = new Date(gateDate);
    const diff = gate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="dashboard">
      <div className="top-cards">
        <div className="card tiny-card">
          <div style={{ fontSize: '14px', fontWeight: '600' }}>Daily Motivation</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>{quote}</div>
        </div>
        <div className="card tiny-card">
          <div style={{ fontSize: '14px', fontWeight: '600' }}>Login Streak</div>
          <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px' }}>
            {user?.loginStreak || 0} days 🔥
          </div>
        </div>
      </div>

      <div className="main-cards">
        <div className="card large-card">
          <h3 style={{ marginBottom: '20px' }}>📅 Daily Planner</h3>
          
          <form onSubmit={addDailyPlan} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
              <div className="form-group">
                <select
                  className="form-input"
                  value={newPlan.subject}
                  onChange={(e) => setNewPlan({ ...newPlan, subject: e.target.value })}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject.name}>{subject.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-input"
                  placeholder="Hours"
                  value={newPlan.targetHours}
                  onChange={(e) => setNewPlan({ ...newPlan, targetHours: e.target.value })}
                  required
                  min="0"
                  step="0.5"
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-input"
                  placeholder="Lectures"
                  value={newPlan.targetLectures}
                  onChange={(e) => setNewPlan({ ...newPlan, targetLectures: e.target.value })}
                  required
                  min="0"
                />
              </div>
              <button type="submit" className="btn">Add</button>
            </div>
          </form>

          <div>
            {dailyPlans.map(plan => (
              <div key={plan._id} className="todo-item" style={{ 
                backgroundColor: plan.completed ? 'rgba(52, 199, 89, 0.1)' : 'transparent',
                border: plan.completed ? '2px solid #34C759' : '1px solid #e0e0e0'
              }}>
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={plan.completed || false}
                  onChange={() => togglePlanCompletion(plan._id)}
                />
                <div className={`todo-text ${plan.completed ? 'completed' : ''}`}>
                  <strong>{plan.subject}</strong> - {plan.targetHours}h, {plan.targetLectures} lectures
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {plan.completed && (
                    <button 
                      className="btn" 
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: '12px',
                        background: '#34C759'
                      }}
                      onClick={() => saveCompletedTask(plan)}
                    >
                      💾 Save
                    </button>
                  )}
                  <button 
                    className="icon-btn" 
                    onClick={() => deletePlan(plan._id)}
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card large-card">
          <h3 style={{ marginBottom: '20px' }}>✓ To-Do List</h3>
          
          <form onSubmit={addTodo} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add a task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn">Add</button>
            </div>
          </form>

          <div>
            {todos.map(todo => (
              <div key={todo.id} className="todo-item">
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <div className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.text}
                </div>
                <button className="icon-btn" onClick={() => deleteTodo(todo.id)}>🗑️</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>📅 Calendar</h3>
          <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>🎯 GATE Countdown</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="date"
              className="form-input"
              value={gateDate ? gateDate.split('T')[0] : ''}
              onChange={(e) => setGateDate(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="btn" onClick={updateGateDate}>Set</button>
          </div>
          <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: '700', color: '#007AFF' }}>
            {getDaysLeft()} days left
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
