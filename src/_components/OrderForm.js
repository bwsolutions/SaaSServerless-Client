import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {Formik, Field, Form, ErrorMessage, withFormik} from 'formik';
import Effect from "./Effect";
import ErrorAlert from "./ErrorAlert";

import {FormLabel, FormControl, FormGroup, Row, Col} from "react-bootstrap/lib";

import LoaderButton from "../_components/LoaderButton";

import { Debug } from "../_helpers/debug";
import {alertActions} from "../_actions";
var logit = new Debug("OrderForm");

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

class OrderForm extends React.Component {
    constructor(props) {
        super(props);
        logit.resetPrefix("constructor");

        const { products } = props
        var productMap = {};
        products.items.forEach(function(it) {productMap[it.productId] = it;});

        this.state = {
            productMap: productMap,
            isLoaded: false,  //  has data been loaded for the form?
            firstTime: true, // set default values
            backTo: props.backTo ? props.backTo : '/orders',
            formType: props.formType,
        }
        this.onProductChange = this.onProductChange.bind(this);
    }

    componentDidUpdate() {
        logit.resetPrefix("componentDidUpdate");

        var {history, products, setFieldValue} = this.props;
        var {productMap, isLoaded, firstTime } = this.state;
        logit.debug("productMap =");
        logit.debug(productMap);

        if (Object.keys(productMap).length === 0 && products.items.length > 0) {
            logit.log("update productMap");

            productMap = {};
            products.items.forEach(function(it) {productMap[it.productId] = it;});
            isLoaded = true;
            this.setState({productMap: productMap, isLoaded: isLoaded});
        } else if (isLoaded === false && Object.keys(productMap).length > 0) {
            isLoaded = true;
            this.setState({isLoaded: isLoaded});
        }

        const today = new Date();
        if (isLoaded && firstTime) {
            if (this.state.formType === "Add") {
                setFieldValue("productId", products.items[0].productId, false);
                setFieldValue("unitCost", products.items[0].unitCost, false);
                setFieldValue("dateOrdered", today.toLocaleString(), false);
            }
            this.setState({ firstTime: false});
        }

    }
    onProductChange(currentFormikState, nextFormikState) {
        logit.resetPrefix("onProductChange");

        const { setFieldValue } = this.props;
        const { productMap } = this.state;
        const { values, touched, errors, isSubmitting} = currentFormikState;
        const { values: nextValues,
                  touched: nextTouched,
                  errors: nextErrors,
                  isSubmitting: nextIsSubmitting} = nextFormikState;

        if (values.productId !== nextValues.productId && nextValues.productId === "") {
            logit.debug("nextValues ProductId is empty clear form..  ");
            setFieldValue("unitCost",0 , false);
            setFieldValue("totalCost",0 , false);
        } else if (values.productId !== nextValues.productId ) {
            logit.debug("setFieldValue for unitCost to = " + productMap[nextValues.productId].unitCost);
            var unitCost = productMap[nextValues.productId].unitCost;
            var totalCost = nextValues.quantity * unitCost;
            setFieldValue("unitCost",unitCost , false);
            setFieldValue("totalCost",totalCost , false);
        } else if (values.quantity !== nextValues.quantity) {
            var unitCost = productMap[nextValues.productId].unitCost;
            var totalCost = nextValues.quantity * unitCost;
            logit.debug("Quantity changed!!! setFieldValue for totalCost to = " + totalCost);
            setFieldValue("totalCost",totalCost , false);
        }
    }
    render() {
        logit.resetPrefix("render");

        let {  handleSubmit,
            products,
                handleChange,
                inputProps,
                isSubmitting,
                isValid,
                values,
                errors,
                touched,
                setFieldValue,
            } = this.props;

        let {backTo, formType } = this.state;
         var optionList = products.items.map(
            function(it,index) {
                return(<option key={"opt"+index} name={it.productId} value={it.productId}>{it.title}</option>)
            });

        optionList.unshift(<option key="blank" name="blank" value=""></option>);

        return (
            <div >
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="orderId" value={values.orderId} />

                    <Effect onChange={this.onProductChange} />
                    <label htmlFor="productId" className="control-label">Product  </label>
                    <Field component="select" name="productId" >
                        {optionList}
                    </Field>
                    {errors.productId && touched.productId && <ErrorAlert text="Must select a product!"/>}

                    <Field type="text" name="dateOrdered" label="Date Ordered"  {...inputProps} component={FieldComponentWithLabel}/>
                    <ErrorMessage name="dateOrdered" component="div"/>

                    <Field type="text" name="quantity" label="Quantity" {...inputProps}  component={FieldComponentWithLabel}/>
                    <ErrorMessage name="quantity" component="div"/>

                    <Field type="text" name="unitCost" label="Unit Cost" {...inputProps}  component={FieldComponentWithLabel}/>
                    <ErrorMessage name="unitCost" component="div"/>

                    <Field type="text" name="totalCost" label="Total Cost" {...inputProps} readOnly="readonly"  component={FieldComponentWithLabel}/>
                    <ErrorMessage name="totalCost" component="div"/>


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
    logit.resetPrefix("handleSubmitOF");

    logit.debug("values info = ");
    logit.debug(values);
    if (values.productId === "") {
        actions.setFieldError("productId","Must select a product");
    } else {
        var productMap = [];
        var products = actions.props.products.items;
        products.forEach(function(it) {productMap[it.productId] = it;});

        var dateOrdered = new Date(values.dateOrdered);

        const  order = {
            orderId: values.orderId,
            productId: values.productId,
            productSKU: productMap[values.productId].sku,
            productDescription: productMap[values.productId].title,
            dateOrdered: dateOrdered.toLocaleString(),
            quantity: values.quantity,
            totalCost: values.totalCost,
            unitCost: values.unitCost,
        };

        const onSubmit = actions.props.onSubmit;
        const formType = actions.props.formType;

        onSubmit(formType, order);
    }
    actions.setSubmitting(false);
}

const EnhancedOrderForm = withFormik( {
    mapPropsToValues: props => {
        if (props.values === undefined) {
            return {
                productId:   '',
                unitCost:    0,
                totalCost:   0,
                quantity:    0,
                dateOrdered: '',
            }
        } else {
            return props.values;
        }
    },
    handleSubmit: handleSubmitTF,
    displayName: "OrderForm"
})(OrderForm);

export {EnhancedOrderForm as OrderForm};