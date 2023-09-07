import { useAuth } from '@/context/authContext';
import { useChatContext } from '@/context/chatContext';
import { db } from '@/firebase/firebase';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import React from 'react'
import ClickAwayListener from 'react-click-away-listener'

const ChatMenu = ({showMenu , setShowMenu}) => {
    const {currentUser}= useAuth();
    const {data, users, chats, dispatch,setSelectedChat}= useChatContext();

    const handleClickAway=()=>{
        setShowMenu(false);
    };

    const isUserBlocked= users[currentUser.uid]?.blockedUsers?.find(
        (u)=> u===data.user.uid//here the person who is blocking the current user
    );

    const IamBlocked= users[data.user.uid]?.blockedUsers?.find(
        (u)=> u===currentUser.uid
    );//who is blocked will check whether the chat user is the user who has blocked you if the id of the block blocking the current user matches then this will happen and the chat will get disappeared

    const handleBlock = async(action)=>{
    if(action === "block"){
    await updateDoc(doc(db, "users", currentUser.uid),
{
    blockedUsers: arrayUnion(data.user.uid),//created an array here add the user to block from the chat
});
    }


    if(action === "unblock"){
    await updateDoc(doc(db, "users", currentUser.uid),
{
    blockedUsers: arrayRemove(data.user.uid),//created an array here add the user to block from the chat
});
}
    }

    const handleDelete= async()=>{
        try {

            const chatRef= doc(db, "chats", data.chatId);//here we took the reference of the chat
            const chatDoc= await getDoc(chatRef);//and here we got the data of the chat from chatDocument

         const updatedMessages = chatDoc.data().messages.map((message)=>{
            message.deleteChatInfo= {
                ...message.deleteChatInfo,
                [currentUser.uid]: true,//means current user who is deleting the chat
            }
            return message;
         })  
         await updateDoc(chatRef,{
            messages :updatedMessages,  //updating the document with new values of messages
         });
         await updateDoc(doc(db, "userChats", currentUser.uid),{//here we selected the userChats object and the currentUser id 
            [data.chatId + ".chatDeleted"]: true,//here because when we will delete all the chats then it will also get removed from the tile section and the reference of the selected chat will automatically be shifted to the next user  
         });

         const filteredChats= Object.entries(chats || {})
         .filter(([id,chat])=> id!== data.chatId )
         .sort((a,b)=> b[1].date - a[1].date)

if(filteredChats.length> 0){
    setSelectedChat(filteredChats?.[0]?.[1]?.userInfo)
    dispatch({
        type:"CHANGE_USER",
        payload: filteredChats?.[0]?.[1]?.userInfo
    })
}
else{
    dispatch({ type : "EMPTY"})
}

        } catch (error) {
            console.log(error);
        }
    };
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
    <div className='w-[200px] absolute top-[70px] right-5 bg-c0 z-10 rounded-md overflow-hidden'>
        <ul className='flex flex-col py-2'>
            {!IamBlocked && (
            <li 
            className='flex items-center py-3 px-5 hover:bg-black cursor-pointer'
            onClick={(e)=>{
            e.stopPropagation();
            handleBlock( isUserBlocked? "unblock" : "block"
            );
            }}>
                {/* Block User */}
                {isUserBlocked ? "Unblock": "Block"}
            </li>
            )}
            <li className='flex items-center py-3 px-5 hover:bg-black cursor-pointer'
            onClick={(e)=>{
            e.stopPropagation();
            handleDelete();
            }}
            >
                Delete Chat
            </li>
        </ul>

    </div>
 </ClickAwayListener> 
 )
}

export default ChatMenu