import { useState } from 'react';
import './content.css'
import Modal from './modal/Modal.jsx'
import Plus from './icons/plus.svg'
import cornerArrow from './icons/cornerArrow.svg'
import Timer from './timer/timer.jsx'
import './reset.css'
import MyChart from './charts/chartComponent.jsx'


const Content: React.FC = () => {
  interface Task {
    id: number;
    title: string;
    active: boolean;
    markQueue: number;
    markList: { id: number; title: string; markTimer: number, active: boolean, time: number }[];
  }

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [text, setText] = useState("");
  const [modalActive, setModalActive] = useState(false);
  const [finishActive, setFinishActive] = useState(false);
  const [errorTrigger, setErrorTrigger] = useState(false);
  const [tasksCount, setTasksCount] = useState(1);
  const [marksCount, setMarksCount] = useState(2);
  const [marks, setMarks] = useState([{ id: 1, title: '', markTimer: Date.now(), active: false, time: 0 }]);
  const [totalTime, setTotalTime] = useState(0);

  const addMark = () => {
    setMarks([
      ...marks,
      { id: marksCount, title: '', markTimer: Date.now(), active: false, time: 0 }
    ]);
    setMarksCount(marksCount + 1);
  };

  const updateMarkText = (id: number, newTitle: string) => {
    setMarks(marks.map(mark =>
      mark.id === id ? { ...mark, title: newTitle } : mark
    ));
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      { id: tasksCount, title: text, active: false, markQueue: 0, markList: [...marks] }
    ]);
    setTasksCount(tasksCount + 1);
    setText("");
    setMarksCount(2);
    setMarks([{ id: 1, title: '', markTimer: Date.now(), active: false, time: 0 }]);
  };

  const startButton = (taskId: number) => {
    setTasks(tasks.map((task: Task) =>
      task.id === taskId
        ? { ...task, active: true, markQueue: 1 }
        : task
    ));
  };

  const markButton = (taskId: number, markId: number, time: number) => {
    setTasks(tasks.map((task: Task) => {
      if (task.id === taskId) {
        const updatedMarkList = task.markList.map((mark) => {
          if (mark.id === markId) {
            return { ...mark, time: time };
          }
          return mark;
        });

        return {
          ...task,
          markList: updatedMarkList,
          markQueue: markId + 1, // Обновляем очередь отсечек
        };
      }
      return task;
    }));
    setFinishActive(false);
  };

  const handleResult = (taskId: number) => {
    setTasks(tasks.map((task: Task) => {
      if (task.id === taskId && task.markQueue >= task.markList.length) {
        const totalTime = task.markList.reduce((total, mark) => total + mark.time, 0);
        setTotalTime(totalTime);
        setFinishActive(true);
        return { ...task, active: false };
      }
      return task;
    }));
  };

  return (
    <div className='mainBody'>
      <main>
        <button className='testbtn' onClick={() => setModalActive(true)}>Открыть окно</button>
      </main>
      <Modal active={finishActive} setActive={setFinishActive}>
        {totalTime}
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
            <button className='addMarkButton' onClick={() => { marksCount < 11 ? addMark() : null }}>
              <img src={Plus} alt="" />
            </button>
          </div>
          {marks.map((mark, index) => (
            <div key={index} className='markItem'>
              <h4>Отсечка {mark.id}</h4>
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
        <button onClick={() => {
          text.length > 0 ? addTask() : setErrorTrigger(true);
        }}>
          ДОБАВИТЬ ДЕЛО
        </button>
      </Modal>
      {tasks.map((task: Task, index: number) => (
        <div key={index} className='taskItem'>
          <div className='taskTitleAndButton'>
            {task.title}
            <button disabled={task.active} onClick={() => startButton(task.id)}>
              {task.active ? "В ПРОЦЕССЕ..." : "НАЧАТЬ"}
            </button>
          </div>
          {task.markList.map((mark, index) => (
            <div key={index} className='markAndTimer'>
              {mark.title || `Отсечка ${mark.id}`}
              <Timer
                onStop={(seconds: number) => markButton(task.id, mark.id, seconds)}
                active={task.active && mark.id === task.markQueue}
              />
              <button
                onClick={() => markButton(task.id, mark.id, 0)}
                disabled={mark.id !== task.markQueue}
                className={mark.id === task.markQueue ? 'activeMarkButton' : 'inactiveMarkButton'}
              >
              </button>

              <div>
                {mark.time > 0 ? `${mark.time} секунд` : 'Таймер не остановлен'}
              </div>
            </div>
          ))}
          <button
            disabled={task.markQueue < marksCount}
            className={task.markQueue > marksCount ? 'resultButton result' : 'resultButton'}
            onClick={() => handleResult(task.id)}
          >
            ПОДВЕСТИ ИТОГИ
          </button>
        </div>
      ))}
    </div>
  );
};

export default Content;