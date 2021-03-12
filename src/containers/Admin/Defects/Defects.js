import styles from './Defects.module.css';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../customAxios';
import trashIcon from '../../../assets/images/trash-solid.svg';
import Modal from '../../../components/Modal/Modal';
import Confirmation from '../../../components/Confirmation/Confirmation';
import Spinner from '../../../components/Spinner/Spinner';

class Defects extends Component {
  state = {
    defects: [],
    id: undefined,
    showConfirmation: false,
    delete: false,
    showMessage: false,
    loading: false,
    filterStatus: undefined,
  };

  async componentDidMount() {
    localStorage.clear();
    this.setState({ loading: true });
    await axios.get('/defects').then(response => {
      this.setState({
        defects: response.data,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    localStorage.clear();
  }

  handleConfirmationOpened = id => {
    this.setState({
      showConfirmation: true,
      id: id,
    });
  };

  handleConfirmationClosed = () => {
    this.setState({
      showConfirmation: false,
      id: undefined,
    });
  };

  handleDelete = async () => {
    localStorage.clear();
    const updatedDefectsList = this.state.defects.filter(
      defect => defect.id !== this.state.id
    );
    await axios
      .delete('/defects/' + this.state.id)
      .then(() => {
        localStorage.setItem('message', 'Успішно видалено');
        localStorage.setItem('style', ' alert alert-success');
        this.setState({
          defects: updatedDefectsList,
          showConfirmation: false,
          id: undefined,
        });
      })
      .catch(() => {
        localStorage.setItem('message', 'Сталась помилка');
        localStorage.setItem('style', ' alert alert-danger');
        this.setState({
          showConfirmation: false,
          id: undefined,
        });
      });
  };

  handleFilterByStatus = e => {
    const filterValue = e.target.value;
    switch (filterValue) {
      case 'open':
        this.setState({ filterStatus: 'Відкрито' });
        break;
      case 'in_process':
        this.setState({ filterStatus: 'В процесі' });
        break;
      case 'closed':
        this.setState({ filterStatus: 'Закрито' });
        break;
      default:
        this.setState({ filterStatus: undefined });
        break;
    }
  };

  filterByStatus = () => {
    let defectsList = null;
    defectsList = this.state.defects.filter(
      defect => defect.info === this.state.filterStatus
    );
    defectsList = defectsList.map(defect => this.defectConstructor(defect));
    if (defectsList.length === 0) {
      defectsList = <p style={{ marginLeft: '10px' }}>Не знайдено</p>;
    }
    return defectsList;
  };

  defectConstructor = defect => {
    const statusColor = this.props.getStatusColor(defect.info);
    return (
      <div key={defect.id} className={styles.defectBlock}>
        <Link to={this.props.match.url + '/' + defect.id}>
          <p>{defect.title}</p>
        </Link>
        <p>{defect.description}</p>
        <p>{defect.room}</p>
        <p className={styles.status} style={statusColor}>
          {defect.info}
        </p>
        <div className={styles.actionsBlock}>
          <img
            src={trashIcon}
            onClick={() => this.handleConfirmationOpened(defect.id)}
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
    let defectsList = null;
    if (this.state.filterStatus) {
      defectsList = this.filterByStatus();
    } else {
      defectsList =
        this.state.defects.length !== 0 ? (
          this.state.defects.map(defect => this.defectConstructor(defect))
        ) : (
          <p style={{ marginLeft: '10px' }}>Список порожній</p>
        );
    }
    if (this.state.loading) {
      defectsList = <Spinner />;
    }
    return (
      <>
        <Modal
          show={this.state.showConfirmation}
          modalClosed={this.handleConfirmationClosed}
        >
          <Confirmation
            title='Підтвердити дію'
            onAgree={this.handleDelete}
            onCancel={this.handleConfirmationClosed}
          ></Confirmation>
        </Modal>
        <div className={styles.defectsList}>
          {message}
          <div className={styles.helperBlock}>
            <h2>Дефекти</h2>
            <div className={styles.filterOne}>
            <span>Фільтр по статусу</span>
            <select onChange={this.handleFilterByStatus}>
              <option value='undefined'>Фільтр відсутній</option>
              <option value='open'>Відкрито</option>
              <option value='in_process'>В процесі</option>
              <option value='closed'>Закрито</option>
            </select>
            </div>
          </div>
          <div className={styles.titles}>
            <p>Назва</p>
            <p>Опис</p>
            <p>Кімната</p>
            <p>Статус</p>
            <p>Дії</p>
          </div>
          {defectsList}
        </div>
      </>
    );
  }
}

export default Defects;
