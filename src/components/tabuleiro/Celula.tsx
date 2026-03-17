import { Personagem } from '@/types/game';
import { TokenHeroi } from './TokenHeroi';
import { TokenMonstro } from './TokenMonstro';

interface CelulaProps {
  x: number;
  y: number;
  personagem: Personagem | null;
  personagemSelecionado: boolean;
  disponivelMovimento: boolean;
  disponivelAtaque: boolean;
  custoMovimento?: number;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export function Celula({
  x,
  y,
  personagem,
  personagemSelecionado,
  disponivelMovimento,
  disponivelAtaque,
  custoMovimento,
  onClick,
  onDragStart,
  onDragEnd,
}: CelulaProps) {
  let bgColor = 'bg-gray-100';
  
  if (disponivelMovimento) {
    if (custoMovimento === 1) {
      bgColor = 'bg-blue-200';
    } else if (custoMovimento === 2) {
      bgColor = 'bg-blue-500';
    } else {
      bgColor = 'bg-blue-400';
    }
  } else if (disponivelAtaque) {
    bgColor = 'bg-red-400';
  } else if ((x + y) % 2 === 0) {
    bgColor = 'bg-gray-200';
  }

  return (
    <div
      className={`
        w-6 h-6 sm:w-8 sm:h-8 border border-gray-300 
        ${bgColor}
        flex items-center justify-center
        cursor-pointer
        transition-colors duration-150
        hover:brightness-95
      `}
      onClick={onClick}
      draggable={!!personagem}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      data-x={x}
      data-y={y}
    >
      {personagem && (
        <div className="w-full h-full p-0.5">
          {personagem.tipo === 'heroi' ? (
            <TokenHeroi
              hp={personagem.hp}
              hpMax={personagem.hpMax}
              pa={personagem.pa}
              selecionado={personagemSelecionado}
            />
          ) : (
            <TokenMonstro
              hp={personagem.hp}
              hpMax={personagem.hpMax}
              pa={personagem.pa}
              selecionado={personagemSelecionado}
            />
          )}
        </div>
      )}
    </div>
  );
}
