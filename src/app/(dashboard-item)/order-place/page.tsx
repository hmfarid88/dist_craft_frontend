'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteAllProducts, deleteProduct, selectTotalQuantity } from "@/app/store/orderlistSlice";
import Select from "react-select";
import { uid } from 'uid';
import { toast, ToastContainer } from "react-toastify";
import { RxCrossCircled } from "react-icons/rx";
import { FcDataSheet, FcDeleteDatabase, FcPrint } from "react-icons/fc";
import { useReactToPrint } from "react-to-print";
import { IoLocationOutline } from "react-icons/io5";
import { FaPhoneVolume } from "react-icons/fa6";
import { AiOutlineMail } from "react-icons/ai";
import ExcelExportButton from "@/app/components/ExcellGeneration";

const Page: React.FC = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [date, setDate] = useState('');
    const [total, setTotal] = useState(0);

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    const [productOption, setProductOption] = useState<ProductOptionType[]>([]);

    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const saleProducts = useAppSelector((state) => state.orderlist.products);
    const totalQuantity = useAppSelector(selectTotalQuantity);
    const dispatch = useAppDispatch();

    const [retailer, setRetailer] = useState("");
    const [area, setArea] = useState("");
    const [soldby, setSoldby] = useState("");
    const [productName, setProductName] = useState("");
    const [productno, setProductno] = useState("");
    const [sprice, setSprice] = useState<number>(0);
    const [color, setColor] = useState('');
    const [qty, setQty] = useState<number>(0);


    interface shopData {
        shopName: string,
        phoneNumber: string,
        address: string,
        email: string
    }

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

    const selectRef = useRef<any>(null);
    interface ProductOptionType {
        id: number;
        value: number;
        label: string;
        sprice: number;
    }
    useEffect(() => {
        calculateTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saleProducts]);

    const calculateTotal = () => {
        const total = saleProducts.reduce((sum, p) => {
            return sum + ((p.sprice * p.qty));
        }, 0);
        setTotal(total);
    };

    const totalQty = saleProducts.reduce((sum: number, p) => {
        return sum + Number(p.qty);
    }, 0);



    const handleDeleteProduct = (id: any) => {
        dispatch(deleteProduct(id));
    };
    const addOrder = () => {

        if (!soldby || !productName || !retailer || !color || !sprice || qty<1) {
            toast.info("Sorry, Need all fields!");
            return;
        }

        dispatch(addProducts({ id: uid(), date, retailer, productName, color, productno, sprice: sprice, qty, srname: soldby, area, username }));
        setQty(0);
        setProductno('');
    };

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getProductStock?username=${username}`)
            .then(response => response.json())
            .then(data => {
                // Filter unique product names using a Map
                const uniqueProductsMap = new Map();
                data.forEach((item: any) => {
                    if (!uniqueProductsMap.has(item.productName)) {
                        uniqueProductsMap.set(item.productName, item);
                    }
                });

                const transformedData = Array.from(uniqueProductsMap.values()).map((item: any) => ({
                    id: item.proId,
                    value: item.productName,
                    label: item.productName,
                    sprice: item.sprice
                }));

                setProductOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);


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


    const [srNameOption, setSrNameOption] = useState([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/shop/getSrInfo?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.srName,
                    label: item.srName + ", " + item.area,
                    area: item.area
                }));
                setSrNameOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    const [shopInfo, setShopInfo] = useState<shopData>();
    useEffect(() => {
        fetch(`${apiBaseUrl}/shop/getShopInfo?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setShopInfo(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    const [retailerOption, setRetailerOption] = useState([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/shop/getRetailerInfo?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.retailerName,
                    label: item.retailerName + ", " + item.area
                }));
                setRetailerOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    const handleSrChange = (selectedOption: any) => {
        setSoldby(selectedOption.value);
        setArea(selectedOption.area);
    };
    const handleProductChange = (selectedOption: any) => {
        setProductName(selectedOption.value);
        setSprice(selectedOption.sprice);
    };

    const [colorOption, setColorOption] = useState([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getColorItem?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.colorItem,
                    label: item.colorItem
                }));
                setColorOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    return (
        <div className='container-2xl min-h-[calc(100vh-228px)]'>
            <div className="flex flex-col">
                <div className="flex flex-col w-full">
                    <div className="flex flex-col">
                        <div className="flex pt-2 justify-between pb-0">
                            <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="input input-ghost" />
                            {saleProducts[0]?.srname && (<div className="flex gap-10"> <button onClick={() => { const confirmed = window.confirm("Are you sure to delete all products?"); if (confirmed) { dispatch(deleteAllProducts(username)); } }} className="flex btn btn-ghost btn-square"><FcDeleteDatabase size={36} /></button>
                                <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                                <ExcelExportButton tableRef={contentToPrint} fileName="order_report" />
                            </div>)}
                            <div className="avatar-group -space-x-6 rtl:space-x-reverse pr-5">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content w-12">
                                        <span>{totalQuantity}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="flex flex-col w-full">
                            <div className="divider divider-accent tracking-widest font-bold p-5">ORDER AREA</div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
                            <div className="flex gap-2">
                                <div className="flex w-full max-w-xs flex-col gap-2">
                                    <label className="font-bold text-sm">SR NAME</label>
                                    <Select className="text-black w-full h-[38px] z-10" onChange={handleSrChange} options={srNameOption} />
                                </div>
                                <div className="flex flex-col w-full max-w-xs gap-2">
                                    <label className="font-bold text-sm">RETAILER NAME</label>
                                    <Select className="text-black h-[38px] w-full z-10" onChange={(selectedOption: any) => setRetailer(selectedOption.value)} options={retailerOption} />
                                </div>
                                <div className="flex flex-col w-full max-w-xs gap-2">
                                    <label className="font-bold text-sm">PRODUCT NAME</label>
                                    <Select className="text-black w-full z-10" onChange={handleProductChange} options={productOption} />
                                </div>

                                <div className="flex flex-col w-full max-w-xs gap-2">
                                    <label className="font-bold text-sm">COLOR NAME</label>
                                    <Select className="text-black w-full z-10" name="pcolor" onChange={(selectedOption: any) => setColor(selectedOption.value)} options={colorOption} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm">QTY</label>
                                    <input type="number" placeholder="0" onChange={(e: any) => setQty(e.target.value)} value={qty} className="input input-sm input-bordered bg-white text-black h-[38px] w-20 z-10" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm">PRODUCT NO</label>
                                    <textarea
                                        className="textarea border border-slate-300 bg-white text-black h-20 z-10 w-48"
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                            const rawValue = e.target.value.replace(/, /g, "").replace(/[^a-zA-Z0-9]/g, "");
                                            const formattedValue = rawValue.match(/.{1,15}/g)?.join(", ") || "";
                                            setProductno(formattedValue);
                                        }}
                                        value={productno}
                                        placeholder="Product No"
                                    />

                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm">ADD</label>
                                    <input type="button" onClick={addOrder} value=">>" className="btn btn-sm btn-info z-10" />
                                </div>
                            </div>

                        </div>

                        <div className="flex items-center justify-center w-full p-3">
                            <div className="overflow-x-auto max-h-96">

                                <table className="table table-xs font-bold">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>SR NAME</th>
                                            <th>AREA</th>
                                            <th>RETAILER NAME</th>
                                            <th>DESCRIPTION</th>
                                            <th>PRICE</th>
                                            <th>QTY</th>
                                            <th>TOTAL</th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-xs capitalize'>
                                        {saleProducts?.map((p, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className="max-w-[100px] break-words whitespace-normal">{p.srname}</td>
                                                <td className="max-w-[100px] break-words whitespace-normal">{p.area}</td>
                                                <td className="max-w-[100px] break-words whitespace-normal">{p.retailer}</td>
                                                <td className="max-w-[500px] break-words whitespace-normal">{p.productName} | {p.color} | {p.productno}</td>
                                                <td>{Number((p.sprice).toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{p.qty}</td>
                                                <td>{Number((p.sprice * p.qty).toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>
                                                    <button onClick={() => {
                                                        handleDeleteProduct(p.id);
                                                    }} className="btn btn-sm btn-circle btn-ghost text-error"> <RxCrossCircled size={24} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td className="font-semibold">TOTAL</td>
                                            <td className="font-semibold">{totalQty}</td>
                                            <td className="font-semibold">{currency} {Number(total.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
                {saleProducts[0]?.srname ? (
                    <div className="flex flex-col w-full p-2">

                        <div className="flex justify-center mb-5">
                            <div ref={contentToPrint} className="flex-1 max-w-[794px] h-auto p-4 border font-bold">
                                <div className="flex w-full justify-between">
                                    <h1><FcDataSheet size={50} /></h1>
                                    <h1 className='tracking-widest text-sm md:text-lg'>ORDER INVOICE</h1>
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
                                <div className="flex w-full">
                                    <div className="flex flex-col">
                                        <h4 className='text-xs md:text-md uppercase'>Invoice No : {saleProducts[0]?.id}</h4>
                                        <h4 className='text-xs md:text-md uppercase pt-1'>Date : {saleProducts[0]?.date?.toLocaleString()}</h4>
                                    </div>
                                </div>
                                <div className="w-full pt-2">
                                    <table className="table table-xs">
                                        <thead>
                                            <tr className='border-b-base-content text-xs'>
                                                <th className='text-left p-0'>SN</th>
                                                <th>SR NAME</th>
                                                <th>AREA</th>
                                                <th>RETAILER NAME</th>
                                                <th>DESCRIPTION</th>
                                                <th>PRICE</th>
                                                <th>QTY</th>
                                                <th>TOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-xs capitalize'>
                                            {saleProducts?.map((p, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td className="max-w-[100px] break-words whitespace-normal">{p.srname}</td>
                                                    <td className="max-w-[100px] break-words whitespace-normal">{p.area}</td>
                                                    <td className="max-w-[100px] break-words whitespace-normal">{p.retailer}</td>
                                                    <td className="max-w-[300px] break-words whitespace-normal">{p.productName} | {p.color} | {p.productno}</td>
                                                    <td>{Number((p.sprice).toFixed(2)).toLocaleString('en-IN')}</td>
                                                    <td>{p.qty}</td>
                                                    <td>{Number((p.sprice * p.qty).toFixed(2)).toLocaleString('en-IN')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="divider mt-0 mb-0"></div>
                                </div>
                                <div className="flex w-full gap-5 justify-end pr-10">
                                    <div className="flex flex-col items-end">
                                        <p className='uppercase  text-xs md:text-md'>TOTAL :</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className='text-xs md:text-md'>{Number(totalQty?.toFixed(2)).toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className='text-xs md:text-md'>{currency} {Number(total?.toFixed(2)).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="tracking-widest text-xs mt-1 mb-0">Signature</div>
                                    <div className="mt-0 mb-0">-----------</div>
                                </div>

                            </div>
                        </div>
                    </div>) : <div className="flex w-full items-center justify-center"><p>No order available</p></div>}
            </div>
            <ToastContainer autoClose={1000} theme="dark" />
        </div>
    )
}

export default Page