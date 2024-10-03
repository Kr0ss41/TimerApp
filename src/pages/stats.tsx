import React, { useState } from 'react';

interface Mark {
  id: number;
  title: string;
  markTimer: number; // Время отсечки
  active: boolean;
  time: number;
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
  averageMarkTimes: number[];
}
const formatTime = (secs: number) => {
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
const formatTimeNamed = (secs: number) => {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;
  return <span className='endscreenTimer'>{String(hours).padStart(2, '0')} ч. {String(minutes).padStart(2, '0')} м. {String(seconds).padStart(2, '0')} с.</span>;
};
const calculateAverage = (times: number[]) => {
  if (times.length === 0) return 0;
  const sum = times.reduce((acc, time) => acc + time, 0);
  return sum / times.length;
};
const formatPercentage = (percentage: number) => {
  return percentage > 0 ? `+${percentage.toFixed(2)}%` : `${percentage.toFixed(2)}%`;
};
const calculatePercentageDifferenceMark = (current: number, previous: number) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

const calculatePercentageDifference = (current: number, average: number) => {
  if (average === 0) return 0;
  return ((current - average) / average) * 100;
};

const calculateTrend = (times: number[]) => {
  if (times.length < 2) return 0;
  let trendSum = 0;
  for (let i = 1; i < times.length; i++) {
    const difference = ((times[i] - times[i - 1]) / times[i - 1]) * 100;
    trendSum += difference;
  }
  return trendSum / (times.length - 1);
};


interface StatsProps {
  tasks: Task[];
}

const Stats: React.FC<StatsProps> = ({ tasks }) => {
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);

  const toggleTask = (taskId: number) => {
    if (openTaskId === taskId) {
      setOpenTaskId(null); // Закрыть задачу, если она уже открыта
    } else {
      setOpenTaskId(taskId); // Открыть новую задачу
    }
  };

  const getLastNStarts = (allStarts: number[], n: number) => {
    return allStarts.slice(Math.max(allStarts.length - n, 0));
  };

  const averageTimeForTask = (task: Task, n: number) => {
    const lastStarts = getLastNStarts(task.allStarts, n);
    return calculateAverage(lastStarts);
  };

  const percentageDifferenceForTask = (task: Task, n: number) => {
    const lastStarts = getLastNStarts(task.allStarts, n);
    const average = calculateAverage(lastStarts);
    const lastRunTime = task.allStarts[task.allStarts.length - 1];
    return calculatePercentageDifference(lastRunTime, average);
  };

  const trendForTask = (task: Task, n: number) => {
    const lastStarts = getLastNStarts(task.allStarts, n);
    return calculateTrend(lastStarts);
  };

  return (
    <div>
      {tasks.length === 0 ? (
        <div className='placeholderBox'>
          <h1 className='placeholderText'>Тут пока ничего нет... Попробуйте создать задачу!</h1>
        </div>
      ) : (
        tasks.map(task => (
          <div key={task.id} className="task-stats">
            <div className={openTaskId === task.id ? 'statsNameBoxActive' : 'statsNameBox'}>
              <h2 onClick={() => toggleTask(task.id)} className={openTaskId === task.id ? 'statsNameTextActive' : 'statsNameText'}>
                Статистика {task.title} {openTaskId === task.id ? '-' : '+'}
              </h2>
            </div>
            {openTaskId === task.id && (
              <div className='statItemBox'>
                <div className='statItem'>
                  <p className='statItemText'>Среднее время выполнения за последние 10 запусков : </p>
                  <div className='statItemText statNumber'>{formatTimeNamed(averageTimeForTask(task, 10))}</div>
                </div>
                <div className='statItem'>
                  <p className='statItemText'>
                    Процентная разница последнего запуска от среднего времени:
                  </p>
                  <div className='statItemText statNumber'>{percentageDifferenceForTask(task, 10).toFixed(2)}%</div>
                </div>
                <div className='statItem'>
                  <p className='statItemText'>
                    Общая тенденция изменения времени выполнения:
                  </p>
                  <div className='statItemText statNumber'>
                    {trendForTask(task, 10).toFixed(2)}%
                  </div>
                </div>
                {task.markList.map((mark)=>{
                  const lastTime = mark.allStarts[mark.allStarts.length - 1];
                  const previousTime = mark.allStarts[mark.allStarts.length - 2] || lastTime; // Используем предыдущее или последнее значение
                  if (mark.allStarts.length === 0) {
                    return (
                      <div className="statItem" key={mark.id}>
                        <p className="statItemText">
                          {mark.title} — Н/Д Н/Д
                        </p>
                      </div>
                    );
                  }

                  // Если есть только одно значение, процентная разница — 0%
                  const percentageDifference = mark.allStarts.length > 1
                    ? calculatePercentageDifference(lastTime, previousTime)
                    : 0;

                  return (
                    <div className="statItem" key={mark.id}>
                      <p className="statItemText statNumber">
                        {mark.title} — {formatTime(lastTime)} {formatPercentage(percentageDifference)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Stats;
