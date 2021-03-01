const Confirmation = (props) => (
    <>
        <h3 style={{marginBottom: '30px'}}>{props.title}</h3>
        <button className='btn btn-danger' onClick={props.onAgree} style={{marginRight: '10px'}}>Так</button>
        <button className='btn btn-primary' onClick={props.onCancel}>Ні</button>
    </>
);

export default Confirmation;