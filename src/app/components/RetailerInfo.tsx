"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";
import { FaRegEdit } from 'react-icons/fa';
import Select from 'react-select';
import { useRouter } from 'next/navigation';

const RetailerInfo = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);
    const router=useRouter();

    const [rName, setrName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [area, setArea] = useState("");
    const [retailer, setRetailer] = useState("");

    const handleEdit = (e: any) => {
        e.preventDefault();
        if (!retailer) {
            toast.warning("Retailer name  is required !");
            return;
        }
        router.push(`/retailer-edit?retailerName=${retailer}`);
        setRetailer("");
    }
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
                body: JSON.stringify({ retailerName: rName, phoneNumber, address, area, username }),
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

    const [retailerOption, setRetailerOption] = useState([]);
    useEffect(() => {

        fetch(`${apiBaseUrl}/payment/getRetailerInfo?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.retailerName,
                    label: `${item.retailerName} (${item.area})`
                }));
                setRetailerOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl, username]);
    return (

        <div className="flex flex-col items-center justify-center">
            <div className="flex w-full items-end justify-end">
                <a href="#my_modal_retailer_edit" className="btn btn-square btn-ghost"><FaRegEdit size={24} /></a>
            </div>
            <div className="flex flex-col gap-3">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">RETAILER NAME</span>
                    </div>
                    <input type="text" name="retailer" onChange={(e: any) => setrName(e.target.value)} value={rName} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">PHONE NUMBER</span>
                    </div>
                    <input type="text" maxLength={11} name="phone" onChange={(e: any) => setPhoneNumber(e.target.value.replace(/\D/g, ""))} value={phoneNumber} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">ADDRESS</span>
                    </div>
                    <input type="text" name="address" onChange={(e: any) => setAddress(e.target.value)} value={address} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">AREA</span>
                    </div>
                    <input type="text" name="area" onChange={(e: any) => setArea(e.target.value)} value={area} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <button onClick={submitrInfo} disabled={pending} className="btn btn-outline btn-success">{pending ? "Submitting..." : "SUBMIT"}</button>
                </label>
            </div>
            <div className="modal sm:modal-middle" role="dialog" id="my_modal_retailer_edit">
                <div className="modal-box">
                    <div className="flex w-full gap-5 h-72">
                        <label className="w-full max-w-xs gap-5">
                            <div className="label">
                                <span className="label-text-alt">RETAILER NAME</span>
                            </div>
                            <Select className="text-black" name="retailer" onChange={(selectedOption: any) => setRetailer(selectedOption.value)} options={retailerOption} />
                            
                        </label>
                        <button onClick={handleEdit} className="btn btn-success mt-7">GO</button>
                    </div>
                    <div className="modal-action">
                        <a href="#" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default RetailerInfo