import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import API from '../api/axios';
import { User, Mail, ShieldCheck, Camera, X, Upload } from 'lucide-react';

const Profile = () => {
  const { user, setTokenAndUser } = useAuthStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const updateAvatarMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      const res = await API.put('/auth/avatar', { avatar: avatarUrl });
      return res.data;
    },
    onSuccess: async () => {
      // Fetch updated user data
      try {
        const res = await API.get('/auth/me');
        // Get token from API headers since it's managed by axios
        const token = API.defaults.headers.common['Authorization']?.toString().replace('Bearer ', '');
        if (token && res.data.user) {
          setTokenAndUser(token, res.data.user);
        }
      } catch (error) {
        console.error('Failed to fetch updated user:', error);
      }
      setPreviewUrl(null);
      setUploadError(null);
    },
    onError: (error: any) => {
      setUploadError(error.response?.data?.message || 'Failed to upload photo. Please try again.');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setUploadError('File size must be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setUploadError(null);
      };
      reader.onerror = () => {
        setUploadError('Failed to read file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (previewUrl) {
      setIsUploading(true);
      try {
        await updateAvatarMutation.mutateAsync(previewUrl);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploading(true);
    try {
      await updateAvatarMutation.mutateAsync('');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Your Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your personal account details.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 border-t-slate-900 dark:border-t-slate-100">
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="relative group">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-2xl uppercase overflow-hidden">
              {user?.avatar || previewUrl ? (
                <img
                  src={previewUrl || user?.avatar}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.name?.[0] || user?.email?.[0] || 'U'
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-5 w-5 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{user?.name || 'User'}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Standard JobFlow Member</p>
            {previewUrl && (
              <div className="flex flex-col gap-2 mt-2">
                {uploadError && (
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-2 text-xs text-rose-800 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400">
                    {uploadError}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 disabled:opacity-50"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setUploadError(null);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {user?.avatar && !previewUrl && (
              <button
                onClick={handleRemoveAvatar}
                disabled={isUploading}
                className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
              >
                {isUploading ? 'Removing...' : 'Remove photo'}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 text-slate-400 dark:text-slate-500">
              <User className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">Full Name</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user?.name || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 text-slate-400 dark:text-slate-500">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">Email Address</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 text-slate-400 dark:text-slate-500">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">Account Status</p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                Verified Account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
