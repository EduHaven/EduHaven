import { useEffect, useRef, useState, useCallback } from "react";
import axiosInstance from "@/utils/axios";
import { jwtDecode } from "jwt-decode";
import { useUserProfile } from "../../contexts/UserProfileContext";
import { Camera, User, Trash2, CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react";
import UpdateButton from "./UpdateButton";
import { CropModal } from "../CropModal";
import { Button } from "@/components/ui/button";

// Toast System Components
const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    iconBg: '#22c55e'
  },
  error: {
    icon: XCircle,
    iconBg: '#ef4444'
  },
  warning: {
    icon: AlertCircle,
    iconBg: '#f59e0b'
  },
  info: {
    icon: Info,
    iconBg: '#3b82f6'
  }
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const toastConfig = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
  const IconComponent = toastConfig.icon;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 350);
  };

  return (
    <div
      className={`
        relative overflow-hidden
        transform transition-all duration-350
        ${isVisible && !isExiting 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'}
        ${isExiting ? 'translate-x-full opacity-0 scale-90' : ''}
      `}
      style={{
        background: 'var(--bg-ter)',
        borderRadius: '20px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)',
        minWidth: '350px',
        maxWidth: '400px',
        animationTimingFunction: isVisible && !isExiting ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'ease-out'
      }}
    >      
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex-shrink-0">
          <div 
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: toastConfig.iconBg }}
          >
            <IconComponent className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[15px] leading-relaxed" style={{ color: 'var(--txt)' }}>
            {toast.message}
          </div>
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 hover:scale-105"
          style={{ color: '#9ca3af' }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Toast Container
const ToastContainer = ({ toasts, onRemove, position = 'top-right' }) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-6 left-6';
      case 'top-center':
        return 'top-6 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-6 right-6';
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-center':
        return 'bottom-6 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-6 right-6';
      default:
        return 'top-6 right-6';
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes bounceInRight {
          0% {
            transform: translateX(100%) scale(0.95);
            opacity: 0;
          }
          60% {
            transform: translateX(-10px) scale(1.02);
            opacity: 0.8;
          }
          80% {
            transform: translateX(5px) scale(0.98);
            opacity: 0.9;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes bounceOutRight {
          0% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          20% {
            transform: translateX(-10px) scale(1.02);
            opacity: 0.9;
          }
          100% {
            transform: translateX(100%) scale(0.90);
            opacity: 0;
          }
        }
      `}</style>
      <div className={`fixed z-50 ${getPositionClasses()} max-w-sm w-full pointer-events-none`}>
        <div className="space-y-3 pointer-events-auto">
          {toasts.map((toast, index) => (
            <div
              key={toast.id}
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              <Toast toast={toast} onRemove={onRemove} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// Toast Hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message, options = {}) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = {
      id,
      message,
      type: options.type || 'info',
      title: options.title,
      duration: options.duration !== undefined ? options.duration : 5000,
      ...options
    };

    setToasts(prev => [...prev, toast]);
    return id;
  }, []);

  const toast = {
    success: (message, options) => addToast(message, { ...options, type: 'success' }),
    error: (message, options) => addToast(message, { ...options, type: 'error' }),
    warning: (message, options) => addToast(message, { ...options, type: 'warning' }),
    info: (message, options) => addToast(message, { ...options, type: 'info' }),
    remove: removeToast,
    clear: () => setToasts([])
  };

  return { toast, toasts, removeToast };
};

export default function BasicInfo() {
  const { user, setUser, fetchUserDetails, isBasicInfoComplete } =
    useUserProfile();
  const [profileData, setProfileData] = useState({
    Username: "",
    FirstName: "",
    LastName: "",
    ProfilePicture: null,
    Bio: "",
    Country: "",
    Gender: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isProfilePicLoading, setIsProfilePicLoading] = useState(false);
  const [isProfileUpdateLoading, setIsProfileUpdateLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [initialProfileData, setInitialProfileData] = useState(null);
  const [hasChanged, setHasChanged] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Custom Toast Hook
  const { toast, toasts, removeToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);

        if (!user) {
          fetchUserDetails(decoded.id);
        } else if (!initialProfileData) {
          const userData = {
            Username: user.Username || "",
            FirstName: user.FirstName || "",
            LastName: user.LastName || "",
            ProfilePicture: user.ProfilePicture || null,
            Bio: user.Bio || "",
            Country: user.Country || "",
            Gender: user.Gender || "",
          };
          setProfileData(userData);
          setInitialProfileData(userData);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [user, fetchUserDetails, initialProfileData]);

  useEffect(() => {
    if (!initialProfileData) return;

    const isChanged =
      Object.keys(profileData).some(
        (key) => profileData[key] !== initialProfileData[key]
      ) || profilePic !== null;

    setHasChanged(isChanged);
  }, [profileData, profilePic, initialProfileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearField = (fieldName) => {
    setProfileData((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropDone = (croppedImageFile) => {
    setProfilePic(croppedImageFile);
    setProfileData((prev) => ({
      ...prev,
      ProfilePicture: URL.createObjectURL(croppedImageFile),
    }));
  };

  const uploadProfilePicture = async () => {
    if (!profilePic) {
      toast.error("No image selected");
      return null;
    }

    setIsProfilePicLoading(true);
    const formData = new FormData();

    formData.append("profilePicture", profilePic);

    try {
      const response = await axiosInstance.post(
        `/user/upload-profile-picture`,
        formData
      );

      return response.data.profilePictureUrl;
    } catch (error) {
      console.error("Profile picture upload error:", error);
      toast.error(
        error.response?.data?.error || "Failed to upload profile picture"
      );
      return null;
    } finally {
      setIsProfilePicLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    setIsProfileUpdateLoading(true);
    try {
      let profilePictureUrl = profileData.ProfilePicture;
      if (profilePic) {
        const uploadedUrl = await uploadProfilePicture();
        if (uploadedUrl) {
          profilePictureUrl = uploadedUrl;
        } else {
          return;
        }
      }

      // Send all fields including empty ones to allow clearing
      const updateData = {
        ...profileData,
        ProfilePicture: profilePictureUrl,
      };

      const response = await axiosInstance.put(`/user/profile`, updateData);

      toast.success("Profile updated successfully");
      setProfileData(response.data);
      setUser(response.data);
      setInitialProfileData(response.data);
      setProfilePic(null);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setIsProfileUpdateLoading(false);
      setHasChanged(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto ">
      <CropModal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        imageSrc={selectedImage}
        onCropDone={handleCropDone}
      />
      <h1 className="text-2xl pb-4 font-semibold text-[var(--txt)] mb-2">
        Basic Information
      </h1>

      {!isBasicInfoComplete() && (
        <div className="mb-4 px-6 py-3 rounded-xl bg-[var(--bg-sec)] border border-yellow-400/50 shadow-lg flex items-center gap-3">
          <span className="text-yellow-400 text-lg">🏅</span>
          <p className="text-[var(--txt)] text-sm font-medium">
            Complete your profile to{" "}
            <span className="text-[var(--btn)] font-semibold">
              earn a badge!
            </span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Picture Section */}
        <div className="rounded-2xl px-6">
          <div className="flex items-center px-4 gap-14">
            <input
              id="profile-pic"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleProfilePicChange}
              className="hidden"
              disabled={isProfilePicLoading || isProfileUpdateLoading}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
            >
              <div className="w-h-32 h-32 rounded-full overflow-hidden border-2 border-[var(--bg-primary)] shadow-lg">
                {profileData.ProfilePicture ? (
                  <img
                    src={profileData.ProfilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="aspect-square w-full h-full flex items-center justify-center bg-[var(--bg-sec)]">
                    <User className="w-14 h-14 text-[var(--txt-dim)]" />
                  </div>
                )}
              </div>

              <div className="absolute rounded-full inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>

              {isProfilePicLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
              className="bg-sec hover:bg-[var(--btn-hover)] hover:text-white px-4 py-2 rounded-lg shadow-sm"
              disabled={isProfilePicLoading || isProfileUpdateLoading}
            >
              Change image
            </Button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-2">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-md font-medium text-[var(--txt-dim)]"
            >
              Username *
            </label>
            <input
              id="username"
              type="text"
              name="Username"
              value={profileData.Username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all"
              required
              disabled={isProfileUpdateLoading}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="first-name"
              className="block text-md font-medium text-[var(--txt-dim)]"
            >
              First Name *
            </label>
            <input
              id="first-name"
              type="text"
              name="FirstName"
              value={profileData.FirstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all"
              required
              disabled={isProfileUpdateLoading}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="last-name"
              className="block text-md font-medium text-[var(--txt-dim)]"
            >
              Last Name *
            </label>
            <input
              id="last-name"
              type="text"
              name="LastName"
              value={profileData.LastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all"
              required
              disabled={isProfileUpdateLoading}
            />
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-2 p-6 py-2">
          <label
            htmlFor="bio"
            className="block text-md font-medium text-[var(--txt-dim)]"
          >
            Bio
          </label>
          <div className="relative">
            <textarea
              id="bio"
              name="Bio"
              value={profileData.Bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself, your interests, and what makes you unique..."
              className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all resize-none pr-10"
              rows="4"
              maxLength="500"
              disabled={isProfileUpdateLoading}
            />
            {profileData.Bio && (
              <Button
                type="button"
                onClick={() => handleClearField("Bio")}
                variant="transparent"
                size="icon"
                className="absolute right-3 top-3 text-[var(--txt-dim)] hover:text-red-500 p-1"
                disabled={isProfileUpdateLoading}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <div className="ml-auto w-fit text-xs text-[var(--txt-dim)]">
              <span>{profileData.Bio.length}/500</span>
            </div>
          </div>
        </div>

        {/* Location & Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 py-2">
          <div className="space-y-2">
            <label
              htmlFor="country"
              className="block text-md font-medium text-[var(--txt-dim)]"
            >
              Country
            </label>
            <div className="relative">
              <input
                id="country"
                type="text"
                name="Country"
                value={profileData.Country}
                onChange={handleInputChange}
                placeholder="Select your country"
                className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all pr-10"
                disabled={isProfileUpdateLoading}
              />
              {profileData.Country && (
                <Button
                  type="button"
                  onClick={() => handleClearField("Country")}
                  variant="transparent"
                  size="icon"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-dim)] hover:text-red-500 p-1"
                  disabled={isProfileUpdateLoading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="gender"
              className="block text-md font-medium text-[var(--txt-dim)]"
            >
              Gender
            </label>
            <div className="relative">
              <select
                id="gender"
                name="Gender"
                value={profileData.Gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all pr-10"
                disabled={isProfileUpdateLoading}
              >
                <option value="" disabled hidden>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <UpdateButton
            label="Update Profile"
            isLoading={isProfileUpdateLoading}
            isDisabled={!hasChanged}
          />
        </div>
      </form>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} position="top-right" />
    </div>
  );
}
