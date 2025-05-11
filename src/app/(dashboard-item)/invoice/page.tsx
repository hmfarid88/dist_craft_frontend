"use client"
import React, { useRef, useEffect, useState } from 'react'
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from 'react-to-print';
import { FcPrint, FcPlus, FcDataSheet, FcAdvertising } from "react-icons/fc";
import Link from 'next/link';
import Loading from '@/app/loading';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoLocationOutline } from 'react-icons/io5';
import { FaPhoneVolume } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';
import { CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";
import { toWords } from 'number-to-words';


const Invoice = () => {
    const router = useRouter();
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    const searchParams = useSearchParams();
    const cid = searchParams.get('cid');
    const [invoiceData, setInvoiceData] = useState<invoiceData[]>([]);
    const [prevInvoice, setPrevInvoice] = useState("");
    const [nextInvoice, setNextInvoice] = useState("");

    interface invoiceData {
        cname: string,
        phoneNumber: string,
        address: string,
        soldby: string,
        brand: string,
        productName: string,
        productno: string,
        saleType: string,
        color: string,
        date: string,
        time: string,
        pprice: number,
        sprice: number,
        discount: number,
        offer: number,
        cardAmount: number,
        vatAmount: number,
        received: number,
        cid: string,
        saleId: number
    }
    interface shopData {
        shopName: string,
        phoneNumber: string,
        address: string,
        email: string
    }
    // useEffect(() => {
    //     if (invoiceData) {
    //         handlePrint();
    //     }
    // }, [invoiceData]);
    const [shopInfo, setShopInfo] = useState<shopData>();
    useEffect(() => {
        fetch(`${apiBaseUrl}/shop/getShopInfo?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setShopInfo(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    const [allNotes, setAllNotes] = useState([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/shop/getInvoiceNote?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setAllNotes(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    useEffect(() => {
        if (username && cid) {
            fetch(`${apiBaseUrl}/api/getInvoiceData?username=${username}&cid=${cid}`)
                .then(response => response.json())
                .then(data => {
                    const updatedData = data.map((item: invoiceData) => {
                        if (item.saleType === 'vendor') {
                            return { ...item, sprice: item.pprice };
                        }
                        return item;
                    });
                    setInvoiceData(updatedData);
                })
                .catch(error => console.error('Error fetching invoice data:', error));
        }
    }, [apiBaseUrl, username, cid]);
    const isVendorSale = invoiceData.some(item => item.saleType === 'vendor');
    const saleLink = isVendorSale ? "/vendor-sale" : "/sale";

    useEffect(() => {
        if (invoiceData[0]?.saleId) {
            const saleId = invoiceData[0].saleId;

            // Fetch previous invoice
            fetch(`${apiBaseUrl}/api/getPreviousInvoice?username=${username}&saleId=${saleId}`)
                .then((response) => response.json())
                .then((data) => setPrevInvoice(data.cid))
                .catch((error) => console.error("Error fetching previous invoice:", error));

            // Fetch next invoice
            fetch(`${apiBaseUrl}/api/getNextInvoice?username=${username}&saleId=${saleId}`)
                .then((response) => response.json())
                .then((data) => setNextInvoice(data.cid))
                .catch((error) => console.error("Error fetching next invoice:", error));
        }
    }, [apiBaseUrl, username, invoiceData]);

    const handleNavigation = (type: string) => {
        if (type === "prev" && prevInvoice.length > 0) {
            const newCid = prevInvoice;
            if (newCid) {
                router.push(`/invoice?cid=${newCid}`);
            } else {
                console.error("No valid invoice found !");
            }
        } else if (type === "next" && nextInvoice.length > 0) {
            const newCid = nextInvoice;
            if (newCid) {
                router.push(`/invoice?cid=${newCid}`);
            } else {
                console.error("No valid invoice found !");
            }
        } else {
            console.error("No data found !");
        }
    };

    const [currency, setCurrency] = useState<string>('');
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getCurrency?username=${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.currency === 'BDT' || !data.currency) {
                    setCurrency('৳');
                } else {
                    setCurrency(data.currency);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [apiBaseUrl, username]);

    const subtotal = invoiceData.reduce((acc, item) => acc + item.sprice, 0);
    const discount = invoiceData.reduce((acc, item) => acc + item.discount, 0);
    const offer = invoiceData.reduce((acc, item) => acc + item.offer, 0);
    const vat = invoiceData.reduce((acc, item) => item.vatAmount, 0);
    const card = invoiceData.reduce((acc, item) => item.cardAmount, 0);
    const received = invoiceData.reduce((acc, item) => item.received, 0);
    const total = (subtotal + vat) - discount - offer;
    const totalInWords = toWords(total + received);

    if (!invoiceData) {
        return <div><Loading /></div>;
    }
    return (
        <div className="container min-h-[calc(100vh-228px)]">
            <div className="flex justify-end pr-10 pt-5 gap-3">
                <Link href={saleLink}>  <button className='btn btn-ghost btn-square'><FcPlus size={30} /></button></Link>
                <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
            </div>
            <div className="flex justify-center mb-5">
                <div ref={contentToPrint} className="flex-1 max-w-[794px] h-auto p-4 border font-semibold">
                    <div className="flex w-full justify-between">
                        <h1><FcDataSheet size={50} /></h1>
                        <h1 className='tracking-widest text-sm md:text-lg font-bold'>INVOICE</h1>
                    </div>
                    <div className="flex flex-col w-full justify-end items-end">
                        <h1 className='uppercase text-sm md:text-md'>{shopInfo?.shopName}</h1>
                        <h4 className='flex font-sans text-xs md:text-md'><IoLocationOutline className='mt-0.5 mr-1' /> {shopInfo?.address}</h4>
                        <h4 className='flex font-sans text-xs md:text-md'><FaPhoneVolume className='mt-0.5 mr-1' /> {shopInfo?.phoneNumber}</h4>
                        <h4 className='flex font-sans text-xs md:text-md'><AiOutlineMail className='mt-0.5 mr-1' /> {shopInfo?.email}</h4>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="divider divider-accent tracking-widest text-xs font-semibold mt-0 mb-1">INFORMATION</div>
                    </div>
                    <div className="flex w-full justify-between">
                        <div className="flex flex-col">
                            <h2 className='uppercase text-xs md:text-md'>{invoiceData[0]?.cname}</h2>
                            <h4 className='flex text-xs md:text-md pt-1'>{invoiceData[0]?.phoneNumber}</h4>
                            <h4 className='capitalize text-xs md:text-md pt-1'>{invoiceData[0]?.address}</h4>
                        </div>
                        <div className="flex flex-col items-end">
                            <h4 className='text-xs md:text-md uppercase'>Invoice No : {invoiceData[0]?.cid}</h4>
                            <h4 className='text-xs md:text-md uppercase pt-1'>Date : {invoiceData[0]?.date.toLocaleString()}</h4>
                            <h4 className='text-xs md:text-md uppercase pt-1'>Time : {invoiceData[0]?.time.toLocaleString()}</h4>
                            {invoiceData[0]?.soldby ? (<h4 className='font-semibold text-xs md:text-md uppercase pt-1'>Sold By : {invoiceData[0]?.soldby} </h4>) : null}
                        </div>
                    </div>
                    <div className="w-full pt-2">
                        <table className="table table-sm">
                            <thead>
                                <tr className='border-b-base-content text-xs md:text-md'>
                                    <th className='text-left p-0'>PRODUCT</th>
                                    <th>QTY</th>
                                    <th>PRICE</th>
                                    <th className='text-right p-0'>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody className='text-xs capitalize'>
                                {invoiceData?.map((products, index) => (
                                    <tr key={index}>
                                        <td className='text-left p-0'>{products.brand} {products.productName} {products.color} {products.productno}</td>
                                        <th>1</th>
                                        <td>{products.sprice.toLocaleString('en-IN')}</td>
                                        <td className='text-right p-0'>{products.sprice.toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="divider mt-0 mb-0"></div>
                    </div>
                    <div className="flex w-full gap-5 justify-end">
                        <div className="flex flex-col items-end">
                            <p className='uppercase  text-xs md:text-md'>SUB TOTAL :</p>
                            <p className='uppercase  text-xs md:text-md'>DISCOUNT :</p>
                            <p className='uppercase  text-xs md:text-md'>OFFER :</p>
                            <p className='uppercase  text-xs md:text-md'>VAT :</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className='text-xs md:text-md'>{currency} {subtotal?.toLocaleString('en-IN')}</p>
                            <p className='text-xs md:text-md'>{currency} {discount?.toLocaleString('en-IN')}</p>
                            <p className='text-xs md:text-md'>{currency} {offer?.toLocaleString('en-IN')}</p>
                            <p className='text-xs md:text-md'>{currency} {vat?.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <div className="flex w-full justify-between">
                        <div className="tracking-widest text-xs mt-1 mb-0">Signature -------------</div>
                        <div className="mt-0 mb-0">--------------------</div>
                    </div>
                    <div className="flex w-full justify-end">
                        <div className="flex w-1/2 gap-5 justify-end">
                            <div className="flex flex-col items-end">
                                <p className='uppercase text-xs md:text-md'>TOTAL :</p>
                                <p className='uppercase text-xs md:text-md'>PREVIOUS DUE :</p>
                                <p className='uppercase text-xs md:text-md'>NET PAYABLE :</p>

                            </div>
                            <div className="flex flex-col items-end">
                                <p className='text-xs md:text-md'>{currency} {total.toLocaleString('en-IN')}</p>
                                <p className='text-xs md:text-md'>{currency} {received?.toLocaleString('en-IN')}</p>
                                <p className='text-xs md:text-md'>{currency} {(total + received)?.toLocaleString('en-IN') || 0}</p>

                            </div>

                        </div>
                    </div>
                    <div className="flex items-end justify-end capitalize pt-2"><p className='text-sm'>(In Words : {totalInWords})</p></div>
                    <div className="flex flex-col pt-16 text-xs uppercase">
                        {allNotes?.map((item: any, index) => (
                            <tr key={index}>
                                <td><p className='flex gap-2 text-left'> <FcAdvertising size={18} /> {item.note}</p></td>
                            </tr>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center gap-10 pb-5">
                <button className='text-success btn btn-ghost btn-square' onClick={() => handleNavigation("prev")} disabled={!prevInvoice.length}><CiSquareChevLeft size={36} /></button>
                <button className='text-success btn btn-ghost btn-square' onClick={() => handleNavigation("next")} disabled={!nextInvoice.length}><CiSquareChevRight size={36} /></button>
            </div>
        </div>
    )
};

export default Invoice