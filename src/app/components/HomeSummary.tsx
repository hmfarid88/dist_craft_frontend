import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../store';

const HomeSummary = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const [date, setDate] = useState('');
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setDate(formattedDate)
  }, []);

  const [stockQty, setStockQty] = useState<number>(0);
  const [stockValue, setProductStock] = useState<number>(0);
  const [saleQty, setSaleQty] = useState<number>(0);
  const [saleValue, setSaleValue] = useState<number>(0);
  const [monthlyTotalQty, setMonthlySaleQty] = useState<number>(0);
  const [monthlyTotalValue, setMonthlySaleValue] = useState<number>(0);
  const [payValue, setPayValue] = useState<number>(0);
  const [recvValue, setRecvValue] = useState<number>(0);
  

  const dashboardData = [
    { id: 1, title: "Stock Today" },
    { id: 2, title: "Sales Today" },
    { id: 3, title: "Monthly Total" },
    { id: 4, title: "Payment Today" },
    { id: 5, title: "Cash Balance" }
  ];
interface Currency{currency:string}
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getProductStock?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const stockQty = new Set(
          data.map((product: { productno: string }) => product.productno)
        ).size;

        const totalStock = data.reduce(
          (total: number, product: { pprice: number }) => total + product.pprice,
          0
        );
        setProductStock(totalStock);
        setStockQty(stockQty);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getProductSale?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const totalQty = new Set(data.map((product: { productno: any; }) => product.productno)).size;
        const totalSprice = data.reduce((total: any, product: { sprice: any; }) => {
          return total + product.sprice;
        }, 0);
        const totalDiscount = data.reduce((total: any, product: { discount: any; }) => {
          return total + product.discount;
        }, 0);
        const totalOffer = data.reduce((total: any, product: { offer: any; }) => {
          return total + product.offer;
        }, 0);
        const totalSaleValue = totalSprice - totalDiscount - totalOffer;
        setSaleQty(totalQty)
        setSaleValue(totalSaleValue)
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getMonthlyProductSale?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const totalQty = new Set(data.map((product: { productno: any; }) => product.productno)).size;
        const totalSprice = data.reduce((total: any, product: { sprice: any; }) => {
          return total + product.sprice;
        }, 0);
        const totalDiscount = data.reduce((total: any, product: { discount: any; }) => {
          return total + product.discount;
        }, 0);
        const totalOffer = data.reduce((total: any, product: { offer: any; }) => {
          return total + product.offer;
        }, 0);
        const totalSaleValue = totalSprice - totalDiscount - totalOffer;
        setMonthlySaleQty(totalQty)
        setMonthlySaleValue(totalSaleValue)
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/cashbook/payments/today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => {
        const payTotal = data.reduce((total: number, payment: { amount: number }) => {
          return total + payment.amount;
        }, 0);
        setPayValue(payTotal);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/cashbook/receives/today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => {
        const recevTotal = data.reduce((total: number, payment: { amount: number }) => {
          return total + payment.amount;
        }, 0);
        setRecvValue(recevTotal);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);


  const [netSumAmount, setNetSumAmount] = useState(0);
  useEffect(() => {
    fetch(`${apiBaseUrl}/cashbook/net-sum-before-today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => setNetSumAmount(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  const [currency, setCurrency] = useState<string>('');
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getCurrency?username=${username}`)
      .then(response => response.json())
      .then(data => {
        if (data.currency === 'BDT' || !data.currency) {
          setCurrency('৳');
        } else {
          setCurrency(data.currency);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, username]);

  return (
    <div className='flex flex-col md:flex-row gap-5 p-4 items-center justify-center w-full'>
      {dashboardData?.map((item) =>
        <div key={item.id} className="card shadow-md shadow-slate-700 border border-accent text-center font-bold h-32 w-60 p-2">
          {item.title === "Stock Today" ? (
            <div className='flex flex-col items-center justify-center gap-5'>
              <p>{item.title}</p>
              <p className='flex text-lg font-bold gap-2'><p className='text-lg'>{currency}</p> {Number(stockValue.toFixed(2)).toLocaleString('en-IN')}  | {Number(stockQty.toFixed(2)).toLocaleString('en-IN')}</p>
            </div>
          ) : item.title === "Sales Today" ? (
            <div className='flex flex-col items-center justify-center gap-5'>
              <p>{item.title}</p>
              <p className='flex text-lg font-bold gap-2'><p className='text-lg'>{currency}</p> {Number(saleValue.toFixed(2)).toLocaleString('en-IN')} | {Number(saleQty.toFixed(2)).toLocaleString('en-IN')}</p>
            </div>
          ) : item.title === "Monthly Total" ? (
            <div className='flex flex-col items-center justify-center gap-5'>
              <p>{item.title}</p>
              <p className='flex text-lg font-bold gap-2'><p className='text-lg'>{currency}</p> {Number(monthlyTotalValue.toFixed(2)).toLocaleString('en-IN')} | {Number(monthlyTotalQty.toFixed(2)).toLocaleString('en-IN')}</p>
            </div>
          ) : item.title === "Payment Today" ? (
            <div className='flex flex-col items-center justify-center gap-5'>
              <p>{item.title}</p>
              <p className='flex text-lg font-bold gap-2'><p className='text-lg'>{currency}</p> {Number(payValue.toFixed(2)).toLocaleString('en-IN')}</p>
            </div>
          ) : item.title === "Cash Balance" ? (
            <div className='flex flex-col items-center justify-center gap-5'>
              <p>{item.title}</p>
              <p className='flex text-lg font-bold gap-2'><p className='text-lg'>{currency}</p> {Number((((netSumAmount + recvValue) - payValue)).toFixed(2)).toLocaleString('en-IN')}</p>
            </div>
          ) : (
            <p>{item.title}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default HomeSummary