import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import cls from "./Header.module.scss";
import Spinner from "../../Spinner/Spinner";
import {ICostsHeaderProps} from "../../../types";
import {countTotalPrice} from "../../../utils/arrayUtils";
import {useStore} from "effector-react";
import {$totalPrice, createCost} from "../../../context";
import {validationInputs} from "../../../utils/validation";
import {getAuthDataFromLS, handleAlertMessage} from "../../../utils/auth";
import {createCostFx} from "../../../api/costsClient";

const Header = ({ costs }: ICostsHeaderProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const textRef = useRef() as MutableRefObject<HTMLInputElement>
    const priceRef = useRef() as MutableRefObject<HTMLInputElement>
    const dateRef = useRef() as MutableRefObject<HTMLInputElement>
    const totalPrice = useStore($totalPrice)

    useEffect(() => {
            countTotalPrice(costs)
        }, [costs])

    const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        const textInputValue = textRef.current.value
        const priceInputValue = priceRef.current.value
        const dateInputValue = dateRef.current.value

        if (!validationInputs(textRef, priceRef, dateRef)) {
            setIsLoading(false)
            return
        }
        const authDate = getAuthDataFromLS()
        const cost = await createCostFx({
            url: '/costs',
            cost: {
                text: textInputValue,
                price: parseInt(priceInputValue),
                date: dateInputValue
            },
            token: authDate.access_token,
        })
        if (!cost) {
            setIsLoading(false)
            return
        }
        setIsLoading(false)
        createCost(cost)
        handleAlertMessage({alertText: 'Успешно создано', alertStatus: 'success'})
    }

    return (
        <>
            <h2 className={cls.header}>Учет моих расходов</h2>
            <div className='container'>
                <form className={`d-flex mb-3 ${cls.form}`} onSubmit={formSubmit}>
                    <div className={cls.item}>
                        <span className='mb-3'>Куда было потрачено:</span>
                        <input ref={textRef} type='text' className='form-control'/>
                    </div>
                    <div className={cls.item}>
                        <span className='mb-3'>Сколько было потрачено:</span>
                        <input ref={priceRef} type='number' className='form-control'/>
                    </div>
                    <div className={cls.item}>
                        <span className='mb-3'>Когда было потрачено:</span>
                        <input ref={dateRef} type='date' className='form-control' placeholder='дд.мм.гг'/>
                    </div>
                    <button className={`btn btn-primary ${cls.btn}`}>
                        {isLoading ? <Spinner top={5} left={20}/> : 'Добавить'}
                    </button>
                    <div className={cls.price}>
                        Итого:
                        <span>{isNaN(totalPrice) ? 0 : parseInt(String(totalPrice))}</span>
                        р.
                    </div>
                </form>
            </div>
        </>
    );
};

export default Header;