
import React from 'react';
import { connect } from 'formik';

/***
type Props = {
    onChange: Function,
    formik: Object,
};
*/
class Effect extends React.Component {
    componentWillReceiveProps(nextProps) {
        const { values, touched, errors, isSubmitting } = this.props.formik;
        const {
                  values: nextValues,
                  touched: nextTouched,
                  errors: nextErrors,
                  isSubmitting: nextIsSubmitting,
              } = nextProps.formik;
        if (nextProps.formik !== this.props.formik) {
            this.props.onChange(
                {
                    values,
                    touched,
                    errors,
                    isSubmitting,
                },
                {
                    values: nextValues,
                    touched: nextTouched,
                    errors: nextErrors,
                    isSubmitting: nextIsSubmitting,
                },
            );
        }
    }

    render() {
        return null;
    }
}

export default connect(Effect);