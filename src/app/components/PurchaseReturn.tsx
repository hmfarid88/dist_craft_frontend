"use client"
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";
import Select from "react-select";

const PurchaseReturn = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);
    const [selectedProid, setSelectedProid] = useState("");
    const [productOption, setProductOption] = useState([]);
    const [selectedProidOption, setSelectedProidOption] = useState(null);

    const selectRef = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleProductSelect = (selectedOption: any) => {
        setSelectedProid(selectedOption.value);
        setSelectedProidOption(selectedOption);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const submitSaleReturn = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProid) {
            toast.warning("Product no is required.");
            return;
        }

        setPending(true);

        try {
            const response = await fetch(
                `${apiBaseUrl}/sales/purchaseReturn?proId=${encodeURIComponent(selectedProid)}&username=${encodeURIComponent(username)}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                 
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                toast.info(errorData?.message || "Product is not returned!");
                return;
            }

            toast.success("Product returned successfully.");
            setSelectedProid("");
            setSelectedProidOption(null);
            if (selectRef.current) {
                selectRef.current.focus();
            }

        } catch (error) {
            toast.error("An error occurred: " + (error as Error).message);
        } finally {
            setPending(false);
        }
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
    }, [apiBaseUrl, username, selectedProid]);
    return (

        <div className="flex items-center justify-center">
            <div className="flex flex-col gap-3">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">FIND PRODUCT</span>
                    </div>
                    <Select
                        className="text-black w-64"
                        ref={selectRef}
                        onChange={handleProductSelect}
                        autoFocus={true}
                        value={selectedProidOption} options={productOption} />

                </label>
                <label className="form-control w-full max-w-xs">
                    <button disabled={pending} onClick={submitSaleReturn} className="btn btn-outline btn-success">{pending ? "Wait..." : "RETURN"}</button>
                </label>
            </div>

        </div>

    )
}

export default PurchaseReturn




