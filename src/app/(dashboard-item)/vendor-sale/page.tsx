'use client'
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteAllProducts, deleteProduct, selectTotalQuantity } from "@/app/store/vendorSaleSlice";
import Select from "react-select";
import { uid } from 'uid';
import { toast } from "react-toastify";
import { RxCrossCircled } from "react-icons/rx";


const Page: React.FC = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    const [date, setDate] = useState("");
    const [pending, setPending] = useState(false);
    const [total, setTotal] = useState(0);

    const [productOption, setProductOption] = useState([]);
    const [vendorOption, setVendorOption] = useState([]);
    const [selectedProidOption, setSelectedProidOption] = useState(null);

    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const saleProducts = useAppSelector((state) => state.vendorSale.products);
    const totalQuantity = useAppSelector(selectTotalQuantity);
    const dispatch = useAppDispatch();

    const [vendor, setVendor] = useState("");
    const cid = uid();
    const selectRef = useRef<any>(null);
    const [maxDate, setMaxDate] = useState("");
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
        setDate(formattedDate);
    }, []);

    useEffect(() => {
        calculateTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saleProducts]);

    const calculateTotal = () => {
        const total = saleProducts.reduce((sum, p) => {
            return sum + p.pprice;
        }, 0);
        setTotal(total);
    };
    const totalQty = saleProducts.length;

    const handleDeleteProduct = (id: any) => {
        dispatch(deleteProduct(id));
    };

    const productInfo = saleProducts.map(product => ({
        proId: product.proId,
        saleType: 'vendor',
        sprice: product.pprice,
        discount: 0,
        offer: 0,
        date: date,
        cid: cid,
        username: username
        
    }));
    const handleFinalSubmit = async (e: any) => {
        e.preventDefault();
        if (!vendor) {
            toast.error("Vendor name is required !");
            return;
        }
        if (productInfo.length === 0) {
            toast.error("Your product list is empty!");
            return;
        }

        const salesRequest = {
            customer: {
                cid, cname: vendor, username, vatAmount:0
            },
            salesItems: productInfo,
        };
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/sales/productSale`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(salesRequest),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.message || "Vendor sale not submitted!");
                return;
            }
            dispatch(deleteAllProducts(username));
            router.push(`/invoice?cid=${cid}`);

        } catch (error: any) {
            toast.error("An error occurred: " + error.message);
        } finally {
            setPending(false);
        }
    };
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getSalesProductStock?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.proId,
                    value: item.proId,
                    label: item.productName + ", " + item.productno
                }));
                setProductOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getSupplierItem?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.supplierItem,
                    label: item.supplierItem
                }));
                setVendorOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);
    return (
        <div className='container-2xl min-h-[calc(100vh-228px)]'>
            <div className="flex flex-col">
                <div className="flex pt-5 px-10 pb-0">
                    <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="input input-ghost" />
                </div>
                <div className="flex flex-col w-full">
                    <div className="divider divider-accent tracking-widest font-bold p-5">VENDOR SALE AREA</div>
                </div>
                <div className="flex gap-2 items-center justify-center z-10">
                    <Select
                        className="text-black w-64 md:w-96"
                        ref={selectRef}
                        autoFocus={true}
                        value={selectedProidOption}
                        onChange={async (selectedOption: any) => {
                            if (!selectedOption) return;
                            setSelectedProidOption(selectedOption);

                            try {
                                const response = await fetch(`${apiBaseUrl}/api/getSingleProduct?proId=${selectedOption.value}`);
                                if (!response.ok) {
                                    toast.error("Error fetching product data");
                                    return;
                                }

                                const data = await response.json();
                                const productToVendor = {
                                    id: uid(),
                                    proId: data.proId,
                                    brand: data.brand,
                                    color: data.color,
                                    productName: data.productName,
                                    productno: data.productno,
                                    pprice: data.pprice,
                                    username: username,
                                };

                                dispatch(addProducts(productToVendor));
                                setSelectedProidOption(null);
                                if (selectRef.current) {
                                    selectRef.current.focus();
                                }
                            } catch (error) {
                                console.error('Error fetching product:', error);

                            }
                        }}
                        options={productOption}
                    />
                    <div className="flex">
                        <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content w-12">
                                    <span>{totalQuantity}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center w-full p-5">
                    <div className="overflow-x-auto max-h-96">
                        <table className="table table-pin-rows">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>DESCRIPTION</th>
                                    <th>PRODUCT NO</th>
                                    <th>VALUE</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {saleProducts?.map((p, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{p.brand}, {p.productName} {p.color}</td>
                                        <td>{p.productno}</td>
                                        <td>{p.pprice.toLocaleString('en-IN')}</td>
                                        <td className="flex justify-between gap-3">
                                            <button onClick={() => {
                                                handleDeleteProduct(p.id);
                                            }} className="btn btn-sm btn-circle btn-ghost text-error"> <RxCrossCircled size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td className="text-lg font-semibold">TOTAL</td>
                                    <td className="text-lg font-semibold">{totalQty}</td>
                                    <td className="text-lg font-semibold">{total.toLocaleString('en-IN')}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
                <div className="flex w-full justify-center p-5">
                    <div className="card shadow shadow-slate-500 max-w-lg gap-3 p-5">
                        <div className="card-title text-sm font-semibold">SELECT VENDOR</div>
                        <Select className="text-black h-[38px] w-64" onChange={(selectedOption: any) => setVendor(selectedOption.value)} options={vendorOption} />
                        <button onClick={handleFinalSubmit} disabled={pending} className="btn w-xs h-[38px] btn-success btn-outline font-bold">{pending ? <span className="loading loading-ring loading-md text-accent"></span> : "SUBMIT"}</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Page