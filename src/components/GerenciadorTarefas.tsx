import React, { useEffect, useReducer } from 'react';
import { Tarefa, TTarefa } from './Tarefa';
import useLocalStorage from './../hooks/useLocalStorage';

const initialState = {
  texto: '',
  listaTarefas: [] as TTarefa[],
};

type ReducerAction =
  | { type: 'ADICIONAR' }
  | { type: 'MARCAR'; payload: { id: number } }
  | { type: 'REMOVER'; payload: { id: number } }
  | { type: 'ALTERAR_TEXTO'; payload: { texto: string } };

function reducer(
  state: typeof initialState,
  action: ReducerAction
): typeof initialState {
  switch (action.type) {
    case 'ADICIONAR':
      if (state.texto === '') return state;

      const novaTarefa: TTarefa = {
        id: Date.now(),
        texto: state.texto,
        feita: false,
      };

      return {
        ...state,
        texto: '',
        listaTarefas: [...state.listaTarefas, novaTarefa],
      };

    case 'MARCAR':
      return {
        ...state,
        listaTarefas: state.listaTarefas.map((tarefa) => {
          if (tarefa.id === action.payload.id) {
            return { ...tarefa, feita: !tarefa.feita };
          }
          return tarefa;
        }),
      };

    case 'REMOVER':
      return {
        ...state,
        listaTarefas: state.listaTarefas.filter(
          (tarefa) => tarefa.id !== action.payload.id
        ),
      };

    case 'ALTERAR_TEXTO':
      return {
        ...state,
        texto: action.payload.texto,
      };

    default:
      throw new Error('Ação não encontrada');
  }
}

export default function GerenciadorTarefas() {
    const {setItem, getItem} = useLocalStorage<Object>('listaTarefas', []);

  const [state, dispatch] = useReducer(reducer, null, () => {
    console.log(getItem())
    initialState.listaTarefas = getItem();
    return initialState;
  });

  useEffect(() => {
    setItem(state.listaTarefas);
  }, [state.listaTarefas, setItem]);

  return (
    <div className="w-full h-screen flex flex-col justify-start items-center pt-10 bg-gray-200">
      <div className="border border-gray-500 bg-white w-96 p-5">
        <div className="flex flex-col justify-evenly items-center border-b border-b-gray-500">
          <h1 className="text-4xl">Tarefas</h1>
          <div className="flex flex-row justify-between items-center gap-2 w-full p-3">
            <input
              type="text"
              placeholder="Digite aqui..."
              value={state.texto}
              onChange={(e) => {
                dispatch({
                    type: 'ALTERAR_TEXTO',
                    payload: { texto: e.target.value },
                  });
              }}
              onKeyUp={(e) => e.key === 'Enter' && dispatch({ type: 'ADICIONAR' })}
              className="bg-gray-200 w-full px-2 py-1 outline-none cursor-pointer"
            />
            <button
              type="button"
              onClick={() => dispatch({ type: 'ADICIONAR' })}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1"
            >
              Adicionar
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-evenly items-center p-3">
          {state.listaTarefas.length === 0 ? (
            <p>Nenhuma tarefa encontrada</p>
          ) : (
            <>
              {state.listaTarefas.map((tarefa) => {
                return (
                  <Tarefa
                    key={tarefa.id}
                    tarefa={tarefa}
                    onMarcar={() => dispatch({ type: 'MARCAR', payload: { id: tarefa.id } })}
                    onRemover={() => dispatch({ type: 'REMOVER', payload: { id: tarefa.id } })}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
