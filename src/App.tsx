import React, { useReducer, useState } from 'react';
import { Tarefa, TTarefa } from './components/Tarefa';

const initialState = { listaTarefas: [] as TTarefa[] };

const enum REDUCER_ACTION_TYPE {
  ADICIONAR,
  MARCAR,
  REMOVER,
}

type ReducerAction =
  | {
      type: REDUCER_ACTION_TYPE.ADICIONAR;
      payload: {
        texto: string;
      };
    }
  | {
      type: REDUCER_ACTION_TYPE.MARCAR;
      payload: {
        idMarcar: number;
      };
    }
  | {
      type: REDUCER_ACTION_TYPE.REMOVER;
      payload: {
        idRemover: number;
      };
    };

function reducer(
  state: typeof initialState,
  action: ReducerAction
): typeof initialState {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.ADICIONAR:
      if (action.payload.texto === '') return state;

      const novaTarefa: TTarefa = {
        id: Date.now(),
        texto: action.payload.texto || 'vazio',
        feita: false,
      };

      return { ...state, listaTarefas: [...state.listaTarefas, novaTarefa] };

    case REDUCER_ACTION_TYPE.MARCAR:
      return {
        ...state,
        listaTarefas: state.listaTarefas.map((tarefa) => {
          if (tarefa.id === action.payload.idMarcar) {
            return { ...tarefa, feita: !tarefa.feita };
          }
          return tarefa;
        }),
      };

    case REDUCER_ACTION_TYPE.REMOVER:
      return {
        ...state,
        listaTarefas: state.listaTarefas.filter(
          (tarefa) => tarefa.id !== action.payload.idRemover
        ),
      };

    default:
      throw new Error('Ação não encontrada');
  }
}

function App() {
  const [texto, setTexto] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);

  const onAdicionar = () => {
    dispatch({ type: REDUCER_ACTION_TYPE.ADICIONAR, payload: { texto } });
    setTexto('');
  };

  const onMarcar = (id: number) => {
    dispatch({ type: REDUCER_ACTION_TYPE.MARCAR, payload: { idMarcar: id } });
  };

  const onRemover = (id: number) => {
    dispatch({ type: REDUCER_ACTION_TYPE.REMOVER, payload: { idRemover: id } });
  };

  return (
    <div className="w-full h-screen flex flex-col justify-start items-center pt-10 bg-gray-200">
      <div className="border border-gray-500 bg-white w-96 p-5">
        <div className="flex flex-col justify-evenly items-center border-b border-b-gray-500">
          <h1 className="text-4xl">Tarefas</h1>
          <div className="flex flex-row justify-between items-center gap-2 w-full p-3">
            <input
              type="text"
              placeholder="Digite aqui..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && onAdicionar()}
              className="bg-gray-200 w-full px-2 py-1 outline-none cursor-pointer"
            />
            <button
              type="button"
              onClick={onAdicionar}
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
                    onMarcar={onMarcar}
                    onRemover={onRemover}
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

export default App;
