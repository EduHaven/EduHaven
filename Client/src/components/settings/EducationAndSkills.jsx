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
  }, [user]);

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

  const clearField = (fieldName) => {
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
      const updateData = {
        ...Object.fromEntries(
          Object.entries(profileData).filter(([_, v]) => v !== "" && v !== null)
        ),
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
              <div className="flex justify-between items-center">
                <label className="block text-md font-medium text-[var(--txt-dim)]">
                  University/Institution
                </label>
                {profileData.University && (
                  <button
                    type="button"
                    onClick={() => clearField('University')}
                    className="text-red-500 hover:text-red-700 transition-colors p-1 rounded"
                    title="Clear University"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                type="text"
                name="University"
                value={profileData.University}
                onChange={handleInputChange}
                placeholder="e.g., Harvard University"
                className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-md font-medium text-[var(--txt-dim)]">
                  Field of Study
                </label>
                {profileData.FieldOfStudy && (
                  <button
                    type="button"
                    onClick={() => clearField('FieldOfStudy')}
                    className="text-red-500 hover:text-red-700 transition-colors p-1 rounded"
                    title="Clear Field of Study"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                type="text"
                name="FieldOfStudy"
                value={profileData.FieldOfStudy}
                onChange={handleInputChange}
                placeholder="e.g., Computer Science"
                className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex justify-between items-center">
                <label className="block text-md font-medium text-[var(--txt-dim)]">
                  Graduation Year
                </label>
                {profileData.GraduationYear && (
                  <button
                    type="button"
                    onClick={() => clearField('GraduationYear')}
                    className="text-red-500 hover:text-red-700 transition-colors p-1 rounded"
                    title="Clear Graduation Year"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                type="number"
                name="GraduationYear"
                value={profileData.GraduationYear}
                onChange={handleInputChange}
                placeholder="e.g., 2026"
                min="1900"
                max="2100"
                className="w-full md:w-64 px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-2 p-6 py-2">
          <label className="block text-md font-medium text-[var(--txt-dim)]">
            Skills & Expertise
          </label>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g., JavaScript, Design, Marketing)"
                className="flex-1 px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkill())
                }
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-sec hover:bg-[var(--btn-hover)] px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-[var(--bg-sec)] text-[var(--txt)] rounded-full text-sm border border-gray-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-[var(--txt-dim)] hover:text-red-500 transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="space-y-2 p-6 py-2">
          <label className="block text-md font-medium text-[var(--txt-dim)]">
            Interests & Hobbies
          </label>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest (e.g., Photography, Travel, Gaming)"
                className="flex-1 px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addInterest())
                }
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={addInterest}
                className="bg-sec hover:bg-[var(--btn-hover)] px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {interestsList.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-[var(--btn)] to-[var(--btn-hover)] rounded-full text-sm"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="ml-2 hover:text-red-200 transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Notes Section */}
        <div className="space-y-2 p-6 py-2">
          <div className="flex justify-between items-center">
            <label className="block text-md font-medium text-[var(--txt-dim)]">
              Additional Information
            </label>
            {profileData.OtherDetails.additionalNotes && (
              <button
                type="button"
                onClick={() => handleOtherDetailsChange("additionalNotes", "")}
                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded"
                title="Clear Additional Information"
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <textarea
            value={profileData.OtherDetails.additionalNotes || ""}
            onChange={(e) =>
              handleOtherDetailsChange("additionalNotes", e.target.value)
            }
            placeholder="Any additional information about your education, certifications, achievements, or goals..."
            className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all resize-none"
            rows="4"
            maxLength="500"
            disabled={isLoading}
          />
          <div className="ml-auto w-fit text-xs text-[var(--txt-dim)]">
            <span>
              {(profileData.OtherDetails.additionalNotes || "").length}/500
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <UpdateButton
            label="Update Profile"
            isLoading={isLoading}
            isDisabled={!hasChanged}
          />
        </div>
      </form>
    </div>
  );
}

export default EducationAndSkills;
