"use client"
import React, { useEffect, useState } from 'react'
interface User {
    email: string;
    username: string;
    password: string;
    roles: string;
    status: string;
}
const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [allUsers, setAllUsers] = useState<User[]>([]);
    
    useEffect(() => {
        fetch(`${apiBaseUrl}/auth/user/userList`)
            .then(response => response.json())
            .then(data => {
                setAllUsers(data);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, [apiBaseUrl]);

    const toggleStatus = async (index: number, username: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        const updatedUsers = allUsers.map((user, i) =>
            i === index ? { ...user, status: newStatus } : user
          );
        setAllUsers(updatedUsers);
    
        try {
          await fetch(
            `${apiBaseUrl}/auth/update-status?username=${username}&status=${newStatus}`,
            { method: "PUT" }
          );
        } catch (error) {
          console.error("Error updating status:", error);
        }
      };

    return (
        <div className='container-2xl'>
            <div className="flex items-center justify-center p-10">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>EMAIL</th>
                            <th>USER NAME</th>
                            <th>ROLES</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers?.map((user, index) => (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td>{user.roles}</td>
                                <td>{user.status}</td>
                                <td>
                                    <label className="flex form-control w-full max-w-xs">
                                        <input type="checkbox" checked={user.status==='ON'}  onChange={() => toggleStatus(index, user.username, user.status)} className="toggle toggle-md toggle-success" />
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Page