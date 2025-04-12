"use client"
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";

const RetailerInfo = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);

    const [rName, setrName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [area, setArea] = useState("");

    const submitrInfo = async (e: any) => {
        e.preventDefault();
        if (!rName || !phoneNumber || !address || !area) {
            toast.warning("All field is required");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/shop/addrInfo`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ retailerName:rName, phoneNumber, address, area, username }),
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message);
                return;
            } else {
                toast.success("Info added successfully.")
                setrName("");
                setPhoneNumber("");
                setAddress("");
                setArea("")
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
                        <span className="label-text-alt">RETAILER NAME</span>
                    </div>
                    <input type="text" name="item" onChange={(e: any) => setrName(e.target.value)} value={rName} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">PHONE NUMBER</span>
                    </div>
                    <input type="text" maxLength={11} name="item" onChange={(e: any) => setPhoneNumber(e.target.value.replace(/\D/g, ""))} value={phoneNumber} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">ADDRESS</span>
                    </div>
                    <input type="text" name="item" onChange={(e: any) => setAddress(e.target.value)} value={address} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">AREA</span>
                    </div>
                    <input type="text" name="item" onChange={(e: any) => setArea(e.target.value)} value={area} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <button onClick={submitrInfo} disabled={pending} className="btn btn-outline btn-success">{pending ? "Submitting..." : "SUBMIT"}</button>
                </label>
            </div>

        </div>

    )
}

export default RetailerInfo