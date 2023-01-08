
export interface IAlert {
    alertText: string
    alertStatus: string
}

export interface IAlertProps {
    props: IAlert
}

export interface ISpinnerProps {
    top: number
    left: number
}

export interface IHandleAuthResponse {
    result: boolean | undefined
    navigatePath: string
    alertText: string
}

export interface ICostsHeaderProps {
    costs: ICost[]
}

export interface ICost {
    text: string
    price: number
    date: Date | string
    _id?: number | string
}

export interface IBaseEffectArgs {
    url: string
    token: string
}

export interface IDeleteCost extends IBaseEffectArgs {
    id: string | number
}

export interface ICreateCost extends IBaseEffectArgs{
    cost: ICost
}

export interface IUpdateCost extends ICreateCost {
    id: string | number
}

export interface IRefreshToken extends IBaseEffectArgs{
    username: string
}

export interface IHandleAxiosErrorsPayload {
    type: string
    createCost?: Partial<ICreateCost>
    getCosts?: Partial<IBaseEffectArgs>
    deleteCost?: Partial<IDeleteCost>
    updateCost?: Partial<IUpdateCost>
}