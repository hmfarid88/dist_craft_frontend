"use client"
import React, { useEffect, useState } from 'react'
import { DatePicker } from 'react-date-picker';
import { toast } from "react-toastify";
import { FcCalendar } from "react-icons/fc";
import { useAppSelector } from "@/app/store";
import Select from "react-select";


const SupplierPayment = () => {
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [pending, setPending] = useState(false);
  const [date, setDate] = useState('');
  const [supplierName, setSupplierName] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [supplierAmount, setSupplierAmount] = useState("");
  const [supplierNote, setSupplierNote] = useState("");
  const [maxDate, setMaxDate] = useState('');
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setMaxDate(formattedDate);
    setDate(formattedDate);
  }, []);
  const handleSupplierPayment = async (e: any) => {
    e.preventDefault();
    if (!supplierName || !paymentType || !supplierAmount ) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/payment/supplierPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, supplierName, paymentType, note: supplierNote, amount: supplierAmount, username }),
      });

      if (response.ok) {
        toast.success("Payment added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid transaction !")
    } finally {
      setPending(false);
      setSupplierNote("");
      setSupplierAmount("");
    }
  };

  const [supplierOption, setSupplierOption] = useState([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getSupplierItem?username=${username}`)
      .then(response => response.json())
      .then(data => {
        setSupplierOption(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  return (
    <div className='flex flex-col gap-3 items-center justify-center'>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">DATE</span>
        </div>
        <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="input input-bordered w-full max-w-xs" />
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">SUPPLIER NAME</span>
        </div>
        <select className='select select-bordered' onChange={(e: any) => { setSupplierName(e.target.value) }}>
          <option selected disabled>Select . . .</option>
          {supplierOption?.map((name: any, index) => (
            <option key={index} value={name.supplierItem}>
              {name.supplierItem}
            </option>
          ))}
        </select>
       
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">TRANSACTION TYPE</span>
        </div>
        <select className='select select-bordered' onChange={(e: any) => { setPaymentType(e.target.value) }}>
          <option selected disabled>Select . . .</option>
          <option value="payment">PAYMENT</option>
          <option value="receive">RECEIVE</option>
        </select>
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">NOTE</span>
        </div>
        <input type="text" value={supplierNote} onChange={(e) => setSupplierNote(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">AMOUNT</span>
        </div>
        <input type="number" value={supplierAmount} onChange={(e) => setSupplierAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
      </label>

      <label className="form-control w-full max-w-xs">
        <button onClick={handleSupplierPayment} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
      </label>

    </div>
  )
}

export default SupplierPayment