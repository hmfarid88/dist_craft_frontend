"use client"
import Purchase from "@/app/components/Purchase";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FcAutomatic, FcPlus } from "react-icons/fc";
import { toast } from "react-toastify";

const Page: React.FC = () => {
  const [productno, setProductno] = useState('');
  const router = useRouter();
  const handleProductEdit = () => {
    if (!productno) {
      toast.info("Product No Required!")
      return;
    }
    router.push(`/product-edit?productno=${productno}`);
  }


  return (
    <div className="container-2xl">
      <div className='card card-actions  p-3'>
        <div className="flex w-full justify-between">
          <a href="#my_modal_product_edit" className="btn btn-square btn-ghost"><FcAutomatic size={35} /></a>
          <a href="#my_modal_product_itemadd" className="btn btn-circle btn-ghost"><FcPlus size={35} /></a>
        </div>
        <Purchase />
      </div>
      <div className="modal sm:modal-middle" role="dialog" id="my_modal_product_edit">
        <div className="modal-box">
          <div className="flex flex-col w-full">
            <div className="divider divider-accent tracking-widest font-bold text-sm p-2">PRODUCT EDIT</div>
          </div>
          <div className="flex items-center justify-center">
            <label className="form-control w-full max-w-xs pt-3">
              <div className="flex items-center justify-between">
                <input type="text" value={productno} name="colorItem" onChange={(e: any) => setProductno(e.target.value)} placeholder="Product No" className="input input-bordered w-3/4 max-w-xs" />
                <button onClick={handleProductEdit} className="btn btn-square btn-success">GO</button>
              </div>
            </label>
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

export default Page