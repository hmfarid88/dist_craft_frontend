"use client"
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../store';
import { IoLocationOutline } from 'react-icons/io5';
import { AiOutlineMail } from 'react-icons/ai';
import { MdPhoneIphone } from 'react-icons/md';

const CompanyInfo = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    interface shopData {
        shopName: string,
        phoneNumber: string,
        address: string,
        email: string
    }
    const [shopInfo, setShopInfo] = useState<shopData>();
    useEffect(() => {
        fetch(`${apiBaseUrl}/shop/getShopInfo?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setShopInfo(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);
    return (
        <div className="flex flex-col items-center pb-5">
        <h1 className='uppercase font-bold text-lg'>{shopInfo?.shopName}</h1>
        <h4 className='flex font-sans'><IoLocationOutline className='mt-1 mr-1' /> {shopInfo?.address}</h4>
        <h4 className='flex font-sans'><MdPhoneIphone className='mt-1 mr-1' /> {shopInfo?.phoneNumber}</h4>
        <h4 className='flex font-sans'><AiOutlineMail className='mt-1 mr-1' /> {shopInfo?.email}</h4>
      </div>
    )
}

export default CompanyInfo