'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from "react-to-print";
import { FcPrint } from "react-icons/fc";
import DateToDate from "@/app/components/DateToDate";
import CurrentMonthYear from "@/app/components/CurrentMonthYear";
import ExcelExportButton from "@/app/components/ExcellGeneration";
import CompanyInfo from "@/app/components/CompanyInfo";
import { useRouter } from "next/navigation";

interface Product {
    cname: string;
    phoneNumber: string;
    address: string;
    soldby: string;
    category: string;
    brand: string;
    productName: string;
    productno: string;
    color: string;
    cid: string;
    sprice: number;
    discount: number;
    offer: number;
    date: string;
    time: string;
}
const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const router = useRouter();
    const findInvoice = (cid: string) => {
        router.push(`/invoice?cid=${cid}`);
    };
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [soldProducts, setSoldProducts] = useState<Product[]>([]);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getMonthlyProductSale?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setSoldProducts(data);

            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);


    useEffect(() => {
        const searchWords = filterCriteria.toLowerCase().split(" ");
        const filtered = soldProducts.filter(product =>
            searchWords.every(word =>
                (product.category?.toLowerCase().includes(word) || '') ||
                (product.brand?.toLowerCase().includes(word) || '') ||
                (product.date?.toLowerCase().includes(word) || '') ||
                (product.color?.toLowerCase().includes(word) || '') ||
                (product.productno?.toLowerCase().includes(word) || '') ||
                (product.cname?.toLowerCase().includes(word) || '') ||
                (product.soldby?.toLowerCase().includes(word) || '') ||
                (product.phoneNumber?.toLowerCase().includes(word) || '') ||
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

    const totalDiscount = filteredProducts.reduce((total, product) => {
        return total + product.discount;
    }, 0);

    const totalOffer = filteredProducts.reduce((total, product) => {
        return total + product.offer;
    }, 0);
    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">
            <div className="flex justify-center p-5">
                <DateToDate routePath="/datewise-salereport" />
            </div>
            <div className="flex justify-between pl-5 pr-5 pt-5">
                <label className="input input-bordered flex max-w-xs  items-center gap-2">
                    <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                </label>
                <div className="flex gap-3">
                    <ExcelExportButton tableRef={contentToPrint} fileName="monthly_sale_report" />
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
            </div>
            <div ref={contentToPrint} className="flex flex-col p-2 items-center justify-center">
                <CompanyInfo />
                <h4 className="font-bold">SALE REPORT</h4>
                <h4 className="pb-5"><CurrentMonthYear /></h4>
                <div className="flex items-center justify-center">
                    <table className="table table-sm">
                        <thead className="sticky top-16 bg-base-100">
                            <tr>
                                <th>SN</th>
                                <th>SALE DATE</th>
                                <th>SALE TIME</th>
                                <th>INVOICE NO</th>
                                <th>CUSTOMER INFO</th>
                                <th>SOLD BY</th>
                                <th>PRODUCT</th>
                                <th>PRODUCT NO</th>
                                <th>SALE PRICE</th>
                                <th>DISCOUNT</th>
                                <th>OFFER</th>
                                <th>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts?.map((product, index) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{product.date}</td>
                                    <td>{product.time}</td>
                                    <td className="uppercase"><button onClick={() => findInvoice(product.cid)} className="btn btn-link uppercase">{product.cid}</button></td>
                                    <td className="capitalize">{product.cname}, {product.phoneNumber} {product.address}</td>
                                    <td className="capitalize">{product.soldby}</td>
                                    <td className="capitalize">{product.category}, {product.brand}, {product.productName}</td>
                                    <td>{product.productno}</td>
                                    <td>{product.sprice}</td>
                                    <td>{product.discount}</td>
                                    <td>{product.offer}</td>
                                    <td>{product.sprice - product.discount - product.offer}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold text-sm">
                                <td colSpan={6}></td>
                                <td>TOTAL</td>
                                <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number(totalSprice.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number(totalDiscount.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number(totalOffer.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number((totalSprice - totalDiscount - totalOffer).toFixed(2)).toLocaleString('en-IN')}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Page