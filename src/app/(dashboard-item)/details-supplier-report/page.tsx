'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import CurrentDate from "@/app/components/CurrentDate";
import { useSearchParams } from "next/navigation";
import ExcelExportButton from "@/app/components/ExcellGeneration";

type Product = {
    date: string;
    invoice: string;
    pvalue: number;
    svalue: number;
    payment: number;
    receive: number;
    note: string;

};

const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    const searchParams = useSearchParams();
    const supplierName = searchParams.get('supplierName');

    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

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

    let cumulativeBalance = 0;

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
                        <ExcelExportButton tableRef={contentToPrint} fileName="details_supplier_ledger" />
                        <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                    </div>
                </div>
                <div className="overflow-x-auto items-center justify-center">
                    <div ref={contentToPrint} className="flex-1 p-5">
                        <div className="flex flex-col items-center pb-5"><h4 className="font-bold">DETAILS SUPPLIER</h4>
                            <h4>Supplier: {supplierName}</h4>
                            <CurrentDate /></div>
                        <table className="table table-sm">
                            <thead className="sticky top-16 bg-base-100">
                                <tr>
                                    <th>SN</th>
                                    <th>DATE</th>
                                    <th>INVOICE NO</th>
                                    <th>PURCHASE VALUE</th>
                                    <th>SALE VALUE</th>
                                    <th>NOTE</th>
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
                                            <td>{product.invoice}</td>
                                            <td>{Number(product.pvalue.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(product.svalue.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td className="capitalize">{product?.note}</td>
                                            <td>{Number(product.payment.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(product.receive.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(cumulativeBalance.toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Page