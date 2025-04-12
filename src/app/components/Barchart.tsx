
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useAppSelector } from '../store';

interface SalesData {
  month: string;
  Value: number;
}

const Barchart = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const [data, setData] = useState<SalesData[]>([]);

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/sales/last-six-months?username=${username}`);
        const result = await response.json(); 
        setData(result); 
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };
    fetchData();
  }, [apiBaseUrl, username]); 

  return (
    <div>
      <ResponsiveContainer width={600} height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" angle={-45} tickMargin={25} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Barchart;
