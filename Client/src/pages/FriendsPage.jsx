import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Users, UserPlus2, UserCheck, UserMinus } from "lucide-react";
import TabNavigation from "../components/friendsPage/TabNavigation";
import MainContent from "../components/friendsPage/MainContent";

const backendUrl = import.meta.env.VITE_API_URL;

function FriendsPage() {
  const [selectedTab, setSelectedTab] = useState("suggested");
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const sendRequest = async (friendId) => {
    try {
      await axios.post(`${backendUrl}/friends/request/${friendId}`, null, getAuthHeader());
      setSuggestedFriends((prev) =>
        prev.map((u) => (u._id === friendId ? { ...u, requestSent: true } : u))
      );
      toast.success("Friend request sent!");
    } catch (error) {
      toast.error("Error sending friend request!");
    }
  };

  const cancelRequest = async (friendId) => {
    try {
      await axios.delete(`${backendUrl}/friends/sent-requests/${friendId}`, getAuthHeader());
      setSentRequests((prev) => prev.filter((r) => r._id !== friendId));
      toast.info("Friend request canceled.");
    } catch (error) {
      toast.error("Error canceling friend request!");
    }
  };

  const rejectRequest = async (friendId) => {
    try {
      await axios.delete(`${backendUrl}/friends/reject/${friendId}`, getAuthHeader());
      setFriendRequests((prev) => prev.filter((r) => r._id !== friendId));
      toast.error("Friend request rejected.");
    } catch (error) {
      toast.error("Error rejecting friend request!");
    }
  };

  const acceptRequest = async (friendId) => {
    try {
      await axios.post(`${backendUrl}/friends/accept/${friendId}`, null, getAuthHeader());
      const acceptedUser = friendRequests.find((u) => u._id === friendId);
      setFriendRequests((prev) => prev.filter((r) => r._id !== friendId));
      setAllFriends((prev) => [...prev, acceptedUser]);
      toast.success("Friend request accepted!");
    } catch (error) {
      toast.error("Error accepting friend request!");
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await axios.delete(`${backendUrl}/friends/${friendId}`, getAuthHeader());
      setAllFriends((prev) => prev.filter((f) => f._id !== friendId));
      toast.success("Friend removed!");
    } catch (error) {
      toast.error("Error removing friend!");
    }
  };

  const fetchData = (tab) => {
    setLoading(true);
    let endpoint = "";
    switch (tab) {
      case "suggested":
        endpoint = "/friends/friend-suggestions";
        break;
      case "friendRequests":
        endpoint = "/friends/requests";
        break;
      case "sentRequests":
        endpoint = "/friends/sent-requests";
        break;
      case "allFriends":
        endpoint = "/friends";
        break;
      default:
        break;
    }

    axios
      .get(`${backendUrl}${endpoint}`, getAuthHeader())
      .then((res) => {
        // Sort users by createdAt date, newest first
        const sortedData = res.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        switch (tab) {
          case "suggested":
            setSuggestedFriends(sortedData);
            break;
          case "friendRequests":
            setFriendRequests(sortedData);
            break;
          case "sentRequests":
            setSentRequests(sortedData);
            break;
          case "allFriends":
            setAllFriends(sortedData);
            break;
          default:
            break;
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(selectedTab);
  }, [selectedTab]);

  const getDataForTab = () => {
    switch (selectedTab) {
      case "suggested":
        return suggestedFriends;
      case "friendRequests":
        return friendRequests;
      case "sentRequests":
        return sentRequests;
      case "allFriends":
        return allFriends;
      default:
        return [];
    }
  };

  return (
    <div className="flex">
      <TabNavigation selectedTab={selectedTab} onTabClick={setSelectedTab} />
      <MainContent
        selectedTab={selectedTab}
        loading={loading}
        users={getDataForTab()}
        onSendRequest={sendRequest}
        onCancelRequest={cancelRequest}
        onAcceptRequest={acceptRequest}
        onRejectRequest={rejectRequest}
        onRemoveFriend={removeFriend}
      />
    </div>
  );
}

export default FriendsPage;
