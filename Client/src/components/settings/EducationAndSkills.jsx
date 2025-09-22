import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useUserProfile } from "../../contexts/UserProfileContext";
import { Plus, X, Trash2 } from "lucide-react";
import UpdateButton from "./UpdateButton";
import { Button } from "@/components/ui/button";

function EducationAndSkills() {
  const { user, setUser, fetchUserDetails, isEduSkillsComplete } =
    useUserProfile();
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

    if (key === "skills") {
      setSkillsList([]);
    } else if (key === "interests") {
      setInterestsList([]);
    }
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

      const response = await axiosInstance.put(`/user/profile`, updateData);

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

      {!isEduSkillsComplete() && (
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Education Section */}
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-2">
            <div className="space-y-2">
              <label
                htmlFor="university"
                className="block text-md font-medium text-[var(--txt-dim)]"
              >
                University/Institution
              </label>
              <div className="relative">
                <input
                  id="university"
                  type="text"
                  name="University"
                  value={profileData.University}
                  onChange={handleInputChange}
                  placeholder="e.g., Harvard University"
                  className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all pr-10"
                  disabled={isLoading}
                />
                {profileData.University && (
                  <Button
                    type="button"
                    onClick={() => handleClearField("University")}
                    variant="transparent"
                    size="icon"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-dim)] hover:text-red-500 p-1"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="field-of-study"
                className="block text-md font-medium text-[var(--txt-dim)]"
              >
                Field of Study
              </label>
              <div className="relative">
                <input
                  id="field-of-study"
                  type="text"
                  name="FieldOfStudy"
                  value={profileData.FieldOfStudy}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science"
                  className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all pr-10"
                  disabled={isLoading}
                />
                {profileData.FieldOfStudy && (
                  <Button
                    type="button"
                    onClick={() => handleClearField("FieldOfStudy")}
                    variant="transparent"
                    size="icon"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-dim)] hover:text-red-500 p-1"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="graduation"
                className="block text-md font-medium text-[var(--txt-dim)]"
              >
                Graduation Year
              </label>
              <div className="relative">
                <input
                  id="graduation"
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
                  <Button
                    type="button"
                    onClick={() => handleClearField("GraduationYear")}
                    variant="transparent"
                    size="icon"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-dim)] hover:text-red-500 p-1"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="px-6 py-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="skills"
                className="block text-md font-medium text-[var(--txt-dim)]"
              >
                Skills
              </label>
              {profileData.OtherDetails.skills && (
                <Button
                  type="button"
                  onClick={() => handleClearOtherDetails("skills")}
                  variant="transparent"
                  className="text-[var(--txt-dim)] hover:text-red-500 flex items-center gap-1 text-sm"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {skillsList.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-[var(--bg-sec)] px-3 py-2 rounded-lg"
                >
                  <span className="text-[var(--txt)] text-sm">{skill}</span>
                  <Button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    variant="transparent"
                    size="icon"
                    className="text-[var(--txt-dim)] hover:text-red-500 p-1"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                id="skills"
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevent form submit
                    addSkill();
                  }
                }}
                placeholder="Add a skill"
                className="flex-1 px-4 py-2 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={addSkill}
                variant="default"
                className="px-4 py-2 rounded-lg flex items-center gap-2"
                disabled={isLoading || !newSkill.trim()}
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="px-6 py-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="interests"
                className="block text-md font-medium text-[var(--txt-dim)]"
              >
                Interests
              </label>
              {profileData.OtherDetails.interests && (
                <Button
                  type="button"
                  onClick={() => handleClearOtherDetails("interests")}
                  variant="transparent"
                  className="text-[var(--txt-dim)] hover:text-red-500 flex items-center gap-1 text-sm"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {interestsList.map((interest, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-[var(--bg-sec)] px-3 py-2 rounded-lg"
                >
                  <span className="text-[var(--txt)] text-sm">{interest}</span>
                  <Button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    variant="transparent"
                    size="icon"
                    className="text-[var(--txt-dim)] hover:text-red-500 p-1"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                id="interests"
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevent form submit
                    addInterest();
                  }
                }}
                placeholder="Add an interest"
                className="flex-1 px-4 py-2 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={addInterest}
                variant="default"
                className="px-4 py-2 rounded-lg flex items-center gap-2"
                disabled={isLoading || !newInterest.trim()}
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Notes Section */}
        <div className="px-6 py-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="notes"
                className="block text-md font-medium text-[var(--txt-dim)]"
              >
                Additional Notes
              </label>
              {profileData.OtherDetails.additionalNotes && (
                <Button
                  type="button"
                  onClick={() => handleClearOtherDetails("additionalNotes")}
                  variant="transparent"
                  className="text-[var(--txt-dim)] hover:text-red-500 flex items-center gap-1 text-sm"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
            <div className="relative">
              <textarea
                id="notes"
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
