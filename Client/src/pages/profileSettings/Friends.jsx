import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Menu  } from "lucide-react";
import axios from "axios";



const Friends = () => {
  
  const context = useOutletContext();
  const user = context.user;
  const socket = context.socket;
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendRequest,setFriendRequest]= useState([]);

  useEffect(() => {
    if (!user._id) {
      setIsLoading(false);
      return;
    }

    const fetchFriends = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:3000/user/${user._id}/friends`);
        setFriends(response.data.friends || []);
        
      } catch (err) {
        setError("Failed to fetch friends.");
        console.error("Error fetching friends:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [user._id]); // ✅ Only re-run when `user._id` changes.


  useEffect(()=>{
    try{
      socket.current.onmessage=(event)=>{
        console.log(event);
          const data=JSON.parse(event.data);
          
          if(data.type==="friend-request")
          { 
            setFriendRequest((prev)=>{
              return [...prev,[data.userId,data.userName]]
            })
          }
          else if(data.type==="cancel-request")
          {
            setFriendRequest(friendRequest.filter(item => item[0] !== data.userId));
          }

      };

    }catch(err)
    {
      console.error("Error Receiving Request:", err);
    }
  },[])

  if (isLoading) {
    return <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const handleRemoveFriend=async (friendId)=>{
    try{
      const response=await axios.post('http://localhost:3000/user/friend/remove',{
        userId:user._id,
        friendId:friendId
      })
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.friendId !== friendId)
      );
    }catch(error){
      console.error("Error deleting friend:", error);
    }
  }

  const requestAccepted=async (friendId,friendName)=>{
    try{
        
        const response=await axios.post('http://localhost:3000/user/friend/add',{
          userId:user._id,
          friendId:friendId
        })
        setFriendRequest(friendRequest.filter(item => item[0] !== friendId));
        setFriends((prev)=>[...prev,{friendId:friendId,friendName:friendName}]);

    }catch(err)
    {
      console.error("Error accepting request:", error);
    }
  }
  const requestRejected=async (friendId)=>{
    try{
      setFriendRequest((prevFriends) =>
        prevFriends.filter((friend) => friend[0] !== friendId)
      );
    }catch(err)
    {
      console.error("Error accepting request:", error);
    }
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Friends List</h2>
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            <Menu  
              size={16} 
              className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
            <span className="bg-purple-500 text-xs px-2 py-1 rounded-full">{friendRequest.length}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg z-10">
              <ul className="py-2">
                {friendRequest.map((name, index) => (
                  <li key={index} className="px-4 py-2 hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          {name[1]?.charAt(0)}
                        </div>
                        <span>{name[1]}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={()=> requestAccepted(name[0],name[1])} className="text-green-500 hover:text-green-400 text-sm">
                          Accept
                        </button>
                        <button onClick={()=> requestRejected(name[0],name[1])} className="text-red-500 hover:text-red-400 text-sm">
                          Decline
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {friends.length > 0 ? (
        <ul className="space-y-2">
          {friends.map((friend) => (
            <li key={friend.friendId} className="p-4 border rounded flex items-center justify-between">
            {/* Profile Icon (First Letter of Name) */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-purple-500 text-white font-bold rounded-full">
                {friend.friendName.charAt(0).toUpperCase()}
              </div>
              <span className="text-lg">{friend.friendName}</span>
            </div>
      
            {/* Remove Button */}
            <button
              onClick={() => handleRemoveFriend(friend.friendId)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </li>
          ))}
        </ul>
      ) : (
        <p>No friends found.</p>
      )}
    </div>
  );
};

export default Friends;
