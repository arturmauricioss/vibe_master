'use client';

import { useGameContext } from '@/contexts/GameContext';
import { TokenHeroi } from './TokenHeroi';
import { TokenMonstro } from './TokenMonstro';

export function HeaderPersonagens() {
  const { state, selecionarPersonagem } = useGameContext();
  const { personagens, indiceAtual, personagemSelecionado, vencedor } = state;

  const personagemDaVez = personagens[indiceAtual];

  return (
    <div className="w-full bg-slate-900 p-3 border-b border-slate-700">
      <div className="flex justify-center items-center gap-8">
        {personagens.map((personagem) => {
          const isTurno = personagem.id === personagemDaVez?.id;
          const isSelecionado = personagemSelecionado?.id === personagem.id;
          const podeSelecionar = isTurno && !vencedor && !personagem.jaAtuouNaRodada;

          return (
            <div
              key={personagem.id}
              className={`
                relative cursor-pointer transition-all
                ${isTurno ? 'scale-110' : 'scale-100'}
                ${!podeSelecionar ? 'opacity-70' : ''}
              `}
              onClick={() => podeSelecionar && selecionarPersonagem(personagem.id)}
            >
              <div className={`
                w-16 h-16 rounded-lg border-2 flex items-center justify-center
                ${isTurno ? 'border-yellow-400 shadow-lg shadow-yellow-400/30' : 'border-slate-500'}
                ${isSelecionado ? 'ring-4 ring-yellow-400/50' : ''}
                ${personagem.tipo === 'heroi' ? 'bg-blue-900/80' : 'bg-red-900/80'}
              `}>
                {personagem.tipo === 'heroi' ? (
                  <TokenHeroi
                    hp={personagem.hp}
                    hpMax={personagem.hpMax}
                    pa={personagem.pa}
                    selecionado={isSelecionado}
                  />
                ) : (
                  <TokenMonstro
                    hp={personagem.hp}
                    hpMax={personagem.hpMax}
                    pa={personagem.pa}
                    selecionado={isSelecionado}
                  />
                )}
              </div>
              
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold">
                {personagem.pa}
              </div>

              {isTurno && !vencedor && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
