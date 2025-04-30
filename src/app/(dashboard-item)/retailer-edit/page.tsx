"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/app/store';


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const searchParams = useSearchParams();
    const retailer = searchParams.get('retailerName');
    const [pending, setPending] = useState(false);

    const [id, setId] = useState("");
    const [retailerName, setRetailerName] = useState("");
    const [area, setArea] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        if (!retailer) return;
        fetch(`${apiBaseUrl}/payment/getRetailerInfoByRetailer?username=${username}&retailerName=${retailer}`)
            .then(response => response.json())
            .then(data => {
                setId(data.id);
                setRetailerName(data.retailerName);
                setArea(data.area);
                setMobileNumber(data.phoneNumber);
                setAddress(data.address);
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl, username, retailer]);

    const handleUpdateSubmit = async (e: any) => {
        e.preventDefault();
        if (!retailerName || !area || !mobileNumber || !address) {
            toast.warning("Item is empty !")
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/payment/updateRetailerInfo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ retailerName, area, phoneNumber:mobileNumber, address }),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                toast.success("Information updated successfully.");

            }

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setPending(false);

        }
    };

    return (
        <div className='container-2xl min-h-screen pb-5'>
            <div className="flex flex-col w-full items-center justify-center p-2">

                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">RETAILER NAME</span>
                    </div>
                    <input type='text' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={retailerName} onChange={(e) => setRetailerName(e.target.value)} />
                </label>

                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">AREA NAME</span>
                    </div>
                    <input type='text' name='area' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={area} onChange={(e) => setArea(e.target.value)} placeholder='Type Here' />
                </label>
               
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">MOBILE NUMBER</span>
                    </div>
                    <input type='text' maxLength={11} minLength={11} className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={mobileNumber} onChange={(e: any) => setMobileNumber(e.target.value.replace(/\D/g, ""))} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">ADDRESS</span>
                    </div>
                    <input type='text' name='address' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-5">
                    <button
                        className="btn btn-success w-full"
                        onClick={(e) => {
                            if (window.confirm("Are you sure you want to update this item?")) {
                                handleUpdateSubmit(e);
                            }
                        }}
                        disabled={pending}
                    >
                        {pending ? "Updating..." : "UPDATE"}
                    </button>

                </label>
            </div>

        </div>
    )
}

export default Page