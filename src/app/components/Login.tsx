"use client"
import { useRouter } from 'next/navigation';
import React, { useState, FormEvent } from 'react'
import { toast } from 'react-toastify';
import { createSession } from '../lib/auth';
import { useAppDispatch } from "@/app/store";
import { addUser } from "@/app/store/usernameSlice";
import { uid } from "uid";

const Login = () => {
    const [pending, setPending] = useState(false);
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const dispatch = useAppDispatch();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!username) {
            toast.error("Username is required !")
            return;
        }
        if (!password) {
            toast.error("Password is required !")
            return;
        }
        setPending(true);

        try {
            const response = await fetch(`${apiBaseUrl}/auth/userLogin?username=${username}&password=${password}`);
            const data = await response.json();
            if (!response.ok) {
                toast.info(data.message);
                return;
            } else {
                const status: string = data.status;
                if (status === "OFF") {
                    toast.info("Sorry, Your login access is off !");
                    return;
                } else {
                    const roles: string = data.roles;
                    createSession(username, roles);
                    dispatch(addUser({ id: uid(), username }));
                    if (data.roles === 'ROLE_USER') {
                        router.push("/dashboard");
                    } else if (data.roles === 'ROLE_ADMIN') {
                        router.push("/admin-dashboard");
                    }
                    toast.success("Congrats, login successful!");
                }
            }

        } catch (error) {
            toast.error("Invalid user request !")
        } finally {
            setPending(false);
            setUsername("");
            setPassword("");
        }

    }
    return (
        <div>
            <form onSubmit={handleLogin} >
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">USER NAME</span>
                    </label>
                    <label className="input input-bordered flex items-center  gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                        <input type="text" name='username' value={username} onChange={(e: any) => setUsername(e.target.value)} disabled={pending} className="grow" />
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">PASSWORD</span>
                    </label>
                    <label className="input input-bordered flex items-center  gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                        <input type="password" name='password' value={password} onChange={(e: any) => setPassword(e.target.value)} disabled={pending} className="grow" />
                    </label>
                </div>
                <div className="form-control mt-6">
                    <button type='submit' disabled={pending} className="btn bg-gradient-to-r from-cyan-500 to-blue-500 font-bold">{pending ? 'Logging in...' : 'LOGIN'}</button>
                </div>
            </form>
        </div>
    )
}

export default Login