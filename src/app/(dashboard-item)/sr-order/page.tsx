'use client'
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, updateSprice, deleteAllProducts, deleteProduct, selectTotalQuantity } from "@/app/store/srorderSlice";
import Select from "react-select";
import { uid } from 'uid';
import { toast, ToastContainer } from "react-toastify";
import { MdOutlineNavigateNext } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { FcDeleteDatabase, FcPrint } from "react-icons/fc";
import ExcelExportButton from "@/app/components/ExcellGeneration";
import { useReactToPrint } from "react-to-print";

interface Product {
  proId: number;
  srname: string;
  brand: string;
  productName: string;
  color: string;
  productno: string;
  date: string;
  sprice: number;

}
const Page: React.FC = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [date, setDate] = useState('');
  const [pending, setPending] = useState(false);
  const [disValue, setDisValue] = useState("");
  const [sprice, setSprice] = useState<{ [key: string]: string | number }>({});
  const [offerValue, setOfferValue] = useState("");
  const [total, setTotal] = useState(0);
  const [Finaltotal, setFinalTotal] = useState(0);

  const [productOption, setProductOption] = useState([]);
  const [selectedProidOption, setSelectedProidOption] = useState(null);

  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const saleProducts = useAppSelector((state) => state.srOrder.products);
  const totalQuantity = useAppSelector(selectTotalQuantity);
  const dispatch = useAppDispatch();

  const [soldby, setSoldby] = useState("");

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
  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });

  const selectRef = useRef<any>(null);

  const fetchOrderList = async () => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/getOrderList?username=${username}`
      );
      const data = await response.json();
      setAllProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchOrderList();
    }
  }, [apiBaseUrl, username]);


  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const searchWords = filterCriteria.toLowerCase().split(" ");
    const filtered = allProducts.filter(product =>
      searchWords.every(word =>
        (product.brand?.toLowerCase().includes(word) || '') ||
        (product.date?.toLowerCase().includes(word) || '') ||
        (product.color?.toLowerCase().includes(word) || '') ||
        (product.productno?.toLowerCase().includes(word) || '') ||
        (product.productName?.toLowerCase().includes(word) || '')
      )
    );

    setFilteredProducts(filtered);
  }, [filterCriteria, allProducts]);

  const handleFilterChange = (e: any) => {
    setFilterCriteria(e.target.value);
  };

  useEffect(() => {
    calculateTotal();
    calculateFinalTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disValue, offerValue, saleProducts]);

  useEffect(() => {
    calculateFinalTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProducts]);

  const calculateTotal = () => {
    const total = saleProducts.reduce((sum, p) => {
      return sum + (p.sprice);
    }, 0);
    setTotal(total);
  };

  const calculateFinalTotal = () => {
    const finaltotal = filteredProducts.reduce((sum, p) => {
      return sum + (p.sprice);
    }, 0);
    setFinalTotal(finaltotal);
  };
  const totalQty = saleProducts.length;

  const FinaltotalQty = filteredProducts.length;
  const handleDeleteProduct = (id: any) => {
    dispatch(deleteProduct(id));
  };
  const handleDeleteFinalProduct = async (proId: number) => {
    const response = await fetch(
      `${apiBaseUrl}/api/product-order-delete?username=${username}&proId=${proId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete product order");
    }
    fetchOrderList();
    fetchProductStock();
    toast.success("Delete Successfull")

  };

  const productInfo = saleProducts.map(product => ({
    sprice: product.sprice,
    proId: product.proId,
    date: date,
    username: username,
    srname: soldby,
    brand: product.brand,
    color: product.color,
    productName: product.productName,
    productno: product.productno
  }));


  const handleFinalSubmit = async (e: any) => {
    e.preventDefault();
    if (!soldby || soldby === " ") {
      toast.info("SR name is Required !");
      return;
    }
    if (productInfo.length === 0) {
      toast.error("Your product list is empty!");
      return;
    }


    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/addOrders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productInfo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Product sale not submitted!";
        toast.error(errorMessage);
        return;
      }
      setSoldby("");
      fetchOrderList();
      fetchProductStock();
      dispatch(deleteAllProducts(username));
    } catch (error: any) {
      toast.error("An error occurred: " + error.message);
    } finally {
      setPending(false);
    }
  };
  const fetchProductStock = async () => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/getProductStock?username=${username}`
      );
      const data = await response.json();

      const transformedData = data.map((item: any) => ({
        id: item.proId,
        value: item.proId,
        label: `${item.productName}, ${item.productno}`,
      }));

      setProductOption(transformedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchProductStock();
    }
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
      <div className="flex justify-between pt-5 px-10 pb-0">
        <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="input input-ghost" />
        {filteredProducts[0]?.srname && (<div className="flex gap-10">
          <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
          <ExcelExportButton tableRef={contentToPrint} fileName="order_report" />
          <label className="input input-bordered flex max-w-xs  items-center gap-2">
            <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </label>
        </div>)}
      </div>
      <div className="flex flex-col w-full">
        <div className="divider divider-accent tracking-widest font-bold p-5">ORDER AREA</div>
      </div>
      <div className="flex w-full">
        <div className="flex flex-col w-1/2">
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
                    date: date,
                    brand: data.brand,
                    color: data.color,
                    productName: data.productName,
                    productno: data.productno,
                    sprice: data.sprice,
                    discount: 0,
                    offer: 0,
                    username: username,
                    srname: ''
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

                      <td>{(p.sprice).toLocaleString('en-IN')}</td>
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
                    <td className="text-lg font-semibold">{total}</td>
                  </tr>
                </tfoot>
              </table>

            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between">

            <div className="flex w-full justify-center p-5">
              <div className="card shadow shadow-slate-500 max-w-lg gap-5 p-2">

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
        </div>
        <div className="flex flex-col w-1/2 items-center">
          <div ref={contentToPrint} className="flex flex-col items-center p-3">
            <h4 className="text-lg">Order List | {FinaltotalQty}</h4>
            <div className="flex items-center justify-center w-full p-2">
              <div className="overflow-x-auto">
                <table className="table table-pin-rows">
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>DATE</th>
                      <th>SR NAME</th>
                      <th>DESCRIPTION</th>
                      <th>PRODUCT NO</th>
                      <th>SUB TOTAL</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts?.map((p, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{p.date}</td>
                        <td className="capitalize">{p.srname}</td>
                        <td>{p.brand}, {p.productName} {p.color}</td>
                        <td>{p.productno}</td>
                        <td>{(p.sprice).toLocaleString('en-IN')}</td>
                        <td>
                          <button onClick={() => {
                            handleDeleteFinalProduct(p.proId);
                          }} className="btn btn-sm btn-circle btn-ghost text-error"> <RxCrossCircled size={24} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3}></td>
                      <td className="text-lg font-semibold">TOTAL</td>
                      <td className="text-lg font-semibold">{FinaltotalQty}</td>
                      <td className="text-lg font-semibold">{Finaltotal}</td>
                    </tr>
                  </tfoot>
                </table>

              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={1000} theme="dark" />
    </div>
  )
}

export default Page