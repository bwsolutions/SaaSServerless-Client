import { modalConstants } from '../_constants';

export const modalActions = {
    showModal,
    hideModal,
};

function showModal(modalProps, modalType) {
    return { type: modalConstants.SHOW_MODAL, modalProps, modalType};
}

function hideModal() {
    return { type: modalConstants.HIDE_MODAL };
}
