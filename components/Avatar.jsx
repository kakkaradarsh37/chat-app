// import Image from 'next/image';
// import React from 'react'

// const Avatar = ({size , user, onClick}) => {//destructured
//     const s=
//     size=== "small"
//     ? 32
//     : size=== "medium"
//     ?36
//     : size=== "x-large"
//     ?56
//     : size=== "xx-large"
//     ?96
//     :40;

//     const c=
//     size=== "small"
//     ? "w-8 h-8"
//     : size=== "medium"
//     ? "w-9 h-9"
//     : size=== "x-large"
//     ? "w-10 h-10"
//     : size=== "xx-large"
//     ? "w-14 h-14"
//     :"w-24 h-24";

//     const f=
//     size=== "x-large"
//     ? "text-2xl"
//     : size=== "xx-large"
//     ? "text-4xl"
//     :"text-base ";
//     return (
//     <div
//     className={`${c}rounded-full flex items-center justify-center text-base shrink-0 relative`} 
//     style= {{backgroundColor: user?.color}}
//     onClick={onClick}
//     >
//         {user?.isOnline && (//to check the green dot herer 
//             <>
//             {size=== "large" && (
//         <span className='w-[10px] h-[10px] bg-green-500 rounded-full absolute bottom-[2px] right-[2px]'></span>)}

// {       size=== "x-large" && (
//         <span className='w-[12px] h-[12px] bg-green-500 rounded-full absolute bottom-[3px] right-[3px]'></span>)}
//         </>
//         )}
       
//         {user?.photoURL ? (
//             <div className={`${c} overflow-hidden rounded-full` }>
//                 <Image
//                 src={user?.photoURL}
//                 alt= "User Avatar"
//                 width= {s}
//                 height={s}
//                 />
//             </div>
//         ) : (
//             <div className={`uppercase font-semibold ${f}`}>
//                 {user?.displayName?.charAt(0)}
//             </div>
//         )}

//     </div>
//   )
// }

// export default Avatar

import React from "react";
import Image from "next/image";
const Avatar = ({ size, user, onClick }) => {
    const s =
        size === "small"
            ? 32
            : size === "medium"
            ? 36
            : size === "x-large"
            ? 56
            : size === "xx-large"
            ? 96
            : 40;

    const c =
        size === "small"
            ? "w-8 h-8"
            : size === "medium"
            ? "w-9 h-9"
            : size === "large"
            ? "w-10 h-10"
            : size === "x-large"
            ? "w-14 h-14"
            : "w-24 h-24";

    const f =
        size === "x-large"
            ? "text-2xl"
            : size === "xx-large"
            ? "text-4xl"
            : "text-base";

    return (
        <div
            className={`${c} rounded-full flex items-center justify-center text-base shrink-0 relative`}
            style={{ backgroundColor: user?.color }}
            onClick={onClick}
        >
            {user?.isOnline && (
                <>
                    {size === "large" && (
                        <span className="w-[10px] h-[10px] bg-green-500 rounded-full absolute bottom-[2px] right-[2px]"></span>
                    )}

                    {size === "x-large" && (
                        <span className="w-[12px] h-[12px] bg-green-500 rounded-full absolute bottom-[3px] right-[3px]"></span>
                    )}
                </>
            )}

            {user?.photoURL ? (
                <div className={`${c} overflow-hidden rounded-full`}>
                    <Image
                        src={user?.photoURL}
                        alt="User Avatar"
                        width={s}
                        height={s}
                    />
                </div>
            ) : (
                <div className={`uppercase font-semibold ${f}`}>
                    {user?.displayName?.charAt(0)}
                </div>
            )}
        </div>
    );
};

export default Avatar;
