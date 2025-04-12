'use client'
import React from 'react'
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FcBusinessman } from "react-icons/fc";
import { deleteSession } from '../lib/auth';
import { useAppSelector, useAppDispatch } from "@/app/store";
import { deleteUser } from "@/app/store/usernameSlice"
import Theme from './Theme';

const Header: React.FC = () => {
  const username = useAppSelector((state) => state.username.username);
  const dispatch = useAppDispatch();


  const handleLogout = () => {
    dispatch(deleteUser());
    deleteSession();
  };

  return (
    <div className="flex flex-col md:flex-row navbar bg-base-100 sticky top-0 z-40">
      <div className="flex-1">
        <a className="btn btn-ghost uppercase text-xl"> {username ? username.username : 'Guest'}</a>
      </div>

      <div className="flex-none gap-2">
        <Theme/>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <FcBusinessman className='text-accent' size={40} />
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content dropdown-hover bg-base-100 rounded-box w-40">
            <li>
              <a onClick={handleLogout} className='btn'> <RiLogoutCircleRLine size={16} /> LOGOUT </a>

            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Header