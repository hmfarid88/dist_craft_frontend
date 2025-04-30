"use client"
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/app/store";
import Select from "react-select";

const ProductStock = () => {
    const [productOption, setProductOption] = useState([]);
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    useEffect(() => {
        fetch(`http://localhost:8080/api/getProductStock?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.proId,
                    value: item.proId,
                    label: item.productName + item.productno,
                }));
                setProductOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [username]);
    return (
        <div>
            <Select className="text-black w-64 md:w-96" placeholder="Search Product . . . ." options={productOption} />
        </div>
    )
}

 export default ProductStock

