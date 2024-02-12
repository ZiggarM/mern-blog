import React, { useState } from 'react'

export default function Conversations() {

    const [newMessageText ,setNewMessageText] = useState('')



    const sendMessage = async (e) => {
    e.preventDefault();

    try {
        const messageData = {
            senderId: 'yourSenderId', // Replace 'yourSenderId' with the actual sender ID
            receiverId: 'yourReceiverId', // Replace 'yourReceiverId' with the actual receiver ID
            content: 'yourMessageContent' // Replace 'yourMessageContent' with the actual message content
        };

        const res = await fetch('/api/message/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData) // Convert messageData to JSON string before sending
        });

        const data = await res.json();
        console.log(data); // Log the response data to the console
    } catch (error) {
        console.error(error); // Log any errors to the console
    }
};

  return (
     <div className="flex h-screen">
            <div className="bg-white w-1/5">
                {/* {Object.keys(onlinePeopleExcludingOurUser).map(userId => (
                    <div key={userId} onClick={() => setSelectedUserId(userId)}
                     className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer " + (userId === selectedUserId ? 'bg-blue-50' : '')}>
                        {userId === selectedUserId && (
                            <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
                        )}
                        <div className="flex gap-2 py-2 pl-4 items-center">
                            <Avatar username={onlinePeople[userId]} userId={userId} />
                            <span className="text-gray-800">{onlinePeople[userId]}</span>
                        </div>
                    </div>
                ))} */}
            </div>
            <div className=" flex flex-col bg-blue-50 w-4/5 p-2">
                <div className="flex-grow">
                    {/* {!selectedUserId && (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-gray-400">&larr; Select a person from the sidebar</div>
                        </div>
                    )}
                    {!!selectedUserId && (
                        <div className="relative h-full">
                            <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                                {messagesWithoutDupes.map(message => (
                                    <div className={(message.sender === id ? 'text-right' : 'text-left')}>
                                        <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " +(message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500')}>
                                            sender:{message.sender}<br />
                                            my id {id} <br />
                                            {message.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={divUnderMessages}></div>
                            </div>
                        </div>
                    )} */}
                </div>
                {/* !! converts it to a boolean */}
                <form className="flex gap-2" onSubmit={sendMessage}>
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

                
                {/* {!!selectedUserId && (
                <form className="flex gap-2" onSubmit={sendMessage}>
                    <input type="text" 
                    value={newMessageText}
                    onChange={ev => setNewMessageText(ev.target.value)}
                    placeholder="Type your message here" 
                    className="bg-white flex-grow border p-2 rounded-sm" />
                    <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
                )} */}
            </div>
        </div>
  )
}


// import { useEffect, useState } from "react"
// import { useLocation } from "react-router-dom"
// import DashSideBar from '../components/DashSideBar'
// import DashProfile from '../components/DashProfile'
// import DashPosts from "../components/DashPosts"
// import DashUsers from "../components/DashUsers"

// export default function Dashboard() {
//   const location = useLocation()
//   const [tab, setTab] = useState('')
//   useEffect(() => {
//     const urlParams = new URLSearchParams(location.search)
//     const tabFormUrl = urlParams.get('tab')
//     if(tabFormUrl) {
//       setTab(tabFormUrl)
//     }
//   }, [location.search])

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">

//       <div className="md:w-56">
//       {/* SideBar */}
//       <DashSideBar />
//       </div>
//       {/* Profile */}
//       {tab === 'profile' && <DashProfile/>}
//       {/* Posts */}
//       {tab === 'posts' && <DashPosts/>}
//       {/* Users */}
//       {tab === 'users' && <DashUsers/>}
//     </div>
//   )
// }
