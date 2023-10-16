

//const {setItem, getItem, clear} = useLocalStorage('listaTarefas', '[]');

import { useCallback, useRef } from "react";

type TValor = string | Object;

export default function useLocalStorage<TValor>(nomeItem: string, valorInicial: TValor) {
    const tipoValor = useRef(typeof valorInicial);

    const setItem = useCallback((valor: TValor) => {
        if (typeof valor !== tipoValor.current) {
            throw new Error(`O item ${nomeItem} precisa ser do tipo ${tipoValor.current}`);
        }

        if (typeof valor === 'object') {
            return localStorage.setItem(nomeItem, JSON.stringify(valor).toString());
        }

        return localStorage.setItem(nomeItem, String(valor));
    }, [nomeItem]);

    const getItem = useCallback(() => {
        if (tipoValor.current === 'object') {
            return JSON.parse(localStorage.getItem(nomeItem) || JSON.stringify(valorInicial));
        }

        return localStorage.getItem(nomeItem) || valorInicial;
    }, [nomeItem, valorInicial]);

    const remove = useCallback(() => localStorage.removeItem(nomeItem), [nomeItem]);

    return {
        setItem,
        getItem,
        remove
    };
}