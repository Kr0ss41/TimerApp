import React, { ComponentProps } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Task {
  id: number;
  title: string;
  allStarts: number[];
}

interface ChartsProps {
  tasks: Task[];
}

const Charts: React.FC<ChartsProps> = ({ tasks }) => {
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className='chartsContainer'>
      {tasks.map((task) => {
        const chartData = {
          labels: task.allStarts.map((_, index) => index + 1), // От 1 до 20
          datasets: [
            {
              label: ` ${task.title} завершения`,
              data: task.allStarts,
              borderColor: getRandomColor(),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              fill: true,
            },
          ],
        };

        const options: ComponentProps<typeof Line>["options"] = {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Время (секунды)",
                font: {
                  size: 14, // Размер шрифта для подписи оси Y
                  family: "Arial", // Шрифт
                  weight: "bold", // Жирность
                },
                color: "#666", // Цвет текста подписи оси Y
              },
              ticks: {
                font: {
                  size: 12, // Размер шрифта для меток на оси Y
                },
                color: "#666", // Цвет меток
              },
            },
            x: {
              title: {
                display: true,
                text: "Количество завершений (Не более 20-ти)",
                font: {
                  size: 14, // Размер шрифта для подписи оси X
                  family: "Arial", // Шрифт
                  weight: "bold", // Жирность
                },
                color: "#666", // Цвет текста подписи оси X
              },
              ticks: {
                font: {
                  size: 12, // Размер шрифта для меток на оси X
                },
                color: "#666", // Цвет меток
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 16, // Размер шрифта для легенды
                  family: "Arial",
                  weight: "bold",
                },
                color: "#333", // Цвет текста легенды
              },
            },
            title: {
              display: true,
              text: `График завершений для ${task.title}`,
              font: {
                size: 24, // Размер шрифта для заголовка графика
                family: "Arial",
                weight: "bold",
              },
              color: "#4C51CA",
            },
          },
        };

        return (
          <div key={task.id} className='chart' style={{ marginBottom: "20px" }}>
            <Line data={chartData} options={options} />
          </div>
        );
      })}
    </div>
  );
};

export default Charts;
