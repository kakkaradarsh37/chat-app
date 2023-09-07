// import { db } from '@/firebase/firebase';
// import { data } from 'autoprefixer';
// import { doc, onSnapshot } from 'firebase/firestore';
// import React, { useEffect,useRef, useState } from 'react'

// const Messages = () => {
//     const [messages, setMessages]= useState([]);
//     const ref= useRef();

//     useEffect(()=>{
//         const unsub= onSnapshot(doc(db, "chats", data.chatId), (doc)=>{
//             if(doc.exists()){
//                 setMessages(doc.data().messages);
//             }
//         });
//         return ()=> unsub();
//     }, [data.chatId]);
//   return <div 
//   ref={ref}
//   className='grow p-5 overflow-auto scrollbar flex flex-col'>
//     Messages
//     </div>
  
    
  
// }

// export default Messages

import { useChatContext } from "@/context/chatContext";
import { db } from "@/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { DELETED_FOR_ME } from "@/utils/constants";
import { useAuth } from "@/context/authContext";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const { data, setIsTyping } = useChatContext();
    const ref = useRef();
    const { currentUser } = useAuth();

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            if (doc.exists()) {
                setMessages(doc.data().messages);
                setIsTyping(doc.data()?.typing?.[data.user.uid] || false);
            }
            setTimeout(() => {
                scrollToBottom();//in setTimeout the function scrollToBottom will get executed at last as setTimeout is used here and therefore on writing the data it will scroll down automatically 
            }, 0);
        });
        return () => unsub();
    }, [data.chatId]);

    const scrollToBottom = () => {
        const chatContainer = ref.current;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };
    return (
        <div
            ref={ref}
            className="grow p-5 overflow-auto scrollbar flex flex-col"
        >
            {messages
                ?.filter((m) => {//here it will filter and map the remaining undeleted messages 
                    return (
                        m?.deletedInfo?.[currentUser.uid] !== DELETED_FOR_ME &&
                        !m?.deletedInfo?.deletedForEveryone &&
                        !m?.deleteChatInfo?.[currentUser.uid]//here we deleted next key passed to the chatMenu
                    );
                })
                ?.map((m) => {
                    return <Message message={m} key={m.id} />;
                })}
        </div>
    );
};

export default Messages;
