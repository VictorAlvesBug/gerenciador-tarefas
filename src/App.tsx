import React, { useReducer, useState } from 'react';
import { Tarefa, TTarefa } from './components/Tarefa';

function App() {
  const [texto, setTexto] = useState('');
  const [listaTarefas, setListaTarefas] = useState<TTarefa[]>([]);

  const onAdicionar = () => {
    if (!texto) return;
    setListaTarefas((prev) => {
      const novaTarefa: TTarefa = {
        id: Date.now(),
        texto: texto,
        feita: false,
      };
      return [...prev, novaTarefa];
    });
    setTexto('');
  };

  const onMarcar = (id: number) => {
    setListaTarefas((prev) => {
      return prev.map((tarefa) => {
        if (tarefa.id === id) {
          return { ...tarefa, feita: !tarefa.feita };
        }
        return tarefa;
      });
    });
  };

  const onExcluir = (id: number) => {
    setListaTarefas((prev) => {
      return prev.filter((tarefa) => tarefa.id !== id);
    });
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
          {listaTarefas.length === 0 ? (
            <p>Nenhuma tarefa encontrada</p>
          ) : (
            <>
              {listaTarefas.map((tarefa) => {
                return (
                  <Tarefa
                    key={tarefa.id}
                    tarefa={tarefa}
                    onMarcar={onMarcar}
                    onExcluir={onExcluir}
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