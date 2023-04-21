import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// chart.js...make the chart full width and height
const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
        legend: {
            display: false,
            // position: "top",
        },
        title: {
            display: false,
            // text: null,
        },
    },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data = {
    labels,
    datasets: [
        {
            label: "Dataset 1",
            data: labels.map(() => 4),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
            label: "Dataset 2",
            data: labels.map(() => 4),
            backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
    ],
};

export default function Chart() {
    return <Bar options={options} data={data} width={"100%"} />;
}
