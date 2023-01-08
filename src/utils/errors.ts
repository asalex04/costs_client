import {ICost, IHandleAxiosErrorsPayload} from "../types";
import {AxiosError} from "axios";
import {getAuthDataFromLS, handleAlertMessage, removeUser} from "./auth";
import {createCostFx, deleteCostFx, getCostsFx, refreshTokenFx, updateCostFx} from "../api/costsClient";
import {createCost, setCosts} from "../context";

export const handleAxiosErrors = async (
    error: unknown,
    payload: IHandleAxiosErrorsPayload | null = null
) => {
    const errorMessage =
        ((error as AxiosError).response?.data as {message: string}).message ||
        ((error as AxiosError).response?.data as {error: string}).error
    if (errorMessage) {
        if (errorMessage === 'jwt expired') {
            const payloadData = payload as IHandleAxiosErrorsPayload
            const authData = getAuthDataFromLS()
            await refreshTokenFx({
                url: '/auth/refresh',
                token: authData.refresh_token,
                username: authData.username
            })
            if (payload !== null) {
                switch (payloadData.type) {
                    case 'get':
                        const costs = await getCostsFx({
                            url: '/costs',
                            token: authData.access_token
                        })
                        setCosts(costs)
                        break
                    case 'create':
                        const cost = await createCostFx({
                            url: '/costs',
                            token: authData.access_token,
                            cost: {...payloadData.createCost?.cost} as ICost
                        })
                        if (!cost) return
                        createCost(cost)

                        handleAlertMessage({alertText: 'Успешно создано', alertStatus: 'success'})
                        break
                    case 'delete':
                        await deleteCostFx({
                            url: 'costs',
                            token: authData.access_token,
                            id: payloadData.deleteCost?.id as string
                        })
                        break
                    case 'update':
                        const updateCost = await updateCostFx({
                            url: '/costs',
                            token: authData.access_token,
                            cost: {...payloadData.createCost?.cost} as ICost,
                            id: payloadData.updateCost?.id as string
                        })
                        if (!updateCost) return
                        updateCost(updateCost)
                        handleAlertMessage({alertText: 'Успешно создано', alertStatus: 'success'})
                        break
                    default:
                        break
                }
            }
        } else {
            handleAlertMessage({alertText: errorMessage, alertStatus: 'warning'})
            removeUser()
        }
    } else {
        handleAlertMessage({alertText: errorMessage, alertStatus: 'warning'})
    }
}