import styles from './ImageBackdrop.module.css';

const ImageBackdrop = props =>
  props.show ? (
    <div className={styles.backdrop} onClick={props.clicked}>
      {props.children}
    </div>
  ) : null;

export default ImageBackdrop;
