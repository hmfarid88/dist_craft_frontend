'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from "react-to-print";
import { FcPrint } from "react-icons/fc";
import CurrentDate from "@/app/components/CurrentDate";
import ExcelExportButton from "@/app/components/ExcellGeneration";
import CompanyInfo from "@/app/components/CompanyInfo";
interface Product {
    id: string;
    brand: string;
    category: string;
    color: string;
    pprice: number;
    productName: string;
    productno: string;
    date: string;
    time: string;
    sprice: number;
    supplier: string;
    supplierInvoice: string;

}
const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [groupMode, setGroupMode] = useState<'none' | 'group'>('none');
    const groupedProducts =
        groupMode === 'group'
            ? Object.values(
                filteredProducts.reduce((acc, item) => {
                    const key = `${item.category}-${item.brand}-${item.productName}`;

                    if (!acc[key]) {
                        acc[key] = {
                            category: item.category,
                            brand: item.brand,
                            productName: item.productName,

                            count: 1,
                            totalPprice: item.pprice,
                            totalSprice: item.sprice,
                        };
                    } else {
                        acc[key].count += 1;
                        acc[key].totalPprice += item.pprice;
                        acc[key].totalSprice += item.sprice;
                    }

                    return acc;
                }, {} as Record<
                    string,
                    {
                        category: string;
                        brand: string;
                        productName: string;
                        count: number;
                        totalPprice: number;
                        totalSprice: number;
                    }
                >)
            )
            : [];

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getProductStock?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    useEffect(() => {
        const search = filterCriteria.trim().toLowerCase();

        const filtered = allProducts.filter(product => {
            const text = `
      ${product.category ?? ''}
      ${product.brand ?? ''}
      ${product.productName ?? ''}
      ${product.date ?? ''}
      ${product.color ?? ''}
      ${product.productno ?? ''}
      ${product.supplierInvoice ?? ''}
      ${product.supplier ?? ''}
    `.toLowerCase();

            return text.includes(search);
        });

        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);


    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    // const totalQty = new Set(filteredProducts.map(product => product.productno)).size;

    // const totalPprice = filteredProducts.reduce((total, product) => {
    //     return total + product.pprice;
    // }, 0);

    // const totalSprice = filteredProducts.reduce((total, product) => {
    //     return total + product.sprice;
    // }, 0);
    const totalQty =
        groupMode === 'group'
            ? groupedProducts.reduce((sum, p) => sum + p.count, 0)
            : new Set(filteredProducts.map(p => p.productno)).size;

    const totalPprice =
        groupMode === 'group'
            ? groupedProducts.reduce((sum, p) => sum + p.totalPprice, 0)
            : filteredProducts.reduce((sum, p) => sum + p.pprice, 0);

    const totalSprice =
        groupMode === 'group'
            ? groupedProducts.reduce((sum, p) => sum + p.totalSprice, 0)
            : filteredProducts.reduce((sum, p) => sum + p.sprice, 0);
    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">

            <div className="flex justify-between items-end pl-5 pr-5 pt-5">
                <label className="input input-bordered flex max-w-xs  items-center gap-2">
                    <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                </label>
                <div className="flex gap-3">
                    <ExcelExportButton tableRef={contentToPrint} fileName="Stock_Report" />
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
            </div>
            <div className="flex justify-end p-5">
                <button
                    onClick={() =>
                        setGroupMode(groupMode === 'group' ? 'none' : 'group')
                    }
                    className="btn btn-sm btn-outline btn-primary"
                >
                    {groupMode === 'group' ? 'Details View' : 'Group View'}
                </button>
            </div>
            <div ref={contentToPrint} className="flex flex-col p-2 items-center justify-center">
                <CompanyInfo />
                <h4 className="font-bold">STOCK DETAILS</h4>
                <h4 className="pb-5"><CurrentDate /></h4>
                <table className="table table-sm">
                    <thead className="sticky top-16 bg-base-100">
                        <tr>
                            <th>SN</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>PRODUCT</th>
                            <th>COLOR</th>
                            <th>PRODUCT NO</th>
                            <th>P PRICE</th>
                            <th>S PRICE</th>
                            <th>SUPPLIER</th>
                            <th>S INVOICE</th>
                            <th>STOCK DATE</th>
                            <th>STOCK TIME</th>
                        </tr>
                    </thead>
                    {/* <tbody>
                        {filteredProducts?.map((product, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>{product.productName}</td>
                                <td>{product.color}</td>
                                <td>{product.productno}</td>
                                <td>{product.pprice}</td>
                                <td>{product.sprice}</td>
                                <td>{product.supplier}</td>
                                <td>{product.supplierInvoice}</td>
                                <td>{product.date}</td>
                                <td>{product.time}</td>
                            </tr>
                        ))}
                    </tbody> */}

                    <tbody>
                        {/* NORMAL VIEW */}
                        {groupMode === 'none' &&
                            filteredProducts.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.productName}</td>
                                    <td>{product.color}</td>
                                    <td>{product.productno}</td>
                                    <td>{product.pprice}</td>
                                    <td>{product.sprice}</td>
                                    <td>{product.supplier}</td>
                                    <td>{product.supplierInvoice}</td>
                                    <td>{product.date}</td>
                                    <td>{product.time}</td>
                                </tr>
                            ))}

                        {/* GROUP VIEW */}
                        {groupMode === 'group' &&
                            groupedProducts.map((p, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{p.category}</td>
                                    <td>{p.brand}</td>
                                    <td>{p.productName}</td>
                                    <td>-</td>
                                    <td>{p.count} pcs</td>
                                    <td>{p.totalPprice}</td>
                                    <td>{p.totalSprice}</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                            ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold text-sm">
                            <td colSpan={4}></td>
                            <td>TOTAL</td>
                            <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                            <td>{Number(totalPprice.toFixed(2)).toLocaleString('en-IN')}</td>
                            <td>{Number(totalSprice.toFixed(2)).toLocaleString('en-IN')}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

export default Page