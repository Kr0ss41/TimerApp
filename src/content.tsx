import { useState } from 'react';
import './content.css'
import Modal from './modal/Modal.jsx'
import Plus from './icons/plus.svg'
import cornerArrow from './icons/cornerArrow.svg'
import Timer from './timer/timer.jsx'
import './reset.css'
import CheckIcon from './icons/check.svg'
import TrashIcon from './icons/trash.svg'

interface Mark {
  id: number;
  title: string;
  markTimer: number;
  active: boolean;
  time: number;
  averageTime : number;
  allStarts : number[]
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
  averageMarkTimes: number[];
}

interface ContentProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  timers: number[];
  setTimers: React.Dispatch<React.SetStateAction<number[]>>;
}

const Content: React.FC<ContentProps> = ({ tasks, setTasks, timers, setTimers }) => {
  const [text, setText] = useState("");
  const [modalActive, setModalActive] = useState(false);
  const [finishActive, setFinishActive] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [errorTrigger, setErrorTrigger] = useState(false);
  const [tasksCount, setTasksCount] = useState(1);
  const [marksCounts, setMarksCounts] = useState(2);
  const [marks, setMarks] = useState<Mark[]>([{ id: 1, title: '', markTimer: Date.now(), active: false, time: 0, averageTime: 0,allStarts:[] }]);
  const [totalTime, setTotalTime] = useState(0);
  const [completedTask, setCompletedTask] = useState<Task | null>(null);

  const addMark = () => {
    setMarks([...marks, { id: marksCounts, title: '', markTimer: Date.now(), active: false, time: 0 , averageTime: 0, allStarts:[]}]);
    setMarksCounts(marksCounts + 1);
  };

  const updateMarkText = (id: number, newTitle: string) => {
    setMarks(marks.map(mark =>
      mark.id === id ? { ...mark, title: newTitle } : mark
    ));
  };

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatTimeNamed = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return <span className='endscreenTimer'>{String(hours).padStart(2, '0')} ч. {String(minutes).padStart(2, '0')} м. {String(seconds).padStart(2, '0')} с.</span>;
  };
  const addTask = () => {
    setTasks([
      ...tasks,
      { id: tasksCount, title: text, active: false, marksCount: marksCounts, markQueue: 0, allStarts: [], markList: [...marks], completed: false,averageMarkTimes: [] } // Устанавливаем completed: false
    ]);
    setTasksCount(tasksCount + 1);
    setText("");
    setMarksCounts(2);
    setMarks([{ id: 1, title: '', markTimer: Date.now(), active: false, time: 0 ,averageTime: 0,allStarts:[]}]);
    setModalActive(false)
  };

  
  const startButton = (taskId: number) => {
    setTasks(tasks.map((task: Task) => {
      if (task.id === taskId) {
        const updatedMarkList = task.markList.map((mark, index) => {
          // Если уже были завершения задачи (task.allStarts.length > 0), пересчитываем среднее время для отсечек
          if (task.allStarts.length > 0) {
            const newAverageTime = (mark.averageTime + mark.time) / 2;
            return { ...mark, averageTime: newAverageTime, time: 0 };
          } else {
            // Если задача запускается первый раз, устанавливаем текущее время как среднее
            return { ...mark, averageTime: mark.time, time: 0 };
          }
        });
  
        return {
          ...task,
          active: true,
          markQueue: 1,
          completed: false,
          markList: updatedMarkList
        };
      }
      return task;
    }));
  };
  


  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  const markButton = (taskId: number, markId: number, time: number) => {
    setTasks(tasks.map((task: Task) => {
      if (task.id === taskId) {
        const updatedMarkList = task.markList.map((mark) => {
          if (mark.id === markId && time > 0) { // Проверяем, что время больше 0
            const updatedAllMarksStarts = [...mark.allStarts, time];
            if (updatedAllMarksStarts.length > 20) {
              updatedAllMarksStarts.shift();
            }
            return { ...mark, time: time, allStarts: updatedAllMarksStarts };
          }
          return mark;
        });
        console.log(task.markQueue, 'markqueue')
        console.log(task.marksCount, 'markscount')
        console.log(task.marksCount, task.markList.map(mark => (mark.averageTime)))
        return {
          ...task,
          markList: updatedMarkList,
          markQueue: markId + 1, // Увеличиваем очередь только при успешной записи
        };
      }

      return task;
    }));

    setFinishActive(false);
};


  const handleResult = (taskId: number) => {
    setTasks(
      tasks.map((task: Task) => {
        if (task.id === taskId && task.markQueue >= task.markList.length && !task.completed) { // Добавляем проверку на флаг completed
          const totalTime = task.markList.reduce((total, mark) => total + mark.time, 0);
          setTotalTime(totalTime);
          setTimers([...timers, totalTime]);
          const updatedAllStarts = [...task.allStarts, totalTime];

          if (updatedAllStarts.length > 20) {
            updatedAllStarts.shift();
          }

          setCompletedTask(task);
          setFinishActive(true);
          return {
            ...task,
            active: false,
            allStarts: updatedAllStarts,
            completed: true, // Устанавливаем флаг completed в true
          };
        }
        return task;
      })
    );
    console.log(tasks.map((task:Task)=>task.markList.map(mark=>mark.allStarts)))
  };



  return (
    <div className='mainBody'>
      <main>
        <button className='testbtn' onClick={() => setModalActive(true)}>Создать новую задачу</button>
      </main>
      <Modal active={deleteModal} setActive={setDeleteModal}>
        <h3 className='deleteTitle'>Удалить задачу</h3>
        {taskToDelete !== null && (
          <div>
            <p className='deleteText'>Вы действительно хотите удалить задачу "{tasks.find(t => t.id === taskToDelete)?.title}"?</p>
            <div className='deleteButtons'>
              <button className='deleteConfirm' onClick={() => {
                if (taskToDelete !== null) {
                  deleteTask(taskToDelete);
                  setDeleteModal(false);
                  setTaskToDelete(null); // Сбрасываем идентификатор после удаления
                }
              }}>Удалить</button>
              <button className='deleteDecline' onClick={() => {
                setDeleteModal(false);
                setTaskToDelete(null); // Сбрасываем идентификатор при отмене
              }}>Отмена</button>
            </div>

          </div>
        )}
      </Modal>

      <Modal active={finishActive} setActive={setFinishActive}>
        <h1 className="endscreenTitle">ЗАВЕРШЕНО!</h1>
        {completedTask && (
          <>
            <div className="endscreenText"><p style={{fontSize:"24px"}}>Задача завершена за </p>{formatTimeNamed(totalTime)}</div>
            <p className="endscreenMarksTitle">Отчёт по отсечкам: </p>
            <div>
              {completedTask.markList.map((mark) => (
                <div key={mark.id}>
                  <li className="li">
                    <img src={cornerArrow} alt="" />
                    <span>{mark.title || `Отсечка ${mark.id}`}</span>
                    <div className="endscreenMarkTimer">{formatTime(mark.time)}</div>
                  </li>
                </div>
              ))}
            </div>
          </>
        )}
        <button onClick={() => setFinishActive(false)} className="endscreenButton">
          ЗАКРЫТЬ
        </button>
      </Modal>
      <Modal active={modalActive} setActive={setModalActive}>
        <h3 className='name'>Название</h3>
        <div className='inputAndStar'>
          <p className={errorTrigger ? "star error" : "star"}>*</p>
          <input
            type="text"
            placeholder='Введите текст'
            className='addName'
            onBlur={(e) => e.target.value.length > 0 ? setErrorTrigger(false) : setErrorTrigger(true)}
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
        </div>
        <p className={errorTrigger ? "errorText error" : "errorText"}>
          Это поле обязательно для заполнения!
        </p>
        <div className='timeMarks'>
          <div className='marksnbutton'>
            <h3 className='name'>Отсечки</h3>
            <button className='addMarkButton' onClick={() => marksCounts < 11 ? addMark() : null}>
              <img src={Plus} alt="" />
            </button>
          </div>
          {marks.map((mark, index) => (
            <div key={index} className='markItem'>
              <h4 className='markTitle'>Отсечка {mark.id}</h4>
              <div className='marksInput'>
                <img src={cornerArrow} alt="" />
                <input
                  placeholder='Введите текст'
                  type="text"
                  className='addMark'
                  onChange={(e) => updateMarkText(mark.id, e.target.value)}
                  value={mark.title}
                />
              </div>
            </div>
          ))}
        </div>
        <div className='finishEdit'>
          <button className='finishEditButton' onClick={() => {
            text.length > 0 ? addTask() : setErrorTrigger(true);
          }}>
            ДОБАВИТЬ ЗАДАЧУ
          </button>
        </div>
      </Modal>
      {tasks.map((task: Task, index: number) => (
        <div key={index} className='taskItem'>
          <div className='taskTitleAndButton'>
            <h2 className='taskTitle'>{task.title}</h2>
            <button className='startTask' disabled={task.active} onClick={() => startButton(task.id)}>
              {task.active ? "В ПРОЦЕССЕ..." : "НАЧАТЬ"}
            </button>
          </div>
          <h2 className='markSubTitle margin35left'>Отсечки :</h2>
          {task.markList.map((mark, index) => (
            <div key={index} className='markAndTimer'>
              <div className='iconNName'>
                <img className='icon' src={cornerArrow} alt="" />
                <h3 className='markSubTitle'>{mark.title || `Отсечка ${mark.id}`}</h3>
              </div>
              <Timer
                onStop={(seconds: number) => markButton(task.id, mark.id, seconds)}
                active={task.active && mark.id === task.markQueue}
                resetOnStart={true} 
              />
              <button
                onClick={() => markButton(task.id, mark.id, 0)}
                disabled={mark.id !== task.markQueue}
                className={mark.id === task.markQueue ? 'activeMarkButton' : 'inactiveMarkButton'}
              >
                {mark.id === task.markQueue ? <img src={CheckIcon} alt="" /> : "Не активна"}
              </button>
            </div>
          ))}
          <div className='bottomButtons'>
            {!task.completed && (
            <button
              disabled={task.markQueue < task.marksCount}
              className={task.markQueue < task.marksCount ? 'resultButton' : 'resultButton result'}
              onClick={() => handleResult(task.id)}
            >
              ПОДВЕСТИ ИТОГИ
            </button>
          )}
            <button onClick={() => {
              setTaskToDelete(task.id);
              setDeleteModal(true);
            }} className='deleteTask'>
              <img src={TrashIcon} alt="" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Content;