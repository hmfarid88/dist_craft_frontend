'use client'
import React, { FormEvent, useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from "react-select";
import { uid } from "uid";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteAllProducts, deleteProduct, selectTotalQuantity } from "@/app/store/productSlice";
import { toast } from 'react-toastify';
import { FcPlus } from "react-icons/fc";

const Purchase = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [pending, setPending] = useState(false);
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const [category, setPcatatory] = useState("");
  const [brand, setBrand] = useState("");
  const [productName, setPname] = useState("");
  const [pprice, setPprice] = useState("");
  const [sprice, setRsale] = useState("");
  const [color, setColor] = useState("");
  const [supplier, setSupplier] = useState("");
  const [supplierInvoice, setSinvoice] = useState("");
  const [date, setDate] = useState("");
  const [productno, setPno] = useState("");

  const dispatch = useAppDispatch();

  const [categoryOption, setCategoryOption] = useState([]);
  const [brandOption, setBrandOption] = useState([]);
  const [productOption, setProductOption] = useState([]);
  const [colorOption, setColorOption] = useState([]);
  const [supplierOption, setSupplierOption] = useState([]);
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setMaxDate(formattedDate);
    setDate(formattedDate);
  }, []);

  const [categoryItem, setCategoryItem] = useState("");
  const handleCategoryItem = async (e: any) => {
    e.preventDefault();
    if (!categoryItem) {
      toast.error("Category is empty !")
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/addNewCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryItem, username }),
      });

      if (response.ok) {
        setCategoryItem("");
        toast.success("Category added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid category name !")
    } finally {

    }
  };
  const [delCategory, setDelCategoryItem] = useState("");
  const handleCategoryDel = async (e: any) => {
    e.preventDefault();
    if (!delCategory) {
      toast.error("Category is empty !")
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/deleteCategory?username=${encodeURIComponent(username)}&categoryItem=${encodeURIComponent(delCategory)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setDelCategoryItem("");
        toast.success("Category delete successful !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid category name !")
    } finally {

    }
  };
  const [brandItem, setBrandName] = useState("");
  const handleBrandAdd = async (e: any) => {
    e.preventDefault();
    if (!brandItem) {
      toast.error("Brand is empty !")
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/addNewBrand`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brandItem, username }),
      });

      if (response.ok) {
        setBrandName("");
        toast.success("Brand added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid Brand name !")
    } finally {

    }
  };

  const [brandDel, setBrandDel] = useState("");
  const handleBrandDel = async (e: any) => {
    e.preventDefault();
    if (!brandDel) {
      toast.error("Brand is empty !")
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/deleteBrand?username=${encodeURIComponent(username)}&brandItem=${encodeURIComponent(brandDel)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },

      });

      if (response.ok) {
        setBrandDel("");
        toast.success("Brand delete successful !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid Brand name !")
    } finally {

    }
  };
  const [supplierItem, setSupplierItem] = useState("");
  const handleSupplieritem = async (e: any) => {
    e.preventDefault();
    if (!supplierItem) {
      toast.error("Supplier is empty !");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/addNewSupplier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supplierItem, username }),
      });

      if (response.ok) {
        setSupplierItem("");
        toast.success("Supplier added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid supplier name !")
    } finally {

    }
  };

  const [supplierDel, setSupplierDel] = useState("");
  const handleSupplierDel = async (e: any) => {
    e.preventDefault();
    if (!supplierDel) {
      toast.error("Supplier is empty !");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/deleteSupplier?username=${encodeURIComponent(username)}&supplierItem=${encodeURIComponent(supplierDel)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },

      });

      if (response.ok) {
        setSupplierDel("");
        toast.success("Supplier delete successful !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid supplier name !")
    } finally {

    }
  };

  const [productItem, setProductItem] = useState("");
  const handleProductitem = async (e: any) => {
    e.preventDefault();
    if (!productItem) {
      toast.error("Product is empty !")
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/addNewProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productItem, username }),
      });

      if (response.ok) {
        setProductItem("");
        toast.success("Product added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid product name !")
    } finally {

    }

  };

  const [productDel, setProductDel] = useState("");
  const handleProductDel = async (e: any) => {
    e.preventDefault();
    if (!productDel) {
      toast.error("Product is empty !")
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/deleteProduct?username=${encodeURIComponent(username)}&productItem=${encodeURIComponent(productDel)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },

      });

      if (response.ok) {
        setProductDel("");
        toast.success("Product delete successful !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid product name !")
    } finally {

    }

  };
  const [colorItem, setColorItem] = useState("");
  const handleColoritem = async (e: any) => {
    e.preventDefault();
    if (!colorItem) {
      toast.error("Color is empty !")
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/addNewColor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ colorItem, username }),
      });

      if (response.ok) {
        setColorItem("");
        toast.success("Color added successfully !");

      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid color name !")
    } finally {

    }
  };
  const [colorDel, setColorDel] = useState("");
  const handleColorDel = async (e: any) => {
    e.preventDefault();
    if (!colorDel) {
      toast.error("Color is empty !")
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/deleteColor?username=${encodeURIComponent(username)}&colorItem=${encodeURIComponent(colorDel)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },

      });

      if (response.ok) {
        setColorDel("");
        toast.success("Color delete successful !");

      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid color name !")
    } finally {

    }
  };

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getCategoryItem?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          id: item.id,
          value: item.categoryItem,
          label: item.categoryItem
        }));
        setCategoryOption(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username, categoryItem, delCategory]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getBrandItem?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          id: item.id,
          value: item.brandItem,
          label: item.brandItem
        }));
        setBrandOption(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username, brandItem, brandDel]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getProductItem?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          id: item.id,
          value: item.productItem,
          label: item.productItem
        }));
        setProductOption(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username, productItem, productDel]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getSupplierItem?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          id: item.id,
          value: item.supplierItem,
          label: item.supplierItem
        }));
        setSupplierOption(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username, supplierItem, supplierDel]);


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
  }, [apiBaseUrl, username, colorItem, colorDel]);

  const [bulkQty, setBulkQty] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(0);
  const generateProductNo = () => {
    return (Math.floor(100000000000000 + Math.random() * 900000000000000)).toString();
  };

  useEffect(() => {
    if (brand && productName) {
      fetch(`${apiBaseUrl}/api/product/last-entry?username=${encodeURIComponent(username)}&brand=${encodeURIComponent(brand)}&productName=${encodeURIComponent(productName)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setPprice(data.purchasePrice);
            setRsale(data.salePrice);
          }
        })
        .catch((err) => console.error("Failed to fetch last product data", err));
    }
  }, [apiBaseUrl, username, brand, productName]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (bulkQty && bulkQuantity > 0) {
      const products = Array.from({ length: bulkQuantity }).map(() => ({
        id: uid(),
        username,
        category,
        brand,
        productName,
        pprice,
        sprice,
        color,
        supplier,
        supplierInvoice,
        date,
        productno: generateProductNo(),
      }));
      products.forEach((product) => dispatch(addProducts(product)));
      setBulkQuantity(0);
    } else {
      const product = { id: uid(), username, category, brand, productName, pprice, sprice, color, supplier, supplierInvoice, date, productno }
      dispatch(addProducts(product));
      setPno("");
      document.getElementById('pno')?.focus();
    }
  }

  const products = useAppSelector((state) => state.products.products);
  const viewdispatch = useAppDispatch();
  const totalQuantity = useAppSelector(selectTotalQuantity);

  const handleDeleteProduct = (id: any) => {
    viewdispatch(deleteProduct(id));
  };
  const confirmAndHandleProductSubmit = (e: any) => {
    e.preventDefault();
    const isConfirmed = window.confirm("Are you sure to submit the products ?");
    if (isConfirmed) {
      ProductSubmit(e);
    }
  };

  const ProductSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (products.length === 0) {
      toast.warning("Sorry, your product list is empty!");
      return;
    }

    try {
      setPending(true);

      const response = await fetch(`${apiBaseUrl}/api/addProducts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(products),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Something went wrong!' }));
        toast.info(error.message || "Failed to add products. Please try again!");
        return;
      }

      dispatch(deleteAllProducts(username));
      toast.success("Product added successfully !");
    } catch (error: any) {
      toast.error(error.message || "Invalid product item!");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-center">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full items-center">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">ENTRY DATE</span>
            </div>
            <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="input input-bordered rounded-md bg-white text-black  w-full max-w-xs h-[40px]" required />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">CATEGORY</span>
            </div>
            <Select className="text-black" name="pcatagory" onChange={(selectedOption: any) => setPcatatory(selectedOption.value)} options={categoryOption} required />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">BRAND NAME</span>
            </div>
            <Select className="text-black" name="pbrand" onChange={(selectedOption: any) => setBrand(selectedOption.value)} options={brandOption} required />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">PRODUCT NAME</span>
            </div>
            <Select className="text-black" name="pname" onChange={(selectedOption: any) => setPname(selectedOption.value)} options={productOption} required />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">PURCHASE PRICE / DP</span>
            </div>
            <input type="number" step="any" name="pprice" value={pprice} onChange={(e: any) => setPprice(e.target.value)} placeholder="Type here" className="input input-bordered rounded-md w-full max-w-xs h-[40px] bg-white text-black" required />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">SALE PRICE / RP</span>
            </div>
            <input type="number" step="any" name="rsale" value={sprice} onChange={(e: any) => setRsale(e.target.value)} placeholder="Type here" className="input input-bordered rounded-md w-full max-w-xs h-[40px] bg-white text-black" required />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">COLOR NAME</span>
            </div>
            <Select className="text-black" name="pcolor" onChange={(selectedOption: any) => setColor(selectedOption.value)} options={colorOption} required />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">SUPPLIER NAME</span>
            </div>
            <Select className="text-black" name="psupplier" onChange={(selectedOption: any) => setSupplier(selectedOption.value)} options={supplierOption} required />
          </label>
          <label className="form-control w-full max-w-xs pt-1">
            <div className="label">
              <span className="label-text-alt">SUPPLIER INVOICE NO</span>
            </div>
            <input type="text" name="sinvoice" onChange={(e: any) => setSinvoice(e.target.value)} placeholder="Type here" className="input input-bordered rounded-md  w-full max-w-xs h-[40px] bg-white text-black" required />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">

              <span className="label-text-alt">PRODUCT ID / QTY</span>

              <div className="flex gap-2">
                <span className="label-text-alt">BULK QTY</span>
                <input type="checkbox" className="checkbox checkbox-success w-[20px] h-[20px]" checked={bulkQty}
                  onChange={(e) => setBulkQty(e.target.checked)} />
              </div>
            </div>

            {!bulkQty && (
              <input type="text" id="pno" maxLength={15} value={productno} name="pno" placeholder="Enter Product ID" onChange={(e: any) => setPno(e.target.value.replace(/\D/g, ""))} className="input input-bordered rounded-md  w-full max-w-xs h-[40px] bg-white text-black" required />
            )}
            {bulkQty && (
              <label className="form-control w-full max-w-xs">
                <input
                  type="number"
                  name="bulkQuantity"
                  onChange={(e: any) => setBulkQuantity(Number(e.target.value))}
                  placeholder="Enter Quantity" max={1000} value={bulkQuantity}
                  className="input input-bordered rounded-md w-full max-w-xs h-[40px] bg-white text-black"
                  required />
              </label>

            )}
          </label>
          <label className="form-control w-full max-w-xs pt-7">
            <button type="submit" className="btn btn-accent btn-sm h-[40px] w-full max-w-xs" >Add Product</button>
          </label>
        </div>
      </form>

      <div className="flex-col items-center justify-center">
        <div className="flex">
          <div className="avatar-group -space-x-6 rtl:space-x-reverse">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content w-12">
                <span>{totalQuantity}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto h-80">
          <table className="table table-xs table-pin-rows">
            <thead>
              <tr className="font-bold">
                <th>Category</th>
                <th>Description</th>
                <th>P.Price</th>
                <th>S.Price</th>
                <th>Supplier</th>
                <th>Product No</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((p) => (
                <tr key={p.id}>
                  <td>{p.category}, {p.brand}</td>
                  <td>{p.productName}, {p.color}</td>
                  <td>{p.pprice}</td>
                  <td>{p.sprice}</td>
                  <td>{p.supplier}, {p.supplierInvoice}</td>
                  <td>{p.date}, {p.productno}</td>
                  <td>
                    <button onClick={() => {
                      handleDeleteProduct(p.id);
                    }} className="btn-xs rounded-md btn-outline btn-error"><RiDeleteBin6Line size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center pt-12">
          <form onSubmit={confirmAndHandleProductSubmit}>
            <label className="form-control w-full max-w-sm pt-12">
              <button
                type="submit"
                className="btn btn-success btn-sm h-[40px] w-full max-w-sm"
                disabled={pending}
              >
                {pending ? "Submitting..." : "Final Submit"}
              </button>
            </label>
          </form>

        </div>
      </div>
      <div className="modal sm:modal-middle" role="dialog" id="my_modal_product_itemadd">
        <div className="modal-box">
          <div className="flex flex-col w-full">
            <div className="divider divider-accent tracking-widest font-bold text-sm p-2">ADD / DELETE ITEM</div>
          </div>
          <div className="flex w-full items-center justify-center gap-10">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">ADD CATEGORY</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="text" value={categoryItem} name="colorItem" onChange={(e: any) => setCategoryItem(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" />
                <button onClick={handleCategoryItem} className="btn btn-sm btn-square btn-outline btn-success"><FcPlus size={24} /></button>
              </div>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">DELETE CATEGORY</span>
              </div>
              <div className="flex items-center gap-3">
                <Select className="text-black w-3/4" name="pcatagory" onChange={(selectedOption: any) => setDelCategoryItem(selectedOption.value)} options={categoryOption} required />
                <button onClick={handleCategoryDel} className="btn btn-sm btn-square btn-outline btn-error"><RiDeleteBin6Line size={24} /></button>
              </div>
            </label>
          </div>
          <div className="flex w-full items-center justify-center gap-10">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">ADD BRAND</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="text" value={brandItem} name="colorItem" onChange={(e: any) => setBrandName(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" />
                <button onClick={handleBrandAdd} className="btn btn-sm btn-square btn-outline btn-success"><FcPlus size={24} /></button>
              </div>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">DELETE BRAND</span>
              </div>
              <div className="flex items-center gap-3">
                <Select className="text-black w-3/4" name="pbrand" onChange={(selectedOption: any) => setBrandDel(selectedOption.value)} options={brandOption} required />
                <button onClick={handleBrandDel} className="btn btn-sm btn-square btn-outline btn-error"><RiDeleteBin6Line size={24} /></button>
              </div>
            </label>
          </div>
          <div className="flex w-full items-center justify-center gap-10">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">ADD SUPPLIER</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="text" value={supplierItem} name="supplierItem" onChange={(e: any) => setSupplierItem(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" />
                <button onClick={handleSupplieritem} className="btn btn-sm btn-square btn-outline btn-success"><FcPlus size={24} /></button>
              </div>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">DELETE SUPPLIER</span>
              </div>
              <div className="flex items-center gap-3">
                <Select className="text-black w-3/4" name="psupplier" onChange={(selectedOption: any) => setSupplierDel(selectedOption.value)} options={supplierOption} required />
                <button onClick={handleSupplierDel} className="btn btn-sm btn-square btn-outline btn-error"><RiDeleteBin6Line size={24} /></button>
              </div>
            </label>
          </div>
          <div className="flex w-full items-center justify-center gap-10">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">ADD PRODUCT</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="text" value={productItem} name="productItem" onChange={(e: any) => setProductItem(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                <button onClick={handleProductitem} className="btn btn-sm btn-square btn-outline btn-success"><FcPlus size={24} /></button>
              </div>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">DELETE PRODUCT</span>
              </div>
              <div className="flex items-center gap-3">
                <Select className="text-black w-3/4" name="pname" onChange={(selectedOption: any) => setProductDel(selectedOption.value)} options={productOption} required />
                <button onClick={handleProductDel} className="btn btn-sm btn-square btn-outline btn-error"><RiDeleteBin6Line size={24} /></button>
              </div>
            </label>
          </div>
          <div className="flex w-full items-center justify-center gap-10">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">ADD COLOR</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="text" value={colorItem} name="colorItem" onChange={(e: any) => setColorItem(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                <button onClick={handleColoritem} className="btn btn-sm btn-square btn-outline btn-success"><FcPlus size={24} /></button>
              </div>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">DELETE COLOR</span>
              </div>
              <div className="flex items-center gap-3">
                <Select className="text-black w-3/4" name="pcolor" onChange={(selectedOption: any) => setColorDel(selectedOption.value)} options={colorOption} required />
                <button onClick={handleColorDel} className="btn btn-sm btn-square btn-outline btn-error"><RiDeleteBin6Line size={24} /></button>
              </div>
            </label>

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

export default Purchase