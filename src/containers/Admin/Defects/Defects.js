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

  render() {
    const message = localStorage.message ? (
      <div className={styles.customAlert + localStorage.style}>
        {localStorage.message}
      </div>
    ) : null;
    let defectsList =
      this.state.defects.length !== 0 ? (
        this.state.defects.map(defect => {
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
        })
      ) : (
        <p style={{ marginLeft: '10px' }}>Список порожній</p>
      );

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
          <h2>Дефекти</h2>
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
