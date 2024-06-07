import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
};


const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const generateRandomData = (min, max) => {
    return Math.random() * (max - min) + min;
};

const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: labels.map(() => generateRandomData(-1000, 1000)),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Dataset 2',
            data: labels.map(() => generateRandomData(-1000, 1000)),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

const HistogramChart = () => {
    return (
        <div style={{width: "400px", height:"300px", display:"flex" , justifyContent: "center",
            alignItems: "center",   marginLeft:'39%'
         }}>
            <Line options={options} data={data} />
        </div>
    );
};

export default HistogramChart;
