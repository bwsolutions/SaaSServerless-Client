import React from 'react'
import {modalActions} from '../_actions';

const enableUser = (props) => {
    return modalActions.showMessage(props, modalConstants.ENABLE_USER);
}
const hideModal = () => {return modalActions.hideModal()};

export const EnableUserModal = ({ closeModal, enableAction, title, message, cancelText, enableText }) => {
    return (
        <div className="modal-content">
            <div className="modal-header">
                <h5
                    className="modal-title"
                >{title}</h5>
                <button type="button" className="close" aria-label="Close" onClick={closeModal}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <p>{message}</p>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>{cancelText || 'Cancel'}</button>
                <button type="button" className="btn btn-danger" onClick={enableAction}>{enableText || 'Continue'}</button>
            </div>
        </div>
    )
}

//export  EnableUserModal