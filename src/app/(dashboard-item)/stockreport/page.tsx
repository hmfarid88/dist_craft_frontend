'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import CurrentDate from "@/app/components/CurrentDate";
import { FcPrint } from "react-icons/fc";
import { FcAutomatic } from "react-icons/fc";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ExcelExportButton from "@/app/components/ExcellGeneration";
import CompanyInfo from "@/app/components/CompanyInfo";
import Select from "react-select";

interface Product {
  category: string;
  brand: string;
  productName: string;
  color: string;
  pprice: number;
  sprice: number;
  countBeforeToday: number;
  countToday: number;
  saleToday: number;
}
interface Updateable {
  supplier: string;
  productName: string;
  pprice: number;
  qty: number;
}
const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const [pending, setPending] = useState(false);
  const [productno, setProductno] = useState('');
  const [supplier, setSupplier] = useState("");
  const [productName, setProductName] = useState("");
  const [pprice, setPprice] = useState(0);
  const [date, setDate] = useState("");


  const [type, setType] = useState('');
  const [newPprice, setNewPprice] = useState('');
  const [newSprice, setNewSprice] = useState('');

  const [updateable, setUpdateable] = useState<Updateable[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState(null);

  const handleDatewise = (e: any) => {
    if (!date) {
      toast.info("No date selected!")
      return;
    }
    router.push(`/datewise-stockreport?date=${date}`);
  }
  const handleRadioChange = (e: any) => {
    setSelectedValue(e.target.value);
  };
  const handleProductEdit = () => {
    if (!productno) {
      toast.info("Product No Required!")
      return;
    }
    router.push(`/product-edit?productno=${productno}`);

  }
  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });
  const options = updateable?.map(product => ({
    value: {
      supplier: product.supplier,
      productName: product.productName,
      pprice: product.pprice,
    },
    label: `${product.supplier}, ${product.productName}, ${product.pprice} (${product.qty})`
  }));
  const handleChange = (selectedOption: any) => {
    const { supplier, productName, pprice } = selectedOption.value;
    setSupplier(supplier);
    setProductName(productName);
    setPprice(pprice);
  };

  const handlePriceup = async (e: any) => {
    e.preventDefault();
    if (!supplier || !productName || !pprice || !newSprice) {
      toast.info("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/update-priceup?username=${encodeURIComponent(username)}&supplier=${encodeURIComponent(supplier)}&productName=${encodeURIComponent(productName)}&pprice=${pprice}&newSprice=${newSprice}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

      });

      if (response.ok) {
        toast.success("Updated successfully !");
      } else {
        const data = await response.json();
        toast.info(data.message);
      }
    } catch (error) {
      toast.error("Invalid transaction !")
    } finally {
      setPending(false);
      setNewSprice("");
    }
  };
  const handlePricedrop = async (e: any) => {
    e.preventDefault();
    if (!supplier || !productName || !pprice || !newPprice || !newSprice || !selectedValue) {
      toast.info("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/update-pricedrop?username=${encodeURIComponent(username)}&supplier=${encodeURIComponent(supplier)}&productName=${encodeURIComponent(productName)}&pprice=${pprice}&newPprice=${newPprice}&newSprice=${newSprice}&save=${selectedValue}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

      });

      if (response.ok) {
        toast.success("Updated successfully !");
      } else {
        const data = await response.json();
        toast.info(data.message);
      }
    } catch (error) {
      toast.error("Invalid transaction !")
    } finally {
      setPending(false);
      setNewPprice("");
      setNewSprice("");
    }
  };
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getUpdateableProductStock?username=${username}`)
      .then(response => response.json())
      .then(data => {
        setUpdateable(data);

      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/productStockSummary?username=${username}`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);


  useEffect(() => {
    const searchWords = filterCriteria.toLowerCase().split(" ");
    const filtered = allProducts.filter(product =>
      searchWords.every(word =>
        (product.category?.toLowerCase().includes(word) || '') ||
        (product.brand?.toLowerCase().includes(word) || '') ||
        (product.productName?.toLowerCase().includes(word) || '')
      )
    );

    setFilteredProducts(filtered);
  }, [filterCriteria, allProducts]);


  const handleFilterChange = (e: any) => {
    setFilterCriteria(e.target.value);
  };

  const totalPreQty = filteredProducts.reduce((total, product) => {
    return total + product.countBeforeToday;
  }, 0);

  const totalTodayQty = filteredProducts.reduce((total, product) => {
    return total + product.countToday;
  }, 0);

  const totalSaleQty = filteredProducts.reduce((total, product) => {
    return total + product.saleToday;
  }, 0);

  const totalPpriceAmount = filteredProducts.reduce((total, product) => {
    return total + (((product.countBeforeToday + product.countToday) - product.saleToday) * product.pprice);
  }, 0);

  const totalSpriceAmount = filteredProducts.reduce((total, product) => {
    return total + (((product.countBeforeToday + product.countToday) - product.saleToday) * product.sprice);
  }, 0);

  return (
    <div className="container-2xl min-h-[calc(100vh-228px)]">
      <div className="flex justify-center gap-5 pt-2 pl-5 pr-5">
        <a href="#my_modal_stock" className="btn btn-square btn-ghost"><FcAutomatic size={40} /></a>
        <div className="flex gap-2">
          <input type="date" onChange={(e: any) => setDate(e.target.value)} className="input btn-outline" />
          <button onClick={handleDatewise} className="btn btn-outline btn-square">GO</button>
        </div>
      </div>
      <div className="flex justify-between pl-5 pr-5 pt-5">
        <label className="input input-bordered flex max-w-xs  items-center gap-2">
          <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
          </svg>
        </label>
        <div className="flex gap-3">
          <ExcelExportButton tableRef={contentToPrint} fileName="stock_summary" />
          <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
        </div>
      </div>

      <div ref={contentToPrint} className="flex flex-col p-2 items-center justify-center">
        <CompanyInfo />
        <h4 className="font-bold">STOCK SUMMARY</h4>
        <h4 className="pb-5"><CurrentDate /></h4>
        <div className="flex items-center justify-center">
          <table className="table table-sm">
            <thead className="sticky top-16 bg-base-100">
              <tr>
                <th>SN</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>PRODUCT</th>
                <th>COLOR</th>
                <th>STOCK</th>
                <th>LIFTING</th>
                <th>TOTAL STOCK</th>
                <th>SALE</th>
                <th>TOTAL STOCK</th>
                <th>RP RATE</th>
                <th>RP AMOUNT</th>
                <th>DP RATE</th>
                <th>DP AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>{product.productName}</td>
                  <td>{product.color}</td>
                  <td>{product.countBeforeToday}</td>
                  <td>{product.countToday}</td>
                  <td>{product.countBeforeToday + product.countToday}</td>
                  <td>{product.saleToday}</td>
                  <td>{(product.countBeforeToday + product.countToday) - product.saleToday}</td>
                  <td>{Number((product.sprice).toFixed(2)).toLocaleString('en-IN')}</td>
                  <td>{Number((((product.countBeforeToday + product.countToday) - product.saleToday) * product.sprice).toFixed(2)).toLocaleString('en-IN')}</td>
                  <td>{Number((product.pprice).toFixed(2)).toLocaleString('en-IN')}</td>
                  <td>{Number((((product.countBeforeToday + product.countToday) - product.saleToday) * product.pprice).toFixed(2)).toLocaleString('en-IN')}</td>

                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold text-sm">
                <td colSpan={4}></td>
                <td>TOTAL</td>
                <td>{Number(totalPreQty.toFixed(2)).toLocaleString('en-IN')}</td>
                <td>{Number(totalTodayQty.toFixed(2)).toLocaleString('en-IN')}</td>
                <td>{Number((totalPreQty + totalTodayQty).toFixed(2)).toLocaleString('en-IN')}</td>
                <td>{Number(totalSaleQty.toFixed(2)).toLocaleString('en-IN')}</td>
                <td>{Number(((totalPreQty + totalTodayQty) - totalSaleQty).toFixed(2)).toLocaleString('en-IN')}</td>
                <td></td>
                <td>{Number((totalSpriceAmount).toFixed(2)).toLocaleString('en-IN')}</td>
                <td></td>
                <td>{Number((totalPpriceAmount).toFixed(2)).toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="modal sm:modal-middle" role="dialog" id="my_modal_stock">
        <div className="modal-box">
          <div className="flex flex-col w-full">
            <div className="divider divider-accent tracking-widest font-bold text-sm p-2">PRODUCT EDIT</div>
          </div>
          <div className="flex items-center justify-center">
            <label className="form-control w-full max-w-xs pt-3">
              <div className="flex items-center justify-between">
                <input type="text" value={productno} name="colorItem" onChange={(e: any) => setProductno(e.target.value)} placeholder="Product No" className="input input-bordered w-3/4 max-w-xs" />
                <button onClick={handleProductEdit} className="btn btn-square btn-success">GO</button>
              </div>
            </label>
          </div>
          <div className="flex flex-col w-full">
            <div className="divider divider-accent tracking-widest font-bold text-sm p-2">PRICE UPDATE</div>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">PICK PRODUCT</span>
              </div>
            
               <Select  className="text-black" options={options} onChange={handleChange} placeholder="Select . . ." />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">UPDATE TYPE</span>
              </div>
              <select className='select select-bordered' onChange={(e: any) => { setType(e.target.value) }}>
                <option selected disabled>Select . . .</option>
                <option value="price up">PRICE UP</option>
                <option value="price drop">PRICE DROP</option>
              </select>
            </label>
            {type === "price drop" && (
              <>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">NEW PURCHASE PRICE / DP</span>
                  </div>
                  <input
                    type="number"
                    value={newPprice}
                    onChange={(e) => setNewPprice(e.target.value)}
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">NEW SALE PRICE / RP</span>
                  </div>
                  <input type="number" value={newSprice} onChange={(e) => setNewSprice(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">SAVE IN PRICEDROP</span>
                  </div>
                  <label className="cursor-pointer label gap-3">
                    <span className="label-text uppercase">yes</span>
                    <input type="radio" name="radio-5" value="yes" checked={selectedValue === 'yes'} onChange={handleRadioChange} className="radio radio-success" />
                  </label>
                  <label className="cursor-pointer label gap-3">
                    <span className="label-text uppercase">no</span>
                    <input type="radio" name="radio-5" value="no" checked={selectedValue === 'no'} onChange={handleRadioChange} className="radio radio-success" />
                  </label>
                </label>
                <label className="form-control w-full max-w-xs">
                  <button onClick={handlePricedrop} className="btn btn-success btn-outline max-w-xs">
                    Update
                  </button>
                </label>
              </>
            )}
            {type === "price up" && (
              <>

                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">NEW SALE PRICE</span>
                  </div>
                  <input type="number" value={newSprice} onChange={(e) => setNewSprice(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                  <button onClick={handlePriceup} className="btn btn-success btn-outline max-w-xs">
                    Update
                  </button>
                </label>
              </>
            )}

          </div>

          <div className="modal-action">
            <a href="#" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page