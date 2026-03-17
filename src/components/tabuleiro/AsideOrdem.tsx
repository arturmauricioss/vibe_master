'use client';

import { useGameContext } from '@/contexts/GameContext';

function calcularRegeneracao(agilidade: number): number {
  return Math.floor((agilidade - 8) / 2);
}

export function AsideOrdem() {
  const { state, pularVez, reiniciarJogo } = useGameContext();
  const { personagens, indiceAtual, personagemSelecionado, mensagem, vencedor } = state;

  const personagemDaVez = personagens[indiceAtual];

  const personagensOrdenados = [...personagens].sort((a, b) => {
    if (b.pa !== a.pa) return b.pa - a.pa;
    return b.agilidade - a.agilidade;
  });

  return (
    <aside className="w-64 bg-white border-l border-gray-200 p-4 flex flex-col h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-3 text-gray-800">Ordem de Ação</h2>
      
      <div className="space-y-2 mb-4">
        {personagensOrdenados.map((personagem) => {
          const isTurno = personagem.id === personagemDaVez?.id;
          const jaAtuou = personagem.jaAtuouNaRodada;

          return (
            <div
              key={personagem.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border-2
                ${isTurno ? 'border-green-500 bg-green-50' : 'border-gray-200'}
                ${jaAtuou ? 'opacity-50' : ''}
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {personagem.tipo === 'heroi' ? '🧙' : '👹'}
                </span>
                <div>
                  <div className="font-semibold text-gray-800">{personagem.nome}</div>
                  <div className="text-xs text-gray-500">
                    {jaAtuou ? 'Aguardando' : 'Pronto'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-yellow-600">{personagem.pa}</div>
                <div className="text-xs text-gray-400">PA</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-100 p-3 rounded-lg mb-4 flex-1">
        <p className="text-sm text-gray-700">{mensagem}</p>
      </div>

      {personagemSelecionado && !vencedor && (
        <button
          onClick={pularVez}
          className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors mb-2"
        >
          Pular Vez
        </button>
      )}

      {vencedor && (
        <button
          onClick={reiniciarJogo}
          className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors"
        >
          Jogar Novamente
        </button>
      )}

      <div className="mt-auto pt-4 border-t border-gray-200 text-xs text-gray-500">
        <div className="grid grid-cols-2 gap-1 mb-2">
          <span>Andar 1:</span><span>1 PA</span>
          <span>Andar 2-3:</span><span>2 PA</span>
          <span>Atacar:</span><span>3 PA</span>
        </div>
        <div>
          <span className="font-medium">Regen (fim):</span>
          <div>Herói: +{calcularRegeneracao(12)} | Monstro: +{calcularRegeneracao(10)}</div>
        </div>
      </div>
    </aside>
  );
}
