"use client"
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";

const SrInfo = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);

    const [srName, setSrName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [area, setArea] = useState("");

    const submitSrInfo = async (e: any) => {
        e.preventDefault();
        if (!srName || !phoneNumber || !address || !area) {
            toast.warning("All field is required");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/shop/addSrInfo`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ srName, phoneNumber, address, area, username }),
            });

            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message);
                return;
            } else {
                toast.success("Info added successfully.")
                setSrName("");
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
                        <span className="label-text-alt">SR NAME</span>
                    </div>
                    <input type="text" name="item" onChange={(e: any) => setSrName(e.target.value)} value={srName} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
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
                    <button onClick={submitSrInfo} disabled={pending} className="btn btn-outline btn-success">{pending ? "Submitting..." : "SUBMIT"}</button>
                </label>
            </div>

        </div>

    )
}

export default SrInfo