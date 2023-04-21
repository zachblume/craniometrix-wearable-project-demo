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

export default function Chart({ data: passedAlongData }) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
    };

    const labels = Object.keys(passedAlongData);

    const data = {
        labels,
        datasets: [
            {
                label: "Metric",
                // data: labels.map(() => 4),
                data: Object.values(passedAlongData),
                backgroundColor: "#F6A037",
            },
        ],
    };
    return <Bar options={options} data={data} width={"100%"} height={"250px"} />;
}
