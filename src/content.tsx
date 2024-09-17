import { useState } from 'react';
import './content.css'
import Modal from './modal/Modal.jsx'
import Plus from './icons/plus.svg'
import cornerArrow from './icons/cornerArrow.svg'
import Timer from './timer/timer.jsx'
import './reset.css'
const Content: React.FC = () => {
  interface Task {
    id: number;
    title: string;
    markList: { id: number; title: string; markTimer: number, active: boolean, time: number }[];
  }

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [text, setText] = useState("");
  const [taskActive, setTaskActive] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [finishActive, setFinishActive] = useState(false)
  const [errorTrigger, setErrorTrigger] = useState(false);
  const [tasksCount, setTasksCount] = useState(1);
  const [marksCount, setMarksCount] = useState(2);
  const [marks, setMarks] = useState([{ id: 1, title: '', markTimer: Date.now(), active: false, time: 0 }]);
  const [markQueue, setMarkQueue] = useState(0)
  const [totalTime, setTotalTime] = useState(0)

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
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;

  };
  const addTask = () => {
    setTasks([
      ...tasks,
      { id: tasksCount, title: text, markList: [...marks] }
    ]);
    setTasksCount(tasksCount + 1);
    setText("");
    setMarksCount(2);
    setMarks([{ id: 1, title: '', markTimer: Date.now(), active: false, time: 0 }]);
  };
  const startButton = () => {
    setTaskActive(true)
    setMarkQueue(1);
  }
  const markButton = (markId: number, time: number) => {
    setTasks(
      tasks.map((task: Task) => {
        return {
          ...task,
          markList: task.markList.map((mark) => {
            if (mark.id === markId) {
              return { ...mark, time: time };  // Обновляем время только для конкретной отсечки
            }
            return mark;
          })
        };
      })
    );
    setMarkQueue(markId + 1);
    setFinishActive(false)
    console.log(markQueue, 'Очередь', marksCount)

    /* Не срабатывает окончание действия*/

    if(markId > marksCount){
      tasks.map((task:Task)=>{
        task.markList.map((mark)=>{
          setTotalTime(task.markList.reduce((markTotal, mark) => markTotal + mark.time, 0))
        })
      })
      setFinishActive(true)
      setTaskActive(false)
    }
  };
  // const markButton = () => {
  //   setTasks(
  //     tasks.map((task: Task) => {
  //       task.markList.map((mark) => {
  //         if (mark.id === markQueue ) {
  //           mark.time = actualTime;
  //         }
  //         return mark
  //       });
  //       return task
  //     })
  //   )
  //   setMarkQueue(markQueue + 1)
  // }
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
            <button disabled={taskActive} onClick={() => startButton()}>{taskActive ? "В ПРОЦЕССЕ..." : "НАЧАТЬ"}</button>
          </div>
          {task.markList.map((mark, index) => {
            console.log(`mark.id: ${mark.id}, time: ${mark.time}`);
            return (
              <div key={index} className='markAndTimer'>
                {mark.title || `Отсечка ${mark.id}`}
                <Timer
                  onStop={(seconds: number) => markButton(mark.id, seconds)}
                  active={mark.id === markQueue}
                />
                <button
                  onClick={() => markButton(mark.id, 0)}
                  disabled={mark.id !== markQueue}
                  className='activeMarkButton'
                >
                </button>
                <div>
                  {mark.time > 0 ? `${mark.time} секунд` : 'Таймер не остановлен'}
                </div>
              </div>
            );
          })}
          <div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Content
