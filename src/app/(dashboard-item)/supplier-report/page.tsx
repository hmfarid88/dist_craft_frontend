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

    supplierName: string;
    totalProductValue: number;
    totalSoldValue: number;
    totalPayment: number;
    totalReceive: number;
    balance: number;
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
    const handleSupplierDetails = (supplierName: string) => {
        router.push(`/details-supplier-report?supplierName=${encodeURIComponent(supplierName)}`);
    }

    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/payment/getSupplierBalance?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);


    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.supplierName.toLowerCase().includes(filterCriteria.toLowerCase()) || '')

        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };


    const totalBalance = filteredProducts.reduce((total, product) => {
        return total + product.balance;
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

                    <div className="flex">
                        <ExcelExportButton tableRef={contentToPrint} fileName="supplier_report" />
                        <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                    </div>
                </div>
                <div className="overflow-x-auto items-center justify-center">
                    <div ref={contentToPrint} className="flex-1 p-5">
                        <CompanyInfo />
                        <div className="flex flex-col items-center pb-5"><h4 className="font-bold">SUPPLIER LEDGER</h4><CurrentDate /></div>
                        <table className="table table-sm">
                            <thead className="sticky top-16 bg-base-100">
                                <tr>
                                    <th>SN</th>
                                    <th>SUPPLIER NAME</th>
                                    <th>BALANCE</th>
                                    <th>DETAILS</th>

                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts?.map((product, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className="uppercase">{product.supplierName}</td>
                                        <td>{Number((product.balance).toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td><button onClick={() => handleSupplierDetails(product.supplierName)} className="btn btn-success btn-xs btn-outline"><CgDetailsMore size={18} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-bold text-sm">
                                    <td colSpan={1}></td>
                                    <td>TOTAL</td>
                                    <td>{Number((totalBalance).toFixed(2)).toLocaleString('en-IN')}</td>
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