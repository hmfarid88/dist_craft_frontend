"use client"
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { useAppSelector } from "@/app/store";

const Expense = () => {
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [pending, setPending] = useState(false);
  const [date, setDate] = useState("");
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

  // expense
  const [expenseName, setExpenseName] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const [expensAmount, setExpenseAmount] = useState("");

  const handleExpenseSubmit = async (e: any) => {
    e.preventDefault();
    if (!expenseName || !expensAmount) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/payment/expenseRecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, expenseName, expenseNote, amount: expensAmount, username }),
      });

      if (response.ok) {
        toast.success("Expense added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid transaction !")
    } finally {
      setPending(false);
      setExpenseNote("");
      setExpenseAmount("");
    }
  };
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
          <span className="label-text-alt">EXPENSE NAME</span>
        </div>
        <select className='select select-bordered' onChange={(e: any) => { setExpenseName(e.target.value) }}>
          <option selected disabled>Select . . .</option>
          <option value="Office Cost">Office Cost</option>
          <option value="Employee Salary">Employee Salary</option>
          <option value="Shop Rent">Shop Rent</option>
          <option value="RPDP">RPDP</option>
          <option value="Others">Others</option>
        </select>

      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">EXPENSE NOTE</span>
        </div>
        <input type="text" name='note' autoComplete='note' value={expenseNote} onChange={(e) => setExpenseNote(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">EXPENSE AMOUNT</span>
        </div>
        <input type="number" value={expensAmount} onChange={(e) => setExpenseAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
      </label>


      <label className="form-control w-full max-w-xs">
        <button onClick={handleExpenseSubmit} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
      </label>

    </div>
  )
}

export default Expense