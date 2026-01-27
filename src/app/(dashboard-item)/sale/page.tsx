'use client'
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, updateSprice, updateDiscount, updateOffer, deleteAllProducts, deleteProduct, selectTotalQuantity } from "@/app/store/productSaleSlice";
import Select from "react-select";
import { uid } from 'uid';
import { toast, ToastContainer } from "react-toastify";
import { MdOutlineNavigateNext } from "react-icons/md";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { RxCrossCircled } from "react-icons/rx";

const Page: React.FC = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [date, setDate] = useState('');
  const [pending, setPending] = useState(false);
  const [disValue, setDisValue] = useState("");
  const [disPercent, setDisPercent] = useState<number>(0);
  const [sprice, setSprice] = useState<{ [key: string]: string | number }>({});
  const [offerValue, setOfferValue] = useState("");
  const [total, setTotal] = useState(0);

  const [productOption, setProductOption] = useState([]);
  const [selectedProidOption, setSelectedProidOption] = useState(null);

  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const saleProducts = useAppSelector((state) => state.productTosale.products);
  const totalQuantity = useAppSelector(selectTotalQuantity);
  const dispatch = useAppDispatch();

  const [cname, setCname] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [soldby, setSoldby] = useState("");
  const [cardPay, setCard] = useState(0);
  const [vat, setVat] = useState<number>(0)
  const vatAmount = (total * vat) / 100;
  const [received, setReceived] = useState('');
  const [returnAmount, setReturnAmount] = useState(0);

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

  const handleReceivedChange = (e: any) => {
    const receivedValue = e.target.value;
    setReceived(receivedValue);
    const returnAmountValue = receivedValue - (Number(total) + Number(vatAmount) - Number(cardPay));
    setReturnAmount(returnAmountValue);
  };
  const selectRef = useRef<any>(null);

  useEffect(() => {
    calculateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disValue, offerValue, saleProducts]);

  const calculateTotal = () => {
    const total = saleProducts.reduce((sum, p) => {
      return sum + (((p.sprice - p.discount) - p.offer));
    }, 0);
    setTotal(total);
  };
  const totalQty = saleProducts.length;

  const handleDeleteProduct = (id: any) => {
    dispatch(deleteProduct(id));
  };


  const handleUpdateDiscount = (id: any) => {
    dispatch(updateDiscount({ id, discount: disValue }));
  };

  const handlePercentDiscount = (id: any) => {
    const sprice = saleProducts.find((product) => product.id === id)?.sprice || 0;
    const discount = (sprice * disPercent) / 100;
    dispatch(updateDiscount({ id, discount }));
  };

  const handleUpdateOffer = (id: any) => {
    dispatch(updateOffer({ id, offer: offerValue }));
  };


  const productInfo = saleProducts.map(product => ({
    sprice: product.sprice,
    discount: product.discount,
    offer: product.offer,
    proId: product.proId,
    date: date,
    cid: cid,
    saleType: 'customer',
    username: username
  }));
  const handleFinalSubmit = async (e: any) => {
    e.preventDefault();
    if (!cname || !soldby) {
      toast.info("Retailer & SR is Required !");
      return;
    }
    if (productInfo.length === 0) {
      toast.error("Your product list is empty!");
      return;
    }

    const salesRequest = {
      customer: {
        cid, cname, phoneNumber, address, soldby, cardPay, vatAmount, received, username
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
        const errorMessage = errorData.message || "Product sale not submitted!";
        toast.error(errorMessage);
        return;
      }

      setCname("");
      setPhone("");
      setCard(0);
      setAddress("");
      setSoldby("");
      setReceived('');
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

  const [srNameOption, setSrNameOption] = useState([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/shop/getSrInfo?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          id: item.id,
          value: item.srName,
          label: item.srName + ", " + item.area
        }));
        setSrNameOption(transformedData);
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
          <div className="divider divider-accent tracking-widest font-bold p-5">SALES AREA</div>
        </div>

        <div className="flex items-center gap-2 justify-center">
          <Select
            className="text-black w-64 md:w-96 z-10"
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
                  proId: data.proId,
                  brand: data.brand,
                  color: data.color,
                  productName: data.productName,
                  productno: data.productno,
                  sprice: data.sprice,
                  discount: 0,
                  offer: 0,
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
                  <th>DISCOUNT</th>
                  <th>(%) DISCOUNT</th>
                  <th>COMPANY OFFER</th>
                  <th>SUB TOTAL</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {saleProducts?.map((p, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{p.brand}, {p.productName} {p.color}</td>
                    <td>{p.productno}</td>
                    <td>
                      <input
                        type="number"
                        name="sprice"
                        value={sprice[p.id] !== undefined ? sprice[p.id] : p.sprice}
                        onChange={(e) => dispatch(updateSprice({ id: p.id, sprice: parseFloat(e.target.value) || 0 }))}
                        className="bg-base-100 w-20 input input-xs input-bordered border-slate-700"
                      />
                    </td>

                    <td>
                      <input type="number" step="any" name="discount" value={p.discount} onChange={(e) => dispatch(updateDiscount({ id: p.id, discount: parseFloat(e.target.value) || 0 }))} className="bg-base-100 w-20 input input-xs input-bordered border-slate-700" />
                    </td>
                    <td>
                      <input type="number" name="percent" step="any" placeholder="0.00" onChange={(e) => {
                        const disPercent = parseFloat(e.target.value) || 0;
                        dispatch(updateDiscount({ id: p.id, discount: (p.sprice * disPercent) / 100 }));
                      }} className="bg-base-100 w-20 input input-xs input-bordered border-slate-700" />
                    </td>
                    <td>
                      <input type="number" name="offer" value={p.offer} onChange={(e) => dispatch(updateOffer({ id: p.id, offer: parseFloat(e.target.value) || 0 }))} className="bg-base-100 w-20 input input-xs input-bordered border-slate-700" />
                    </td>
                    <td>{(p.sprice - p.discount - p.offer).toLocaleString('en-IN')}</td>
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
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="text-lg font-semibold">{currency} {total.toLocaleString('en-IN')}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex w-full justify-center p-5">
          <div className="card shadow shadow-slate-500 max-w-lg gap-3 p-2">
            <h1 className="font-bold text-sm">PRICE INFO</h1>
            <label className="input input-bordered flex items-center gap-2">
              <HiOutlineReceiptTax size={20} />
              <span className="text-sm">VAT</span>
              <p>{Number((vatAmount).toFixed(2)).toLocaleString('en-IN')}</p>
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <div className="text-lg">{currency}</div>
              <span className="text-sm">TOTAL</span>
              <p>{Number((total + vatAmount).toFixed(2)).toLocaleString('en-IN')}</p>
            </label>

          </div>
        </div>
        <div className="flex w-full justify-center p-5">
          <div className="card shadow shadow-slate-500 max-w-lg gap-5 p-2">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">SELECT RETAILER</label>
              <Select className="text-black h-[38px] w-64" onChange={(selectedOption: any) => setCname(selectedOption.value)} options={retailerOption} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">SELECT SR</label>
              <Select className="text-black h-[38px] w-64" onChange={(selectedOption: any) => setSoldby(selectedOption.value)} options={srNameOption} />
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center p-2">
          <div className="card items-center justify-center gap-3 p-2">
            <label className="font-bold">SUBMIT</label>
            <button onClick={handleFinalSubmit} disabled={pending} className="btn btn-success btn-circle btn-outline font-bold">{pending ? <span className="loading loading-ring loading-md text-accent"></span> : <MdOutlineNavigateNext size={40} />}</button>

          </div>
        </div>
      </div>
      <ToastContainer autoClose={1000} theme="dark" />
    </div>
  )
}

export default Page