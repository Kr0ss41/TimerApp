import { useState } from 'react';
import './reset.css'
import './App.css'
import Modal from './modal/Modal.jsx'
import Plus from './icons/plus.svg'
import cornerArrow from './icons/cornerArrow.svg'
import Timer from './timer/timer.jsx'

const App: React.FC = () => {
  interface Task {
    id: number;
    title: string;
    markList: { id: number; title: string; markTimer: number }[];
  }

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [text, setText] = useState("");
  const [modalActive, setModalActive] = useState(false);
  const [errorTrigger, setErrorTrigger] = useState(false);
  const [tasksCount, setTasksCount] = useState(1);
  const [marksCount, setMarksCount] = useState(2);
  const [marks, setMarks] = useState([{ id: 1, title: '', markTimer: Date.now() }]);

  // Добавление новой отсечки
  const addMark = () => {
    setMarks([
      ...marks,
      { id: marksCount, title: '', markTimer: Date.now() }  // title изначально пустое
    ]);
    setMarksCount(marksCount + 1);
  };

  // Обновление текста отсечки
  const updateMarkText = (id: number, newTitle: string) => {
    setMarks(marks.map(mark =>
      mark.id === id ? { ...mark, title: newTitle } : mark
    ));
  };

  // Добавление новой задачи
  const addTask = () => {
    setTasks([
      ...tasks,
      { id: tasksCount, title: text, markList: [...marks] }
    ]);
    setTasksCount(tasksCount + 1);
    setText("");
    setMarksCount(2);
    setMarks([{ id: 1, title: '', markTimer: Date.now() }]); // сброс отсечек с пустыми полями
  };

  return (
    <div className='mainBody'>
      <main>
        <button className='testbtn' onClick={() => setModalActive(true)}>Открыть окно</button>
      </main>
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
              <img src={Plus} alt=""/>
            </button>
          </div>
          {marks.map((mark, index) => (
            <div key={index} className='markItem'>
              <h4>Отсечка {mark.id}</h4>
              <div className='marksInput'>
                <img src={cornerArrow} alt=""/>
                <input
                  placeholder='Введите текст'
                  type="text"
                  className='addMark'
                  onChange={(e) => updateMarkText(mark.id, e.target.value)} // обновление title
                  value={mark.title} // устанавливается пустым или введенным значением
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
          {task.title}
          {task.markList.map((mark, index: number) => (
            <div key={index}>
              {mark.title || `Отсечка ${mark.id}`}
              <Timer></Timer>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;


