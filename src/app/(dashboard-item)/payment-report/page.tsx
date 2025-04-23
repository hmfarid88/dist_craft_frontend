'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import CurrentDate from "@/app/components/CurrentDate";
import { CgDetailsMore } from "react-icons/cg";
import { useRouter } from "next/navigation";
import ExcelExportButton from "@/app/components/ExcellGeneration";
import CompanyInfo from "@/app/components/CompanyInfo";

type Product = {
  paymentName: string;
  payment: number;
  receive: number;

};


const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const router = useRouter();
  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });
  const handlePaymentsDetails = (paymentName: string) => {
    router.push(`/details-payment-report?paymentName=${paymentName}`);
  }

  const [filterCriteria, setFilterCriteria] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/payment/getPaymentRecord?username=${username}`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);


  useEffect(() => {
    const filtered = allProducts.filter(product =>
      (product.paymentName.toLowerCase().includes(filterCriteria.toLowerCase()) || '')

    );
    setFilteredProducts(filtered);
  }, [filterCriteria, allProducts]);

  const handleFilterChange = (e: any) => {
    setFilterCriteria(e.target.value);
  };
  const totalPayment = filteredProducts.reduce((total, product) => {
    return total + product.payment;
  }, 0);
  const totalReceive = filteredProducts.reduce((total, product) => {
    return total + product.receive;
  }, 0);


  return (
    <div className="container-2xl">
      <div className="flex flex-col w-full  min-h-[calc(100vh-228px)] items-center justify-center p-4">

        <div className="flex w-full justify-between p-5">
          <label className="input input-bordered flex max-w-xs  items-center gap-2">
            <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </label>
          <div className="flex gap-2">
            <ExcelExportButton tableRef={contentToPrint} fileName="pay_recv-report" />
            <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
          </div>
        </div>
        <div className="overflow-x-auto items-center justify-center">
          <div ref={contentToPrint} className="flex-1 p-5">
          <CompanyInfo />
            <div className="flex flex-col items-center pb-5"><h4 className="font-bold">DEBTOR-CREDITOR</h4><CurrentDate /></div>
            <table className="table table-sm">
              <thead className="sticky top-16 bg-base-100">
                <tr>
                  <th>SN</th>
                  <th>DEBTOR/CREDITOR NAME</th>
                  <th>BALANCE</th>
                  <th>DETAILS</th>

                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.paymentName}</td>
                    <td>{Number((product.payment - product.receive).toFixed(2)).toLocaleString('en-IN')}</td>
                    <td><button onClick={() => handlePaymentsDetails(product.paymentName)} className="btn btn-success btn-xs btn-outline"><CgDetailsMore size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold text-sm">
                  <td colSpan={1}></td>
                  <td>TOTAL</td>
                  <td>{Number((totalPayment - totalReceive).toFixed(2)).toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Page