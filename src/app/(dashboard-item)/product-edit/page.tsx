'use client'
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/app/store";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

interface Product {
    proId: number;
    category: string;
    brand: string;
    productName: string;
    productno: string;
    color: string;
    supplier: string;
    supplierInvoice: string;
    pprice: number;
    sprice: number;
    date: string;
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
        fetch(`${apiBaseUrl}/api/products/not-in-sales?username=${username}&productno=${productno}`)
            .then(response => response.json())
            .then(data => {
                setEditableProduct(data[0] || null);
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
        if (!editableProduct || !editableProduct.proId) {
            toast.warning("Product ID is required to update the product.");
            return;
        }
        setIsSaving(true);
    
        fetch(`${apiBaseUrl}/api/products/update/${editableProduct.proId}`, {
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
                <h4 className="font-bold">PRODUCT INFORMATION</h4>
                <h4 className="pb-5">Product No: {productno}</h4>

                {loading ? (
                    <p>Loading...</p>
                ) : editableProduct ? (
                    <>
                        <div className="flex items-center justify-center">
                            <table className="table table-sm">
                                <tbody>
                                    <tr>
                                        <th>ENTRY DATE</th>
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
                                        <th>INVOICE NO</th>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-sm max-w-xs w-full input-bordered"
                                                value={editableProduct.supplierInvoice}
                                                onChange={(e) => handleInputChange('supplierInvoice', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>SUPPLIER</th>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-sm max-w-xs w-full input-bordered"
                                                value={editableProduct.supplier}
                                                onChange={(e) => handleInputChange('supplier', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>CATEGORY</th>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-sm max-w-xs w-full input-bordered"
                                                value={editableProduct.category}
                                                onChange={(e) => handleInputChange('category', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>BRAND</th>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-sm max-w-xs w-full input-bordered"
                                                value={editableProduct.brand}
                                                onChange={(e) => handleInputChange('brand', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>PRODUCT</th>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-sm max-w-xs w-full input-bordered"
                                                value={editableProduct.productName}
                                                onChange={(e) => handleInputChange('productName', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>PRODUCT NO</th>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-sm max-w-xs w-full input-bordered"
                                                value={editableProduct.productno}
                                                onChange={(e) => handleInputChange('productno', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>COLOR</th>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-sm max-w-xs w-full input-bordered"
                                                value={editableProduct.color}
                                                onChange={(e) => handleInputChange('color', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>PURCHASE PRICE</th>
                                        <td>
                                            <input
                                                type="number"
                                                className="input input-sm max-w-xs w-full input-bordered"
                                                value={editableProduct.pprice}
                                                onChange={(e) => handleInputChange('pprice', parseFloat(e.target.value) || 0)}
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
