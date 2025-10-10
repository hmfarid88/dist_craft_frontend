"use client"
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { useAppSelector } from '@/app/store';
import Select from "react-select";
import { useRouter } from 'next/navigation';
import { MdOutlineEditNote } from 'react-icons/md';

type Product = {
  id: number;
  date: string;
  retailerName: string;
  paymentType: string;
  note: string;
  amount: number;
};
const RetailerPayment = () => {
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
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
  const [retailerName, setRetailerName] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [retailerNote, setRetailerNote] = useState("");
  const [retailerAmount, setRetailerAmount] = useState("");
  const handleEdit = (id: number) => {
    if (!id) {
      toast.warning("Payment id is required !");
      return;
    }
    router.push(`/paymentinfo-edit?id=${id}`);

  }
  const handleRetailerSubmit = async (e: any) => {
    e.preventDefault();
    if (!date || !retailerName || !paymentType || !retailerNote || !retailerAmount) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/payment/retailerPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, username, retailerName, paymentType, note: retailerNote, amount: retailerAmount }),
      });

      if (response.ok) {
        toast.success("Payment successfull !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid transaction !")
    } finally {
      setPending(false);
      setRetailerNote("");
      setRetailerAmount("");
    }
  };

  const [retailerOption, setRetailerOption] = useState([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/payment/getRetailerInfo?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          id: item.id,
          value: item.retailerName,
          label: item.retailerName
        }));
        setRetailerOption(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/payment/getTodaysRetailerPayment?username=${encodeURIComponent(username)}`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username, allProducts]);

  return (
    <div className='flex gap-10 items-center justify-center p-2'>
      <div className="flex flex-col">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text-alt">DATE</span>
          </div>
          <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="input input-bordered bg-white text-black h-[38px]  w-full max-w-xs" />
        </label>
        <div className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text-alt">RETAILER NAME</span>
          </div>
          <Select className="text-black h-[38px] w-full max-w-xs" onChange={(selectedOption: any) => setRetailerName(selectedOption.value)} options={retailerOption} />
        </div>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text-alt">PAYMENT TYPE</span>
          </div>
          <select className='select select-bordered bg-white text-black' onChange={(e: any) => { setPaymentType(e.target.value) }}>
            <option selected disabled>Select . . .</option>
            <option value="current">CURRENT</option>
            <option value="previous">PREVIOUS</option>
          </select>
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text-alt">NOTE</span>
          </div>
          <input type="text" name='retailerNote' autoComplete='retailerNote' value={retailerNote} onChange={(e) => setRetailerNote(e.target.value)} placeholder="Type here" className="input input-bordered bg-white text-black h-[38px] w-full max-w-xs" />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text-alt">PAYMENT AMOUNT</span>
          </div>
          <input type="number" value={retailerAmount} onChange={(e) => setRetailerAmount(e.target.value)} placeholder="Type here" className="input input-bordered bg-white text-black h-[38px] w-full max-w-xs" />
        </label>

        <label className="form-control w-full max-w-xs pt-3">
          <button onClick={handleRetailerSubmit} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
        </label>
      </div>
      <div className="flex">
        <table className="table table-xs table-pin-rows">
          <thead className="sticky top-16 bg-base-100">
            <tr>
              <th>SN</th>
              <th>RETAILER NAME</th>
              <th>PAYMENT TYPE</th>
              <th>AMOUNT</th>
              <th>EDIT</th>
            </tr>
          </thead>
          <tbody>
            {allProducts?.map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product.retailerName}</td>
                <td>{product.paymentType}</td>
                <td>{Number(product.amount.toFixed(2)).toLocaleString('en-IN')}</td>
                <td><button onClick={() => handleEdit(product.id)} className="btn btn-primary btn-xs"><MdOutlineEditNote size={24} /></button></td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default RetailerPayment