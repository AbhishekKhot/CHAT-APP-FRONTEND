import { useState } from "react";
import { Send, Search, FileText } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: {
    first_name: string;
    last_name: string;
    username: string;
    color: string;
    isOnline: boolean;
  };
  timestamp: string;
  attachment?: {
    name: string;
    size: string;
  };
  isOwn?: boolean;
}

const LetterAvatar = ({
  name,
  color,
  size = "medium",
}: {
  name: string;
  color: string;
  size?: "small" | "medium" | "large";
}) => {
  const letter = name.charAt(0).toUpperCase();
  const sizeClasses = {
    small: "w-8 h-8 text-sm",
    medium: "w-10 h-10 text-md",
    large: "w-12 h-12 text-lg",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-medium text-white ${color}`}
    >
      {letter}
    </div>
  );
};

const MessageInterface = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hey Olivia, Katherine sent me over the latest doc. I just have a quick question about the...",
      sender: {
        first_name: "Phoenix",
        last_name: "Baker",
        username: "@phoenix",
        color: "bg-blue-500",
        isOnline: true,
      },
      timestamp: "5min ago",
    },
    {
      id: "2",
      sender: {
        first_name: "Katherine",
        last_name: "Moss",
        username: "@kathy",
        color: "bg-green-500",
        isOnline: true,
      },
      content: "Tech requirements.pdf",
      timestamp: "Thursday 11:40am",
      attachment: {
        name: "Tech requirements.pdf",
        size: "1.2 MB",
      },
    },
    {
      id: "3",
      content: "Awesome! Thanks. I'll look at this today.",
      sender: {
        first_name: "You",
        last_name: "",
        username: "@you",
        color: "bg-blue-500",
        isOnline: true,
      },
      timestamp: "Thursday 11:41am",
      isOwn: true,
    },
  ]);
  const filteredMessages = selectedUser
    ? messages.filter(
        (message) =>
          message.sender.username === selectedUser ||
          (message.isOwn && message.sender.username === "@you")
      )
    : messages;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="w-72 border-r border-gray-200 bg-white hidden md:flex md:flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
   
          {messages.map((message) => (
            <div
              key={message.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150"
              onClick={() => setSelectedUser(message.sender.username)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <LetterAvatar
                    name={message.sender.first_name}
                    color={message.sender.color}
                  />
                  {message.sender.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {message.sender.first_name}
                    </p>
                    <p className="text-xs text-gray-500">{message.timestamp}</p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <LetterAvatar
                name="Katherine Moss"
                color="bg-blue-500"
                size="large"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {selectedUser ? selectedUser : "Select a user"}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isOwn ? "justify-end" : "justify-start"
              }`}
            >
              {!message.isOwn && (
                <div className="mr-3 flex-shrink-0">
                  <LetterAvatar
                    name={message.sender.first_name + message.sender.last_name}
                    color={message.sender.color}
                    size="small"
                  />
                </div>
              )}
              <div
                className={`max-w-md ${
                  message.isOwn ? "items-end" : "items-start"
                }`}
              >
                {!message.isOwn && (
                  <div className="flex items-center mb-1 space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {message.sender.first_name + message.sender.last_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp}
                    </span>
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 shadow-sm ${
                    message.isOwn
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  {message.content}
                  {message.attachment && (
                    <div className="mt-2 flex items-center space-x-3 bg-gray-50 p-2 rounded-lg">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <FileText className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {message.attachment.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {message.attachment.size}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Send a message"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inputValue.trim()}
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
