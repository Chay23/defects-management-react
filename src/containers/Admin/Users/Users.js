import React, { Component } from 'react';
import axios from '../../../axios';
import styles from './Users.module.css';
import trashIcon from '../../../assets/images/trash-solid.svg';
import userIcon from '../../../assets/images/user.svg';
import editIcon from '../../../assets/images/edit.svg';
import Modal from '../../../components/Modal/Modal';
import Confirmation from '../../../components/Confirmation/Confirmation';
import UpdateUserForm from '../../UpdateUserForm/UpdateUserForm';

class Users extends Component {
  state = {
    users: [],
    user: null,
    id: undefined,
    showConfirmation: false,
    action: null,
    editMode: false,
  };

  async componentDidMount() {
    await axios.get('/users').then(response => {
      this.setState({ users: response.data });
    });
  }

  handleUserStatusColor = status => {
    return status ? (
      <p
        className={styles.status}
        style={{ backgroundColor: 'rgb(7, 207, 0)' }}
      >
        Активний
      </p>
    ) : (
      <p className={styles.status} style={{ backgroundColor: 'red' }}>
        Неактивний
      </p>
    );
  };

  handleConfirmationOpened = (id, action) => {
    this.setState({
      id: id,
      showConfirmation: true,
      action: action,
    });
  };

  handleConfirmationClosed = () => {
    this.setState({
      id: undefined,
      showConfirmation: false,
      action: null,
      editMode: false,
    });
  };

  handleDelete = async () => {
    const updatedUsersList = this.state.users.filter(
      user => user.id !== this.state.id
    );
    await axios.delete('/users/' + this.state.id).then(() => {
      this.setState({
        users: updatedUsersList,
        showConfirmation: false,
        id: undefined,
      });
    });
  };

  handleActivation = async () => {
    await axios.post('/users/active/' + this.state.id).then(response => {
      this.setState({
        users: response.data,
        showConfirmation: false,
        id: undefined,
      });
    });
  };

  handleUpdateClosed = e => {
    e.preventDefault();
  };

  handleRole = role => {
    switch (role) {
      case 'Не визначено':
        return 'not_specified';
      case 'Технічний працівник':
        return 'technical_worker';
      case 'Санітарний працівник':
        return 'sanitary_worker';
      default:
        return 'not_specified';
    }
  };

  handleUpdate = async (e, data) => {
    e.preventDefault();
    data.role = this.handleRole(data.role);
    data.is_active = Boolean(data.is_active);
    await axios.put('/users/' + this.state.id, data).then(response => {
      const updatedUsersList = this.state.users.map(user =>
        user.id === this.state.id ? (user = response.data) : user
      );
      this.setState({
        users: updatedUsersList,
        showConfirmation: false,
        editMode: false,
        id: undefined,
      });
    });
  };

  render() {
    const usersList =
      this.state.users.length !== 0 ? (
        this.state.users.map(user => {
          const status = this.handleUserStatusColor(user.is_active);
          return (
            <div key={user.telegram_id} className={styles.userBlock}>
              <p>{user.first_name + ' ' + user.last_name}</p>
              <p>{user.telegram_id}</p>
              <p>{user.role}</p>
              {status}
              <div>
                <img
                  src={userIcon}
                  onClick={() =>
                    this.handleConfirmationOpened(
                      user.id,
                      this.handleActivation
                    )
                  }
                  title='Активувати/деактивувати'
                  alt='Активувати/деактивувати'
                />
                <img
                  src={editIcon}
                  onClick={() => {
                    this.setState({
                      user: user,
                      editMode: true,
                    });
                    return this.handleConfirmationOpened(
                      user.id,
                      this.handleUpdate
                    );
                  }}
                  title='Редагувати'
                  alt='Редагувати'
                />
                <img
                  src={trashIcon}
                  onClick={() =>
                    this.handleConfirmationOpened(user.id, this.handleDelete)
                  }
                  title='Видалити'
                  alt='Видалити'
                />
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ marginLeft: '10px' }}>Список порожній</p>
      );

    let innerContent = null;
    if (this.state.showConfirmation) {
      innerContent = (
        <Confirmation
          title='Підтвердити дію?'
          onAgree={this.state.action}
          onCancel={this.handleConfirmationClosed}
        />
      );
    }
    if (this.state.editMode) {
      innerContent = (
        <UpdateUserForm
          user={this.state.user}
          onUpdate={this.handleUpdate}
          onCancel={this.handleUpdateClosed}
        />
      );
    }

    return (
      <>
        <Modal
          show={this.state.showConfirmation}
          modalClosed={this.handleConfirmationClosed}
        >
          {innerContent}
        </Modal>
        <div className={styles.usersList}>
          <h2>Користувачі</h2>
          <div className={styles.titles}>
            <p>Повне ім'я</p>
            <p>Телеграм ID</p>
            <p>Посада</p>
            <p>Статус</p>
            <p>Дії</p>
          </div>
          {usersList}
        </div>
      </>
    );
  }
}

export default Users;
