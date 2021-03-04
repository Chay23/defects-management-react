import { Component } from 'react';
import styles from './UpdateUserForm.module.css';

class UpdateUserForm extends Component {
  state = {
    first_name: this.props.user.first_name,
    last_name: this.props.user.last_name,
    username: this.props.user.username,
    role: this.props.user.role,
    is_active: this.props.user.is_active,
  };

  handleFormChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFormBooleanChange = e => {
    let value;
    if (e.target.value === 'true') {
      value = true;
    } else {
      value = false;
    }
    this.setState({ is_active: value });
  };

  render() {
    return (
      <form className={styles.updateForm}>
        <p>Ім'я</p>
        <input
          type='text'
          value={this.state.first_name}
          name='first_name'
          onChange={this.handleFormChange}
        ></input>
        <p>Прізвище</p>
        <input
          type='text'
          value={this.state.last_name}
          name='last_name'
          onChange={this.handleFormChange}
        ></input>
        <p>Посада</p>
        <select name='role' onChange={this.handleFormChange}>
          <option defaultValue={this.state.role} value={this.state.role}>
            {this.state.role}
          </option>
          <option value='Не визначено'>Не визначено</option>
          <option value='Технічний працівник'>Технічний працівник</option>
          <option value='Санітарний працівник'>Санітарний працівник</option>
        </select>
        <p>Статус</p>
        <select name='is_active' onChange={this.handleFormBooleanChange}>
          <option
            defaultValue={this.state.is_active}
            value={this.state.is_active}
          >
            {this.state.is_active ? 'Активний' : 'Неактивний'}
          </option>
          <option value='true'>Активний</option>
          <option value='false'>Неактивний</option>
        </select>
        <br />
        <button
          className='btn btn-danger'
          onClick={e => this.props.onUpdate(e, this.state)}
        >
          Редагувати
        </button>
        <button className='btn btn-primary' onClick={this.props.onCancel}>
          Скасувати
        </button>
      </form>
    );
  }
}

export default UpdateUserForm;
