'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from "react-to-print";
import { FcPrint } from "react-icons/fc";
import DateToDate from "@/app/components/DateToDate";
import CurrentMonthYear from "@/app/components/CurrentMonthYear";
import ExcelExportButton from "@/app/components/ExcellGeneration";
import CompanyInfo from "@/app/components/CompanyInfo";

interface Product {
    category: string;
    brand: string;
    productName: string;
    productno: string;
    color: string;
    supplier: string;
    supplierInvoice: string;
    pprice: number;
    sprice: number;
    date: string;
    time: string;
}
const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [soldProducts, setSoldProducts] = useState<Product[]>([]);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isGroupView, setIsGroupView] = useState(false);

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getMonthlyProductEntry?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setSoldProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    const groupedData = filteredProducts.reduce((acc: any, item) => {
        const key = item.productName;

        if (!acc[key]) {
            acc[key] = {
                totalQty: 0,
                totalPprice: 0,
                totalSprice: 0
            };
        }

        acc[key].totalQty += 1;
        acc[key].totalPprice += item.pprice;
        acc[key].totalSprice += item.sprice;

        return acc;
    }, {});
    useEffect(() => {
        const searchWords = filterCriteria.toLowerCase().split(" ");

        const filtered = soldProducts.filter(product =>
            searchWords.every(word =>
                (product.category?.toLowerCase().includes(word) || '') ||
                (product.brand?.toLowerCase().includes(word) || '') ||
                (product.date?.toLowerCase().includes(word) || '') ||
                (product.color?.toLowerCase().includes(word) || '') ||
                (product.productno?.toLowerCase().includes(word) || '') ||
                (product.supplier?.toLowerCase().includes(word) || '') ||
                (product.supplierInvoice?.toLowerCase().includes(word) || '') ||
                (product.productName?.toLowerCase().includes(word) || '')
            )
        );

        setFilteredProducts(filtered);
    }, [filterCriteria, soldProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };
    const totalQty = new Set(filteredProducts.map(product => product.productno)).size;

    const totalSprice = filteredProducts.reduce((total, product) => {
        return total + product.sprice;
    }, 0);

    const totalPprice = filteredProducts.reduce((total, product) => {
        return total + product.pprice;
    }, 0);

    const groupTotals = Object.values(groupedData).reduce(
        (acc: any, item: any) => {
            acc.totalQty += item.totalQty;
            acc.totalPprice += item.totalPprice;
            acc.totalSprice += item.totalSprice;
            return acc;
        },
        { totalQty: 0, totalPprice: 0, totalSprice: 0 }
    );

    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">
            <div className="flex justify-center pl-5 pr-5 pt-5">
                <DateToDate routePath="/datewise-entry-report" />

            </div>
            <div className="flex justify-between pl-5 pr-5 pt-5">
                <label className="input input-bordered flex max-w-xs  items-center gap-2">
                    <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                </label>
                <div className="flex gap-3">
                    <ExcelExportButton tableRef={contentToPrint} fileName="product_entry" />
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
            </div>
            <div className="flex justify-end p-5">
                <button
                    onClick={() => setIsGroupView(prev => !prev)}
                    className="btn btn-sm btn-primary"
                >
                    {isGroupView ? "Details View" : "Group View"}
                </button>
            </div>

            <div ref={contentToPrint} className="flex flex-col p-2 items-center justify-center">
                <CompanyInfo />
                <h4 className="font-bold">PRODUCT ENTRY REPORT</h4>
                <h4 className="pb-5"><CurrentMonthYear /></h4>
                <div className="flex items-center justify-center">
                    <table className="table table-sm">

                        <thead className="sticky top-16 bg-base-100">
                            {!isGroupView ? (
                                <tr>
                                    <th>SN</th>
                                    <th>ENTRY DATE</th>
                                    <th>ENTRY TIME</th>
                                    <th>INVOICE NO</th>
                                    <th>SUPPLIER</th>
                                    <th>CATEGORY</th>
                                    <th>BRAND</th>
                                    <th>PRODUCT</th>
                                    <th>COLOR</th>
                                    <th>PRODUCT NO</th>
                                    <th>PURCHASE PRICE</th>
                                    <th>SALE PRICE</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th>SN</th>
                                    <th colSpan={6}>PRODUCT NAME</th>
                                    <th>QTY</th>
                                    <th>PURCHASE TOTAL</th>
                                    <th>SALE TOTAL</th>
                                </tr>
                            )}
                        </thead>

                        <tbody>
                            {/* NORMAL VIEW */}
                            {!isGroupView && filteredProducts.map((product, index) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{product.date}</td>
                                    <td>{product.time}</td>
                                    <td className="uppercase">{product.supplierInvoice}</td>
                                    <td className="capitalize">{product.supplier}</td>
                                    <td className="capitalize">{product.category}</td>
                                    <td className="capitalize">{product.brand}</td>
                                    <td className="capitalize">{product.productName}</td>
                                    <td className="capitalize">{product.color}</td>
                                    <td>{product.productno}</td>
                                    <td>{product.pprice}</td>
                                    <td>{product.sprice}</td>
                                </tr>
                            ))}

                            {/* GROUP VIEW */}
                            {isGroupView &&
                                Object.entries(groupedData).map(([productName, data]: any, index) => (
                                    <tr key={index} className="font-semibold">
                                        <td>{index + 1}</td>
                                        <td colSpan={6}>{productName}</td>
                                        <td>{data.totalQty}</td>
                                        <td>{Number(data.totalPprice.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number(data.totalSprice.toFixed(2)).toLocaleString('en-IN')}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        <tfoot>
                            {!isGroupView ? (
                                <tr className="font-bold text-sm">
                                    <td colSpan={8}></td>
                                    <td>TOTAL</td>
                                    <td>{totalQty.toLocaleString('en-IN')}</td>
                                    <td>{totalPprice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{totalSprice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            ) : (
                                <tr className="font-bold text-sm">
                                    <td colSpan={7}>GRAND TOTAL</td>
                                    <td>{(groupTotals as { totalQty: number }).totalQty}</td>
                                    <td>{(groupTotals as { totalPprice: number }).totalPprice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{(groupTotals as { totalSprice: number }).totalSprice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            )}
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Page