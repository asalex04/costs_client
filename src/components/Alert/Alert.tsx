import React from 'react';
import {IAlertProps} from "../../types";
import cls from './Alert.module.scss'


const Alert = ({ props }: IAlertProps) => {
    return (
        <div className={`${cls.wrapper} alert alert-${props.alertStatus}`}>
            {props.alertText}
        </div>
    );
};

export default Alert;