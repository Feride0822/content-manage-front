import React, { useState } from "react";
import { BiMessageRounded } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";
import { LuSend } from "react-icons/lu";

// mock data
const MOCK_MESSAGES = [
  {
    id: 101,
    chatId: 1,
    sender: "other",
    content: "helllo",
    time: "1 day ago",
    date: "1 day ago",
  },
  {
    id: 102,
    chatId: 1,
    sender: "me",
    content: "Abdul-Aziz?????",
    time: "1 day ago",
    date: "3 days ago",
  },
];
const MOCK_CHATS = [
  {
    id: 1,
    username: "kosimov",
    time: "1 day ago",
    preview: "kosimov: helllo",
    avatar: "https://placehold.co/40x40/508D69/FFFFFF?text=K",
    messages: MOCK_MESSAGES.filter((m) => m.chatId === 1),
  },
  {
    id: 2,
    username: "phantom_dev",
    time: "4 hours ago",
    preview: "I fixed that bug, check it out.",
    avatar: "https://placehold.co/40x40/1B4242/FFFFFF?text=P",
    messages: [],
  },
  {
    id: 3,
    username: "anon_reader",
    time: "2 mins ago",
    preview: "Have you seen the latest post?",
    avatar: "https://placehold.co/40x40/994D1C/FFFFFF?text=A",
    messages: [],
  },
];

// Message Bubble
const MessageBubble = ({ message, sender }) => {
  const isMe = sender === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl text-white shadow ${
          isMe
            ? "bg-indigo-600 rounded-br-none"
            : "bg-gray-700 text-white rounded-tl-none"
        }`}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
};

// Date Divider
const DateDivider = ({ date }) => (
  <div className="flex items-center justify-center my-4">
    <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full shadow-sm">
      {date}
    </span>
  </div>
);

const ChatListItem = ({ chat, isSelected, onClick }) => {
  return (
    <div
      className={`flex items-center p-3 cursor-pointer transition duration-150 ease-in-out ${
        isSelected
          ? "bg-indigo-50 border-r-4 border-indigo-500"
          : "hover:bg-gray-50"
      }`}
      onClick={() => onClick(chat.id)}
    >
      <img
        src={chat.avatar}
        alt={chat.username}
        className="w-10 h-10 rounded-full object-cover mr-3"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/40x40/508D69/FFFFFF?text=?";
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {chat.username}
          </p>
          <span className="text-xs text-gray-500 ml-2 flex shrink-0">
            {chat.time}
          </span>
        </div>
        <p className="text-xs text-gray-600 truncate">{chat.preview}</p>
      </div>
    </div>
  );
};

function Chat() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const selectedChat = MOCK_CHATS.find((c) => c.id === selectedChatId);

  // handles back button
  const handleBackClick = () => {
    setSelectedChatId(null);
  };
  // Function to handle chat selection
  const handleChatSelect = (id) => {
    setSelectedChatId(id);
  };

  const renderMessages = () => {
    if (!selectedChat || selectedChat.messages.length === 0) {
      return (
        <div className="text-center text-gray-400 mt-20">
          No messages in this chat. Say hello!
        </div>
      );
    }
    return (
      <>
        <DateDivider date="3 days ago" />
        <MessageBubble message={selectedChat.messages[1]} sender="me" />
        <DateDivider date="1 day ago" />
        <MessageBubble message={selectedChat.messages[0]} sender="other" />
      </>
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
      {/* sidebar */}
      <div
        className={`w-full sm:w-80 border-r border-gray-200 bg-white flex flex-col shrink-0 transition-all duration-300 ${
          selectedChatId !== null ? "hidden sm:flex" : "flex"
        }`}
      >
        {/* header of sidebar */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center">
            <BiMessageRounded className="w-6 h-6 text-gray-700 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          </div>
          <button className="flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg shadow-md hover:bg-gray-800 transition duration-150 ease-in-out cursor-pointer">
            <FaPlus className="w-5 h-5 mr-1" />
            New Chat
          </button>
        </div>

        {/* chat lists */}
        <div className="flex-1 overflow-y-auto">
          {MOCK_CHATS.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChatId === chat.id}
              onClick={setSelectedChatId}
            />
          ))}
        </div>
      </div>

      {/* Conversation view(right column) */}
      <div
        className={`flex-col flex-1 transition-all duration-300 ${
          selectedChatId === null ? "hidden sm:flex" : "flex"
        }`}
      >
        {/* if chat not selected */}
        {!selectedChatId && (
          <div className="text-center text-gray-500 p-8">
            <BiMessageRounded className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-xl font-medium mb-1">
              Select a conversation to start messaging
            </p>
            <p className="text-sm">or create a new chat</p>
          </div>
        )}

        {/* if chat is selected */}
        {selectedChatId && (
          <div className="flex flex-col h-full">
            {/* Conversation Header Placeholder */}
            <div className="flex items-center p-3 border-b border-gray-200 bg-white shadow-sm">
              {/* Back button visible only on mobile (when selectedChatId is true) */}
              <button
                onClick={handleBackClick}
                className="mr-2 p-1 rounded-full hover:bg-gray-100 text-gray-700 sm:hidden"
              >
                <FaArrowLeft className="w-7 h-7" />
              </button>
              <img
                src={selectedChat.avatar}
                alt={selectedChat.username}
                className="w-10 h-10 rounded-full object-cover mr-3"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/40x40/508D69/FFFFFF?text=?";
                }}
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedChat.username}
              </h3>
            </div>
            {/* Message Feed Placeholder */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-100/50">
              {renderMessages()}
            </div>
            {/* Input Area Placeholder */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button className="p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition duration-150 ease-in-out shadow">
                  <LuSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
