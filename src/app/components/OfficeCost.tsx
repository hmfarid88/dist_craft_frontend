"use client"
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { FcPlus } from "react-icons/fc";
import { useAppSelector } from "@/app/store";


const OfficeCost = () => {
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [pending, setPending] = useState(false);
  const [date, setDate] = useState('');
  const [paymentName, setPaymentName] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
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

  const [paymentPerson, setPaymentPerson] = useState("");
  const handlePaymentNameAdd = async (e: any) => {
    e.preventDefault();
    if (!paymentPerson) {
      toast.warning("Name is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/payment/addPaymentName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentPerson, username }),
      });

      if (response.ok) {
        toast.success("Name added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid payment name !")
    } finally {
      setPending(false);
      setPaymentPerson("");
    }
  };
  const handlePaymentSubmit = async (e: any) => {
    e.preventDefault();
    if (!paymentName || !paymentType || !paymentAmount) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/payment/paymentRecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, paymentName, paymentType, paymentNote, amount: paymentAmount, username }),
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
      setPaymentNote("");
      setPaymentAmount("");
    }
  };
  const [paymentPersonOption, setPaymentPersonOption] = useState([]);
  useEffect(() => {

    fetch(`${apiBaseUrl}/payment/getPaymentPerson?username=${username}`)
      .then(response => response.json())
      .then(data => {
        setPaymentPersonOption(data);
      })
      .catch(error => console.error('Error fetching products:', error));

  }, [paymentPerson, apiBaseUrl, username]);

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
          <span className="label-text-alt">TRANSACTION NAME</span>
          <a href="#my_modal_addPaymentName" className="btn btn-xs btn-circle btn-ghost"><FcPlus size={20} /></a>
        </div>
        <select className='select select-bordered' onChange={(e: any) => { setPaymentName(e.target.value) }}>
          <option selected disabled>Select . . .</option>
          {paymentPersonOption?.map((name: any, index) => (
            <option key={index} value={name.paymentPerson}>
              {name.paymentPerson}
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
        <input type="text" name='note' autoComplete='note' value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">AMOUNT</span>
        </div>
        <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
      </label>


      <label className="form-control w-full max-w-xs">
        <button onClick={handlePaymentSubmit} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
      </label>
      <div className="modal sm:modal-middle" role="dialog" id="my_modal_addPaymentName">
        <div className="modal-box">
          <div className="flex w-full items-center justify-center p-2">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">TRANSACTION NAME</span>
              </div>
              <div className="flex items-center justify-between">
                <input type="text" value={paymentPerson} name="supplierItem" onChange={(e: any) => setPaymentPerson(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                <button onClick={handlePaymentNameAdd} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
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

export default OfficeCost