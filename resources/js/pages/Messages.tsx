import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { type BreadcrumbItem } from '@/types';
import axios from 'axios';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Message type definition
interface Message {
  message_id: number;
  sender_id: number;
  receiver_id: number;
  message_text: string;
  is_read: boolean;
  created_at: string;
}

// User type definition
interface User {
  id: number;
  name: string;
  email: string;
  user_role: string;
}

// Props from Inertia
interface MessagesProps {
  users: User[];
  messages?: Message[];
  selectedUser?: User | null;
}

export default function Messages({ users, messages: initialMessages, selectedUser: initialSelectedUser }: MessagesProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(initialSelectedUser || null);
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [newMessage, setNewMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<User[]>(users);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults(users);
    } else {
      const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredUsers);
    }
  }, [searchTerm, users]);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  // Fetch messages for the selected user
  const fetchMessages = async (userId: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/messages/${userId}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        }
      });
      console.log('API Response:', response.data);

      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
      } else {
        console.error('No messages found in response:', response.data);
        setMessages([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setIsLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newMessage.trim()) return;

    try {
      const response = await axios.post('/messages', {
        receiver_id: selectedUser.id,
        message_text: newMessage,
      }, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        }
      });
      console.log('Message sent. Response:', response.data);

      setNewMessage('');
      await fetchMessages(selectedUser.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get user role color
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-yellow-500';
      case 'client':
        return 'bg-blue-500';
      case 'agent':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Messages',
      href: '/messages',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Messages" />
      <div className="flex h-screen bg-white rounded-lg shadow-lg overflow-hidden">
        {/* User List Panel */}
        <div className="w-1/3 md:w-1/4 border-r border-gray-200 bg-gray-50">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contacts</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto h-full pb-20">
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No users found</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {searchResults.map(user => (
                  <li
                    key={user.id}
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 transition duration-150 ${
                      selectedUser?.id === user.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-red-500`}>
                      {getInitials(user.name)}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.user_role}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.user_role)} bg-opacity-10 text-gray-800`}>
                      {user.user_role}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white flex items-center sticky top-0 z-10">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-red-500`}>
                  {getInitials(selectedUser.name)}
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : messages && messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages && messages.map((message, index) => {
                      const isSender = message.sender_id !== selectedUser.id;
                      return (
                        <div
                          key={message.message_id || index}
                          className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isSender
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-gray-200 text-gray-800 rounded-tl-none'
                            }`}
                          >
                            <p>{message.message_text}</p>
                            <p className={`text-xs mt-1 ${isSender ? 'text-blue-100' : 'text-gray-500'}`}>
                              {formatDate(message.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center p-2 border border-transparent text-sm rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 h-10 w-10"
                      disabled={!newMessage.trim()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <p className="text-xl font-medium mb-2">Your Messages</p>
              <p className="text-sm text-center max-w-md px-4">
                Select a contact from the list to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}