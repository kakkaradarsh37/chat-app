// import { useAuth } from '@/context/authContext'
// import React, { useEffect } from 'react'
// import { useRouter } from 'next/router'
// import Loader from '@/components/Loader';


// const Home = () => {
//   const router= useRouter();//here we created a instance in router variable of useRouter 
//   const {signOut, currentUser, isLoading} = useAuth();

// useEffect(()=>{
//   if(!isLoading || !currentUser){
//     router.push("/login")
//   }
// }, [currentUser, isLoading]);

//   return !currentUser ?(
//     <Loader/>
//   ) :(
//     // <div>
//     //   <button onClick={signOut}>Sign Out</button>
//     // </div>
//     <div className='bg-c1 flex h-[100vh]'>
//       <div className='flex w-full shrink-0'>
//       <div>Left Nav</div>
      

//       <div className='flex bg-c2 grow'>
//       <div>Sidebar</div>
//       <div>Chat</div>
//       </div>

// </div>
//     </div>
//   )
// }

// export default Home;

import React, { useEffect } from "react";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import LeftNav from "@/components/LeftNav";
import Chats from "@/components/Chats";
import Chat from "@/components/Chat";
import { useChatContext } from "@/context/chatContext";

const Home = () => {
    const router = useRouter();
    const { signOut, currentUser, isLoading } = useAuth();
    const {data} = useChatContext();

    useEffect(() => {
        if (!isLoading && !currentUser) {
            router.push("/login");
        }
    }, [currentUser, isLoading]);

    return !currentUser ? (
        <Loader />
    ) : (
        // <div>
        //     <button onClick={signOut}>Sign Out</button>
        // </div>
        <div className="bg-c1 flex h-[100vh]">
            <div className="flex w-full shrink-0">
                <LeftNav />

                <div className="flex bg-c2 grow">
                    <div className="w-[400px] p-5 overflow-auto scrollbar shrink-0 border-r border-white/[0.05]">
                        <div className="flex flex-col h-full">
                            <Chats />
                        </div>
                    </div>
                   { data.user && <Chat/>} 
                   {/* if data is there in the chat */}
                </div>
            </div>
        </div>
    );
};

export default Home;
