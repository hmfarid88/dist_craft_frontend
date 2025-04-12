"use client"
import { useState } from 'react';
import DatePicker from 'react-date-picker';
import Input from 'react-date-picker';
import { FcCalendar } from "react-icons/fc";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function Datepicker() {
  const [date, setDate] = useState<Value>(new Date());

  return (
    <div>
      <Input calendarIcon={FcCalendar} className="z-20" clearIcon={null} maxDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} />
    </div>
  );
}
export default Datepicker