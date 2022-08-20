import React, { Component } from "react";

import "./newTaskForm.css";

export default class NewTaskForm extends Component {
  state = {
    label: "",
    min: "",
    sec: ""
  };

  onLabelChange = (event) => {
    // console.log("Вы вызвали функцию onLabelChange");
    // console.log(event.target.value);
    this.setState({ label: event.target.value });
  };

  onChangeTime = (event) => {
    const { value, name } = event.target;

    if (value.trim() && value <= 59 && value >= 0 && !Number.isNaN(value)) {
      this.setState({
        [name]: value
      });
    }
    if (!value.trim()) this.setState({ [name]: "" });
  };

  onSubmit = (event) => {
    const { label, min, sec } = this.state;
    event.preventDefault();
    this.props.onItemAdded(label, min, sec);
    this.setState({
      label: "",
      min: "",
      sec: ""
    });
  };

  render() {
    const { label, min, sec } = this.state;
    return (
      <form className="new-todo-form" onSubmit={this.onSubmit}>
        <input
          type="text"
          className="new-todo"
          placeholder="Task"
          onChange={this.onLabelChange}
          value={label}
          autoFocus
          required
        />
        <input
          className="new-todo-form__timer"
          placeholder="Min"
          name="min"
          value={min}
          onChange={this.onChangeTime}
          required
        />
        <input
          className="new-todo-form__timer"
          placeholder="Sec"
          name="sec"
          value={sec}
          onChange={this.onChangeTime}
          required
        />
        <input className="new-todo-form__submit" type="submit" />
      </form>
    );
  }
}
