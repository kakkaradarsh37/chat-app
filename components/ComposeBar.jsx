// import { useAuth } from '@/context/authContext';
// import { useChatContext } from '@/context/chatContext'
// import { db, storage } from '@/firebase/firebase';
// import { updateCurrentUser } from 'firebase/auth';
// import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
// import { ref } from 'firebase/storage';
// import React from 'react'
// import {TbSend} from "react-icons/tb";
// import { v4 as uuid } from "uuid";

// const ComposeBar = () => {
//     const {inputText, setInputText, data, attachment, setAttachment, setAttachmentPreview}= useChatContext();
//     const {currentUser}= useAuth();

//     const handleTyping= (e)=> {
//         setInputText(e.target.value);
//     };
//     const onKeyUp= (e)=> {
//         if(e.key === "Enter" && inputText){
//             handleSend()
//         }
//     };
//     const handleSend = async()=>{

//         if(attachment){
//             const storageRef = ref(storage, uuid);

// const uploadTask = uploadBytesResumable(storageRef, attachment);

// // Register three observers:
// // 1. 'state_changed' observer, called any time the state changes
// // 2. Error observer, called on failure
// // 3. Completion observer, called on successful completion
// uploadTask.on('state_changed', 
// (snapshot) => {
// // Observe state change events such as progress, pause, and resume
// // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
// const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
// console.log('Upload is ' + progress + '% done');
// switch (snapshot.state) {
//   case 'paused':
//     console.log('Upload is paused');
//     break;
//   case 'running':
//     console.log('Upload is running');
//     break;
// }
// }, 
// (error) => {
// console.log(error);
// // Handle unsuccessful uploads
// },  
// () => {
//     // Handle successful uploads on complete
//     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//     getDownloadURL(uploadTask.snapshot.ref).then( 
//         async(downloadURL) => {
//             await updateDoc(doc,(db, 'chats', data.chatId),{
//                 messages: arrayUnion({//pass as an object
//                 id: uuid(),
//                 text: inputText,
//                 sender: updateCurrentUser.uid,
//                 date: Timestamp.now(),
//                 read: false,//means by default the chat will be unread i.e. false
//                 img: downloadURL 
//                 })
//             }) 
      
//     });
// });
//   }
// else{
// await updateDoc(doc,(db, 'chats', data.chatId),{
//     messages: arrayUnion({//pass as an object
//     id: uuid(),
//     text: inputText,
//     sender: updateCurrentUser.uid,
//     date: Timestamp.now(),
//     read: false//means by default the chat will be unread i.e. false
//     })
// })
// }
// let msg= {text: inputText};
// if(attachment){
//     msg.img= true;
// }

// await updateDoc(doc,(db, "userChats", currentUser.uid),{
//     [data.chatId + ".lastMessage"]: msg,
//     [data.chatId + ".data"]: serverTimestamp (),
// });

// await updateDoc(doc,(db, "userChats", currentUser.uid),{
//     [data.chatId + ".lastMessage"]: msg,
//     [data.chatId + ".data"]: serverTimestamp (),
// });
// setInputText("");
// setAttachment(null);
// setAttachmentPreview(null);
// };
//   return (
//     <div className='flex items-center gap-2 grow'>
//         <input 
//         type="text" 
//         className='grow w-full outline-0 px-2 py-2 text-white bg-transparent placeholder: text-c3 outline-none text-base'
//         placeholder='Type a message'
//         value= {inputText}
//         onChange={handleTyping}
//         onKeyUp={onKeyUp}
//         />
//         <button 
//         className= {`h-10 w-10 rounded-xl shrink-0 flex justify-center items-center ${inputText.trim().length> 0 ? "bg-c4" : ""}`}
//         onClick={handleSend}
//         >
//             <TbSend size={20}
//             className= "text-white"
        
//             /> </button>
//     </div>
//   )
// }

// export default ComposeBar

import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import { db, storage } from "@/firebase/firebase";
import {
    Timestamp,
    arrayUnion,
    deleteField,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect } from "react";
import { TbSend } from "react-icons/tb";
import { v4 as uuid } from "uuid";

let typingTimeout = null;

const Composebar = () => {
    const {
        inputText,
        setInputText,
        data,
        attachment,
        setAttachment,
        setAttachmentPreview,
        editMsg,
        setEditMsg,
    } = useChatContext();
    const { currentUser } = useAuth();

    useEffect(() => {
        setInputText(editMsg?.text || "");
    }, [editMsg]);

    const handleTyping = async (e) => {
        setInputText(e.target.value);
        await updateDoc(doc(db, "chats", data.chatId), {
            [`typing.${currentUser.uid}`]: true,
        });

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        typingTimeout = setTimeout(async () => {
            await updateDoc(doc(db, "chats", data.chatId), {
                [`typing.${currentUser.uid}`]: false,
            });

            typingTimeout = null;
        }, 500);
    };
    const onKeyUp = (e) => {
        if (e.key === "Enter" && (inputText || attachment)) {
            editMsg ? handleEdit() : handleSend();
        }
    };

    const handleSend = async () => {
        if (attachment) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, attachment);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                    }
                },
                (error) => {
                    console.error(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (downloadURL) => {
                            await updateDoc(doc(db, "chats", data.chatId), {
                                messages: arrayUnion({
                                    id: uuid(),
                                    text: inputText,
                                    sender: currentUser.uid,
                                    date: Timestamp.now(),
                                    read: false,
                                    img: downloadURL,
                                }),
                            });
                        }
                    );
                }
            );
        } else {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text: inputText,
                    sender: currentUser.uid,
                    date: Timestamp.now(),
                    read: false,
                }),
            });
        }

        let msg = { text: inputText };
        if (attachment) {
            msg.img = true;
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: msg,
            [data.chatId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: msg,
            [data.chatId + ".date"]: serverTimestamp(),
            [data.chatId + ".chatDeleted"]: deleteField(),//here it means that when we pass chatDeleted key it will again and again delete the user's chat and we will not able to add the user from the plus icon so we have to remove the key as well which we have done here  
        });
        // deleteField is a method in firebase

        setInputText("");
        setAttachment(null);
        setAttachmentPreview(null);
    };

    const handleEdit = async () => {
        const messageId = editMsg.id;
        const chatRef = doc(db, "chats", data.chatId);

        const chatDoc = await getDoc(chatRef);

        if (attachment) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, attachment);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                    }
                },
                (error) => {
                    console.error(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (downloadURL) => {
                            let updatedMessages = chatDoc
                                .data()
                                .messages.map((message) => {
                                    if (message.id === messageId) {
                                        message.text = inputText;
                                        message.img = downloadURL;
                                    }
                                    return message;
                                });
                            await updateDoc(chatRef, {
                                messages: updatedMessages,
                            });
                        }
                    );
                }
            );
        } else {
            let updatedMessages = chatDoc.data().messages.map((message) => {
                if (message.id === messageId) {
                    message.text = inputText;
                }
                return message;
            });
            await updateDoc(chatRef, {
                messages: updatedMessages,
            });
        }

        setInputText("");
        setAttachment(null);
        setAttachmentPreview(null);
        setEditMsg(null);
    };

    return (
        <div className="flex items-center  gap-2 grow">
            <input
                type="text"
                className="grow w-full outline-0 px-2 py-2 text-white bg-transparent placeholder:text-c3 outline-none text-base"
                placeholder="Type a message"
                value={inputText}
                onChange={handleTyping}
                onKeyUp={onKeyUp}
            />
            <button
                className={`h-10 w-10 rounded-xl shrink-0 flex justify-center items-center ${
                    inputText.trim().length > 0 ? "bg-c4" : ""
                }`}
                onClick={editMsg ? handleEdit : handleSend}
            >
                <TbSend size={20} className="text-white" />
            </button>
        </div>
    );
};

export default Composebar;
