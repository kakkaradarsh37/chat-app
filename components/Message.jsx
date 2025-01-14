// import { useAuth } from '@/context/authContext'
// import { useChatContext } from '@/context/chatContext';
// import React, { useState } from 'react'
// import Avatar from './Avatar';
// import Image from 'next/image';
// import ImageViewer from 'react-simple-image-viewer';
// import { Timestamp, doc, updateDoc } from 'firebase/firestore';
// import { formateDate, wrapEmojisInHtmlTag } from '@/utils/helpers';
// import Icon from './Icon';
// import {GoChevronDown} from "react-icons/go";
// import MessageMenu from './MessageMenu';
// import DeleteMsgPopup from './popup/DeleteMsgPopup';
// import { db } from '@/firebase/firebase';
// import { DELETED_FOR_EVERYONE, DELETED_FOR_ME } from '@/utils/constants';


// const Message = ({message}) => {
//   const [showMenu , setShowMenu ]= useState(false);
//   const [showDeletePopup , setShowDeletePopup]= useState(false);
//   const {currentUser}= useAuth();
//   const {users, data, imageViewer, setImageViewer}= useChatContext();
//   const self= message.sender === currentUser.uid;

//   const timestamp = new Timestamp(//new  because it's in object format
//   message.date?.seconds,//to change the date
//   message.date?.nanoseconds,
// );
// const date= timestamp.toDate();

// const deletePopupHandler = ()=> {
//   setShowDeletePopup(true)
//    setShowMenu(false)//means the menu will get close
// };
// const deleteMessage = async(action)=>{
//   try {
//     const messageId= message.id;
//     const charRef= doc(db, "chats", data.chatId)
//     const chatDoc = await getDoc(chatRef)
    
//     const updatedMessages= chatDoc.data().messages.map((message)=>{
//       if(message.id=== messageId){
//         if(action === DELETED_FOR_ME){
//           message.deletedInfo = {
//             [currentUser.uid] : DELETED_FOR_ME
//           }
//         }

//         if(action === DELETED_FOR_EVERYONE){
//           message.deletedInfo = {//here an object will be appended in the firebase named deletedInfo
//             deletedForEveryone : true//means that if action is for everyone then in the firebase the messages are in object form and the data here passed is also in object form and the state will be true for deletedForEveryone message
//           }
//         }
//       }
//       return message;
//     })

//     await updateDoc(chatRef, {messages: updatedMessages });
//     setShowDeletePopup(false);//means after hte doc is completed the popup will get closed
//   } catch (error) {
//     console.log(error);
//   }
// }
//   return (
//     <div className={`mb-5 max-w-[75%] ${self? "self-end": ""}`}>
//      {DeleteMsgPopup &&(//if deleteMsgPopup is true then only the window of delete will appear
//      <DeleteMsgPopup
//       onHide= {()=> setShowDeletePopup(false)}
//       className="DeleteMsgPopup"
//       noHeader={true}
//       shortHeight= {true}
//       self = {self}
//       deleteMessage= {deleteMessage}
//       />
//       )} 
//       <div className={`flex items-center gap-3 mb-1 ${self?"justify-start flex-row-reverse" : ""}`}>
//         <Avatar 
//         size="small"
//         user= {self ? currentUser : users
//         [data.user.uid]}
//         className="mb-4"
//         />
//         <div className={`group flex flex-col gap-4 p-4 rounded-3xl relative break-all ${self? "rounded-br-md bg-c5" : "rounded-bl-md bg-c1" }`}
//         >
//           {message.text && (
//             <div 
//             className='text-sm'
//             dangerouslySetInnerHTML={{
//               __html:
//               wrapEmojisInHtmlTag
//             (message.text),
//             }}
//             ></div>
//           )}
//           {message.img && (
//             <>
//             <Image
//             src={message.img}
//             width={250}
//             height={250}
//             alt={message?.text || ""}
//             className='rounded-3xl max-w-[250px]'
//             onClick={()=> {
//               setImageViewer({
//                 msgId: 
//                 message.id,
//                 url : message.img
//               })
//             }}
//             />
//             {imageViewer && 
//             imageViewer.msgId=== message.id && (
//               <ImageViewer
//               src={[imageViewer, url]}
//               currentIndex={0}
//               disableScroll= {false}
//               closeOnClickOutside={true}
//               onClose={()=> setImageViewer(null)}
//               />
//             )}

            
//             </>
//           )}

//           <div className={`${showMenu ? "" : "hidden"} group-hover:: flex absolute top-2 ${self ? "left-2 bg-c5" : "right-2 bg-c1"}`}
//           onClick={()=> setShowMenu(true)}
//           >
//             <Icon
//             size="medium"
//             className="hover: bg-inherit rounded-none"
//             icon={<GoChevronDown size={24} className="text-c3"/>
//               }
//             />
//             {showMenu && (
//               <MessageMenu
//               self={self}
//               setShowMenu={setShowMenu}
//               showMenu={showMenu}
//               deletePopupHandler= {deletePopupHandler}
//               setEditMsg={()=> setEditMsg(message)}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//       <div className={`flex items-end ${self ? "justify-start flex-row-reverse mr-12" : "ml-12"}`}
//       >
//         <div className='text-xs text-c3'>
//           {formateDate(date)}
//           {/* pass the date here */}
//         </div>
//       </div>
//     </div>
   
//   )
// }

// export default Message

import { useAuth } from "@/context/authContext";
import React, { useState } from "react";
import Avatar from "./Avatar";
import { useChatContext } from "@/context/chatContext";
import Image from "next/image";
import ImageViewer from "react-simple-image-viewer";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { formateDate, wrapEmojisInHtmlTag } from "@/utils/helpers";
import Icon from "./Icon";
import { GoChevronDown } from "react-icons/go";
import MessageMenu from "./MessageMenu";
import DeleteMsgPopup from "./popup/DeleteMsgPopup";
import { db } from "@/firebase/firebase";
import { DELETED_FOR_EVERYONE, DELETED_FOR_ME } from "@/utils/constants";
const Message = ({ message }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const { currentUser } = useAuth();
    const { users, data, imageViewer, setImageViewer, setEditMsg } =
        useChatContext();
    const self = message.sender === currentUser.uid;

    const timestamp = new Timestamp(
        message.date?.seconds,
        message.date?.nanoseconds
    );

    const date = timestamp.toDate();

    const deletePopupHandler = () => {
        setShowDeletePopup(true);
        setShowMenu(false);
    };

    const deleteMesasge = async (action) => {
        try {
            const messageId = message.id;
            const chatRef = doc(db, "chats", data.chatId);

            const chatDoc = await getDoc(chatRef);

            const updatedMessages = chatDoc.data().messages.map((message) => {
                if (message.id === messageId) {
                    if (action === DELETED_FOR_ME) {
                        message.deletedInfo = {
                            [currentUser.uid]: DELETED_FOR_ME,
                        };
                    }

                    if (action === DELETED_FOR_EVERYONE) {
                        message.deletedInfo = {
                            deletedForEveryone: true,
                        };
                    }
                }

                return message;
            });

            await updateDoc(chatRef, { messages: updatedMessages });
            setShowDeletePopup(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={`mb-5 max-w-[75%] ${self ? "self-end" : ""}`}>
            {showDeletePopup && (
                <DeleteMsgPopup
                    onHide={() => setShowDeletePopup(false)}
                    className="DeleteMsgPopup"
                    noHeader={true}
                    shortHeight={true}
                    self={self}
                    deleteMesasge={deleteMesasge}
                />
            )}
            <div
                className={`flex items-end gap-3 mb-1 ${
                    self ? "justify-start flex-row-reverse" : ""
                }`}
            >
                <Avatar
                    size="small"
                    user={self ? currentUser : users[data.user.uid]}
                    className="mb-4"
                />
                <div
                    className={`group flex flex-col gap-4 p-4 rounded-3xl relative break-all ${
                        self ? "rounded-br-md bg-c5" : "rounded-bl-md bg-c1"
                    }`}
                >
                    {message.text && (
                        <div
                            className="text-sm"
                            dangerouslySetInnerHTML={{
                                __html: wrapEmojisInHtmlTag(message.text),
                            }}
                        ></div>
                    )}

                    {message.img && (
                        <>
                            <Image
                                src={message.img}
                                width={250}
                                height={250}
                                alt={message?.text || ""}
                                className="rounded-3xl max-w-[250px]"
                                onClick={() => {
                                    setImageViewer({
                                        msgId: message.id,
                                        url: message.img,
                                    });
                                }}
                            />

                            {imageViewer &&
                                imageViewer.msgId === message.id && (
                                    <ImageViewer
                                        src={[imageViewer.url]}
                                        currentIndex={0}
                                        disableScroll={false}
                                        closeOnClickOutside={true}
                                        onClose={() => setImageViewer(null)}
                                    />
                                )}
                        </>
                    )}

                    <div
                        className={`${
                            showMenu ? "" : "hidden"
                        } group-hover:flex absolute top-2 ${
                            self ? "left-2 bg-c5" : "right-2 bg-c1"
                        }`}
                        onClick={() => setShowMenu(true)}
                    >
                        <Icon
                            size="medium"
                            className="hover:bg-inherit rounded-none"
                            icon={
                                <GoChevronDown size={24} className="text-c3" />
                            }
                        />
                        {showMenu && (
                            <MessageMenu
                                self={self}
                                setShowMenu={setShowMenu}
                                showMenu={showMenu}
                                deletePopupHandler={deletePopupHandler}
                                setEditMsg={() => setEditMsg(message)}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div
                className={`flex items-end ${
                    self ? "justify-start flex-row-reverse mr-12" : "ml-12"
                }`}
            >
                <div className="text-xs text-c3">{formateDate(date)}</div>
            </div>
        </div>
    );
};

export default Message;
