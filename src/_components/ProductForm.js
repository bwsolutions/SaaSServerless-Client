import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {Formik, Field, Form, ErrorMessage, withFormik} from 'formik';

import {FormLabel, FormControl, FormGroup, Row, Col} from "react-bootstrap/lib";

import LoaderButton from "../_components/LoaderButton";

import { Debug } from "../_helpers/debug";

var logit = new Debug("ProductForm");

const FieldComponentWithLabel = ({
    field,
    form: {values, errors},
    ...props
}) => (
    <div className="form-group">
        <label htmlFor={field.name} className="control-label">{props.label} </label>
        <input type={props.type} id={field.name} className="form-control"
            value={field.value}
            onChange={field.onChange}
            {...props}
        />
    </div>
);

class ProductForm extends React.Component {
    constructor(props) {
        super(props);
        logit.resetPrefix("constructor");
        logit.debug("props =");
        logit.debug(props);

        this.state = {
            backTo: props.backTo ? props.backTo : '/products',
            formType: props.formType,
        }
     }

    componentDidUpdate() {
        logit.resetPrefix("componentDidUpdate");
        var {history, aProduct} = this.props;
    }
    render() {
        logit.resetPrefix("render");

        let {  handleSubmit,
            aProduct,
                inputProps,
                isSubmitting,
                isValid,
                values,
            } = this.props;

        let {backTo, formType } = this.state;

        return (
            <div >
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="productId" value={values.productId} />

                    <Field type="text" name="sku" label="SKU" {...inputProps} component={FieldComponentWithLabel}/>
                    <ErrorMessage name="sku" component="div"/>

                    <Field type="text" name="title" label="Title"  {...inputProps} component={FieldComponentWithLabel}/>
                    <ErrorMessage name="title" component="div"/>

                    <Field type="text" name="description" label="Description" {...inputProps}  component={FieldComponentWithLabel}/>
                    <ErrorMessage name="description" component="div"/>

                    <Field type="text" name="condition" label="Condition"  {...inputProps} component={FieldComponentWithLabel}/>
                    <ErrorMessage name="description" component="div"/>

                    <Field type="text" name="conditionDescription" label="Condition Description" {...inputProps}  component={FieldComponentWithLabel}/>
                    <ErrorMessage name="conditionDescription" component="div"/>

                    <Field type="text" name="numberInStock" label="Number In Stock" {...inputProps}  component={FieldComponentWithLabel}/>
                    <ErrorMessage name="numberInStock" component="div"/>

                    <Field type="text" name="unitCost" label="Unit Cost" {...inputProps}  component={FieldComponentWithLabel}/>
                    <ErrorMessage name="unitCost" component="div"/>

                    <div className="form-group mt-3">
                        {this.state.formType !== "View" && <LoaderButton
                                disabled={!isValid}
                                type="submit"
                                isLoading={isSubmitting}
                                text={formType == "Add" ? formType : "Update"}
                                loadingText="Updating.…"
                            />
                        }
                        <Link to={backTo} className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }

}

function handleSubmitTF(values, actions) {
    logit.resetPrefix("handleSubmitPF");

    const  product = {
        productId: values.productId,
        sku: values.sku,
        title: values.title,
        description: values.description,
        condition: values.condition,
        conditionDescription: values.conditionDescription,
        numberInStock: values.numberInStock,
        unitCost: values.unitCost,
    };
    logit.debug("product info = ");
    logit.debug(product);

    const  onSubmit  = actions.props.onSubmit;
    const formType = actions.props.formType;

    onSubmit(formType,product);

    actions.setSubmitting(false);
}


const EnhancedProductForm = withFormik( {
    mapPropsToValues: props => { return props.values;},
    handleSubmit: handleSubmitTF,
    displayName: "ProductForm"
})(ProductForm);


export {EnhancedProductForm as ProductForm};