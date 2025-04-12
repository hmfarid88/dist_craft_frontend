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

// useFetchProducts.js
// import { useState, useEffect } from "react";

// const useFetchProducts = (username:any) => {
//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (username) {
//       setLoading(true);
//       fetch(`http://localhost:8080/api/getProductStock?username=${username}`)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then((data) => {
//           setAllProducts(data);
//           setLoading(false);
//         })
//         .catch((error) => {
//           setError(error);
//           setLoading(false);
//         });
//     }
//   }, [username]);

//   return { allProducts, loading, error };
// };

// export default useFetchProducts;
