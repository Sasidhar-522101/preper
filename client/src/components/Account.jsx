import React, { useState } from 'react';
import axios from 'axios';

const Account = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/auth/profile', formData);
      setUser(response.data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('New passwords do not match');
      setTimeout(() => setPasswordMessage(''), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters long');
      setTimeout(() => setPasswordMessage(''), 3000);
      return;
    }

    try {
      await axios.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMessage('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (error) {
      setPasswordMessage(error.response?.data?.message || 'Error updating password');
      setTimeout(() => setPasswordMessage(''), 3000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordFieldChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const compressImage = (file, maxWidth = 400, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    
    try {
      // Compress image before upload
      const compressedFile = await compressImage(file);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result;
        
        try {
          const response = await axios.put('/auth/profile', {
            ...formData,
            profilePic: base64
          });
          setUser(response.data);
          setMessage('Profile picture updated successfully!');
          setTimeout(() => setMessage(''), 3000);
        } catch (error) {
          console.error('Upload error:', error);
          if (error.response?.status === 413) {
            setMessage('Image too large. Please choose a smaller image.');
          } else {
            setMessage('Error uploading profile picture');
          }
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      setMessage('Error processing image');
      setUploading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>👤 Account</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '1000px' }}>
        {/* Profile Settings */}
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Profile Settings</h3>
          
          <form onSubmit={handleSubmit}>
            {/* Profile Picture Upload */}
            <div className="form-group">
              <label className="form-label">Profile Picture</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <div className="profile-pic" style={{ width: '80px', height: '80px', fontSize: '24px' }}>
                  {user?.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    formData.username?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="profile-upload"
                    disabled={uploading}
                  />
                  <label 
                    htmlFor="profile-upload" 
                    className="btn" 
                    style={{ 
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      opacity: uploading ? 0.6 : 1,
                      display: 'inline-block'
                    }}
                  >
                    {uploading ? 'Uploading...' : 'Choose Photo'}
                  </label>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    JPG, PNG only. Image will be automatically resized.
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            {message && (
              <div style={{ 
                color: message.includes('success') ? '#34C759' : '#FF3B30', 
                marginBottom: '16px', 
                textAlign: 'center',
                fontWeight: '600'
              }}>
                {message}
              </div>
            )}
            
            <button type="submit" className="btn" style={{ width: '100%' }}>
              Update Profile
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Change Password</h3>
          
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="form-input"
                value={passwordData.currentPassword}
                onChange={handlePasswordFieldChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="form-input"
                value={passwordData.newPassword}
                onChange={handlePasswordFieldChange}
                required
                minLength="6"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={passwordData.confirmPassword}
                onChange={handlePasswordFieldChange}
                required
                minLength="6"
              />
            </div>
            
            {passwordMessage && (
              <div style={{ 
                color: passwordMessage.includes('success') ? '#34C759' : '#FF3B30', 
                marginBottom: '16px', 
                textAlign: 'center',
                fontWeight: '600'
              }}>
                {passwordMessage}
              </div>
            )}
            
            <button type="submit" className="btn" style={{ width: '100%' }}>
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
