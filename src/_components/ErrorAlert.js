import React from 'react';
import {Alert} from "react-bootstrap/lib";

const ErrorAlert = ({text}) => {
        return (<Alert variant="danger">{text}</Alert>);
};

export default ErrorAlert