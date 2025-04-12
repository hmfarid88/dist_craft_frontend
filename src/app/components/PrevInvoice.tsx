"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const PrevInvoice = () => {
    const router = useRouter();
    const [cid, setPhoneNo] = useState("");
   
    const handleInvoice = (e: any) => {
        e.preventDefault();
        if (!cid.trim()) {
            toast.warning("Invoice no required !");
            return;
        }
        router.push(`/invoice?cid=${cid}`);
        setPhoneNo("");
    }
    return (
        <div className="flex flex-col gap-3 font-bold">
            <input type='text' value={cid} className='input input-sm input-success w-[150px]' placeholder='Invoice No' onChange={(e: any) => setPhoneNo(e.target.value)} />
            <button onClick={handleInvoice} className='btn btn-sm btn-success w-[150px]'>PREV INVOICE </button>
        </div>
    )
}

export default PrevInvoice