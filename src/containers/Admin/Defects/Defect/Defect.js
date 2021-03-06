import styles from './Defect.module.css';
import React, { Component } from 'react';
import axios from '../../../../customAxios';

import Modal from '../../../../components/Modal/Modal';
import Confirmation from '../../../../components/Confirmation/Confirmation';
import ImageBackdrop from '../../../../components/ImageBackdrop/ImageBackdrop';

import closeIcon from '../../../../assets/images/close.svg';

class Defect extends Component {
  state = {
    defect: [],
    photoName: '',
    decodedImage: null,
    showConfirmation: false,
    imageView: false,
  };

  componentDidMount = async () => {
    await axios
      .get('/defects/' + this.props.match.params.defectId)
      .then(response => {
        this.setState({ defect: response.data });
        this.setState({ photoName: response.data.attachment });
      });
    await axios.get('/defects/image/' + this.state.photoName).then(response => {
      this.decodeImage(response.data.image_encode);
    });
  };

  decodeImage = encodedImage => {
    let decodedImage = encodedImage.substring(2, encodedImage.length - 1);
    this.setState({ decodedImage: decodedImage });
  };

  handleConfirmationOpened = () => {
    this.setState({ showConfirmation: true });
  };

  handleConfirmationClosed = () => {
    this.setState({ showConfirmation: false });
  };

  handleDelete = async () => {
    await axios.delete('/defects/' + this.props.match.params.defectId);
    this.setState({ showConfirmation: false });
    this.props.history.push('/admin/defects');
  };

  handleImageOpened = () => {
    console.log('AAAAA');
    this.setState({ imageView: true });
  };

  handleImageClosed = () => {
    this.setState({ imageView: false });
  };

  render() {
    const statusColor = this.props.getStatusColor(this.state.defect.info);
    const defect = (
      <div className={styles.defectBlock}>
        <div className={styles.defectHeader}>
          <h3>{this.state.defect.title}</h3>
          <div className={styles.status} style={statusColor}>
            {this.state.defect.info}
          </div>
        </div>
        <p>Опис: {this.state.defect.description}</p>
        <p>Кімната: {this.state.defect.room}</p>
        <p>Фото:</p>
        <img
          alt='defect'
          src={`data:image/jpeg;base64,${this.state.decodedImage}`}
          onClick={this.handleImageOpened}
        />
        <br />
        <button
          className='btn btn-danger'
          onClick={this.handleConfirmationOpened}
        >
          Видалити
        </button>
      </div>
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
        <ImageBackdrop
          show={this.state.imageView}
          clicked={this.handleImageClosed}
        >
          <div className={styles.biggerPhotoBlock}>
            <img
              alt='defect'
              src={`data:image/jpeg;base64,${this.state.decodedImage}`}
            />
            <span className={styles.closeBlock}>
              <img src={closeIcon} title='Закрити' alt='Закрити'></img>
            </span>
          </div>
        </ImageBackdrop>
        <div>
          <h2>Дефект</h2>
          {defect}
        </div>
      </>
    );
  }
}

export default Defect;
