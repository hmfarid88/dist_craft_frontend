'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CurrentDate from "@/app/components/CurrentDate";
import { CgDetailsMore } from "react-icons/cg";
import ExcelExportButton from "@/app/components/ExcellGeneration";
import CompanyInfo from "@/app/components/CompanyInfo";

type Product = {
  retailerName: string;
  area: string;
  todayProductValue: number;
  todayPreviousPayment: number;
  totalProductValue: number;
  currentPaymentTotal: number;
  previousPaymentTotal: number;
};
type AreaGroup = {
  products: Product[];
  totalCollection: number;
  totalDue: number;
};


const Page = () => {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const [date, setDate] = useState("");

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);


  const handleDetails = (retailerName: string) => {
    if (!retailerName) {
      toast.warning("Retailer name is missing!");
      return;
    }
    router.push(`/details-retailer-ledger?retailerName=${encodeURIComponent(retailerName)}&username=${encodeURIComponent(username)}`);
  };

  useEffect(() => {
    fetch(`${apiBaseUrl}/payment/getRetailerBalance?username=${username}`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  const handleDatewise = (e: any) => {
    if (!date) {
      toast.info("No date selected!")
      return;
    }
    router.push(`/datewise-retailer-ledger?username=${username}&date=${date}`);
  }

  useEffect(() => {
    const filtered = allProducts.filter(product =>
      (product.retailerName.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.area.toLowerCase().includes(filterCriteria.toLowerCase()) || '')

    );
    setFilteredProducts(filtered);
  }, [filterCriteria, allProducts]);

  const handleFilterChange = (e: any) => {
    setFilterCriteria(e.target.value);
  };

  const currentValue = filteredProducts.reduce((total, product) => {
    return total + product.todayProductValue;
  }, 0);
  const totalValue = filteredProducts.reduce((total, product) => {
    return total + product.totalProductValue;
  }, 0);
  const currentPayment = filteredProducts.reduce((total, product) => {
    return total + product.currentPaymentTotal;
  }, 0);
  const todayPreviousPayment = filteredProducts.reduce((total, product) => {
    return total + product.todayPreviousPayment;
  }, 0);
  const totalPayment = filteredProducts.reduce((total, product) => {
    return total + product.previousPaymentTotal;
  }, 0);
  const totalBalance = filteredProducts.reduce((total, product) => {
    return total + product.totalProductValue - product.previousPaymentTotal - product.currentPaymentTotal - product.todayPreviousPayment;
  }, 0);

  const areaGroups: Record<string, AreaGroup> = {};

  filteredProducts?.forEach((product) => {
    const area = product.area;

    if (!areaGroups[area]) {
      areaGroups[area] = {
        products: [],
        totalCollection: 0,
        totalDue: 0,
      };
    }

    const todayDue = product.todayProductValue - product.currentPaymentTotal;
    const previousDue =
      product.totalProductValue -
      product.todayProductValue -
      product.previousPaymentTotal -
      product.todayPreviousPayment;

    areaGroups[area].products.push(product);
    areaGroups[area].totalCollection += product.currentPaymentTotal + product.todayPreviousPayment;
    areaGroups[area].totalDue += todayDue + previousDue;
  });
  let serialNo = 1;

  return (
    <div className="container-2xl">
      <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
        <div className="flex w-full justify-between pl-5 pr-5 pt-1">
          <label className="input input-bordered flex max-w-xs  items-center gap-2">
            <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </label>
          <div className="flex gap-2">
            <input type="date" onChange={(e: any) => setDate(e.target.value)} className="input btn-outline" />
            <button onClick={handleDatewise} className="btn btn-outline btn-square">GO</button>
          </div>
          <div className="flex">
            <ExcelExportButton tableRef={contentToPrint} fileName="rtailer_ledger" />
            <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <div className="overflow-x-auto">
            <div ref={contentToPrint} className="flex-1 p-5">
              <CompanyInfo />
              <div className="flex flex-col items-center pb-5"><h4 className="font-bold">RETAILER LEDGER</h4>
                <h4><CurrentDate /></h4>
              </div>
              <table className="table table-xs md:table-sm table-pin-rows">
                <thead className="sticky top-16 bg-base-100">
                  <tr>
                    <th>SN</th>
                    <th>RETAILER NAME</th>
                    <th>AREA</th>
                    <th>PREVIOUS DUE</th>
                    <th>PREVIOUS PAY</th>
                    <th>PREVIOUS TOTAL</th>
                    <th>CURRENT BILL</th>
                    <th>CURRENT PAY</th>
                    <th>CURRENT TOTAL</th>
                    <th>TOTAL DUE</th>
                    <th>DETAILS</th>
                    <th>AREA SUMMARY</th>
                  </tr>
                </thead>
                {/* <tbody>
                  {filteredProducts?.map((product, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="uppercase">{product?.retailerName}</td>
                      <td className="uppercase">{product?.area}</td>
                      <td>{Number((product?.totalProductValue - product?.todayProductValue - product?.previousPaymentTotal).toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(product?.todayPreviousPayment.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number((product?.totalProductValue - product?.todayProductValue - product?.previousPaymentTotal - product?.todayPreviousPayment).toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(product?.todayProductValue.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(product?.currentPaymentTotal.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number((product?.todayProductValue - product?.currentPaymentTotal).toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number((product?.totalProductValue - product?.previousPaymentTotal - product?.currentPaymentTotal - product.todayPreviousPayment).toFixed(2)).toLocaleString('en-IN')}</td>
                      <td><button onClick={() => handleDetails(product?.retailerName)} className="btn btn-xs btn-info"><CgDetailsMore size={18} /></button></td>

                    </tr>
                  ))}
                </tbody> */}
                <tbody>
                  {Object.entries(areaGroups)?.map(([area, { products, totalCollection, totalDue }]) => {
                    return products.map((product, idx) => (
                      <tr key={`${area}-${idx}`}>
                        <td>{serialNo ++}</td>
                        <td className="uppercase">{product?.retailerName}</td>
                        <td className="uppercase">{product?.area}</td>
                        <td>{Number((product?.totalProductValue - product?.todayProductValue - product?.previousPaymentTotal).toFixed(2)).toLocaleString('en-IN')}</td>
                        <td>{Number(product?.todayPreviousPayment.toFixed(2)).toLocaleString('en-IN')}</td>
                        <td>{Number((product?.totalProductValue - product?.todayProductValue - product?.previousPaymentTotal - product?.todayPreviousPayment).toFixed(2)).toLocaleString('en-IN')}</td>
                        <td>{Number(product?.todayProductValue.toFixed(2)).toLocaleString('en-IN')}</td>
                        <td>{Number(product?.currentPaymentTotal.toFixed(2)).toLocaleString('en-IN')}</td>
                        <td>{Number((product?.todayProductValue - product?.currentPaymentTotal).toFixed(2)).toLocaleString('en-IN')}</td>
                        <td>{Number((product?.totalProductValue - product?.previousPaymentTotal - product?.currentPaymentTotal - product.todayPreviousPayment).toFixed(2)).toLocaleString('en-IN')}</td>
                        <td>
                          <button onClick={() => handleDetails(product?.retailerName)} className="btn btn-xs btn-info">
                            <CgDetailsMore size={18} />
                          </button>
                        </td>

                        {/* Right side column only on first row of each area */}
                        {idx === 0 && (
                          <td rowSpan={products.length} className="bg-base-200 text-center align-middle">
                            <div>
                              <div className="font-bold">{area}</div>
                              <div>Total Coll: {totalCollection.toLocaleString("en-IN")}</div>
                              <div>Total Due: {totalDue.toLocaleString("en-IN")}</div>
                            </div>
                          </td>
                        )}
                      </tr>
                    ));
                  })}
                </tbody>

                <tfoot>
                  <tr className="font-semibold text-lg">
                    <td colSpan={2}></td>
                    <td>TOTAL</td>
                    <td>{(totalValue - totalPayment).toLocaleString('en-IN')}</td>
                    <td>{todayPreviousPayment.toLocaleString('en-IN')}</td>
                    <td>{(totalValue - totalPayment - todayPreviousPayment).toLocaleString('en-IN')}</td>
                    <td>{currentValue.toLocaleString('en-IN')}</td>
                    <td>{currentPayment.toLocaleString('en-IN')}</td>
                    <td>{(currentValue - currentPayment).toLocaleString('en-IN')}</td>
                    <td>{totalBalance.toLocaleString('en-IN')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page