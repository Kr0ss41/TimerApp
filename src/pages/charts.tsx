import React, { useState } from 'react';
import './stats.css';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartType,
  Plugin,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

interface Mark {
  id: number;
  title: string;
  time: number;
  active: boolean;
  averageTime: number;
  allStarts: number[]
}

interface Task {
  id: number;
  title: string;
  active: boolean;
  markQueue: number;
  marksCount: number;
  allStarts: number[];
  markList: Mark[];
  completed: boolean;
}

interface ChartsProps {
  tasks: Task[];
}

const Charts: React.FC<ChartsProps> = ({ tasks }) => {
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  const handleTaskClick = (taskId: number) => {
    setOpenTaskId(openTaskId === taskId ? null : taskId);
  };
  const timeLabelPlugin: Plugin<ChartType> = {
    id: 'timeLabelPlugin',
    afterDatasetsDraw: (chart) => {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar, index) => {
          const dataValue = dataset.data[index] as number;
          const timeText = formatTime(dataValue);

          let percentageDiffText = '';
          let percentageDiffColor = 'black';
          if (index === 1) {
            const averageValue = dataset.data[0] as number;
            const percentageDiff = averageValue !== 0
              ? ((dataValue - averageValue) / averageValue) * 100
              : 0;
            percentageDiffText = `${Math.round(percentageDiff)}%`;
            if (percentageDiff > 0) {
              percentageDiffColor = 'green';
            } else if (percentageDiff < 0) {
              percentageDiffColor = '#DC143C';
            } else {
              percentageDiffColor = 'darkgray';
            }
          }


          if (bar && typeof bar.getProps === 'function') {
            const { x, y, base, width } = bar.getProps(['x', 'y', 'base', 'width'], true);

            const xPos = x + width / 2 + 15;
            const yPos = y + (base - y) / 2;
            const previousValue = index > 0 ? dataset.data[index - 1] as number : 0;
            const fontSize = Math.abs(dataValue - previousValue) < 2 ? 10 : 12; // Уменьшаем шрифт, если разница меньше 10 секунд

            // Отрисовываем текст рядом с каждым столбцом
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillStyle = isDarkMode ? 'white' : 'black';
            ctx.fillText(timeText, xPos, yPos);
            if (percentageDiffText) {
              ctx.font = `bold ${fontSize}px Arial`
              ctx.fillStyle = percentageDiffColor;
              ctx.fillText(percentageDiffText, xPos + 35, yPos);
            }
          }
        });
      });
    },
  };
  const timeLabelPlugin2: Plugin<ChartType> = {
    id: 'timeLabelPlugin2',
    afterDatasetsDraw: (chart) => {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar, index) => {
          const dataValue = dataset.data[index] as number;
          const timeText = `${Math.floor(dataValue / 60)}:${(dataValue % 60).toString().padStart(2, '0')}`;

          if (bar && typeof bar.getProps === 'function') {
            const { x, y, base, width } = bar.getProps(['x', 'y', 'base', 'width'], true);

            const xPos = x + width / 2 + 15; // Позиция текста справа от столбца
            const yPos = y + (base - y) / 2; // Позиция текста по середине столбца
            const previousValue = index > 0 ? dataset.data[index - 1] as number : 0;
            const fontSize = Math.abs(dataValue - previousValue) < 2 ? 9 : 12;
            // Отрисовываем текст рядом с каждым столбцом
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillStyle = isDarkMode ? 'white' : 'black';
            ctx.fillText(timeText, xPos, yPos);
          }
        });
      });
    },
  }


  return (
    <div className="chartsContainer" >
      {tasks.length === 0 ? (
        <div className="placeholderBox">
          <h1 className="placeholderText">Тут пока ничего нет... Попробуйте создать задачу!</h1>
        </div>
      ) : (
        tasks.map((task) => {
          const isOpen = openTaskId === task.id;
          const completionChartData = {
            labels: task.allStarts.map((_, index) => index + 1),
            datasets: [
              {
                label: `Завершения задачи ${task.title}`,
                data: task.allStarts,
                borderColor: getRandomColor(),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true,
              },
            ],
          };
          const averageTimes = task.markList.map((mark) => {
            if (mark.allStarts.length === 0) return 0; // Если нет данных, возвращаем 0
            const total = mark.allStarts.reduce((acc, start) => acc + start, 0); // Суммируем все значения
            return Math.round(total / mark.allStarts.length); // Среднее значение
          });          
          const lastMarkTimes = task.markList.map((mark) => Math.round(mark.time));
          const labelsAvr = [];
          if (averageTimes.some((time) => time > 0)) {
            labelsAvr.push('Среднее время');
          }
          labelsAvr.push('Последнее время');

          const barChartData = {
            labels: labelsAvr,
            datasets: task.markList.map((mark, index) => {
              const data = [];

              if (averageTimes[index] > 0) {
                data.push(averageTimes[index]); // Добавляем столбец среднего времени, если есть данные
              }

              data.push(lastMarkTimes[index]); // Всегда добавляем столбец последнего времени

              return {
                label: `Отсечка ${mark.title}`,
                backgroundColor: getRandomColor(),
                data: data, // Добавляем данные динамически
                stack: 'Stack 0',
              };
            }),
          };

          const barChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: { color: isDarkMode ? 'white' : 'gray', display: true, text: 'Время (секунды)' },
                grid: {
                  color: isDarkMode ? '#87CEEB' : 'gray',
                  display: true,
                  lineWidth: 0.5,
                },
              },
              x: {
                stacked: true,
                title: { color: isDarkMode ? 'white' : 'gray', display: true, text: 'Среднее и последнее время' },
                grid: {
                  display: true,
                  lineWidth: 0.5,
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: isDarkMode ? 'white' : 'gray'
                }, display: true, position: 'top' as const
              },
              title: { display: true, color: isDarkMode ? 'white' : 'black', text: `График отсечек для задачи ${task.title}` },
            },
            barThickness: 20,
          };
          const lastRunsCount = Math.min(5, task.markList[0]?.allStarts.length || 0);
          const labels = Array.from({ length: lastRunsCount }, (_, i) => `Запуск ${i + 1}`);

          const lastRunsBarChartData = {
            labels: labels,
            datasets: task.markList.map((mark) => ({
              label: `Отсечка ${mark.title}`,
              backgroundColor: getRandomColor(),
              data: mark.allStarts.slice(-lastRunsCount).map(start => Math.round(start)),
              stack: `Stack 0`,
            })),
          };

          const lastRunsBarChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: { color: isDarkMode ? 'white' : 'gray', display: true, text: 'Время (секунды)' },
                grid: {
                  color: isDarkMode ? '#87CEEB' : 'gray',
                  display: true,
                  lineWidth: 0.5,
                },
              },
              x: {
                stacked: true,
                title: { color: isDarkMode ? 'white' : 'gray', display: true, text: 'Последние запуски' },
                grid: {
                  display: true,
                  lineWidth: 0.5,
                },
              },
            },
            plugins: {
              legend: { display: true, labels: { color: isDarkMode ? 'white' : 'gray' }, position: 'top' as const },
              title: { display: true, color: isDarkMode ? 'white' : 'black', text: `График последних запусков для задачи ${task.title}` },
            },
            barThickness: 15,
          };


          return (
            <div key={task.id} className="taskAccordion" style={{ marginBottom: "20px", marginTop: "15px" }}>
              <div className={openTaskId === task.id ? 'statsNameBoxActive' : 'statsNameBox'} onClick={() => handleTaskClick(task.id)}>
                <h2 className={openTaskId === task.id ? 'statsNameTextActive' : 'statsNameText'}>Графики {task.title} {openTaskId === task.id ? '-' : '+'}</h2>
              </div>

              {isOpen && (
                <div className="taskCharts">
                  <div style={{ width: '94%', height: '300px', marginRight: '10px', marginBottom: '40px' }}>
                    <Line data={completionChartData} options={{

                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: { grid: { color: isDarkMode ? '#87CEEB' : 'gray', }, beginAtZero: true, title: { color: isDarkMode ? 'white' : 'gray', display: true, text: 'Время (секунды)' } },
                        x: { grid: { color: isDarkMode ? '#87CEEB' : 'gray', }, title: { display: true, color: isDarkMode ? 'white' : 'black', text: 'Количество завершений' } },
                      },
                      plugins: {
                        legend: { labels: { color: isDarkMode ? 'white' : 'gray', font: { size: 16 } } },
                        title: { display: true, color: isDarkMode ? 'white' : 'black', text: `График завершений для ${task.title}` },
                      },
                    }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '40px' }}>
                    {/* Столбчатый график */}
                    <div style={{ width: '94%', height: '300px' }}>
                      <Bar data={barChartData} options={barChartOptions} plugins={[timeLabelPlugin]} />
                    </div>
                  </div>
                  <div style={{ width: '94%', height: '300px' }}>
                    <Bar data={lastRunsBarChartData} options={lastRunsBarChartOptions} plugins={[timeLabelPlugin2]} />
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Charts;
