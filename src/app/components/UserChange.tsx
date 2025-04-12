"use client"
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";

const UserChange = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);

    const [password, setPassword] = useState("");

    const submitAdminInfo = async (e: any) => {
        e.preventDefault();
        if (!password) {
            toast.warning("All field is required");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/auth/userChange?username=${username}&newPassword=${password}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
             
            });

            if (!response.ok) {
                toast.info("Password is not changed !");
                return;
            } else {
                toast.success("Password changed successfully.")
                setPassword("");

            }
        } catch (error: any) {
            toast.error("An error occurred: " + error.message);
        } finally {
            setPending(false);
        }
    }
 
     return (

        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col gap-3 pb-5">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">PASSWORD</span>
                    </div>
                    <input type="text" name="item" onChange={(e: any) => setPassword(e.target.value)} value={password} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <button onClick={submitAdminInfo} disabled={pending} className="btn btn-outline btn-success">{pending ? "Submitting..." : "SUBMIT"}</button>
                </label>
            </div>
          
        </div>

    )
}

export default UserChange