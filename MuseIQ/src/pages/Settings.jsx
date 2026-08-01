import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import userService from '../services/userService';
import { Camera, User as UserIcon, Save, Loader2 } from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('error', 'Image size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let newAvatarUrl = user?.avatarUrl;
      
      // Upload avatar if changed
      if (selectedFile) {
        const uploadResponse = await userService.uploadAvatar(selectedFile);
        newAvatarUrl = uploadResponse.avatarUrl;
      }
      
      // Update profile if name changed
      if (name !== user?.name) {
        await userService.updateProfile({ name });
      }
      
      // Update global state
      updateUser({
        name,
        avatarUrl: newAvatarUrl
      });
      
      showToast('success', 'Profile updated successfully!');
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-text-primary mb-2">Profile Settings</h2>
        <p className="text-text-secondary">Update your personal information and avatar.</p>
      </div>

      <div className="bg-bg-secondary border border-border rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Avatar Upload */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div 
              className="relative w-32 h-32 rounded-full overflow-hidden bg-bg-primary border-4 border-bg-secondary shadow-lg cursor-pointer group"
              onClick={handleImageClick}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-secondary bg-primary">
                  <span className="text-4xl text-white font-bold">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white mb-1" />
                <span className="text-white text-xs font-medium">Change</span>
              </div>
            </div>
            
            <div className="flex flex-col justify-center text-center sm:text-left space-y-2 mt-2 sm:mt-4">
              <h3 className="text-lg font-medium text-text-primary">Profile Picture</h3>
              <p className="text-sm text-text-secondary max-w-sm">
                Upload a new avatar. Recommended size is 256x256px. Maximum file size is 5MB.
              </p>
              <div>
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="mt-2 text-sm text-primary hover:text-white transition-colors"
                >
                  Browse files...
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="border-t border-border pt-6 mt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Display Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-bg-primary text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Your Name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="block w-full px-3 py-2 border border-border rounded-md leading-5 bg-bg-secondary text-text-secondary cursor-not-allowed sm:text-sm"
                />
                <p className="mt-1 text-xs text-text-secondary">Email address cannot be changed.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving || (!selectedFile && name === user?.name)}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="-ml-1 mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
