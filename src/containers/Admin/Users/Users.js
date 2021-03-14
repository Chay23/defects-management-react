import React, { Component } from 'react';
import axios from '../../../customAxios';
import styles from './Users.module.css';
import trashIcon from '../../../assets/images/trash-solid.svg';
import userIcon from '../../../assets/images/user.svg';
import editIcon from '../../../assets/images/edit.svg';
import Modal from '../../../components/Modal/Modal';
import Confirmation from '../../../components/Confirmation/Confirmation';
import UpdateUserForm from '../../UpdateUserForm/UpdateUserForm';
import Spinner from '../../../components/Spinner/Spinner';

class Users extends Component {
  state = {
    users: [],
    user: null,
    showConfirmation: false,
    action: null,
    editMode: false,
    loading: false,
    searchValue: '',
    filterStatus: undefined,
    filterRole: undefined,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    await axios.get('/users').then(response => {
      this.setState({
        users: response.data,
        loading: false,
      });
    }).catch(()=> {
      this.showMessage('error','Відсутнє з\'єднання');
      this.setState({loading: false})
    })
  }

  showMessage = (message, text = '') => {
    if (message === 'success') {
      localStorage.setItem('message', text);
      localStorage.setItem('style', ' alert alert-success');
    } else if (message === 'error') {
      localStorage.setItem('message', text || 'Сталась помилка');
      localStorage.setItem('style', ' alert alert-danger');
    }
  };

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

  handleConfirmationOpened = (user, action) => {
    this.setState({
      user: user,
      showConfirmation: true,
      action: action,
    });
  };

  handleConfirmationClosed = () => {
    this.setState({
      user: null,
      showConfirmation: false,
      action: null,
      editMode: false,
    });
  };

  handleDelete = async () => {
    const updatedUsersList = this.state.users.filter(
      user => user.id !== this.state.user.id
    );
    await axios
      .delete('/users/' + this.state.user.id)
      .then(() => {
        this.showMessage('success', 'Успішно видалено');
        this.setState({
          users: updatedUsersList,
          showConfirmation: false,
          user: null,
        });
      })
      .catch(() => {
        this.showMessage('error');
      });
    localStorage.clear();
  };

  handleStatus = async () => {
    await axios
      .post('/users/active/' + this.state.user.id)
      .then(response => {
        this.showMessage('success', 'Успішно змінено статус');
        this.setState({
          users: response.data,
          showConfirmation: false,
          user: null,
        });
      })
      .catch(() => {
        this.showMessage('error');
        this.setState({
          showConfirmation: false,
          user: null,
        });
      });
    localStorage.clear();
  };

  handleUpdateOpened = user => {
    this.setState({
      user: user,
      editMode: true,
    });
  };

  handleUpdateClosed = e => {
    e.preventDefault();
    this.setState({
      user: null,
      editMode: false,
    });
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
    await axios
      .put('/users/' + this.state.user.id, data)
      .then(response => {
        const updatedUsersList = this.state.users.map(user =>
          user.id === this.state.user.id ? (user = response.data) : user
        );
        this.showMessage('success', 'Успішно оновлено');
        this.setState({
          users: updatedUsersList,
          showConfirmation: false,
          editMode: false,
          user: null,
        });
      })
      .catch(() => {
        this.showMessage('error');
        this.setState({
          showConfirmation: false,
          editMode: false,
          user: null,
        });
      });
    localStorage.clear();
  };

  handleChangeSearchValue = e => {
    this.setState({ searchValue: e.target.value.toLocaleLowerCase() });
  };

  filterByName = () => {
    let usersList = null;
    usersList = this.state.users.filter(user =>
      (user.first_name + ' ' + user.last_name)
        .toLocaleLowerCase()
        .match(this.state.searchValue)
    );
    usersList = usersList.map(user => this.userConstructor(user));
    if (usersList.length === 0) {
      usersList = <p style={{ marginLeft: '10px' }}>Не знайдено</p>;
    }
    return usersList;
  };

  handleFilterByStatus = e => {
    const filterValue = e.target.value;
    switch (filterValue) {
      case 'true':
        this.setState({ filterStatus: true });
        break;
      case 'false':
        this.setState({ filterStatus: false });
        break;
      default:
        this.setState({ filterStatus: undefined });
        break;
    }
  };

  filterByStatus = () => {
    let usersList = null;
    usersList = this.state.users.filter(
      user => user.is_active === this.state.filterStatus
    );
    usersList = usersList.map(user => this.userConstructor(user));
    if (usersList.length === 0) {
      usersList = <p style={{ marginLeft: '10px' }}>Не знайдено</p>;
    }
    return usersList;
  };

  handleFilterByRole = e => {
    const filterValue = e.target.value;
    switch (filterValue) {
      case 'Не визначено':
        this.setState({ filterRole: filterValue });
        break;
      case 'Технічний працівник':
        this.setState({ filterRole: filterValue });
        break;
      case 'Санітарний працівник':
        this.setState({ filterRole: filterValue });
        break;
      default:
        this.setState({ filterRole: undefined });
        break;
    }
  };

  filterByRole = () => {
    let usersList = null;
    usersList = this.state.users.filter(
      user => user.role === this.state.filterRole
    );
    usersList = usersList.map(user => this.userConstructor(user));
    if (usersList.length === 0) {
      usersList = <p style={{ marginLeft: '10px' }}>Не знайдено</p>;
    }
    return usersList;
  };

  userConstructor = user => {
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
              this.handleConfirmationOpened(user, this.handleStatus)
            }
            title='Активувати/деактивувати'
            alt='Активувати/деактивувати'
          />
          <img
            src={editIcon}
            onClick={() => this.handleUpdateOpened(user)}
            title='Редагувати'
            alt='Редагувати'
          />
          <img
            src={trashIcon}
            onClick={() =>
              this.handleConfirmationOpened(user, this.handleDelete)
            }
            title='Видалити'
            alt='Видалити'
          />
        </div>
      </div>
    );
  };

  render() {
    const message = localStorage.message ? (
      <div className={styles.customAlert + localStorage.style}>
        {localStorage.message}
      </div>
    ) : null;
    let usersList = null;
    if (this.state.searchValue) {
      usersList = this.filterByName(this.state.users);
    } else if (this.state.filterStatus !== undefined) {
      usersList = this.filterByStatus(this.state.users);
    } else if (this.state.filterRole !== undefined) {
      usersList = this.filterByRole(this.state.users);
    } else {
      usersList =
        this.state.users.length !== 0 ? (
          this.state.users.map(user => this.userConstructor(user))
        ) : (
          <p style={{ marginLeft: '10px' }}>Список порожній</p>
        );
    }

    if (this.state.loading) {
      usersList = <Spinner />;
    }

    let innerContent = null;
    if (this.state.showConfirmation) {
      innerContent = (
        <Confirmation
          title='Підтвердити дію?'
          onAgree={this.state.action}
          onCancel={this.handleConfirmationClosed}
        />
      );
    } else if (this.state.editMode) {
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
          show={this.state.showConfirmation || this.state.editMode}
          modalClosed={this.handleConfirmationClosed}
        >
          {innerContent}
        </Modal>
        <div className={styles.usersList}>
          {message}
          <div className={styles.helperBlock}>
            <h2>Користувачі</h2>
            <div className={styles.searchBlock}>
              Пошук
              <input
                type='text'
                onChange={this.handleChangeSearchValue}
                placeholder='Ім&#39;я та прізвище'
              />
            </div>
            <div className={styles.filterOne}>
              <span>Фільтр по статусу</span>
              <select onChange={this.handleFilterByStatus}>
                <option value='undefined'>Фільтр відсутній</option>
                <option value='true'>Активний</option>
                <option value='false'>Неактивний</option>
              </select>
            </div>
            <div className={styles.filterTwo}>
              <span>Фільтр по посаді</span>
              <select onChange={this.handleFilterByRole}>
                <option value='undefined'>Фільтр відсутній</option>
                <option value='Не визначено'>Не визначено</option>
                <option value='Технічний працівник'>Технічний працівник</option>
                <option value='Санітарний працівник'>
                  Санітарний працівник
                </option>
              </select>
            </div>
          </div>
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
