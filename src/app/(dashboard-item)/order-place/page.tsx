'use client'
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteAllProducts, deleteProduct, selectTotalQuantity, updateAllSrAndArea } from "@/app/store/orderlistSlice";
import Select from "react-select";
import { uid } from 'uid';
import { toast, ToastContainer } from "react-toastify";
import { MdOutlineNavigateNext } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { FcDataSheet, FcDeleteDatabase, FcPrint } from "react-icons/fc";
import { useReactToPrint } from "react-to-print";
import { IoLocationOutline } from "react-icons/io5";
import { FaPhoneVolume } from "react-icons/fa6";
import { AiOutlineMail } from "react-icons/ai";

const Page: React.FC = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    const [date, setDate] = useState('');
    const [pending, setPending] = useState(false);
    const [offerValue, setOfferValue] = useState("");
    const [total, setTotal] = useState(0);
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [productOption, setProductOption] = useState([]);
    const [selectedProidOption, setSelectedProidOption] = useState(null);

    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const saleProducts = useAppSelector((state) => state.orderlist.products);
    const totalQuantity = useAppSelector(selectTotalQuantity);
    const dispatch = useAppDispatch();

    const [cname, setCname] = useState("");
    const [phoneNumber, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [area, setArea] = useState("");
    const [soldby, setSoldby] = useState("");
    const [cardPay, setCard] = useState(0);
    const [vat, setVat] = useState<number>(0)
    const vatAmount = (total * vat) / 100;
    const [received, setReceived] = useState('');
    interface shopData {
        shopName: string,
        phoneNumber: string,
        address: string,
        email: string
    }
    const cid = uid();
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

    useEffect(() => {
        calculateTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saleProducts]);

    const calculateTotal = () => {
        const total = saleProducts.reduce((sum, p) => {
            return sum + ((p.sprice));
        }, 0);
        setTotal(total);
    };
    const totalQty = saleProducts.length;

    const handleDeleteProduct = (id: any) => {
        dispatch(deleteProduct(id));
    };
    const handleSetSrAndArea = () => {
        if(!soldby){
            toast.info("Sorry, Sr name not found!");
            return;
        }
        if (saleProducts.length === 0) {
              toast.error("Sorry, product list is empty!");
              return;
            }
        dispatch(updateAllSrAndArea({ srname: soldby, area: area }));
    };

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getProductStock?username=${username}`)
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
        fetch(`${apiBaseUrl}/api/getVatPercent?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setVat(data);
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

    useEffect(() => {
        if (phoneNumber.trim().length === 11) {
            fetch(`${apiBaseUrl}/customer/customers?username=${username}&phoneNumber=${phoneNumber}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        setCname(data[0]?.customer || "");
                        setAddress(data[0]?.address || "");

                    } else {
                        setCname("");
                        setAddress("");
                    }
                })
                .catch(error => {
                    console.error("Error fetching customer info:", error);
                    setCname("");
                    setAddress("");
                });
        } else {
            setCname("");
            setAddress("");
        }
    }, [phoneNumber, apiBaseUrl, username]);

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

    const handleSrChange = (selectedOption: any) => {
        setSoldby(selectedOption.value);
        setArea(selectedOption.area);
    };


    return (
        <div className='container-2xl min-h-[calc(100vh-228px)]'>
            <div className="flex flex-col md:flex-row">
                <div className="flex flex-col w-full md:w-1/2">
                    <div className="flex flex-col">
                        <div className="flex pt-5 px-10 pb-0">
                            <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="input input-ghost" />
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="divider divider-accent tracking-widest font-bold p-5">ORDER AREA</div>
                        </div>

                        <div className="flex items-center gap-2 justify-center">
                            <Select
                                className="text-black w-64 md:w-96 z-50"
                                ref={selectRef}
                                autoFocus={true}
                                value={selectedProidOption}
                                options={productOption}

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
                                        const productToSale = {
                                            id: uid(),
                                            date: date,
                                            proId: data.proId,
                                            brand: data.brand,
                                            color: data.color,
                                            productName: data.productName,
                                            productno: data.productno,
                                            sprice: data.sprice,
                                            srname: '',
                                            area: '',
                                            username: username
                                        };

                                        dispatch(addProducts(productToSale));
                                        setSelectedProidOption(null);
                                        if (selectRef.current) {
                                            selectRef.current.focus();
                                        }
                                    } catch (error) {
                                        console.error('Error fetching product:', error);

                                    }
                                }}
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
                                                <td>{Number((p.sprice).toFixed(2)).toLocaleString('en-IN')}</td>
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
                                            <td className="text-lg font-semibold">TOTAL</td>
                                            <td className="text-lg font-semibold">{totalQty}</td>
                                            <td className="text-lg font-semibold">{currency} {Number(total.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between p-5">
                        <div className="flex justify-center p-5">
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-sm">SELECT SR</label>
                                <Select className="text-black h-[38px] w-64" onChange={handleSrChange} options={srNameOption} />
                            </div>
                        </div>

                        <div className="flex justify-center p-2">
                            <div className="card items-center justify-center gap-3 p-2">
                                <label className="font-bold">SUBMIT</label>
                                <button disabled={pending} onClick={handleSetSrAndArea} className="btn btn-success btn-circle btn-outline font-bold">{pending ? <span className="loading loading-ring loading-md text-accent"></span> : <MdOutlineNavigateNext size={40} />}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {saleProducts[0]?.srname? (
                <div className="flex flex-col w-full md:w-1/2 p-2">
                    <div className="flex justify-between p-5">
                        <button onClick={() => {const confirmed = window.confirm("Are you sure to delete all products?"); if (confirmed) {dispatch(deleteAllProducts(username));}}} className="flex btn btn-ghost btn-square"><FcDeleteDatabase size={36} /></button>
                        <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                    </div>
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
                                    <h4 className='text-xs md:text-md uppercase pt-1'>Area Name : {saleProducts[0]?.area?.toLocaleString()}</h4>
                                    {saleProducts[0]?.srname ? (<h4 className='font-semibold text-xs md:text-md uppercase pt-1'>Sr Name : {saleProducts[0]?.srname} </h4>) : null}
                                </div>
                            </div>
                            <div className="w-full pt-2">
                                <table className="table table-sm">
                                    <thead>
                                        <tr className='border-b-base-content text-xs md:text-md'>
                                            <th className='text-left p-0'>SN</th>
                                            <th>DESCRIPTION</th>
                                            <th>PRODUCT NO</th>
                                            <th>PRICE</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-xs md:text-md capitalize'>
                                        {saleProducts?.map((products, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className='text-left p-0'>{products.brand} {products.productName} {products.color}</td>
                                                <th>{products.productno}</th>
                                                <td className='text-right p-0'>{Number(products.sprice.toFixed(2)).toLocaleString('en-IN')}</td>
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
                                    <p className='uppercase  text-xs md:text-md'>TOTAL :</p>

                                </div>
                                <div className="flex flex-col items-end">
                                    <p className='text-xs md:text-md'>{currency} {Number(total.toFixed(2)).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="tracking-widest text-xs mt-1 mb-0">SIGNATURE</div>
                                <div className="mt-0 mb-0">-----------</div>
                            </div>

                        </div>
                    </div>
                </div>):<div className="flex w-1/2 items-center justify-center"><p>No preview available</p></div>}
            </div>
            <ToastContainer autoClose={1000} theme="dark" />
        </div>
    )
}

export default Page