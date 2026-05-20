'use client'
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/app/store";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

interface Product {
    saleId: number;
    saleNote: string;
    category: string;
    brand: string;
    productName: string;
    productno: string;
    pprice: number;
    sprice: number;
    discount: number;
    offer: number;
    date: string;
    cid: string;
}

const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const searchParams = useSearchParams();
    const productno = searchParams.get('productno');

    const [editableProduct, setEditableProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        setLoading(true);
        fetch(`${apiBaseUrl}/sales/sale/saleinfo?username=${encodeURIComponent(username)}&productno=${encodeURIComponent(productno ?? '')}`)
            .then(response => response.json())
            .then(data => {
                setEditableProduct(data || null);
                setLoading(false); 
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, [apiBaseUrl, username, productno]);

    const handleInputChange = (field: keyof Product, value: string | number) => {
        if (editableProduct) {
            setEditableProduct({
                ...editableProduct,
                [field]: value,
            });
        }
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        if (!editableProduct || !editableProduct.saleId) {
            toast.warning("Sale ID is required to update the sale.");
            return;
        }
        setIsSaving(true);
    
        fetch(`${apiBaseUrl}/sales/update/${editableProduct.saleId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editableProduct),
        })
            .then(async response => {
                setIsSaving(false);
                const data = await response.json();

                if (response.ok) {
                    toast.info(data.message || "Product updated successfully!");
                } else {
                    toast.warning(data.message || "Failed to update product.");
                }
            })
            .catch(error => {
                console.error("Error updating product:", error);
                toast.error("Error occurred while updating product.");
                setIsSaving(false);
            });
    };
    
    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">
            <div className="flex flex-col p-2 items-center justify-center">
                <h4 className="font-bold">SALE INFORMATION</h4>
                <h4 className="pb-5">Product No: {productno}</h4>

                {loading ? (
                    <p>Loading...</p>
                ) : editableProduct ? (
                    <>
                        <div className="flex items-center justify-center">
                            <table className="table table-sm">
                                <tbody>
                                     <tr>
                                        <th>INVOICE NO</th>
                                        <td className="uppercase">{editableProduct.cid}</td>
                                    </tr>
                                     <tr>
                                        <th>CATEGORY</th>
                                        <td className="uppercase">{editableProduct.category}</td>
                                    </tr>
                                     <tr>
                                        <th>BRAND</th>
                                        <td className="uppercase">{editableProduct.brand}</td>
                                    </tr>
                                     <tr>
                                        <th>PRODUCT NO</th>
                                        <td className="uppercase">{editableProduct.productno}</td>
                                    </tr>
                                    
                                    <tr>
                                        <th>SALE DATE</th>
                                        <td>
                                            <input
                                                type="date"
                                                className="input input-sm max-w-xs w-full input-bordered"
                                                value={editableProduct.date}
                                                onChange={(e) => handleInputChange('date', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                
                                    <tr>
                                        <th>SALE PRICE</th>
                                        <td>
                                            <input
                                                type="number"
                                                className="input input-sm max-w-xs w-full input-bordered"
                                                value={editableProduct.sprice}
                                                onChange={(e) => handleInputChange('sprice', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>DISCOUNT</th>
                                        <td>
                                            <input
                                                type="number"
                                                className="input input-sm max-w-xs w-full input-bordered"
                                                value={editableProduct.discount}
                                                onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>OFFER</th>
                                        <td>
                                            <input
                                                type="number"
                                                className="input input-sm max-w-xs w-full input-bordered"
                                                value={editableProduct.offer}
                                                onChange={(e) => handleInputChange('offer', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>SALE NOTE</th>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-sm max-w-xs w-full input-bordered"
                                                value={editableProduct?.saleNote}
                                                onChange={(e) => handleInputChange('saleNote', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <button
                            className="btn btn-primary mt-4"
                            onClick={handleSave}
                            disabled={isSaving} >
                            {isSaving ? "Saving..." : "Save"}
                        </button>

                    </>
                ) : (
                    <p>Sorry, No product data found for the given product number.</p>
                )}
            </div>
        </div>
    );
};

export default Page;
