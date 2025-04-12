"use client"
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { useAppSelector } from "@/app/store";


const ProfitWithdraw = () => {
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
    
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("");
    const [note, setNote] = useState("");

    const handleProfitSubmit = async (e: any) => {
        e.preventDefault();
        if (!month || !year || !type || !amount) {
            toast.warning("Item is empty !");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/payment/profitWithdraw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date, year, month, type, amount, note, username }),
            });

            if (response.ok) {
                toast.success("Amount added successfully !");
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Invalid transaction !")
        } finally {
            setPending(false);
            setNote("");
            setAmount("");
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
                    <span className="label-text-alt">SELECT YEAR</span>
                </div>
                <select className='select select-bordered' onChange={(e: any) => { setYear(e.target.value) }}>
                    <option selected disabled>Select . . .</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                </select>
            </label>

            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">SELECT MONTH</span>
                </div>
                <select className='select select-bordered' onChange={(e: any) => { setMonth(e.target.value) }}>
                    <option selected disabled>Select . . .</option>
                    <option value="1">JANUARY</option>
                    <option value="2">FEBRUARY</option>
                    <option value="3">MARCH</option>
                    <option value="4">APRIL</option>
                    <option value="5">MAY</option>
                    <option value="6">JUNE</option>
                    <option value="7">JULY</option>
                    <option value="8">AUGUST</option>
                    <option value="9">SEPTEMBER</option>
                    <option value="10">OCTOBER</option>
                    <option value="11">NOVEMBER</option>
                    <option value="12">DECEMBER</option>
                </select>
            </label>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">PROFIT TYPE</span>
                </div>
                <select className='select select-bordered' onChange={(e: any) => { setType(e.target.value) }}>
                    <option selected disabled>Select . . .</option>
                    <option value="deposit">PROFIT DEPOSIT</option>
                    <option value="withdraw">PROFIT WITHDRAW</option>
                </select>
            </label>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">NOTE</span>
                </div>
                <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            </label>

            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">AMOUNT</span>
                </div>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            </label>

            <label className="form-control w-full max-w-xs">
                <button onClick={handleProfitSubmit} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
            </label>
        </div>


    )
}

export default ProfitWithdraw