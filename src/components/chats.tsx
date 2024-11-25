import { useEffect, useState } from "react";
import { Send, Search, FileText } from "lucide-react";
import { useUser } from "../components/user-context";
import UserName from "./user-name";
import socketService from "../services/socket-service";
import axios from "axios";

interface User {
  username: string;
  phone_number: string;
  country_code: string;
}

interface Message {
  content: string;
  sender: User;
  receiver: User;
  timestamp: string;
}

const API_BASE_URL = process.env.API_BASE_URL || "http://0.0.0.0:9000/chat-app";

const MessageInterface = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { phoneNumber, countryCode } = useUser();

  const filteredMessages = selectedUser
    ? messages.filter(
        (message) =>
          (message.sender.phone_number === selectedUser.phone_number &&
            message.receiver.phone_number === phoneNumber) ||
          (message.receiver.phone_number === selectedUser.phone_number &&
            message.sender.phone_number === phoneNumber)
      )
    : [];

  useEffect(() => {
    socketService.connect(phoneNumber, countryCode);
    const socket = socketService.getSocket();

    if (socket) {
      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socket.on("message", (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      socketService.disconnect();
    };
  }, [phoneNumber, countryCode]);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length >= 2) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/users?phone_number=${searchQuery.trim()}`,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setSearchResults(response.data);
        } catch (error) {
          console.error("Error searching users:", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimeout = setTimeout(searchUsers, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleSendMessage = () => {
    if (!selectedUser || !inputValue.trim()) return;

    const messageData = {
      content: inputValue.trim(),
      sender: {
        phone_number: phoneNumber,
        country_code: countryCode,
        username: "You",
      },
      receiver: selectedUser,
      timestamp: new Date().toISOString(),
    };

    const socket = socketService.getSocket();
    if (socket) {
      socket.emit("PeerToPeerMessage", messageData);
      setMessages((prev) => [...prev, messageData]);
      setInputValue("");
    }
  };

  const renderUserItem = (user: User, isSelected: boolean) => (
    <div
      key={user.phone_number}
      className={`p-4 hover:bg-gray-50 cursor-pointer transition duration-150 ${
        isSelected ? "bg-gray-100" : ""
      }`}
      onClick={() => {
        setSelectedUser(user);
        setSearchQuery("");
        setSearchResults([]);
      }}
    >
      <div className="flex items-center space-x-3">
        <UserName name={user.username} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.username}
          </p>
          <p className="text-sm text-gray-500 truncate">{user.phone_number}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="w-72 border-r border-gray-200 bg-white hidden md:flex md:flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {searchQuery.length >= 2 ? (
            searchResults.length > 0 ? (
              searchResults.map((user) =>
                renderUserItem(
                  user,
                  user.phone_number === selectedUser?.phone_number
                )
              )
            ) : (
              <div className="p-4 text-center text-gray-500">
                No users found
              </div>
            )
          ) : (
            Array.from(
              new Set(
                messages.map((m) =>
                  m.sender.phone_number === phoneNumber ? m.receiver : m.sender
                )
              )
            ).map((user) =>
              renderUserItem(
                user,
                user.phone_number === selectedUser?.phone_number
              )
            )
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-white">
        {selectedUser ? (
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <UserName name={selectedUser.username} size="large" />
            <div className="ml-4">
              <h2 className="font-medium">{selectedUser.username}</h2>
              <p className="text-sm text-gray-500">
                {selectedUser.phone_number}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <h2 className="text-xl font-medium">Welcome to Chat</h2>
              <p className="mt-2">Select a contact to start messaging</p>
            </div>
          </div>
        )}
        {selectedUser && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {filteredMessages.map((message) => (
              <div
                key={message.timestamp}
                className={`flex ${
                  message.sender.phone_number === phoneNumber
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-md ${
                    message.sender.phone_number === phoneNumber
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-900 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{message.content}</span>
                    <span className="text-xs opacity-75 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={!selectedUser}
            >
              <FileText className="h-5 w-5 text-gray-500" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                placeholder={
                  selectedUser
                    ? "Type a message..."
                    : "Select a user to start chatting"
                }
                className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={!selectedUser}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!selectedUser || !inputValue.trim()}
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInterface;
