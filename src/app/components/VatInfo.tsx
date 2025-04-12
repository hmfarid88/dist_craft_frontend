"use client"
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";

const VatInfo = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);

    const [percent, setPercent] = useState("");

    const submitVatInfo = async (e: any) => {
        e.preventDefault();
        if (!percent) {
            toast.warning("All field is required");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/vatEntry`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ percent, username }),
            });

            if (!response.ok) {
                toast.error("Vat info not submitted !");
                return;
            } else {
                toast.success("Info added successfully.")
                setPercent("");

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
                        <span className="label-text-alt">VAT (%)</span>
                    </div>
                    <input type="number" name="item" onChange={(e: any) => setPercent(e.target.value)} value={percent} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <button onClick={submitVatInfo} disabled={pending} className="btn btn-outline btn-success">{pending ? "Submitting..." : "SUBMIT"}</button>
                </label>
            </div>

        </div>

    )
}

export default VatInfo