
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface DateToDateProps {
  routePath: string; // Accept the dynamic route path as a prop
}

const DateToDate: React.FC<DateToDateProps> = ({ routePath }) => {
  const router = useRouter();
  const [maxDate, setMaxDate] = useState('');
  
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setMaxDate(formattedDate);
  }, []);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.warning("Start date and end date required !");
      return;
    }
    // Use the dynamic routePath for navigation
    router.push(`${routePath}?startDate=${startDate}&endDate=${endDate}`);
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className='flex gap-3'>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">START DATE</span>
        </div>
        <input 
          type="date" 
          name="date" 
          onChange={(e: any) => setStartDate(e.target.value)} 
          max={maxDate} 
          value={startDate} 
          className="input input-bordered" 
        />
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">END DATE</span>
        </div>
        <input 
          type="date" 
          name="date" 
          onChange={(e: any) => setEndDate(e.target.value)} 
          max={maxDate} 
          value={endDate} 
          className="input input-bordered" 
        />
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">SEARCH</span>
        </div>
        <button onClick={handleSubmit} className='btn btn-success'>{'>>'}</button>
      </label>
    </div>
  );
};

export default DateToDate;
