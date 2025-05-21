import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, ChartOptions, registerables } from 'chart.js';
import { callFetchjobpermonth, callFetchTopCompanyByJob } from '@/config/api';
Chart.register(...registerables);
interface IChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor: string[],
        borderColor: string[],
        borderWidth: number
    }>;
}
const TopCompaniesByJobsChart = () => {
    const [chartData, setChartData] = useState<IChartData>({
        labels: [],
        datasets: [{
            label: 'Số lượng việc làm',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 0, 57, 0.6)',
                'rgba(255, 69, 0, 0.6)',
                'rgba(100, 149, 237, 0.6)',
                'rgba(218, 112, 214, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 0, 57, 1)',
                'rgba(255, 69, 0, 1)',
                'rgba(100, 149, 237, 1)',
                'rgba(218, 112, 214, 1)'
            ],
            borderWidth: 1,
        }],
    });
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchTopCompanies = async () => {
            try {
                const res = await callFetchTopCompanyByJob()
                if(res.data){
                const labels = res.data.map(item => item.companyName);
                const counts = res.data.map(item => item.jobCount);

                setChartData({
                    labels: labels,
                    datasets: [{ ...chartData.datasets[0], data: counts }],
                });
                 }
            } catch (error) {
                console.error('Error fetching top companies by jobs:', error);
            }
        };
        fetchTopCompanies();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Top công ty có số lượng việc làm nhiều nhất',
                font: {
                    size: 16,
                },
            },
            legend: {
                position: 'bottom',
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Tên công ty',
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Số lượng công việc',
                }
            },
        },
    };

    return (
        <div>
            <Bar data={chartData} options={options as ChartOptions<'bar'>}  ref={chartRef} />
        </div>
    );
};

export default TopCompaniesByJobsChart;