import React from 'react';
import cls from './Spinner.module.scss'
import {ISpinnerProps} from "../../types";

const Spinner = ({ top, left }: ISpinnerProps) => {
    return (
        <div
            style={{ top: `${top}px`, left: `${left}px`}}
            className={`spinner-border ${cls.main}`}
            role='status'
        />
    );
};

export default Spinner;