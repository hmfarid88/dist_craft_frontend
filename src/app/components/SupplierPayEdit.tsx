import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { useAppSelector } from '../store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const SupplierPayEdit = () => {
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    
    const [paymentno, setPaymentno]=useState();
    const [paymentOption, setPaymentOption] = useState([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/payment/getLast30daysSupplierPayment?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    value: item.id,
                    label: item.date + ", " + item.supplierName + ", " + item.amount
                }));
                setPaymentOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);


    const handleEdit = () => {
        if (!paymentno) {
            toast.info("Please select any expense.")
            return;
        }
        router.push(`/supplierpay-edit?id=${paymentno}`);

    }
    return (
        <div className="flex min-h-64">
            <div className="flex flex-col gap-3 items-center w-full">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">SELECT PAYMENT</span>
                    </div>
                    <Select className="text-black" onChange={(selectedOption: any) => setPaymentno(selectedOption.value)} options={paymentOption} />
                </label>
                <label className="form-control w-full max-w-xs">
                    <button onClick={handleEdit} className="btn btn-outline btn-success">NEXT</button>
                </label>
            </div>

        </div>
    )
}

export default SupplierPayEdit