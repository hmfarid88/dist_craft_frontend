'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import CurrentDate from "@/app/components/CurrentDate";
import { useRouter, useSearchParams } from "next/navigation";
import ExcelExportButton from "@/app/components/ExcellGeneration";
import { toast } from "react-toastify";
import CompanyInfo from "@/app/components/CompanyInfo";

type Product = {
    date: string;
    invoice: string;
    qty: number;
    pvalue: number;
    svalue: number;
    payment: number;
    receive: number;
    note: string;

};
type modatProduct = {
    productName: string;
    color: string;
    pprice: number;
    qty: number;
};

const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const router = useRouter();
    const [date, setDate] = useState("");
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    const searchParams = useSearchParams();
    const supplierName = searchParams.get('supplierName');

    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState<modatProduct[]>([]);
    const [showModal, setShowModal] = useState(false);
    
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
        router.push(`/datewise-supplierReport?supplierName=${supplierName}&startDate=${startDate}&endDate=${endDate}`);
        setStartDate("");
        setEndDate("");
      };
    useEffect(() => {
        fetch(`${apiBaseUrl}/payment/getSupplierBalance-details?username=${encodeURIComponent(username)}&supplierName=${encodeURIComponent(supplierName ?? "")}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, supplierName]);
   
    useEffect(() => {
        const searchWords = filterCriteria.toLowerCase().split(" ");

        const filtered = allProducts.filter(product =>
            searchWords.every(word =>
                (product.date?.toLowerCase().includes(word) || '') ||
                (product.invoice?.toLowerCase().includes(word) || '') ||
                (product.note?.toLowerCase().includes(word) || '')
            )
        );

        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);


    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    const handleInvoiceClick = (invoice: string | undefined) => {
        fetch(`${apiBaseUrl}/payment/getProductInfo?username=${encodeURIComponent(username)}&supplierInvoice=${encodeURIComponent(invoice ?? "")}`)
            .then(async response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSelectedInvoiceDetails(data);
                setShowModal(true);
            })
            .catch(error => console.error('Error fetching products:', error));
    };

    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.qty;
    }, 0);
    const totalPayment = filteredProducts.reduce((total, product) => {
        return total + product.payment;
    }, 0);
    const totalReceive = filteredProducts.reduce((total, product) => {
        return total + product.receive;
    }, 0);
    const totalPvalue = filteredProducts.reduce((total, product) => {
        return total + product.pvalue;
    }, 0);
    const totalSvalue = filteredProducts.reduce((total, product) => {
        return total + product.svalue;
    }, 0);
    const totalInvoiceQty = selectedInvoiceDetails.reduce((total, product) => {
        return total + product.qty;
    }, 0);
    const totalInvoicevalue = selectedInvoiceDetails.reduce((total, product) => {
        return total + product.qty * product.pprice;
    }, 0);
    let cumulativeBalance = 0;

    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full  min-h-[calc(100vh-228px)] items-center justify-center p-4">
            <div className="flex p-5">
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
            </div>
                <div className="flex w-full justify-between p-5">
                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                  
                    <div className="flex gap-2">
                        <ExcelExportButton tableRef={contentToPrint} fileName="details_supplier_ledger" />
                        <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                    </div>
                </div>
                <div className="overflow-x-auto items-center justify-center">
                    <div ref={contentToPrint} className="flex-1 p-5">
                        <CompanyInfo />
                        <div className="flex flex-col items-center pb-5"><h4 className="font-bold">DETAILS SUPPLIER</h4>
                            <h4 className="uppercase">Supplier: {supplierName}</h4>
                            <CurrentDate /></div>
                        <table className="table table-sm">
                            <thead className="sticky top-16 bg-base-100">
                                <tr>
                                    <th>SN</th>
                                    <th>DATE</th>
                                    <th>INVOICE NO</th>
                                    <th>NOTE</th>
                                    <th>QTY</th>
                                    <th>DP VALUE</th>
                                    <th>RP VALUE</th>
                                    <th>PAYMENT</th>
                                    <th>RECEIVE</th>
                                    <th>BALANCE</th>

                                </tr>
                            </thead>
                            <tbody>

                                {filteredProducts?.map((product, index) => {
                                    const currentBalance = product.pvalue + product.receive - product.payment - product.svalue;
                                    cumulativeBalance += currentBalance;

                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{product.date}</td>
                                            <td><button onClick={() => handleInvoiceClick(product.invoice)} className="btn btn-ghost btn-sm uppercase break-words max-w-[150px]">{product.invoice}</button></td>
                                            <td className="uppercase break-words max-w-[150px]">{product?.note}</td>
                                            <td>{Number(product?.qty?.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(product.pvalue.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(product.svalue.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(product.payment.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(product.receive.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(cumulativeBalance.toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tr className="font-semibold text-lg">
                                <td colSpan={3}></td>
                                <td>TOTAL</td>
                                <td>{(totalQty).toLocaleString('en-IN')}</td>
                                <td>{totalPvalue.toLocaleString('en-IN')}</td>
                                <td>{(totalSvalue).toLocaleString('en-IN')}</td>
                                <td>{totalPayment.toLocaleString('en-IN')}</td>
                                <td>{totalReceive.toLocaleString('en-IN')}</td>

                            </tr>
                        </table>
                    </div>
                </div>
                {showModal && (
                    <div className="modal modal-open sm:modal-middle">
                        <div className="modal-box w-full max-w-3xl">
                            <div className="flex flex-col">
                                <div className="divider divider-accent tracking-widest font-bold text-sm p-2">PRODUCT INFO</div>
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>PRODUCT</th>
                                            <th>COLOR</th>
                                            <th>QTY</th>
                                            <th>P VALUE</th>
                                            <th>TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedInvoiceDetails.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.productName}</td>
                                                <td>{item.color}</td>
                                                <td>{item.qty.toLocaleString('en-IN')}</td>
                                                <td>{item.pprice.toLocaleString('en-IN')}</td>
                                                <td>{(item.qty * item.pprice).toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tr className="font-semibold text-lg">
                                        <td colSpan={2}></td>
                                        <td>TOTAL</td>
                                        <td>{(totalInvoiceQty).toLocaleString('en-IN')}</td>
                                        <td></td>
                                        <td>{totalInvoicevalue.toLocaleString('en-IN')}</td>
                                    </tr>
                                </table>
                            </div>
                            <div className="modal-action">
                                <button onClick={() => setShowModal(false)} className="btn btn-error btn-outline">Close</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Page