import React, {MutableRefObject, useRef, useState} from 'react';
import cl from 'classnames'
import cls from './CostItem.module.scss'
import {ICost} from "../../../types";
import {getAuthDataFromLS, handleAlertMessage} from "../../../utils/auth";
import {deleteCostFx, updateCostFx} from "../../../api/costsClient";
import {removeCost, updateCost} from "../../../context";
import {formatDate} from "../../../utils/arrayUtils";
import {validationInputs} from "../../../utils/validation";

export interface ICostItemProps {
    cost: ICost
    index: number
}

const CostItem = ({cost, index}: ICostItemProps) => {
    const [edit, setEdit] = useState(false)
    const [newCost, setNewCost] = useState(cost)
    const [isLoading, setIsLoading] = useState(false)
    const textRef = useRef() as MutableRefObject<HTMLInputElement>
    const dateRef = useRef() as MutableRefObject<HTMLInputElement>
    const priceRef = useRef() as MutableRefObject<HTMLInputElement>

    const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCost({...newCost, text: e.target.value})
    }
    const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCost({...newCost, date: e.target.value})
    }
    const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCost({...newCost, price: +e.target.value})
    }

    const deleteCost = async () => {
        const authData = getAuthDataFromLS()
        await deleteCostFx({
            url: '/costs',
            token: authData.access_token,
            id: cost._id as string
        })
        removeCost(cost._id as string)
        handleAlertMessage({alertText: 'Успешно удалено', alertStatus: 'success'})
    }

    const handleEditCost = async () => {
        setIsLoading(true)
        if (newCost.text === cost.text && newCost.date === cost.date && +newCost.price === +cost.price){
            setIsLoading(false)
            setEdit(false)
            return
        }
        if (!validationInputs(textRef, priceRef, dateRef)) return setIsLoading(false)
        setEdit(false)

        const authData = getAuthDataFromLS()
        const updatedCost = await updateCostFx({
            url: '/costs',
            token: authData.access_token,
            cost: {text: newCost.text, date: newCost.date, price: +newCost.price},
            id: cost._id as string
        })
        if (!updatedCost) return setIsLoading(false)

        setIsLoading(false)
        updateCost(updatedCost)
        handleAlertMessage({alertText: 'Успешно обновлено', alertStatus: 'success'})
    }

    return (
        <li
            className={cl('d-flex align-items-center justify-content-between', cls.costItem)}
            id={cost._id as string}
        >
            <div className={cls.costItemLeft}>
                <span>{index}.</span>
                <span>Магазин</span>
                {edit
                    ? <input
                        type={'text'}
                        ref={textRef}
                        value={newCost.text}
                        onChange={handleChangeText}
                        className={cl('form-control', cls.shopInput)}
                    />
                    : <span>"{cost.text}"</span>
                }
                {edit
                    ? <input
                        type={'date'}
                        ref={dateRef}
                        onChange={handleChangeDate}
                        value={new Date(newCost.date).toISOString().split('T')[0]}
                        className={cl('form-control', cls.dateInput)}
                    />
                    : <span>Дата {formatDate(cost.date as string)}</span>
                }
            </div>
            <div className={cl(cls.costItemRight, 'd-flex align-items-center')}>
                {edit
                    ? <input
                        type={'number'}
                        ref={priceRef}
                        value={newCost.price}
                        onChange={handleChangePrice}
                        className={cl('form-control', cls.priceInput)}
                    />
                    : <span>Сумма {cost.price}</span>
                }
                {edit
                    ? <div className={cls.btnBlock}>
                        <button
                            onClick={handleEditCost}
                            className={cl('btn btn-success', cls.btnSave)}
                        >
                            Сохранить
                        </button>
                        <button
                            className={cl('btn btn-danger', cls.btnCancel)}
                            onClick={() => setEdit(false)}
                        >
                            Отмена
                        </button>
                    </div>
                    : <button
                        className={cl('btn btn-primary', cls.btnEdit)}
                        onClick={() => setEdit(true)}
                    >Изменить</button>
                }
                <button className={cl('btn btn-danger', cls.btnDelete)} onClick={deleteCost}>
                    <span>&times;</span>
                </button>
            </div>
        </li>
    );
};

export default CostItem;