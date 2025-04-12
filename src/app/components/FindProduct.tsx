"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const FindProduct = () => {
    const router = useRouter();
    const [productno, setProductno] = useState("");
    const handleProduct = (e: any) => {
        e.preventDefault();
        if(!productno.trim()){
            toast.warning("Product no is required !");
            return;
        }
        router.push(`/product-info?productno=${productno}`);
        setProductno("");
    }
    return (
        <div className="flex flex-col gap-3 justify-center font-bold">
            <input type='text' value={productno} className='input input-sm input-success w-[150px]' placeholder='Product No' onChange={(e: any) => setProductno(e.target.value)} />
            <button onClick={handleProduct} className='btn btn-sm btn-success w-[150px]'> FIND </button>
        </div>
    )
}

export default FindProduct