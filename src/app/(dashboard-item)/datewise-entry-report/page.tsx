'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from "react-to-print";
import { FcPrint } from "react-icons/fc";
import { useSearchParams } from "next/navigation";

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

    const searchParams = useSearchParams();
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [soldProducts, setSoldProducts] = useState<Product[]>([]);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getDatewiseProductEntry?username=${username}&startDate=${startDate}&endDate=${endDate}`)
            .then(response => response.json())
            .then(data => {
                setSoldProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, startDate, endDate]);

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
    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">
            
            <div className="flex justify-between pl-5 pr-5 pt-5">
                <label className="input input-bordered flex max-w-xs  items-center gap-2">
                    <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                </label>
                <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
            </div>
            <div ref={contentToPrint} className="flex flex-col p-2 items-center justify-center">
                <h4 className="font-bold">PRODUCT ENTRY REPORT</h4>
                <h4 className="pb-5">{startDate} TO {endDate}</h4>
                <div className="flex items-center justify-center">
                    <table className="table table-sm">
                        <thead>
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
                        </thead>
                        <tbody>
                            {filteredProducts?.map((product, index) => (
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
                        </tbody>
                        <tfoot>
                            <tr className="font-bold text-sm">
                            <td colSpan={8}></td>
                                <td>TOTAL</td>
                                <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number(totalPprice.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number(totalSprice.toFixed(2)).toLocaleString('en-IN')}</td>

                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Page