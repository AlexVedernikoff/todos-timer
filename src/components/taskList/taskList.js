import React from "react";

import Task from "../task";

import "./taskList.css";

const TaskList = (props) => {
  const {
    todos,
    onDeleted,
    onEdit,
    onToggleDone,
    onStartTimer,
    onStopTimer,
    filter
  } = props;
  // console.log(`Эту информацию мы передали из App.js
  // в TaskList в качестве todos:`);
  // console.log(todos);
  // console.log(`Эту информацию мы передали из App.js
  // в TaskList в качестве props:`);

  const elements = todos.map((item) => {
    // console.log(`Элемент массива todos: `);
    // console.log(item);

    const { id, ...itemProps } = item;

    return (
      <Task
        {...item}
        key={id}
        id={id}
        onDeleted={() => onDeleted(id)}
        onEdit={onEdit}
        onToggleDone={() => onToggleDone(id)}
        onStartTimer={() => onStartTimer(id)}
        onStopTimer={() => onStopTimer(id)}
        done={item.done}
        itemProps={itemProps}
      />
    );
  });

  const elementsDone = elements.filter((element) => {
    if (element) {
      return element.props.done;
    }
  });

  const elementsActive = elements.filter((element) => {
    if (element) {
      return !element.props.done;
    }
  });

  let arrayFiltetered;

  if (filter === "Completed") {
    arrayFiltetered = elementsDone;
  } else if (filter === "Active") {
    arrayFiltetered = elementsActive;
  } else {
    arrayFiltetered = elements;
  }

  return <ul className="todo-list">{arrayFiltetered}</ul>;
};

export default TaskList;
