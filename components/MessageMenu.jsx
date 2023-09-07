import React, { useEffect, useReducer, useRef } from 'react'
import ClickAwayListener from 'react-click-away-listener'

const MessageMenu = ({showMenu , setShowMenu, self, deletePopupHandler, setEditMsg}) => {
    const handleClickAway=()=>{
        setShowMenu(false);
    };
    const ref= useRef();

    useEffect(()=>{
        ref?.current?.scrollIntoViewIfNeeded();
    }, [showMenu]);//here when the user will click on menu then automatically if will scroll down on the bottom chat
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
    <div className={`w-[200px] absolute bg-c0 z-10 rounded-md overflow-hidden top-8 ${self ? "right-0" : "left-0"}`}>
        <ul className='flex flex-col py-2'>
           {self && <li className='flex items-center py-3 px-5 hover:bg-black cursor-pointer'
           onClick={(e)=>{
           e.stopPropagation();
           setEditMsg();
           setShowMenu(false)//means on clicking the edit message the menu will get closed
           }}
           >
                Edit Message
            </li>}
            {/* means edit message option will only be shown in the login user menu who sended the  message */}
            <li className='flex items-center py-3 px-5 hover:bg-black cursor-pointer'onClick={ (e)=>{
                e.stopPropagation();//means when the deleteMsgPopup will appear the menu will get automatically disappeared
            deletePopupHandler(true);
            }}
            >
                Delete Message
            </li>
        </ul>

    </div>
 </ClickAwayListener> 
 )
}

export default MessageMenu