// import React, { useState } from 'react'
// import {BiEdit} from "react-icons/bi";
// import Avatar from './Avatar';
// import { useAuth } from '@/context/authContext';
// import Icon from './Icon';

// import {IoClose, IoLogoutOutline} from "react-icons/io5";
// import {FiPlus} from "react-icons/fi";
// import {MdPhotoCamera , MdAddAPhoto, MdDeleteForever} from "react-icons/md";
// import {BsFillCheckCircleFill} from "react-icons/bs";


// const LeftNav = () => {
//     const [editProfile, setEditProfile]= useState(false);
//     const [nameEdited, setNameEdited]= useState(false);
//     const {currentUser,signOut} = useAuth();//take and destructure the current user from useAuth

//     const onkeyup = (event) =>{
//         if(event.target.innerText.trim()!== currentUser.displayName){
//             setNameEdited(true);
//         }else{
//             setNameEdited(false);
//         }
//     };

//     const editProfileContainer = ()=>{
//         return (
//             <div className='relative flex flex-col items-center'>
//             <Icon
//             size="small"
//             className="absolute top-0 right-5 hover:bg-c2"
//             icon= {<IoClose size={20}/>}
//             onClick= {()=> setEditProfile(false)}
//             />
//             <div className='relative-group cursor-pointer'>
//                 <Avatar
//                 size="xx-large" user={currentUser}/>
//                 <div className='w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex'>
//                     <label htmlFor='fileUpload'>
//                         {currentUser.photoURL ? (
//                             <MdPhotoCamera size={34}/>
//                         ) : (
//                         <MdAddAPhoto size={34}/>
//                         )}
//                     </label>
//                     <input 
//                     id='fileUpload'
//                     type="file" 
//                     onChange={(e)=>{}}
//                     style={{display :"none"}}
//                     />
//                 </div>
//                 {currentUser.photoURL && (
//                 <div className='w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute right-0 bottom-0'>
//                     <MdDeleteForever size={14}/>
//                 </div>
//                 )}
//             </div>
//             <div className='mt-5 flex flex-col items-center'>
//                 <div className='flex items-center gap-2'>
//                     {!nameEdited && <BiEdit className='text-c3'/>}
//                     {nameEdited && (
//                     <BsFillCheckCircleFill 
//                     className="text-c4 
//                     cursor-pointer"
//                     onClick={()=>{

//                     }}
//                     />
//                     )}
//                     <div
//                     contentEditable//means that we can edit the name of the user
//                     className='bg-transparent outline-none border-none text-center'
//                     id='displayNameEdit'
//                     onKeyUp={onkeyup} 
//                     onKeyDown={onkeydown} 
//                     >
//                         {currentUser.displayName}
//                     </div>
//                 </div>
//                 <span className='text-c3 text-sm'>
//                     {currentUser.email}
//                 </span>
//             </div>
// </div>
//         )
//     }
//   return (
//     <div className={` ${editProfile ? "w-[350px]" :"w-[80px] items-center" 
//     } 
//     flex flex-col justify-between py-5 shrink-0 transition-all`}
//     >
//         {editProfile ? (
// editProfileContainer()
//          ) : (

        
//         <div className='relative group cursor-pointer'>
//             {/* <div>Avatar</div> */}
//             <Avatar size="x-large" user={currentUser}/>
//             <div className='w-full h-full rounded-full bg-black/[0.5] absolute
//             top-0 left-0 justify-center items-center hidden group-hover:flex'>
//                 <BiEdit size={14}/>
//             </div>
//         </div>
// )}
//         <div className='flex gap-5 flex-col items-center'>
//             {/* <span>Icon</span>
//             <span>Icon</span> */}
//             <Icon
//             size="x-large"
//             className= "bg-green-500 hover:bg-gray-600"
//             icon= {<FiPlus size= {24}/>}
//             onClick = {()=>{}}
//             />

//             <Icon
//             size="x-large"
//             className= "hover: bg-c2"
//             icon= {<IoLogoutOutline size= {24}/>}
//             //onClick = {()=>{}}
//             onClick = {signOut}
//             />
//         </div>
//     </div>
//  )
// }

// export default LeftNav

import React, { useState } from "react";
import { BiEdit, BiCheck } from "react-icons/bi";
import Avatar from "./Avatar";
import { useAuth } from "@/context/authContext";
import Icon from "./Icon";


import { FiPlus } from "react-icons/fi";
import { IoLogOutOutline, IoClose } from "react-icons/io5";
import { MdPhotoCamera, MdAddAPhoto, MdDeleteForever } from "react-icons/md";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { profileColors } from "@/utils/constants";

import { toast } from "react-toastify";
import ToastMessage from "./ToastMessage";
import {doc, updateDoc } from "firebase/firestore";
import {db, auth, storage} from "@/firebase/firebase";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import UsersPopup from "./popup/UsersPopup";



const LeftNav = () => {
const [usersPopup, setUsersPopup] = useState(false);
const [editProfile, setEditProfile] = useState(false);
    const [nameEdited, setNameEdited] = useState(false);
    const { currentUser, signOut, setCurrentUser } = useAuth();

    const authUser= auth.currentUser;

    const uploadImageToFirestore = (file)=>{
        try {
            if(file){
                const storageRef = ref(storage, currentUser.displayName);

const uploadTask = uploadBytesResumable(storageRef, file);

// Register three observers:
// 1. 'state_changed' observer, called any time the state changes
// 2. Error observer, called on failure
// 3. Completion observer, called on successful completion
uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    console.log(error);
    // Handle unsuccessful uploads
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then( async(downloadURL) => {
      console.log('File available at', downloadURL);
      handleUpdateProfile("photo", downloadURL);
      await updateProfile(authUser,{
        photoURL:
        downloadURL,
      })
    });
  }
);
            }
            
        } catch (error) {
            console.log(error);
        }
    }

   
    const handleUpdateProfile= (type, value)=>{
    let obj= {...currentUser}//created a shallow copy of the user
    switch(type){
    case "color":
        obj.color = value;
        break;
        case "name":
            obj.displayName= value;
            break;
            case "photo":
            obj.photoURL= value;
            break;
            case "photo-remove":
            obj.photoURL= null;
            break;
            default: 
            break;
} 

try {
    toast.promise(
        async () => {
            const userDocRef= doc(db, "users", currentUser.uid)
            await updateDoc(userDocRef, obj)
            setCurrentUser(obj);

            if(type === "photo-remove"){
                await updateProfile(authUser , {
                    photoURL: null,
                });
            }
            if(type === "name"){
                await updateProfile(authUser , {
                    displayName: value,
                }); 
                setNameEdited(false);//means after editing the name it will change the edit icon to normal icon
            }
        },
        {
            pending: "Updating Profile",
            success: "Profile Updated Successfully.",
            error: "Profile update failed ",
        },
        {
            autoClose: 3000,
        }
    );
} catch (error) {
    console.error(error);
}
    };
const onkeyup = (event) =>{
                if(event.target.innerText.trim()!== currentUser.displayName){
                    setNameEdited(true);
                }else{
                    setNameEdited(false);
                }
            };
        
            const onkeydown= (event)=>{
                if(event.key === "Enter" && event.keyCode === 13){
                    event.preventDefault();//means that it will prevent from auto change the line to down
                }
            };


    const editProfileContainer = () => {
        return (
            <div className="relative flex flex-col items-center">
                    <ToastMessage />
                <Icon
                    size="small"
                    className="absolute top-0 right-5 hover:bg-c2"
                    icon={<IoClose size={20} />}
                    onClick={() => setEditProfile(false)}
                />
                <div className="relative group cursor-pointer">
                    <Avatar size="xx-large" user={currentUser} />
                    <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex">
                        <label htmlFor="fileUpload">
                            {currentUser.photoURL ? (
                                <MdPhotoCamera size={34} />
                            ) : (
                                <MdAddAPhoto size={34} />
                            )}
                        </label>
                        <input 
                id='fileUpload'
                    type="file" 
                    onChange={(e)=>
                    uploadImageToFirestore(e.target.files[0])}
                style={{display :"none"}}
                />
                    </div>

                    {currentUser.photoURL && (
                        <div
                            className="w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute right-0 bottom-0"
                            onClick={() => handleUpdateProfile("photo-remove")}//here we will remove the profile
                        >
                            <MdDeleteForever size={14} />
                        </div>
                    )}
                </div>

                <div className="mt-5 flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        {!nameEdited && <BiEdit className="text-c3" />}
                        {nameEdited && (
                            <BsFillCheckCircleFill
                                className="text-c4 cursor-pointer"
                                onClick={() => {
                                    handleUpdateProfile(
                                        "name",
                                        document.getElementById(
                                            "displayNameEdit"// to change and edit the name and to change the color of the user
                                        ).innerText
                                    );
                                }}
                            />
                        )}
                        <div
                            contentEditable
                            className="bg-transparent outline-none border-none text-center"
                            id="displayNameEdit"
                            onKeyUp={onkeyup}
                            onKeyDown={onkeydown}
                        >
                            {currentUser.displayName}
                        </div>
                    </div>
                    <span className="text-c3 text-sm">{currentUser.email}</span>
                </div>

                <div className="grid grid-cols-5 gap-4 mt-5">
                    {profileColors.map((color, index) => (
                        <span
                            key={index}
                            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-125"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                handleUpdateProfile("color", 
                                color);//to change the color of the ser profile
                            }}
                        >
                            {color === currentUser.color && (
                                <BiCheck size={24} />
                            )}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div
            className={`${
                editProfile ? "w-[350px]" : "w-[80px] items-center"
            } flex flex-col justify-between py-5 shrink-0 transition-all`}
        >
            {editProfile ? (
                editProfileContainer()
            ) : (
                <div
                    className="relative group cursor-pointer"
                    onClick={() => setEditProfile(true)}
                >
                    <Avatar size="large" user={currentUser} />
                    <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex">
                        <BiEdit size={14} />
                    </div>
                </div>
            )}

            <div
                className={`flex gap-5 ${
                    editProfile ? "ml-5" : "flex-col items-center"
                }`}
            >
                <Icon
                    size="x-large"
                    className="bg-green-500 hover:bg-gray-600"
                    icon={<FiPlus size={24} />}
                    onClick={() => setUsersPopup(!usersPopup)}
                />
                <Icon
                    size="x-large"
                    className="hover:bg-c2"
                    icon={<IoLogOutOutline size={24} />}
                    onClick={signOut}
                />
            </div>
            {usersPopup && <UsersPopup onHide= {()=>
            setUsersPopup(false)} title= "Find Users"/>}
        </div>
    );
};

export default LeftNav;
