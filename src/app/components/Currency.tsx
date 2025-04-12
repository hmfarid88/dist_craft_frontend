import React, { useState } from 'react'
import { useAppSelector } from '../store';
import { toast } from 'react-toastify';

const Currency = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);
    const [currency, setCurrency] = useState("")

    const submitCurrency = async (e: any) => {
        e.preventDefault();
        if (!currency) {
            toast.warning("All field is required");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/currencyEntry?username=${username}&currency=${currency}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                toast.error("Currency info not submitted !");
                return;
            } else {
                toast.success("Currency added successfully.")

            }
        } catch (error: any) {
            toast.error("An error occurred: " + error.message);
        } finally {
            setPending(false);
        }

    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col gap-3">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">CURRENCY NAME</span>
                    </div>
                    <select className='select select-bordered' onChange={(e: any) => { setCurrency(e.target.value) }}>
                        <option selected disabled>Select . . .</option>
                        <option value="BDT">BDT (৳)</option>
                        <option value="$">USD ($)</option>
                        <option value="€">EUR (€)</option>
                        <option value="¥">CNY (¥)</option>
                        <option value="SAR">SAR (SAR)</option>
                        <option value="INR">INR (INR)</option>
                    </select>
                </label>
                <label className="form-control w-full max-w-xs">
                    <button onClick={submitCurrency} disabled={pending} className="btn btn-outline btn-success">{pending ? "Submitting..." : "SUBMIT"}</button>
                </label>
            </div>
        </div>
    );
};


export default Currency