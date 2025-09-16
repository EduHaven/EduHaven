import { createContext, useContext, useEffect, useState } from "react";
import UseSocket from "../hooks/UseSocket.jsx";
import { jwtDecode } from "jwt-decode";
import { useUserProfile } from "./UserProfileContext.jsx";

const SocketContext = createContext();

const UseSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { token } = useUserProfile();
  useEffect(() => {
    const currentToken = token;
    if (!currentToken) return;
    const decoded = jwtDecode(currentToken);

    const userData = {
      token: currentToken,
      id: decoded.id,
      name: `${decoded.FirstName} ${decoded?.LastName ?? ""}`,
      profileImage: decoded.profileImage,
    };
    setUser(userData);
  }, [token]);

  const { socket, isConnected, onlineUsers } = UseSocket(user);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers, user }}>
      {children}
    </SocketContext.Provider>
  );
};
export default UseSocketContext;
