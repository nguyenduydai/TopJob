import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, ChartOptions, registerables } from 'chart.js';
import { callFetchjobpermonth, callFetchjobpermonthForHr } from '@/config/api';
import { Props } from 'html-react-parser/lib/attributes-to-props';
Chart.register(...registerables);

interface IChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor: string,
        borderColor: string,
        borderWidth: number,
        fill: boolean,
        pointRadius: number,
    }>;
}
interface IProps{
    isChartForHr:boolean
}
const JobPerMonthChart = (props: IProps) => {
    const { isChartForHr } = props;
    const [chartData, setChartData] = useState<IChartData>({
        labels: [],
        datasets: [{
            label: 'Số lượng công việc',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
            pointRadius: 5,
        }],
    });
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchApplicationsPerMonth = async () => {
            console.log(isChartForHr);
            try {
                if(isChartForHr){
                    const res = await callFetchjobpermonthForHr()
                    
                    if(res.data){
                    // Chuyển đổi định dạng tháng nếu cần thiết và sắp xếp
                        const formattedData = res.data.sort((a, b) => a.month.localeCompare(b.month));
                        const labels = formattedData.map(item => item.month);
                        const counts = formattedData.map(item => item.applicationCount);
                        setChartData({
                            labels: labels,
                            datasets: [{ ...chartData.datasets[0], data: counts }],
                        });
                    }
                }else{
                    const res = await callFetchjobpermonth()
                    if(res.data){
                    // Chuyển đổi định dạng tháng nếu cần thiết và sắp xếp
                        const formattedData = res.data.sort((a, b) => a.month.localeCompare(b.month));
                        const labels = formattedData.map(item => item.month);
                        const counts = formattedData.map(item => item.applicationCount);
                        setChartData({
                            labels: labels,
                            datasets: [{ ...chartData.datasets[0], data: counts }],
                        });
                    }
    
                }
                
            } catch (error) {
                console.error('Error fetching job applications per month:', error);
            }
        };
        fetchApplicationsPerMonth();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Số lượng công việc theo tháng',
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
                  text: 'Tháng',
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
        <div style={{height:250}}>
            <Line data={chartData} options={options as ChartOptions<'line'>} ref={chartRef} />

        </div>
    );
};

export default JobPerMonthChart;