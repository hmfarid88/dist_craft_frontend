"use client"
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";

const SaleReturn = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);
    const [productno, setProductno] = useState("");

    const confirmSaleReturn = (e: any) => {
        e.preventDefault();
        const isConfirmed = window.confirm("Are you sure to return the sale ?");
        if (isConfirmed) {
            submitSaleReturn(e);
        }
      };

    const submitSaleReturn = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productno.trim()) {
            toast.warning("Product no is required.");
            return;
        }

        setPending(true);

        try {
            const response = await fetch(
                `${apiBaseUrl}/sales/saleReturn?username=${encodeURIComponent(username)}&productno=${encodeURIComponent(productno)}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                toast.info(errorData?.message || "Sale is not returned!");
                return;
            }

            toast.success("Sale is returned successfully.");
            setProductno("");

        } catch (error) {
            toast.error("An error occurred: " + (error as Error).message);
        } finally {
            setPending(false);
        }
    };

    return (

        <div className="flex items-center justify-center">
            <div className="flex flex-col gap-3">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">PRODUCT NO</span>
                    </div>
                    <input type="text" name="productno" onChange={(e: any) => setProductno(e.target.value)} value={productno} placeholder="Type Here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <button onClick={confirmSaleReturn} disabled={pending} className="btn btn-outline btn-success">{pending ? "Wait..." : "RETURN"}</button>
                </label>
            </div>

        </div>

    )
}

export default SaleReturn




