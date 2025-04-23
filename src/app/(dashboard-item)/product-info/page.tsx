'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from "react-to-print";
import { FcPrint } from "react-icons/fc";
import CurrentDate from "@/app/components/CurrentDate";
import { useSearchParams } from "next/navigation";
import CompanyInfo from "@/app/components/CompanyInfo";

interface Product {
    category: string;
    brand: string;
    productName: string;
    productno: string;
    color: string;
    pprice: number;
    sprice: number;
    supplier: string;
    supplierInvoice: string;
    entryDate: string;
    entryTime: string;
    status: string;
    saleType: string;
    soldprice: number;
    discount: number;
    offer: number;
    saleDate: string;
    saleTime: string;
    invoice: string;
    cName: string;
    phoneNumber: string;
    soldby: string;

}
const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    const searchParams = useSearchParams();
    const productno = searchParams.get('productno');
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getProductInfo?username=${username}&productno=${productno}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, productno]);


    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">

            <div className="flex justify-between pl-5 pr-5 pt-5">
                <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
            </div>

            <div ref={contentToPrint} className="flex flex-col p-2 items-center justify-center">
                <CompanyInfo />
                <h4 className="font-bold">PRODUCT INFO</h4>
                <h4 className="p-2"><CurrentDate /></h4>
                <div className="flex items-center justify-center">
                    {allProducts.length === 0 && <p className="text-accent">No product information available.</p>}
                    {allProducts?.map((product, index) => (
                        <div key={index} className="card card-body card-bordered capitalize">
                            <table className="table table-sm table-zebra">
                                <tbody>
                                    <tr><td>Category</td><td>{product.category}</td></tr>
                                    <tr><td>Brand</td><td>{product.brand}</td></tr>
                                    <tr><td>Product</td><td>{product.productName}</td></tr>
                                    <tr><td>Color</td><td>{product.color}</td></tr>
                                    <tr><td>Product No</td><td>{product.productno}</td></tr>
                                    <tr><td>P Price</td><td>{product.pprice}</td></tr>
                                    <tr><td>S Price</td><td>{product.sprice}</td></tr>
                                    <tr><td>Supplier</td><td>{product.supplier}</td></tr>
                                    <tr><td>S Invoice</td><td>{product.supplierInvoice}</td></tr>
                                    <tr><td>Stock Date</td><td>{product.entryDate}</td></tr>
                                    <tr><td>Stock Time</td><td>{product.entryDate}</td></tr>
                                    <tr><td>Status</td><td>{product.status}</td></tr>
                                    {product.status === 'sold' && (
                                        <>
                                            <tr><td>Sale Type</td><td>{product.saleType}</td></tr>
                                            <tr><td>Sold Price</td><td>{product.soldprice}</td></tr>
                                            <tr><td>Own Discount</td><td>{product.discount}</td></tr>
                                            <tr><td>Company Offer</td><td>{product.offer}</td></tr>
                                            <tr><td>Invoice</td><td>{product.invoice}</td></tr>
                                            <tr><td>Customer</td><td>{product.cName} {product.phoneNumber}</td></tr>
                                            <tr><td>Sold By</td><td>{product.soldby}</td></tr>
                                            <tr><td>Sale Date</td><td>{product.saleDate}</td></tr>
                                            <tr><td>Sale Time</td><td>{product.saleTime}</td></tr>
                                        </>
                                    )}
                                </tbody>
                            </table>

                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default Page