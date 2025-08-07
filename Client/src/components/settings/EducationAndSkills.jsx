import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useUserProfile } from "../../contexts/UserProfileContext";
import { Plus, X, Trash2 } from "lucide-react";
import UpdateButton from "./UpdateButton";
const backendUrl = import.meta.env.VITE_API_URL;

function EducationAndSkills() {
  const { user, setUser, fetchUserDetails } = useUserProfile();
  const [profileData, setProfileData] = useState({
    University: "",
    FieldOfStudy: "",
    GraduationYear: "",
    OtherDetails: {
      interests: "",
      skills: "",
      additionalNotes: "",
    },
  });
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [skillsList, setSkillsList] = useState([]);
  const [interestsList, setInterestsList] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [initialData, setInitialData] = useState(null);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);

        if (!user) {
          fetchUserDetails(decoded.id);
        } else {
          const initial = {
            University: user.University || "",
            FieldOfStudy: user.FieldOfStudy || "",
            GraduationYear: user.GraduationYear || "",
            OtherDetails: user.OtherDetails || {
              interests: "",
              skills: "",
              additionalNotes: "",
            },
          };
          setInitialData(initial);
          setProfileData(initial);

          // Parse skills and interests into arrays
          if (user.OtherDetails?.skills) {
            setSkillsList(
              user.OtherDetails.skills
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s)
            );
          }
          if (user.OtherDetails?.interests) {
            setInterestsList(
              user.OtherDetails.interests
                .split(",")
                .map((i) => i.trim())
                .filter((i) => i)
            );
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [user, fetchUserDetails]);

  useEffect(() => {
    if (!initialData) return;

    const isEqual = JSON.stringify(profileData) === JSON.stringify(initialData);
    setHasChanged(!isEqual);
  }, [profileData, initialData]);

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

  const handleOtherDetailsChange = (key, value) => {
    setProfileData((prev) => ({
      ...prev,
      OtherDetails: {
        ...prev.OtherDetails,
        [key]: value,
      },
    }));
  };

  const handleClearOtherDetails = (key) => {
    setProfileData((prev) => ({
      ...prev,
      OtherDetails: {
        ...prev.OtherDetails,
        [key]: "",
      },
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      const updatedSkills = [...skillsList, newSkill.trim()];
      setSkillsList(updatedSkills);
      handleOtherDetailsChange("skills", updatedSkills.join(", "));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = skillsList.filter((skill) => skill !== skillToRemove);
    setSkillsList(updatedSkills);
    handleOtherDetailsChange("skills", updatedSkills.join(", "));
  };

  const addInterest = () => {
    if (newInterest.trim() && !interestsList.includes(newInterest.trim())) {
      const updatedInterests = [...interestsList, newInterest.trim()];
      setInterestsList(updatedInterests);
      handleOtherDetailsChange("interests", updatedInterests.join(", "));
      setNewInterest("");
    }
  };

  const removeInterest = (interestToRemove) => {
    const updatedInterests = interestsList.filter(
      (interest) => interest !== interestToRemove
    );
    setInterestsList(updatedInterests);
    handleOtherDetailsChange("interests", updatedInterests.join(", "));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      // Send all fields including empty ones to allow clearing
      const updateData = {
        ...profileData,
      };

      const response = await axios.put(
        `${backendUrl}/user/profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Education & Skills updated successfully");
      setUser(response.data);
      setInitialData(response.data);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setIsLoading(false);
      setHasChanged(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl pb-4 font-semibold text-[var(--txt)] mb-2">
        Education & Skills
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Education Section */}
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-2">
            <div className="space-y-2">
              <label className="block text-md font-medium text-[var(--txt-dim)]">
                University/Institution
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="University"
                  value={profileData.University}
                  onChange={handleInputChange}
                  placeholder="e.g., Harvard University"
                  className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all pr-10"
                  disabled={isLoading}
                />
                {profileData.University && (
                  <button
                    type="button"
                    onClick={() => handleClearField("University")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-dim)] hover:text-red-500 transition-colors"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-md font-medium text-[var(--txt-dim)]">
                Field of Study
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="FieldOfStudy"
                  value={profileData.FieldOfStudy}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science"
                  className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all pr-10"
                  disabled={isLoading}
                />
                {profileData.FieldOfStudy && (
                  <button
                    type="button"
                    onClick={() => handleClearField("FieldOfStudy")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-dim)] hover:text-red-500 transition-colors"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-md font-medium text-[var(--txt-dim)]">
                Graduation Year
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="GraduationYear"
                  value={profileData.GraduationYear}
                  onChange={handleInputChange}
                  placeholder="e.g., 2024"
                  min="1900"
                  max={new Date().getFullYear() + 10}
                  className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all pr-10"
                  disabled={isLoading}
                />
                {profileData.GraduationYear && (
                  <button
                    type="button"
                    onClick={() => handleClearField("GraduationYear")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-dim)] hover:text-red-500 transition-colors"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="px-6 py-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-md font-medium text-[var(--txt-dim)]">
                Skills
              </label>
              {profileData.OtherDetails.skills && (
                <button
                  type="button"
                  onClick={() => handleClearOtherDetails("skills")}
                  className="text-[var(--txt-dim)] hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {skillsList.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-[var(--bg-sec)] px-3 py-2 rounded-lg"
                >
                  <span className="text-[var(--txt)] text-sm">{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-[var(--txt-dim)] hover:text-red-500 transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1 px-4 py-2 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-[var(--btn)] hover:bg-[var(--btn-hover)] text-white rounded-lg transition-colors flex items-center gap-2"
                disabled={isLoading || !newSkill.trim()}
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="px-6 py-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-md font-medium text-[var(--txt-dim)]">
                Interests
              </label>
              {profileData.OtherDetails.interests && (
                <button
                  type="button"
                  onClick={() => handleClearOtherDetails("interests")}
                  className="text-[var(--txt-dim)] hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {interestsList.map((interest, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-[var(--bg-sec)] px-3 py-2 rounded-lg"
                >
                  <span className="text-[var(--txt)] text-sm">{interest}</span>
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="text-[var(--txt-dim)] hover:text-red-500 transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest"
                className="flex-1 px-4 py-2 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-4 py-2 bg-[var(--btn)] hover:bg-[var(--btn-hover)] text-white rounded-lg transition-colors flex items-center gap-2"
                disabled={isLoading || !newInterest.trim()}
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Additional Notes Section */}
        <div className="px-6 py-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-md font-medium text-[var(--txt-dim)]">
                Additional Notes
              </label>
              {profileData.OtherDetails.additionalNotes && (
                <button
                  type="button"
                  onClick={() => handleClearOtherDetails("additionalNotes")}
                  className="text-[var(--txt-dim)] hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
            <div className="relative">
              <textarea
                value={profileData.OtherDetails.additionalNotes}
                onChange={(e) =>
                  handleOtherDetailsChange("additionalNotes", e.target.value)
                }
                placeholder="Any additional information about your education, achievements, or goals..."
                className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all resize-none"
                rows="4"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <UpdateButton
            label="Update Education & Skills"
            isLoading={isLoading}
            isDisabled={!hasChanged}
          />
        </div>
      </form>
    </div>
  );
}

export default EducationAndSkills;
