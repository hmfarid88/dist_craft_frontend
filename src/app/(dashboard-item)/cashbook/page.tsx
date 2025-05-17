"use client"
import ExcelExportButton from '@/app/components/ExcellGeneration';
import { useAppSelector } from '@/app/store';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { FcPrint } from 'react-icons/fc';
import { useReactToPrint } from 'react-to-print';
interface Payment {
  date: string;
  name: string;
  note: string;
  amount: number;
}
interface Receive {
  date: string;
  name: string;
  note: string;
  amount: number;
}
interface Sale {
  date: String;
  invoice: string;
  value: number;
}

const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const [netSumAmount, setNetSumAmount] = useState(0);

  useEffect(() => {
    fetch(`${apiBaseUrl}/cashbook/net-sum-before-today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => setNetSumAmount(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });

  const [payments, setPayments] = useState<Payment[]>([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/cashbook/payments/today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => setPayments(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);


  const [receives, setReceives] = useState<Receive[]>([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/cashbook/receives/today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => setReceives(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  // const [saledata, setSaleData] = useState<Sale[]>([]);
  // useEffect(() => {
  //   fetch(`${apiBaseUrl}/cashbook/sales/customer?username=${username}&date=${date}`)
  //     .then(response => response.json())
  //     .then(data => {
  //       setSaleData(data);
  //     })
  //     .catch(error => console.error('Error fetching data:', error));
  // }, [apiBaseUrl, username, date]);

  const totalDebit = () => {
    return receives.reduce((debit, receive) => debit + (receive.amount), 0);
  };
  const totalCredit = () => {
    return payments.reduce((credit, payment) => credit + (payment.amount), 0);
  };
  // const totalSale = () => {
  //   return saledata.reduce((debit, sale) => debit + (sale.value), 0);
  // };

  return (
    <div className='container min-h-screen'>
      <div className="flex gap-2 pl-5 pr-5">
        <ExcelExportButton tableRef={contentToPrint} fileName='cash_book' />
        <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
      </div>
      <div className="w-full">
        <div ref={contentToPrint} className="flex flex-col w-full items-center justify-center pt-5 pb-5">
          <div className="flex flex-col items-center justify-center">
            <h4 className='font-bold'>CASH BOOK</h4>
            <h4 className='font-semibold uppercase'>{username}</h4>
            <h4 className='font-semibold'>{date}</h4>
          </div>
          <div className="overflow-x-auto">
            <div className="flex w-full items-center justify-between text-sm font-semibold p-5">
              <h4>DEBIT</h4>
              <h4>CREDIT</h4>
            </div>
            <div className="flex w-full gap-10">
              <div className="flex">
                <table className="table table-sm">
                <thead className="sticky top-16 bg-base-100">
                    <tr>
                      <th>DATE</th>
                      <th>DESCRIPTION</th>
                      <th>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{date}</td>
                      <td>BALANCE B/D</td>
                      <td>{(netSumAmount ?? 0).toLocaleString('en-IN')}</td>
                    </tr>
                    {/* {saledata?.map((sold, index) => (
                      <tr key={index}>
                        <td>{sold.date}</td>
                        <td className='uppercase'>{sold.invoice}</td>
                        <td>{(sold.value).toLocaleString('en-IN')}</td>
                      </tr>
                    ))} */}
                    {receives?.map((receive, index) => (
                      <tr key={index}>
                        <td>{receive.date}</td>
                        <td className='capitalize'>{receive.name}</td>
                        <td>{(receive.amount ?? 0).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}

                    <tr className='text-sm font-bold'>
                      <td colSpan={1}></td>
                      <td>TOTAL</td>
                      <td>{(totalDebit() + netSumAmount).toLocaleString('en-IN')}</td>
                    </tr>

                  </tbody>
                  <tfoot>
                    <tr className='text-sm font-bold'>
                      <td></td>
                      <td>BALANCE B/D</td>
                      <td>{Number((totalDebit() + netSumAmount) - (totalCredit())).toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div>
                <table className="table table-sm">
                <thead className="sticky top-16 bg-base-100">
                    <tr>
                      <th>DATE</th>
                      <th>DESCRIPTION</th>
                      <th>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.date}</td>
                        <td className='capitalize'>{payment.name}</td>
                        <td>{(payment.amount ?? 0).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    <tr className='font-semibold'>
                      <td>{date}</td>
                      <td className='text-sm'>TOTAL CREDIT</td>
                      <td>{Number(totalCredit()).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className='font-semibold'>
                      <td>{date}</td>
                      <td className='text-sm'>BALANCE C/D</td>
                      <td>{((totalDebit() + netSumAmount) - (totalCredit())).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className='text-sm font-bold'>
                      <td colSpan={1}></td>
                      <td>TOTAL</td>
                      <td>{(totalCredit() + ((totalDebit() + netSumAmount) - (totalCredit()))).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page