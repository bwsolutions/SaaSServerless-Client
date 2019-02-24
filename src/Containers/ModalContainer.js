import React, {PureComponent} from 'react'
import { connect } from 'react-redux'
import ReactModal from 'react-modal'

import {EnableUserModal } from '../_components/EnableUserModal';
import {DeleteItemModal } from '../_components/DeleteItemModal';

const ConfirmLogoutModal = require('../_components/ConfirmLogoutModal');

import { Debug } from "../_helpers/debug";
import {modalConstants} from "../_constants";
import {modalActions} from "../_actions";
var logit = new Debug("modalContainer");

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    },

};

const MODAL_COMPONENTS = {
    [modalConstants.DELETE_ITEM] : DeleteItemModal,
    [modalConstants.ENABLE_USER] : EnableUserModal,
    [modalConstants.CONFIRM_LOGOUT] : ConfirmLogoutModal
}

function mapStateToProps(state, ownProps) {
    logit.resetPrefix("mapStateToProps");
    logit.debug("state = ");
    logit.debug(state);
    return {
        ...state.modal
    };
}
const hideModal = () => {return modalActions.hideModal()};

class ModalContainer extends React.Component {
    constructor(props) {
        super(props);
        logit.resetPrefix("constructor");

        this.state = {
            modalIsOpen: false
        };
        this.closeModal = this.closeModal.bind(this)
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }
    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }
    closeModal() {
        logit.resetPrefix("closeModal");
        logit.debug("set isOpen to false");
        this.setState({modalIsOpen: false});
        this.props.dispatch(hideModal());
    }
    componentDidUpdate(prevProps, prevState) {
        logit.resetPrefix("componentDidUpdate");
        if (prevProps !== this.props) {
            //Perform some operation here
            logit.debug("set modalIsOpen to " + this.props.modalProps.open);
            this.setState({ modalIsOpen: this.props.modalProps.open });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        logit.resetPrefix("getDerivedStateFromProps");
        if (nextProps.modalType === null)
            return null;
        if (nextProps.modalProps.open !== prevState.modalIsOpen) {
            logit.debug("return modalIsOpen to " + nextProps.modalProps.open);
            return { modalIsOpen: nextProps.modalProps.open }
        }
        else return null;
    }


    temp() {

    }
    render() {
        logit.resetPrefix("render");

        if (!this.props.modalType) {
           return (<div className="hidden"></div> );
        }

        let {title, closeModal, message, deleteAction, deleteText, cancelText} = this.props.modalProps;

        const SpecificModal = MODAL_COMPONENTS[this.props.modalType];
        return (
            <div className="myModal">
                <ReactModal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Modal"
                    style={customStyles}
                >
                 <SpecificModal closeModal={this.closeModal} {...this.props.modalProps} />
                </ReactModal>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ModalContainer)