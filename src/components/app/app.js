//Тестируем git111122222222222222222222
import React, { Component } from "react";
import { formatDistance } from "date-fns";

import "./app.css";

import TaskList from "../taskList";
import Footer from "../footer/";
import NewTaskForm from "../newTaskForm";
import deepEqual from "../../utils/deepEqual";

export default class App extends Component {
  maxId = 0;
  newData;

  state = {
    todoData: [
      this.createTodoItem("Drink coffee", new Date()),
      this.createTodoItem("Make Awesome App", new Date()),
      this.createTodoItem("Have a lunch", new Date())
    ],
    buttons: ["All", "Active", "Completed"],
    filter: "All",
    edit: false,
    isFirstRender: true
  };

  addItem = (text, min = 59, sec = 59, statusTimer = "stop") => {
    const newItem = this.createTodoItem(
      text,
      new Date(),
      min,
      sec,
      statusTimer
    );

    this.setState(({ todoData }) => {
      const newArray = [...todoData, newItem];
      localStorage.setItem("todoData", JSON.stringify(newArray));
      return { todoData: newArray };
    });
  };

  deleteItem = (id) => {
    this.setState(({ todoData }) => {
      const idx = todoData.findIndex((el) => el.id === id);
      const newArray = [...todoData.slice(0, idx), ...todoData.slice(idx + 1)];
      localStorage.setItem("todoData", JSON.stringify(newArray));
      return { todoData: newArray };
    });
  };

  clearCompleted = () => {
    this.state.todoData.forEach((item) => {
      if (item.done) {
        this.deleteItem(item.id);
      }
    });
  };

  editItem = (id, label) => {
    this.setState(({ todoData }) => {
      const newArray = this.toggleProperty(todoData, id, "edit", label);
      localStorage.setItem("todoData", JSON.stringify(newArray));
      return {
        todoData: newArray
      };
    });
  };

  createTodoItem(label, timeStamp, min = 59, sec = 59, statusTimer = "stop") {
    return {
      label,
      min,
      sec,
      statusTimer,
      done: false,
      edit: false,
      id: this.maxId++,
      timeStamp,
      string: formatDistance(new Date(), timeStamp, {
        includeSeconds: true
      })
    };
  }

  toggleProperty(arr, id, propName, label) {
    const idx = arr.findIndex((el) => el.id === id);
    if (!label) {
      label = this.state.todoData[idx].label;
    }
    // console.log(`id  = ${id}`);
    // console.log(`Значение label, переданное в toggleProperty: ${label}`);
    // console.log(label);
    // console.log(`Значение propName, переданное в toggleProperty: ${propName}`);
    // console.log(label);

    const oldItem = arr[idx];
    //console.log(arr[idx]);
    const newItem = {
      ...oldItem,
      [propName]: !oldItem[propName],
      label: label
    };
    return [...arr.slice(0, idx), newItem, ...arr.slice(idx + 1)];
  }

  updateTime(arr, stringArray) {
    arr = this.state.todoData;
    // console.log(`Старый массив, который мы модифицируем: `);
    // console.log(arr);
    const newArray = arr.map((element, i) => {
      const newItem = element;
      newItem.string = stringArray[i];
      //const id = `time${newItem.id}`;

      //localStorage.setItem(id, JSON.stringify(newItem.string));

      return newItem;
    });
    // console.log(`И вот наш новый массив: `);
    // console.log(newArray);
    return newArray;
  }

  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      todoData = this.toggleProperty(todoData, id, "done");
      localStorage.setItem("todoData", JSON.stringify(todoData));
      return {
        todoData
      };
    });
  };

  onToggleFilter = (text) => {
    this.setState({
      filter: text
    });
  };

  onStartTimer = (id) => {
    const { todoData } = this.state;
    const idx = this.state.todoData.findIndex((el) => el.id === id);
    if (idx === -1) return;
    let { min, sec } = this.state.todoData[idx];

    if (sec > 0) {
      sec--;
    } else if (min > 0) {
      sec = 59;
      min--;
    }

    this.newData = JSON.parse(localStorage.getItem("todoData"));
    if (!this.newData) return;
    if (deepEqual(this.newData, todoData) === false) {
      this.setState({ todoData: this.newData });
    }

    if (this.state.todoData[idx]) {
      this.setState((prevState) => {
        const { todoData } = prevState;
        const oldItem = todoData[idx];
        if (!oldItem) return;
        const newItem = {
          ...oldItem,
          min: min,
          sec: sec
        };
        const newArray = [
          ...todoData.slice(0, idx),
          newItem,
          ...todoData.slice(idx + 1)
        ];
        //localStorage.setItem("todoData", JSON.stringify(newArray));
        return {
          todoData: newArray
        };
      });
    }
  };

  componentDidMount() {
    this.setState({ todoData: this.newData });
    this.newTime = setInterval(() => {
      const stringArray = this.state.todoData.map((element, i) => {
        if (element.string) {
          return formatDistance(new Date(), new Date(element.timeStamp), {
            includeSeconds: true
          });
        } else return null;
      });
      this.newData = this.updateTime(this.newData, stringArray);
      this.setState(() => {
        return {
          todoData: this.updateTime(this.state.todoData, stringArray)
        };
      });
    }, 4000);
    this.setState({ isFirstRender: false });
  }

  componentWillUnmount() {
    clearInterval(this.newTime);
  }

  componentDidUpdate() {
    const { todoData } = this.state;
    this.newData = JSON.parse(localStorage.getItem("todoData"));
    if (!this.newData) return;
    if (deepEqual(this.newData, todoData) === false) {
      this.setState({ todoData: this.newData });
    }
  }

  UpdatetodoData() {
    const { isFirstRender } = this.state;
    if (localStorage.getItem("todoData")) {
      //console.log("В localStorage хранится список дел с предыдущей сессии");
      this.newData = JSON.parse(localStorage.getItem("todoData"));
      if (!this.newData.length && isFirstRender) {
        this.newData = this.state.todoData;
        localStorage.setItem("todoData", JSON.stringify(this.state.todoData));
        return this.state.todoData;
      }
      return this.newData;
    } else {
      this.newData = this.state.todoData;
      //localStorage.setItem("todoData", JSON.stringify(this.state.todoData));
      return this.state.todoData;
    }
  }

  render() {
    const todoData = this.UpdatetodoData();
    this.maxId = 0;
    todoData.forEach((el) => {
      if (el.id >= this.maxId) {
        this.maxId = el.id + 1;
      }
    });

    const doneCount = todoData.filter((el) => el.done).length;
    const todoCount = todoData.length - doneCount;

    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <NewTaskForm onItemAdded={this.addItem} />
        </header>
        <section className="main">
          <TaskList
            todos={todoData}
            onDeleted={this.deleteItem}
            onEdit={this.editItem}
            onToggleDone={this.onToggleDone}
            onStartTimer={this.onStartTimer}
            onStopTimer={this.onStopTimer}
            filter={this.state.filter}
          />
          <Footer
            toDo={todoCount}
            onToggleFilter={this.onToggleFilter}
            clearCompleted={this.clearCompleted}
            buttons={this.state.buttons}
            filter={this.state.filter}
          />
        </section>
      </section>
    );
  }
}
