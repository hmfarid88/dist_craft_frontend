'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from "react-to-print";
import { useRouter, useSearchParams } from "next/navigation";
import ExcelExportButton from "@/app/components/ExcellGeneration";
import CompanyInfo from "@/app/components/CompanyInfo";
import { toast } from "react-toastify";

interface Product {
    category: string;
    brand: string;
    productName: string;
    color: string;
    pprice: number;
    sprice: number;
    countBeforeToday: number;
    countToday: number;
    saleToday: number;
}

const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const router=useRouter(); 
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const searchParams = useSearchParams();
    const date = searchParams.get('date');
    const [selecteddate, setDate] = useState("");

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const handleDatewise = (e: any) => {
    if (!date) {
      toast.info("No date selected!")
      return;
    }
    router.push(`/datewise-stockreport?date=${selecteddate}`);
  }
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/datewiseStockSummary?username=${username}&today=${date}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, date]);

    useEffect(() => {
        const searchWords = filterCriteria.toLowerCase().split(" ");
        const filtered = allProducts.filter(product =>
            searchWords.every(word =>
                (product.category?.toLowerCase().includes(word) || '') ||
                (product.brand?.toLowerCase().includes(word) || '') ||
                (product.productName?.toLowerCase().includes(word) || '')
            )
        );

        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);


    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    const totalPreQty = filteredProducts.reduce((total, product) => {
        return total + product.countBeforeToday;
    }, 0);

    const totalTodayQty = filteredProducts.reduce((total, product) => {
        return total + product.countToday;
    }, 0);

    const totalSaleQty = filteredProducts.reduce((total, product) => {
        return total + product.saleToday;
    }, 0);

    const totalPpriceAmount = filteredProducts.reduce((total, product) => {
        return total + (((product.countBeforeToday + product.countToday) - product.saleToday) * product.pprice);
    }, 0);

    const totalSpriceAmount = filteredProducts.reduce((total, product) => {
        return total + (((product.countBeforeToday + product.countToday) - product.saleToday) * product.sprice);
    }, 0);

    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">
            <div className="flex items-center justify-center gap-2">
                    <input type="date" onChange={(e: any) => setDate(e.target.value)} className="input btn-outline" />
                    <button onClick={handleDatewise} className="btn btn-outline btn-square">GO</button>
                </div>
            <div className="flex justify-between pl-5 pr-5 pt-5">
                <label className="input input-bordered flex max-w-xs  items-center gap-2">
                    <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                </label>
                
                <div className="flex gap-3">
                    <ExcelExportButton tableRef={contentToPrint} fileName="stock_summary" />
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
            </div>

            <div ref={contentToPrint} className="flex flex-col p-2 items-center justify-center">
                <CompanyInfo />
                <h4 className="font-bold">STOCK SUMMARY</h4>
                <h4 className="pb-5">{date}</h4>
                <div className="flex items-center justify-center">
                    <table className="table table-sm">
                        <thead className="sticky top-16 bg-base-100">
                            <tr>
                                <th>SN</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th>PRODUCT</th>
                                <th>COLOR</th>
                                <th>STOCK</th>
                                <th>LIFTING</th>
                                <th>TOTAL STOCK</th>
                                <th>SALE</th>
                                <th>TOTAL STOCK</th>
                                <th>RP RATE</th>
                                <th>RP AMOUNT</th>
                                <th>DP RATE</th>
                                <th>DP AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts?.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.productName}</td>
                                    <td>{product.color}</td>
                                    <td>{product.countBeforeToday}</td>
                                    <td>{product.countToday}</td>
                                    <td>{product.countBeforeToday + product.countToday}</td>
                                    <td>{product.saleToday}</td>
                                    <td>{(product.countBeforeToday + product.countToday) - product.saleToday}</td>
                                    <td>{Number((product.sprice).toFixed(2)).toLocaleString('en-IN')}</td>
                                    <td>{Number((((product.countBeforeToday + product.countToday) - product.saleToday) * product.sprice).toFixed(2)).toLocaleString('en-IN')}</td>
                                    <td>{Number((product.pprice).toFixed(2)).toLocaleString('en-IN')}</td>
                                    <td>{Number((((product.countBeforeToday + product.countToday) - product.saleToday) * product.pprice).toFixed(2)).toLocaleString('en-IN')}</td>

                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold text-sm">
                                <td colSpan={4}></td>
                                <td>TOTAL</td>
                                <td>{Number(totalPreQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number(totalTodayQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number((totalPreQty + totalTodayQty).toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number(totalSaleQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number(((totalPreQty + totalTodayQty) - totalSaleQty).toFixed(2)).toLocaleString('en-IN')}</td>
                                <td></td>
                                <td>{Number((totalSpriceAmount).toFixed(2)).toLocaleString('en-IN')}</td>
                                <td></td>
                                <td>{Number((totalPpriceAmount).toFixed(2)).toLocaleString('en-IN')}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default Page