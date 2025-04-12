
"use client"
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';
import { useAppSelector } from '../store';

const Invoice = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const router = useRouter();

    const handleInvoice = async (e: any) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiBaseUrl}/sales/lastCustomerCid?username=${username}`);
            if (!response.ok) {
                throw new Error('Failed to fetch invoice number');
            }

            const data = await response.json();
            if (data) {
                router.push(`/invoice?cid=${data.lastCid}`); 
            } else {
                toast.warning("No invoice number found!");
            }
        } catch (error) {
           toast.error("An error occurred while fetching invoice number.");
        }
    };

    return (
        <div className="flex flex-col gap-3 justify-center">
            <button onClick={handleInvoice} className='text-sm' > LAST INVOICE </button>
        </div>
    );
}

export default Invoice;
