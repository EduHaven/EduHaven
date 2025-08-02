import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  User,
  MessageCircle,
  ThumbsUp,
  Edit3,
  Share2,
  UserPlus,
  Landmark,
  Earth,
  DraftingCompass,
  Puzzle,
} from "lucide-react";
import ProfileCard from "../components/stats/ProfileCard";
import MonthlyLevel from "../components/stats/MonthlyLevel";
import Achievements from "../components/stats/Achievements";
import Badges from "../components/stats/Badges";
import StudyStats from "../components/stats/StudyStats";
import Goals from "../components/stats/Goals";
import Leaderboard from "../components/stats/Leaderboard";
import { useParams } from "react-router-dom";
const backendUrl = import.meta.env.VITE_API_URL;

const UserStats = () => {

    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log("User ID from params:", userId);    

    useEffect(() => {
        const fetchUserProfile = async () => {

        if (!userId) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.get(
            `${backendUrl}/user/details?id=${userId}`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user profile:", error);
                setError("Failed to fetch user data.");
        } finally {
            setIsLoading(false);
        }
        };

        fetchUserProfile();
    }, [userId]);

    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-pulse">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 bg-gray-700 rounded-full mb-4">yggggu</div>
                        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
      return <div className="text-red-500 text-center">{error}</div>
    }

    return (
        <>
        <div className="m-6 ">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Anaylitics</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-400">Great! keep it up</span>
                </div>
            </div>
            {/* content */}
            <div className="flex flex-col lg:flex-row gap-6 w-full content-center">
                <div className="bg-gradient-to-br from-indigo-500/50 to-purple-500/5 rounded-3xl shadow-2xl pt-6 lg:w-[20%] min-w-72 h-fit relative overflow-hidden">
                    {/* nav */}
                    <div className=" flex justify-end gap-6 px-4">
                        <Link to={"/settings/"}>
                            <Edit3 className="h-6 w-6 text-gray-400 hover:text-white" />
                        </Link>
                    <Share2 className=" h-6 w-6 text-gray-400 hover:text-white" />
                </div>

                <div className="mx-4">
                    {/* Profile  */}
                    <div className="relative flex items-center mb-4 gap-4">
                        <div className="w-28 h-28 rounded-full shadow-lg overflow-hidden">
                            {user.ProfilePicture ? (
                                <img
                                    src={user.ProfilePicture}
                                    alt="Profile"
                                    className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-indigo-600/50 flex items-center justify-center">
                                    <User className="w-16 h-16 text-white/70" />
                                </div>
                            )}
                        </div>
                        <div className=" text-center flex-1">
                            <span className="block text-2xl font-bold">342</span>
                            <span className="text-sm text-white/70">Kudos</span>
                        </div>
                        <div className=" text-center flex-1">
                            <span className="block text-2xl font-bold">56</span>
                            <span className="text-sm text-white/70">Friends</span>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="text-white">
                        <h2 className="text-xl font-bold">
                            {user.FirstName} {user.LastName}
                        </h2>
                        {user?.Bio && (
                            <p className="text-white/80 mb-4 max-w-xs">{user.Bio}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 my-4">
                        <button className="bg-white/20 hover:bg-white/30 transition-colors text-white px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1">
                            <ThumbsUp className="w-5 h-5" />
                            <span>Kudos</span>
                        </button>
                        <button className="bg-white/20 hover:bg-white/30 transition-colors text-white px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1">
                            <MessageCircle className="w-5 h-5" />
                            <span>Chat</span>
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-6 py-2 h-10 rounded-lg flex items-center space-x-2 w-full sm:w-auto text-center flex-1 text-nowrap">
                            <UserPlus className="w-5 h-5" />
                            <span>Add friend</span>
                        </button>
                    </div>
                </div>

                {/* Additional Details */}
                <div className="bg-gray-500/20 rounded-3xl p-4 space-y-4">
                    {user.FieldOfStudy && (
                        <div className="flex items-center gap-4 text-white/80">
                            <Landmark className="h-7 w-7" />
                            <div>
                                <p className="text-xs">{user.University || "Field of Study"}</p>
                                <p className="text-lg">
                                    {user.FieldOfStudy}
                                    {", " + user.GraduationYear || ""}
                                </p>
                            </div>
                        </div>
                    )}

                    {user.OtherDetails?.skills && (
                        <div className="flex items-center gap-4 text-white/80">
                            <Puzzle className="h-7 w-7" />
                            <div>
                                <p className="text-xs">Skills</p>
                                <p className="text-lg">{user.OtherDetails.skills}</p>
                            </div>
                        </div>
                    )}
                    {user.OtherDetails?.interests && (
                        <div className="flex items-center gap-4 text-white/80">
                            <DraftingCompass className="h-7 w-7" />
                            <div>
                                <p className="text-xs">Interests</p>
                                <p className="text-lg">{user.OtherDetails.interests}</p>
                            </div>
                        </div>
                    )}
                    {user.Country && (
                        <div className="flex items-center gap-4 text-white/80">
                            <Earth className="h-7 w-7" />
                            <div>
                                <p className="text-xs">Country</p>
                                <p className="text-lg">{user.Country}</p>
                            </div>
                        </div>
                    )}
                    {user.OtherDetails?.additionalNotes && (
                        <div className="flex gap-3 text-white/80">
                            <span>{user.OtherDetails.additionalNotes}</span>
                        </div>
                    )}
                </div>
                </div>
                <div className="flex-1">
                    <div className="mb-6">
                        <StudyStats />
                    </div>
                    <div className="flex flex-col xl:flex-col 2xl:flex-row">
                        <div className="flex-1 mr-6">
                        <div className="flex gap-6 mb-6">
                            <MonthlyLevel />
                            <Badges />
                        </div>
                        <div className=" gap-6 mb-6 ">
                            <Goals />
                        </div>
                        </div>
                        <div>
                        <Achievements />
                        <Leaderboard />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}

export default UserStats;
