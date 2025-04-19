'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import CurrentDate from "@/app/components/CurrentDate";
import ExcelExportButton from "@/app/components/ExcellGeneration";

type Product = {
    date: string;
    year: string;
    month: string;
    type: string;
    note: string;
    amount: number;

};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/profit/profit-withdraws?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);


    useEffect(() => {
        const filtered = allProducts.filter(product =>
            String(product.year)?.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            String(product.month)?.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            String(product.type)?.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            String(product.note)?.toLowerCase().includes(filterCriteria.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">

                <div className="flex w-full justify-between pl-5 pr-5 pt-1">
                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                    <div className="flex gap-2">
                        <ExcelExportButton tableRef={contentToPrint} fileName="profit_withdraw_report" />
                        <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <div ref={contentToPrint} className="flex-1 p-5">
                        <div className="flex flex-col items-center pb-5"><h4 className="font-bold">PROFIT WITHDRAW REPORT</h4>
                            <h4><CurrentDate /></h4>
                        </div>
                        <table className="table table-sm">
                            <thead className="sticky top-16 bg-base-100">
                                <tr>
                                    <th>SN</th>
                                    <th>DATE</th>
                                    <th>YEAR</th>
                                    <th>MONTH</th>
                                    <th>TYPE</th>
                                    <th>REMARK NOTE</th>
                                    <th>AMOUNT</th>

                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts?.map((product, index) => {
                                    const monthNames = [
                                        "January", "February", "March", "April", "May", "June",
                                        "July", "August", "September", "October", "November", "December"
                                    ];
                                    const monthName = monthNames[parseInt(product?.month) - 1];

                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{product?.date}</td>
                                            <td>{product?.year}</td>
                                            <td>{monthName}</td>
                                            <td className="capitalize">{product?.type}</td>
                                            <td className="capitalize">{product?.note}</td>
                                            <td>{Number(product?.amount?.toFixed(2)).toLocaleString('en-IN')}</td>
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