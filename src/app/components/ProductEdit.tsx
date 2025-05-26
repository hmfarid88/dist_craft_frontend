"use client"
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";
import { useRouter } from 'next/navigation';

const ProductEdit = () => {

    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [productno, setProductno] = useState("");

    const handleProductEdit = () => {
        if (!productno) {
            toast.info("Product No Required!")
            return;
        }
        router.push(`/product-edit?productno=${productno}`);

    }

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
                    <button onClick={handleProductEdit} disabled={pending} className="btn btn-outline btn-success">{pending ? "Wait..." : "NEXT"}</button>
                </label>
            </div>

        </div>

    )
}

export default ProductEdit




