// import Link from 'next/link'
// import React, { useEffect, useState } from 'react'
// import { IoLogoFacebook, IoLogoGoogle } from "react-icons/io"

// import { auth } from "@/firebase/firebase";
// import { signInWithEmailAndPassword, signInWithPopup , GoogleAuthProvider, FacebookAuthProvider, sendPasswordResetEmail} from 'firebase/auth';
// import { useAuth } from '@/context/authContext';

// import { useRouter } from 'next/router';
// const gProvider = new GoogleAuthProvider();
// const fProvider = new FacebookAuthProvider();//here also created an instance here

// import ToastMessage from "@/components/ToastMessage";
// import { toast } from 'react-toastify';
// import Loader from '@/components/Loader';


// const Login = () => {
//     const router= useRouter();
//     const {currentUser, isLoading}= useAuth();
//     const [email, setEmail] = useState(""); 
//     useEffect(()=>{
//         if(!isLoading && currentUser){
//             //means user logged in
//             router.push("/")
//         }
//     },[currentUser, isLoading])//dependency array when we will pass currentUser and isLoading if any one is true then the useEffect method is called and whenever the value is changed the useEffect method will be again called



//     const handleSubmit= async(e)=>{
//         e.preventDefault();//prevents from reloading when we click on Login
//         const email= e.target[0].value;
//         const password= e.target[1].value;
//         try {
//             await signInWithEmailAndPassword(auth, email, password)
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const signInWithGoogle = async()=>{
//         try {
//             await signInWithPopup(auth, gProvider)
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const signInWithFacebook = async()=>{
//         try {
//             await signInWithPopup(auth, fProvider)
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const resetPassword = async()=>{
//         try {
//             toast.promise(
//                 async()=>{
//                 await
//                 sendPasswordResetEmail(auth, email)//"email id")
//                 },
//                 {
//                     pending: "Generating reset link",
//                     success: "Reset email send to your registered email id",
//                     error: "You may have entered wrong email id!"
//                 },
//                 {
//                     autoClose:  5000, //means after 5000 ms or 5 seconds
//                 }
//             );
//         } catch (error) {
//             console.log(error);
//         }
//     }
//   return  isLoading || (!isLoading && currentUser) ? 
//   (
//     <Loader/>
//   ): (
//     <div className='h-[100vh] flex justify-center items-center bg-c1'>
//         <div className='flex items-center flex-col'>
//             <div className='text-center'>
//                 <div className='text-4xl font-bold'>
//                     Login To Your Account
//             </div>
//            <div className='mt-3 text-c3'>
//              Connect and chat with anyone, anywhere 
//              </div>
//             </div>
//             <div className='flex items-center gap-2 w-full mt-10 mb-5'>
//             <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]'
//             onClick={signInWithGoogle}
//             >
//                 {/* <div className='flex items-center justify-center p-[1px]'> */}
//                     <div className='flex items-center justify-center gap-3 text-white font-semibold bg-c1 w-full h-full rounded-md'>
//                     <IoLogoGoogle size={24}/>
//                         <span>Login With Google</span>
//                     </div>
//                 </div>
            

//             <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]'
//             onClick={signInWithFacebook}
//             >
//                     <div className='flex items-center justify-center gap-3 text-white font-semibold bg-c1 w-full h-full rounded-md'>
//                         <IoLogoFacebook size={24}/>
//                         <span>Login With Facebook</span>
//                     </div>
//                 </div>
//             </div>
            
//             <div className='flex items-center gap-1'>
//                 <span className='w-5 h-[1px] bg-c3'></span>
//                 <span className='text-c3 font-semibold'>OR</span>
//                 <span className='w-5 h-[1px] bg-c3'></span>

//             </div>

//             <form className='flex flex-col items-center gap-3 w-[500px] mt-5'
//             onSubmit={handleSubmit}
//             >
//                 <input
//                 type='email'
//                 placeholder='Email'
//                 className='w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3'
//                 autoComplete='off'
//                 onChange={(e)=>setEmail(e.target.value)}
//                 />

// <input
//                 type='password'
//                 placeholder='Password'
//                 className='w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3'
//                 autoComplete='off'
//                 />

//                 <div className='text-right w-full text-c3'>
//                     <span className='cursor-pointer'>Forgot Password?</span>
//                      </div>

//                     <button className='mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
//                         Login To Your Account
//                     </button>
//             </form>

//             <div className='flex justify-center gap-1 text-c3 mt-5'>
//                 <span>Not a member yet?</span>
//                 <   Link 
//                 href="/register"
//                 className='font-semibold text-white underline underline-offset-2 cursor-pointer'
//                 >
//                     Register Now
//                     </Link>

//             </div>
            
//             </div>
//             </div>

//   )
// }

// export default Login

import Link from "next/link";
import React, { useEffect, useState } from "react";

import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";

import { auth } from "@/firebase/firebase";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
} from "firebase/auth";
import { useAuth } from "@/context/authContext";

import { useRouter } from "next/router";

const gProvider = new GoogleAuthProvider();
const fProvider = new FacebookAuthProvider();

import ToastMessage from "@/components/ToastMessage";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

const Login = () => {
    const router = useRouter();
    const { currentUser, isLoading } = useAuth();
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (!isLoading && currentUser) {
            // it means user logged in
            router.push("/");
        }
    }, [currentUser, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error(error);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, gProvider);
        } catch (error) {
            console.error(error);
        }
    };

    const signInWithFacebook = async () => {
        try {
            await signInWithPopup(auth, fProvider);
        } catch (error) {
            console.error(error);
        }
    };

    const resetPassword = async () => {
        try {
            toast.promise(
                async () => {
                    await sendPasswordResetEmail(auth, email);
                },
                {
                    pending: "Generating reset link",
                    success: "Reset email send to your registered email id.",
                    error: "You may have entered wrong email id!",
                },
                {
                    autoClose: 5000,
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    return isLoading || (!isLoading && currentUser) ? (
        <Loader />
    ) : (
        <div className="h-[100vh] flex justify-center items-center bg-c1">
            <ToastMessage />
            <div className="flex items-center flex-col">
                <div className="text-center">
                    <div className="text-4xl font-bold">
                        Login to Your Account
                    </div>
                    <div className="mt-3 text-c3">
                        Connect and chat with anyone, anywhere
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full mt-10 mb-5">
                    <div
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]"
                        onClick={signInWithGoogle}
                    >
                        <div className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 w-full h-full rounded-md">
                            <IoLogoGoogle size={24} />
                            <span>Login with Google</span>
                        </div>
                    </div>

                    <div
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]"
                        onClick={signInWithFacebook}
                    >
                        <div className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 w-full h-full rounded-md">
                            <IoLogoFacebook size={24} />
                            <span>Login with Facebook</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <span className="w-5 h-[1px] bg-c3"></span>
                    <span className="text-c3 font-semibold">OR</span>
                    <span className="w-5 h-[1px] bg-c3"></span>
                </div>

                <form
                    className="flex flex-col items-center gap-3 w-[500px] mt-5"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
                        autoComplete="off"
                    />
                    <div className="text-right w-full text-c3">
                        <span
                            className="cursor-pointer"
                            onClick={resetPassword}
                        >
                            Forgot Password?
                        </span>
                    </div>
                    <button className="mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        Login to Your Account
                    </button>
                </form>

                <div className="flex justify-center gap-1 text-c3 mt-5">
                    <span>Not a member yet?</span>
                    <Link
                        href="/register"
                        className="font-semibold text-white underline underline-offset-2 cursor-pointer"
                    >
                        Register Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
