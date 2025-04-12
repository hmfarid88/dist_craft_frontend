
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, YAxis, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../store';

interface ProductData {
  name: string;
  total: number;
}

const Areachart = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  
  const [data, setData] = useState<ProductData[]>([]); // Explicit type

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getMonthlyProductSale?username=${username}`)
      .then(response => response.json())
      .then((data: { productName: string; sprice: number }[]) => {
        // Group and sum sprice by productName
        const aggregatedData: Record<string, number> = data.reduce((acc, item) => {
          const { productName, sprice } = item;
          acc[productName] = (acc[productName] || 0) + sprice;
          return acc;
        }, {} as Record<string, number>);

        // Convert aggregated data into an array, sort, and get the top 5
        const sortedData: ProductData[] = Object.entries(aggregatedData)
          .map(([name, total]) => ({ name, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);

        setData(sortedData); // Update state with top 5 products
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  return (
    <ResponsiveContainer width={600} height={240}>
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
        <defs>
          <linearGradient id="colorUv2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis angle={-45} dataKey="name" tickMargin={10} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="total" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv2)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Areachart;
