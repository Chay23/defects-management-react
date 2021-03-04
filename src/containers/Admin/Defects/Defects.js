import styles from './Defects.module.css';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../axios';
import trashIcon from '../../../assets/images/trash-solid.svg';
import Modal from '../../../components/Modal/Modal';
import Confirmation from '../../../components/Confirmation/Confirmation';

class Defects extends Component {
  state = {
    defects: [],
    id: undefined,
    showConfirmation: false,
    delete: false,
  };

  async componentDidMount() {
    await axios.get('/defects').then(response => {
      this.setState({ defects: response.data });
    });
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
    const updatedDefectsList = this.state.defects.filter(
      defect => defect.id !== this.state.id
    );
    await axios.delete('/defects/' + this.state.id).then(() => {
      this.setState({
        defects: updatedDefectsList,
        showConfirmation: false,
        id: undefined,
      });
    });
  };

  render() {
    const defectsList =
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
