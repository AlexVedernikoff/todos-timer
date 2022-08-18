/*eslint-disable*/
import React, { Component } from "react";

import "./task.css";

export default class Task extends Component {
  state = {
    label: this.props.itemProps.label,
    timerStatus: "stop",
  };

  newValue = "";
  editing = false;
  taskClassName = "view";
  editClassName = "view";
  isTimeElapsed = "";

  onLabelChange = (event) => {
    this.newValue = event.target.value;
    this.setState({ label: event.target.value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onEdit(this.props.id, this.state.label);
    this.editing = false;
    this.setState({
      label: this.state.label,
    });
  };

  componentDidMount() {
    const { id } = this.props;
    const { onStartTimer } = this.props;
    document.getElementById("edit").focus();

    const arr = JSON.parse(localStorage.getItem("todoData"));
    if (arr) {
      const idx = arr.findIndex((el) => el.id === id);
      if (arr[idx]) {
        const { min, sec, label } = arr[idx];
        this.setState({ min, sec, label });
      }
    }

    this.timer = setInterval(() => {
      const arr = JSON.parse(localStorage.getItem("todoData"));
      if (arr) {
        const idx = arr.findIndex((el) => el.id === id);
        if (arr[idx] && !this.editing) {
          const { min, sec, label } = arr[idx];
          this.setState({ min, sec, label });
        }
      }
      if (localStorage.getItem(id) === "play") {
        onStartTimer(id);
      }
    }, 1000);
  }

  onCreateTimer = () => {
    const { id } = this.props;
    localStorage.setItem(id, "play");
  };

  onDeleteTimer = () => {
    const { id } = this.props;
    this.setState({ timerStatus: "stop" });
    localStorage.setItem(id, "stop");
  };

  componentWillUnmount() {
    const { id } = this.props;
    clearInterval(this.timer);
    localStorage.removeItem(id);
  }

  render() {
    const { done, id, string } = this.props;
    let time = JSON.parse(localStorage.getItem(`time${id}`));
    if (!time) {
      time = string;
    }
    const { min, sec } = this.state;
    if (Number(min + sec) === 0) {
      this.isTimeElapsed = "timeElapsed";
    }

    if (done) {
      this.classNames = "completed";
      this.checked = true;
    } else {
      this.checked = false;
      this.classNames = "";
    }

    if (this.editing === true) {
      this.taskClassName = "hidden";
      this.editClassName = "view";
    } else {
      this.taskClassName = "view";
      this.editClassName = "hidden";
    }
    return (
      <div>
        <li id={id} className={this.classNames}>
          <div className={this.taskClassName}>
            <input
              className="toggle"
              type="checkbox"
              onChange={this.props.onToggleDone}
              checked={this.checked}
            ></input>
            <label>
              <span className="title">
                <button id="1" onClick={this.props.onToggleDone}>
                  {this.state.label}
                </button>
              </span>
              <span className="description">
                <button
                  className="icon icon-play"
                  onClick={this.onCreateTimer}
                ></button>
                <button
                  className="icon icon-pause"
                  onClick={this.onDeleteTimer}
                ></button>
                <span className={this.isTimeElapsed}>
                  {`${String(min).padStart(2, "0")}:
                  ${String(sec).padStart(2, "0")}`}
                </span>
              </span>
              <span className="description">{time}</span>
            </label>
            <button
              className="icon icon-edit"
              onClick={() => {
                // console.log("Мы редактируем элемент списка");
                // console.log(this.state.label);
                this.editing = true;
                this.props.onEdit(this.props.id, this.newValue);
              }}
            ></button>
            <button
              className="icon icon-destroy"
              onClick={this.props.onDeleted}
            ></button>
          </div>
        </li>
        <li className="editing">
          <div className={this.editClassName}>
            <form onSubmit={this.onSubmit}>
              <input
                id="edit"
                className="edit"
                type="text"
                onChange={this.onLabelChange}
                value={this.state.label}
                ref={(input) => input && input.focus()}
                autoFocus
              ></input>
            </form>
          </div>
        </li>
      </div>
    );
  }
}
