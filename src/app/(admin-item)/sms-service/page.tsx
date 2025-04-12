"use client"
import React, { useEffect, useState } from 'react'
import { FaCommentSms } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { toast } from 'react-toastify';
interface User {
    username: string;
    status: string;
    qty: number;
}
const Page = () => {
    const [pending, setPending] = useState(false);
    const [username, setUserName] = useState("");
    const [smsqty, setSmsQty] = useState('');
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleSmsAdd = async (e: any) => {
        e.preventDefault();

        if (!username.trim() || !smsqty) {
            toast.error("All fields are required!");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/smsapi/sms/update-smsqty?username=${username}&newQty=${smsqty}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (response.ok) {
                setUserName("");
                setSmsQty('');
                toast.success("Sms added successfully!");

            } else {
                const data = await response.json();
                toast.error(data.message || "Error adding user.");
            }
        } catch (error: any) {
            toast.error(error.message || "Error adding user.")
        } finally {
            setPending(false);
        }
    };
    const [allUsers, setAllUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/smsapi/sms/allSmsUser`)
            .then(response => response.json())
            .then(data => {
                setAllUsers(data);

            })
            .catch(error => console.error('Error fetching users:', error));
    }, [apiBaseUrl, smsqty]);
    return (
        <div className='container-2xl'>
            <div className="flex flex-col w-full items-center justify-center pt-10">
                <div className="flex">
                    <div className="collapse collapse-arrow bg-base-200">
                        <input type="checkbox" className="peer" />
                        <div className="collapse-title text-sm font-medium">ADD SMS</div>
                        <div className="collapse-content">
                            <div className="card shadow shadow-slate-700 w-full max-w-sm p-5">
                               
                                    <div className="flex flex-col">
                                        <div className="flex p-2">
                                            <label className="input input-bordered flex items-center w-full max-w-xs gap-2">
                                                <FaRegUser />
                                                <input type="text" name='name' value={username} onChange={(e: any) => setUserName(e.target.value)} className="grow" placeholder="Username" />
                                            </label>
                                        </div>
                                        <div className="flex p-2">
                                            <label className="input input-bordered flex items-center w-full max-w-xs gap-2">
                                                <FaCommentSms />
                                                <input type="number" value={smsqty} name='smsqty' onChange={(e: any) => setSmsQty(e.target.value)} className="grow" placeholder='Sms Qty' />
                                            </label>
                                        </div>

                                        <div className="flex p-2">
                                            <button onClick={handleSmsAdd} className='btn btn-success w-full max-w-xs'>{pending ? "Submitting..." : "ADD SMS"}</button>
                                        </div>
                                    </div>
                               
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex p-5">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>USER NAME</th>
                                <th>SMS STATUS</th>
                                <th>SMS QTY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers?.map((user, index) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{user.username}</td>
                                    <td>{user.status}</td>
                                    <td>{user.qty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
       
        </div>
    )
}

export default Page