import React, { useEffect, useState, useRef } from 'react'
import {useSelector} from 'react-redux'
import { Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi'



export default function ChatPage() {
  const {currentUser} = useSelector(state => state.user)
  const [usersMessages, setUsersMessages] = useState([])
  const [usersTalkedWith, setUsersTalkedWith] = useState([])
  const [newMessageText ,setNewMessageText] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState('')
  const [messages, setMessages] = useState([])
  const chatAreaRef = useRef(null); // Ref for the chat area element


  const url = new URL(window.location.href);
  const receiverId = url.pathname.split("/").pop(); // Get the last segment of the URL path
  const params = new URLSearchParams(location.search);
  const otherUsername = params.get('username');

  useEffect(() => {
    // Scroll to the bottom of the chat area every time usersMessages changes
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
    }, [usersMessages]);
 
    console.log(messageToDelete);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/message/getmessagesbetweenusers/${receiverId}/${currentUser._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if(res.ok){
        setUsersMessages(data)
      }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUsers();
  }, [newMessageText]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`/api/conversation/getconversation/${currentUser._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUsersTalkedWith(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchConversations(); 
  }, [usersMessages]);


  const sendMessage = async (e) => {
    e.preventDefault();
    
    try {
      const messageData = {
        senderId: currentUser._id,
        receiverId: receiverId,
        content: newMessageText
        };

      // Create a new message
      const messageResponse = await fetch('/api/message/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });
        
      setNewMessageText('');
      const messageResult = await messageResponse.json();

      const conversationData = {
        user1: receiverId,
        user2: currentUser._id,
        lastMessage: {
          sender: currentUser.username,
          content: newMessageText
          }
      };

      // Check if the conversation exists
      const conversationCheckResponse = await fetch('/api/conversation/checkConversationExists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversationData)
      });

      const conversationExists = await conversationCheckResponse.json();

      if (conversationExists) {
        // Conversation exists, update the lastMessage
        const updateConversationResponse = await fetch('/api/conversation/updateconversation', {
          method: 'PUT',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(conversationData)
          });

        const updatedConversation = await updateConversationResponse.json();
        console.log('Updated Conversation:', updatedConversation);
      } else {
        // Conversation does not exist, create a new one
        const createConversationResponse = await fetch('/api/conversation/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(conversationData)
        });

        const conversationResult = await createConversationResponse.json();
        console.log('New Conversation Created:', conversationResult);
      }
    } catch (error) {
        console.error(error);
    }
};

const handleDeleteMessage = async () => {
    try {
        const res = await fetch(`/api/message/deletemessage/${messageToDelete}`, {
            method: 'DELETE',
        })
        const data = await res.json();
        if(res.ok){
            setMessages((prev) => prev.filter((message) => message._id !== messageToDelete))
            setShowModal(false)
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <div className="flex h-screen relative">
      <div className="bg-gray-500 w-1/5 sidebar">
        {usersTalkedWith.map(user => {
          const [user1] = user.user1;
          const [user2] = user.user2;
            return (
              <div key={user._id} className="bg-white mb-2 text-black">
                <a href={user1.username === currentUser.username ? `/chat/${user2._id}?username=${user2.username}` : `/chat/${user1._id}?username=${user1.username}`}>
                  <h4>{user1.username === currentUser.username ? user2.username : user1.username}</h4>
                </a>
                <p>{user.lastMessage.content}</p>
              </div>
            );
          })
        }
      </div>
      <div className="bg-blue-50 w-2/3 p-2 chat-area flex-1" ref={chatAreaRef}>
        <div className="last-message">
          {usersMessages
          .slice() // Create a copy of the array to avoid mutating the original array
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort messages by createdAt
          .map(message => (
            <div key={message._id} className={message.senderId === currentUser._id ? 'flex justify-end' : 'flex justify-start'}>
              {message.isDeleted ? (
                <p className='bg-red-500 p-2 rounded-lg m-2'>Message is deleted</p>
              ) : (
                <p 
                  onClick={() => {
                    if(currentUser.isAdmin || currentUser.username === message.senderId) {
                      setShowModal(true);
                      setMessageToDelete(message._id);
                    }
                  }}
                  className={message.senderId === currentUser._id ? 'bg-blue-500 text-white p-2 rounded-lg m-2 text-right cursor-pointer' : 'bg-gray-200 text-gray-700 p-2 rounded-lg m-2 text-left cursor-pointer'}
                >
                  {message.content}
                </p>
              )}
            </div>
          ))}
                   
        </div>
      </div>
      <form className="flex gap-2 mt-4 chat-form" onSubmit={sendMessage}>
        <input type="text" 
        value={newMessageText}
        onChange={e => setNewMessageText(e.target.value)}
        placeholder="Type your message here" 
        className="bg-white flex-grow border p-2 rounded-sm" />
        <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        </button>
      </form>
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header/>
        <Modal.Body>
            <div className="text-center">
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>
                <div className="flex justify-center gap-4">
                    <Button color='failure' onClick={handleDeleteMessage}>
                        Yes, I am sure
                    </Button>
                    <Button color="gray" onClick={() => setShowModal(false)}>No, cancel</Button>
                </div>
            </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
