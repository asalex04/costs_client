import {MutableRefObject} from "react";
import {handleAlertMessage} from "./auth";

export const validationInputs = (
    textInput: MutableRefObject<HTMLInputElement>,
    priceInput: MutableRefObject<HTMLInputElement>,
    dateInput: MutableRefObject<HTMLInputElement>,
) => {
    const textInputValue = textInput.current.value
    const priceInputValue = priceInput.current.value
    const dateInputValue = dateInput.current.value

    const inputs = [textInput.current, dateInput.current, priceInput.current]

    const addDangerBorder = () =>
        inputs.forEach(input => input.value.length
            ? input.classList.remove('border-danger')
            : input.classList.add('border-danger')
        )
    if (!textInputValue || !priceInputValue || !dateInputValue) {
        handleAlertMessage({alertText: 'Заполните все поля', alertStatus: 'warning'})
        addDangerBorder()
        return false
    }
    if (isNaN(+priceInputValue)) {
        handleAlertMessage({alertText: 'Введите число', alertStatus: 'warning'})
        addDangerBorder()

        priceInput.current.classList.add('border-danger')
        return false
    }
    textInput.current.value = ''
    priceInput.current.value = ''
    dateInput.current.value = ''

    inputs.forEach(input => input.classList.remove('border-danger'))
    return true
}