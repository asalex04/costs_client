import React, {useEffect, useMemo, useRef, useState} from 'react';
import Header from "./Header/Header";
import {getCostsFx} from "../../api/costsClient";
import Spinner from "../Spinner/Spinner";
import {useStore} from "effector-react";
import {$costs, setCosts} from "../../context";
import {getAuthDataFromLS} from "../../utils/auth";
import CostsList from "./CostsList/CostsList";

const CostsPage = () => {
    const store = useStore($costs)
    const shouldLoadCosts = useRef(true)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (shouldLoadCosts.current) {
            shouldLoadCosts.current = false
            handleGetCosts()
        }
    }, [])

    const handleGetCosts = async () => {
        setIsLoading(true)
        const {access_token} = getAuthDataFromLS()
        const costs = await getCostsFx({url: '/costs',token: access_token})
        setIsLoading(false)
        setCosts(costs)
    }
    return (
        <div>
            {useMemo(() => <Header costs={store} />, [store])}
            <div style={{position: "relative"}}>
                {isLoading && <Spinner top={0} left={0}/>}
                {useMemo(() => <CostsList costs={store} />, [store])}
                {(!isLoading && !store.length) && <h2>Список расходов пуст</h2>}
            </div>
        </div>
    );
};

export default CostsPage;