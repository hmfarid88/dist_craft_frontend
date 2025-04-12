'use client';
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from "react-to-print";
import { FcPrint } from "react-icons/fc";
import CurrentDate from "@/app/components/CurrentDate";
import { useRouter, useSearchParams } from "next/navigation";

interface Product {
    invoice: string;
    customer: string;
    phoneNumber: string;
}

const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const phoneNumber = searchParams?.get('phoneNumber') || '';
    const contentToPrint = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    const findInvoice = (cid: string) => {
        router.push(`/invoice?cid=${cid}`);
    };

    useEffect(() => {
        setIsLoading(true);
        fetch(`${apiBaseUrl}/customer/customers?username=${username}&phoneNumber=${phoneNumber}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setAllProducts([]);
                setIsLoading(false);
            });
    }, [apiBaseUrl, username, phoneNumber]);

    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">
            <div className="flex justify-between pl-5 pr-5 pt-5">
                <button onClick={handlePrint} className='btn btn-ghost btn-square'>
                    <FcPrint size={36} />
                </button>
            </div>

            <div ref={contentToPrint} className="flex flex-col p-2 items-center justify-center">
                <h4 className="font-bold">INVOICE INFO</h4>
                <h4 className="p-2"><CurrentDate /></h4>
                <div className="flex items-center justify-center">
                    <div className="card card-body card-bordered capitalize">
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : allProducts.length === 0 ? (
                            <p className="text-accent">No invoice information available with this number.</p>
                        ) : (
                            <table className="table table-sm table-zebra">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>CUSTOMER</th>
                                        <th>PHONE NUMBER</th>
                                        <th>INVOICE NO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{product.customer}</td>
                                            <td>{product.phoneNumber}</td>
                                            <td>
                                                <button onClick={() => findInvoice(product.invoice)} className="btn btn-link uppercase">
                                                    {product.invoice}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
