import {IBaseEffectArgs, ICreateCost, IDeleteCost, IRefreshToken, IUpdateCost} from "../types";
import {createEffect} from "effector";
import {$host} from "./index";
import {removeUser} from "../utils/auth";
import {handleAxiosErrors} from "../utils/errors";

export const getCostsFx = createEffect(async ({url, token}: IBaseEffectArgs) => {
    try {
        const { data } = await $host.get(url,{headers: {'Authorization': `Bearer ${token}`}})
        return data
    } catch (err) {
        await handleAxiosErrors(err, {type: 'get'})
    }
})

export const createCostFx = createEffect(async ({url, cost, token}: ICreateCost) => {
    try {
        const { data } = await $host.post(
            url,
            {...cost},
            {headers: {'Authorization': `Bearer ${token}`}})
        return data
    } catch (err) {
        await handleAxiosErrors(err, {type: 'create', createCost: {cost}})
    }
})

export const updateCostFx = createEffect(async ({url, cost, token, id}: IUpdateCost) => {
    try {
        const { data } = await $host.patch(
            `${url}/${id}`,
            {...cost},
            {headers: {'Authorization': `Bearer ${token}`}})
        return data
    } catch (err) {
        await handleAxiosErrors(err, {type: 'update', updateCost: {cost, id}})
    }
})

export const deleteCostFx = createEffect(async ({url, token, id}: IDeleteCost) => {
    try {
        await $host.delete(`${url}/${id}`,{headers: {'Authorization': `Bearer ${token}`}})
    } catch (err) {
       await handleAxiosErrors(err, {type: 'delete', deleteCost: {id}})
    }
})

export const refreshTokenFx = createEffect(async ({url, token, username}: IRefreshToken) => {
    try {
        const result = await $host.post(url, {refresh_token: token, username})
        if (result.status === 200) {
            localStorage.setItem('token', JSON.stringify({...result.data, username}))
            return result.data.access_token
        } else {
            removeUser()
        }
    } catch (e) {
        console.log(e)
    }
})

