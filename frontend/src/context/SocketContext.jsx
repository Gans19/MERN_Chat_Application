import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
		

			const socket = io("https://real-chat-p248.onrender.com", {
				query: {
					userId: authUser._id,
				},
			});

			setSocket(socket);

			// socket.on() is used to listen to the events. can be used both on client and server side
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
				console.log("🚀 ~ socket.on ~ users:", users)
			});

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
			console.log("🚀 ~ useEffect ~ socket:", socket)
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
