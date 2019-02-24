import * as React from 'react';
import Cell from './Cell';
// import EventHandler from '@shopify/polaris';
import {FormLabel, FormControl, FormGroup} from "react-bootstrap";

/******
 * data         - array or objects  defining key value pair of data to display
 * rules        - array of rules on how to display fields on form
 * title        -  (title) for table
 * editable     - flag if form is editable
 * deletefn       - function to call on delete (if no function no button will be displayed)
 * create       - flag this is create form (if set editable & delete are ignored)
 * submit       - function to call on form submit
 *
 *
 */
export default class ReadEditForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            formRef:  props.formName ? props.formName : React.createRef()
        };

    }

    renderControl = (rule) => {
        const {data} = this.props;
        var { name, type, onChange, label, groupProps, controlProps } = rule;
        type = type ? type : 'text';
        onChange = onChange ? onChange : this.handleChange;
        label = label ? label : name;
        groupProps = groupProps ? groupProps : '';
        controlProps = controlProps ? controlProps : '';
        var value = data[name];

        var control = {};
        switch (type) {
            case 'select':
                var options = rule.options.map(
                                (opt) => {return(<option value={opt.value} {(opt.value == value) ? 'selected' : ''}>
                                    {opt.label ? opt.label : opt.value}
                                    </option>
                                )}
                );
                return (
                   <FormControl
                        {controlProps}
                        onChange={onChange}
                        componentClass={type} >
                       {options}
                   </FormControl>
                );
                break;

            case 'radio':
                return (rule.radio.map(
                            (opt) => { return(<Radio name={name} {controlProps}{(value == opt.value) ? 'checked' : ''}>
                                {opt.value}
                                </Radio>
                            )}
                        )
                );
                break;

            case 'checkbox':
                return (rule.checkbox.map(
                        (opt) => { return(<Checkbox  name={name} {controlProps}{(value == opt.value) ? 'checked' : ''}>
                                {opt.value}
                            </Checkbox >
                        )}
                    )
                );
                break;

            case 'text':
            case 'email':
            case 'file':
            case 'password':
            case 'textArea':
            default:
                return (
                    <FormControl
                        {controlProps}
                        value={value}
                        onChange={onChange}
                        type={type}
                    />
                );
                break;
        }
    }

    renderFormGroup = (rule) => {
        const {data} = this.props;
       // const {cellHeights} = this.state;

        var { name, label, groupProps, help } = rule;
        label = label ? label : name;
        groupProps = groupProps ? groupProps : '';
        if (data[name] === undefined) {
            return '';
        }
        var control =  this.renderControl(rule);

        return (
            <FormGroup controlId={name} {groupProps} >
                <FormLabel>{label}</FormLabel>
                {control}
                {help && <HelpBlock>{help}</HelpBlock>}
            </FormGroup>
        );
    };

    render() {
        const {data, rules, deletefn, editable, create, submit, title} = this.props;

        this.renderFormGroup = this.renderFormGroup.bind(this);
        this.renderControl = this.renderControl.bind(this);

        const formGroups = rules.map(this.renderFormGroup);

        return (
            <div className="ReadEditForm">
                <h3>{title}</h3>
                <form name={this.state.formRef} onSubmit={submit}>
                    {formGroups}
                </form>
            </div>
        );
    }
}