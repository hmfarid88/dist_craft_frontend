'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from "react-to-print";
import { FcPrint } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import ExcelExportButton from "@/app/components/ExcellGeneration";
import CompanyInfo from "@/app/components/CompanyInfo";

interface Product {
    category: string;
    brand: string;
    productName: string;
    qty: number;
    pprice: number;
    sprice: number;
    discount: number;

}
const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const searchParams = useSearchParams();
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    const getMonthName = (monthNumber: string | null) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ];
        const monthIndex = monthNumber ? parseInt(monthNumber, 10) - 1 : -1;
        return months[monthIndex] || "Invalid month";
    };

    const [profitWithdraw, setProfitWithdraw] = useState(0)
    useEffect(() => {
        fetch(`${apiBaseUrl}/profit/selected-month-withdrawsum?username=${username}&year=${year}&month=${month}`)
            .then(response => response.json())
            .then(data => {
                setProfitWithdraw(data);

            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, year, month]);

    const [profitDeposit, setProfitDeposit] = useState(0)
    useEffect(() => {
        fetch(`${apiBaseUrl}/profit/selected-month-depositsum?username=${username}&year=${year}&month=${month}`)
            .then(response => response.json())
            .then(data => {
                setProfitDeposit(data);

            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, year, month]);

    const [totalExpense, setTotalExpense] = useState(0)
    useEffect(() => {
        fetch(`${apiBaseUrl}/payment/getSelectedSum?username=${username}&year=${year}&month=${month}`)
            .then(response => response.json())
            .then(data => {
                setTotalExpense(data);

            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, year, month]);

    const [soldProducts, setSoldProducts] = useState<Product[]>([]);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getSelectedProfitSale?username=${username}&year=${year}&month=${month}`)
            .then(response => response.json())
            .then(data => {
                setSoldProducts(data);

            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, year, month]);

    useEffect(() => {
        const searchWords = filterCriteria.toLowerCase().split(" ");

        const filtered = soldProducts.filter(product =>
            searchWords.every(word =>
                (product.category?.toLowerCase().includes(word) || '') ||
                (product.brand?.toLowerCase().includes(word) || '') ||
                (product.productName?.toLowerCase().includes(word) || '')
            )
        );

        setFilteredProducts(filtered);
    }, [filterCriteria, soldProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    const totalPprice = filteredProducts.reduce((total, product) => {
        return total + product.pprice;
    }, 0);

    const totalSprice = filteredProducts.reduce((total, product) => {
        return total + product.sprice;
    }, 0);

    const totalDiscount = filteredProducts.reduce((total, product) => {
        return total + product.discount;
    }, 0);

    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.qty;
    }, 0);

    const totalProfit = filteredProducts.reduce((total, product) => {
        return total + (product.sprice - product.pprice) * product.qty;
    }, 0);

    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">

            <div className="flex justify-between pl-5 pr-5 pt-5">
                <label className="input input-bordered flex max-w-xs  items-center gap-2">
                    <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                </label>
                <div className="flex gap-3">
                    <ExcelExportButton tableRef={contentToPrint} fileName="RPDP_Report" />
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
            </div>
            <div ref={contentToPrint} className="flex flex-col p-2 items-center justify-center">
                <CompanyInfo />
                <h4 className="font-bold">PROFIT / LOSS REPORT</h4>
                <h4 className="pb-5">{getMonthName(month)} {year}</h4>
                <div className="flex flex-col">
                    <table className="table table-sm">
                        <thead className="sticky top-16 bg-base-100">
                            <tr>
                                <th>SN</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th>PRODUCT NAME</th>
                                <th>RP VALUE</th>
                                <th>DP VALUE</th>
                                <th>UNIT PROFIT</th>
                                <th>PROFIT (%)</th>
                                <th>QTY</th>
                                <th>PROFIT TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts?.map((product, index) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td className="capitalize">{product.category}</td>
                                    <td className="capitalize">{product.brand}</td>
                                    <td className="capitalize">{product.productName}</td>
                                    <td>{Number((product.sprice).toFixed(2)).toLocaleString('en-IN')}</td>
                                    <td>{Number((product.pprice).toFixed(2)).toLocaleString('en-IN')}</td>
                                    <td>{Number((product.sprice - product.pprice).toFixed(2)).toLocaleString('en-IN')}</td>
                                    <td>{Number((((product.sprice - product.pprice) * 100) / (product.pprice)).toFixed(2)).toLocaleString('en-IN')} %</td>
                                    <td>{Number((product.qty).toFixed(2)).toLocaleString('en-IN')}</td>
                                    <td>{Number(((product.sprice - product.pprice) * product.qty).toFixed(2)).toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold">
                                <td colSpan={3}></td>
                                <td>TOTAL</td>
                                <td>{Number(totalSprice.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number(totalPprice.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td></td>
                                <td></td>
                                <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number((totalProfit).toFixed(2)).toLocaleString('en-IN')}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <div className="flex flex-col items-end text-xs font-semibold p-5 gap-2">
                        <label>TOTAL EXPENSE : {Number(totalExpense.toFixed(2)).toLocaleString('en-IN')}</label>
                        <label>TOTAL DISCOUNT : {Number(totalDiscount.toFixed(2)).toLocaleString('en-IN')}</label>
                        <label>NET PROFIT : {Number((totalProfit - totalDiscount - totalExpense).toFixed(2)).toLocaleString('en-IN')}</label>
                        <label>PROFIT DEPOSIT : {Number(profitDeposit.toFixed(2)).toLocaleString('en-IN')}</label>
                        <label>PROFIT WITHDRAW : {Number(profitWithdraw.toFixed(2)).toLocaleString('en-IN')}</label>
                        <label>PROFIT REMAINING : {Number((totalProfit + profitDeposit - totalDiscount - totalExpense - profitWithdraw).toFixed(2)).toLocaleString('en-IN')}</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page