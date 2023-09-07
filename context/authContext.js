// import { auth, db } from "@/firebase/firebase";
// import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";//passed as an alice
// import { doc, getDoc } from "firebase/firestore";
// import { createContext, useContext, useEffect, useState } from "react";//contextApi is used because when we login it will be redirected to the next page


// const UserContext= createContext();


// export const UserProvider= ({children})=>{
//     const [currentUser, setCurrentUser]= useState(null);
//     const [isLoading, setIsLoading]= useState(true);

// const clear= ()=>{
//     setCurrentUser(null);
//     setIsLoading(false);
// }
// const authStateChanged= async(user)=>{
//     setIsLoading(true);
//     if(!user){
//         clear()
//         return;
//     }
//     const userDoc= await getDoc(doc(db,"users", user.uid ));
//     setCurrentUser(userDoc.data());
//     setIsLoading(false)
// };

// const signOut= ()=>{
//     authSignOut(auth).then(()=> clear())
// }
//  useEffect(()=>{
//     const unsubscribe= onAuthStateChanged(auth, authStateChanged);
//     return()=> unsubscribe();
//  },[]);

//     return(
//         <UserContext.Provider
//         value={{
//             currentUser,
//             setCurrentUser,
//             isLoading,
//             setIsLoading,
//             signOut,
//         }}
//         >
//         {children}
//         </UserContext.Provider>
//     )
// }
// export const useAuth = ()=> useContext(UserContext);


import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const clear = async () => {
        try {
            if (currentUser) {
                await updateDoc(doc(db, "users", currentUser.uid), {
                    isOnline: false,//added the functionality to check whether the user is online or not
                });
            }
            setCurrentUser(null);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const authStateChanged = async (user) => {
        setIsLoading(true);
        if (!user) {
            clear();
            return;
        }

        const userDocExist = await getDoc(doc(db, "users", user.uid));
        if (userDocExist.exists()) {
            await updateDoc(doc(db, "users", user.uid), {
                isOnline: true,
            });
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));

        setCurrentUser(userDoc.data());
        setIsLoading(false);
    };

    const signOut = () => {
        authSignOut(auth).then(() => clear());
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                isLoading,
                setIsLoading,
                signOut,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);
