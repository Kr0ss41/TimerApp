import React, { useEffect, useRef } from 'react';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController } from 'chart.js';
import Task from '../content'

// Регистрация компонентов графика в Chart.js
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController);

const MyChart = () => {
  const chartRef = useRef(null);  // Ссылка на элемент canvas
  let myChart = null;  // Переменная для хранения графика

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');  // Получаем 2D-контекст для canvas

    if (ctx && !myChart) {
      // Создаем новый график, если его ещё нет
      myChart = new Chart(ctx, {
        type: 'bar',  // Тип графика (столбчатый)
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],  // Метки оси X
          datasets: [
            {
                // Подпись к данным
              data: [12, 19, 3, 5, 2, 3],  // Данные для столбцов
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,label: '# of Votes', // Толщина границы столбцов
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,  // Начало оси Y с нуля
            },
          },
        },
      });
    }

    // Очищаем график при размонтировании компонента
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, []);  // Пустой массив зависимостей, чтобы график создавался только один раз при монтировании

  return (
    <div>
      <canvas ref={chartRef} width="400" height="200"></canvas> {/* Canvas для отображения графика */}
    </div>
  );
};

export default MyChart;
