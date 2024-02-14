import React, { useEffect, useState, useRef } from 'react'
import {useSelector} from 'react-redux'
import { Button, Modal, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck, FaTimes } from 'react-icons/fa'



export default function ChatPage() {
  const {currentUser} = useSelector(state => state.user)
  const [usersMessages, setUsersMessages] = useState([])
  const [usersTalkedWith, setUsersTalkedWith] = useState([])
  const [newMessageText ,setNewMessageText] = useState('')
  const chatAreaRef = useRef(null); // Ref for the chat area element
  const [users, setUsers] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState('')

//   ------------------------------------------------------
useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`)
        const data = await res.json()
        if(res.ok){
          setUsers(data.users)
          if(data.users.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
      fetchUsers()
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = users.length
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`)
      const data = await res.json()
      if(res.ok) {
        setUsers((prev) => [...prev, ...data.users])
        if(data.users.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteUser = async () => {
    try {
        const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
            method: 'DELETE',
        })
        const data = await res.json();
        if(res.ok){
            setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete))
            setShowModal(false)
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.log(error);
    }
  }
//   ----------------------------------------------------------

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
      <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {/* Modify later, right now only admin can see users */}
      
        <>
        <h1 className='text-center mb-4 font-bold'>Pick someone to speak with</h1>
        <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell>
              Date Created
            </Table.HeadCell>
            <Table.HeadCell>
              User image
            </Table.HeadCell>
            <Table.HeadCell>
              Username
            </Table.HeadCell>
            <Table.HeadCell>
              Email
            </Table.HeadCell>
            <Table.HeadCell>
              Admin
            </Table.HeadCell>
            {currentUser.isAdmin &&(
            <Table.HeadCell>
              <span>Delete</span>
            </Table.HeadCell>
            )}
            {currentUser.isAdmin &&(
            <Table.HeadCell>
              <span>Edit</span>
            </Table.HeadCell>
             )}
            <Table.HeadCell>
              <span>Message</span>
            </Table.HeadCell>
          </Table.Head>
          {users.map((user) => (
            <Table.Body className='divide-y' key={user._id}>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>
                  {new Date(user.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                    <img src={user.profilePicture} alt={user.username} className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                </Table.Cell>
                <Table.Cell>
                    {user.username}
                </Table.Cell>
                <Table.Cell>
                  {user.email}
                </Table.Cell>
                <Table.Cell>
                  {user.isAdmin ? (<FaCheck className="text-green-500 mx-auto"/>) : (<FaTimes className="text-red-500 mx-auto"/>)}
                </Table.Cell>
                {currentUser.isAdmin &&(
                <Table.Cell>
                  <span onClick={() => {
                    setShowModal(true)
                    setUserIdToDelete(user._id)
                  }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                    Delete
                  </span>
                </Table.Cell>
                )}
                {currentUser.isAdmin &&(
                <Table.Cell>
                  <Link className='text-teal-500 hover:underline' to={`/update-user/${user._id}`}>
                    <span>
                      Edit
                    </span>
                  </Link>
                </Table.Cell>
                )}
                {/* Modify it later */}
                <Table.Cell>
                  <Link className='text-teal-500 hover:underline' to={`/chat/${user._id}?username=${user.username}`}>
                    <span>
                      Message
                    </span>
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        {
          showMore && (
            <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
              Show More
            </button>
          )
        }
        </>
       <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header/>
        <Modal.Body>
            <div className="text-center">
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>
                <div className="flex justify-center gap-4">
                    <Button color='failure' onClick={handleDeleteUser}>
                        Yes, I am sure
                    </Button>
                    <Button color="gray" onClick={() => setShowModal(false)}>No, cancel</Button>
                </div>
            </div>
        </Modal.Body>
      </Modal>
    </div>
    </div>
  )
}
