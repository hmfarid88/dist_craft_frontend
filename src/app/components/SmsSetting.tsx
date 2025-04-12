import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../store';

const SmsSetting = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [status, setStatus] = useState(false);
    const [qty, setQty] = useState(0);

    useEffect(() => {
        fetch(`${apiBaseUrl}/smsapi/sms/status?username=${username}`)
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status === "ON");
                setQty(data.qty);
            })
            .catch((err) => console.error("Error fetching status:", err));
    }, [apiBaseUrl, username]);

    const handleToggleChange = async () => {
        const newStatus = !status;
        setStatus(newStatus);

        try {
            await fetch(
                `${apiBaseUrl}/smsapi/sms/update-status?username=${username}&status=${newStatus}`,
                { method: "PUT" }
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-end justify-end pr-5">
                <div className="indicator border rounded-lg">
                    <span className="indicator-item badge badge-success">{qty}</span>
                    <button className="btn btn-sm">Balance</button>
                </div>
            </div>
            <div className="flex">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">{status ? "SMS ON" : "SMS OFF"}</span>
                    </div>
                    <input type="checkbox" checked={status} onChange={handleToggleChange} className="toggle toggle-lg toggle-success" />
                </label>
            </div>
        </div>
    )
}

export default SmsSetting