import React from 'react'
import Messages from './Messages'
import ChatHeader from './ChatHeader'
import { useChatContext } from '@/context/chatContext'
import ChatFooter from './ChatFooter';
import { useAuth } from '@/context/authContext';


const Chat = () => {
    const {currentUser}= useAuth();
    const {data, users}= useChatContext();

    const handleClickAway=()=>{
        setShowMenu(false);
    };

    const isUserBlocked= users[currentUser.uid]?.blockedUsers?.find(
        (u)=> u===data.user.uid//here the person who is blocking the current user
    );

    const IamBlocked= users[data.user.uid]?.blockedUsers?.find(
        (u)=> u===currentUser.uid
    );//who is blocked will check whether the chat user is the user who has blocked you if the id of the block blocking the current user matches then this will happen and the chat will get disappeared
return (
    <div className='flex flex-col p-5 grow'>
        <ChatHeader/>
        {data.chatId && <Messages/>}
        {!isUserBlocked && !IamBlocked && <ChatFooter/>}

        {isUserBlocked && (
            <div className='w-full to-current text-c3 py-5'>
                This user has been blocked
            </div>
        )}
        {IamBlocked && (
        <div className='w-full to-current text-c3 py-5'>
            {`${data.user.displayName} has blocked you`}
        </div>
        )}
    </div>
);
};

export default Chat;