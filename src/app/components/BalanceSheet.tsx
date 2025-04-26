"use client"
import CurrentDate from '@/app/components/CurrentDate';
import { useAppSelector } from '@/app/store';
import React, { useEffect, useRef, useState } from 'react'
import { FcPrint } from 'react-icons/fc';
import { useReactToPrint } from 'react-to-print';
import CompanyInfo from './CompanyInfo';

const BalanceSheet = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    const [netcashToday, setNetSumAmount] = useState(0);

    useEffect(() => {
        fetch(`${apiBaseUrl}/cashbook/net-cash-today?username=${username}`)
            .then(response => response.json())
            .then(data => setNetSumAmount(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [apiBaseUrl, username]);

    const [payments, setPayments] = useState(0);
    useEffect(() => {
        fetch(`${apiBaseUrl}/cashbook/allPaymentSum?username=${username}`)
            .then(response => response.json())
            .then(data => setPayments(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [apiBaseUrl, username]);


    const [receives, setReceives] = useState(0);
    useEffect(() => {
        fetch(`${apiBaseUrl}/cashbook/allReceiveSum?username=${username}`)
            .then(response => response.json())
            .then(data => setReceives(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [apiBaseUrl, username]);

    const [supplierBalance, setSupplierBalance] = useState(0);
    useEffect(() => {
        fetch(`${apiBaseUrl}/payment/getSupplierBalance?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const total = data.reduce((sum: any, supplier: { balance: any; }) => sum + supplier.balance, 0);
                setSupplierBalance(total);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    const [retailerBalance, setRetailerBalance] = useState(0);
    useEffect(() => {
        fetch(`${apiBaseUrl}/payment/getRetailerDue?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setRetailerBalance(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);


    const [stockValue, setStockValue] = useState(0);
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getProductStock?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const total = data.reduce((sum: any, product: { pprice: any; }) => sum + product.pprice, 0);
                setStockValue(total);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);


    return (
        <div className="flex flex-col">
            <div className="flex justify-between pl-5 pr-5">
                <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
            </div>
            <div className="w-full card">
                <div ref={contentToPrint} className="flex flex-col w-full items-center justify-center pt-5">
                    <div className="flex flex-col items-center justify-center">
                        <CompanyInfo />
                        <h4 className='font-bold'>BALANCE SHEET</h4>
                        <h4 className='font-semibold'><CurrentDate /></h4>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="flex w-full items-center justify-between text-sm font-semibold p-5">
                            <h4>ASSETS</h4>
                            <h4>LIABILITIES</h4>
                        </div>
                        <div className="flex w-full gap-10">
                            <div className="flex">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>DESCRIPTION</th>
                                            <th>AMOUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>CASH IN HAND</td>
                                            <td>{(netcashToday ?? 0).toLocaleString('en-IN')}</td>
                                        </tr>
                                        <tr>
                                            <td>TOTAL DEBITOR</td>
                                            <td>{(payments ?? 0).toLocaleString('en-IN')}</td>
                                        </tr>
                                        <tr>
                                            <td>RETAILER DUE</td>
                                            <td>{(retailerBalance ?? 0).toLocaleString('en-IN')}</td>
                                        </tr>

                                        <tr>
                                            <td>PRODUCT STOCK</td>
                                            <td>{(stockValue ?? 0).toLocaleString('en-IN')}</td>
                                        </tr>


                                    </tbody>
                                    <tfoot>
                                        <tr className='text-sm font-bold'>
                                            <td>TOTAL ASSETS</td>
                                            <td>{Number(netcashToday + retailerBalance + payments + stockValue).toLocaleString('en-IN')}</td>

                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div>
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>DESCRIPTION</th>
                                            <th>AMOUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className='font-semibold'>
                                            <td className='text-sm'>TOTAL CAPITAL</td>
                                            <td>{Number(receives).toLocaleString('en-IN')}</td>
                                        </tr>
                                        <tr className='font-semibold'>
                                            <td className='text-sm'>TOTAL CREDITOR</td>
                                            <td>{Number(supplierBalance).toLocaleString('en-IN')}</td>
                                        </tr>
                                        <tr className='font-semibold'>
                                            <td className='text-sm'>OWNER&apos;S EQUITY </td>
                                            <td>{Number((netcashToday + payments + retailerBalance + stockValue) - (receives + supplierBalance)).toLocaleString('en-IN')}</td>
                                        </tr>

                                    </tbody>
                                    <tfoot>
                                        <tr className='text-sm font-bold'>
                                            <td>TOTAL LIABILITIES</td>
                                            <td>{Number(receives + supplierBalance + ((netcashToday + payments + retailerBalance + stockValue) - (receives + supplierBalance))).toLocaleString('en-IN')}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BalanceSheet




