import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { callFetchJobHaveResumeForHr } from '@/config/api';

const COLORS = ['#00C49F', '#FF8042'];
type PieData = {
    name: string;
    value: number;
  };
const JobPieChart = () => {
  const [data, setData] = useState<PieData[]>([]);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await callFetchJobHaveResumeForHr();
        if(res.data){

            setData([
                { name: 'Có đơn ứng tuyển', value: res.data.withApplications},
                { name: 'Không có đơn ứng tuyển', value:  res.data.withoutApplications },
              ]);
        }

      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ width: '100%', height: 220 }}>
      <h3 style={{ textAlign: 'center' ,color:'GrayText'}}>Tỷ lệ công việc có/không có đơn ứng tuyển</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart >
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={75}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default JobPieChart;
