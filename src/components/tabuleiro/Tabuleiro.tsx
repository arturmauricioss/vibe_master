'use client';

import { useCallback } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import { Celula } from './Celula';

const GRID_SIZE = 20;

export function Tabuleiro() {
  const { state, clickCelula, selecionarPersonagem } = useGameContext();

  const getCustoCelula = useCallback(
    (x: number, y: number): number | undefined => {
      const celula = state.celulasDisponiveis.find((c) => c.x === x && c.y === y);
      return celula?.custo;
    },
    [state.celulasDisponiveis]
  );

  const isCelulaDisponivel = useCallback(
    (x: number, y: number, tipo: 'movimento' | 'ataque'): boolean => {
      const celulas = tipo === 'movimento' ? state.celulasDisponiveis : state.celulasAtaque;
      return celulas.some((c) => c.x === x && c.y === y);
    },
    [state.celulasDisponiveis, state.celulasAtaque]
  );

  const getPersonagemNaCelula = useCallback(
    (x: number, y: number) => {
      return state.personagens.find((p) => p.x === x && p.y === y) || null;
    },
    [state.personagens]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, x: number, y: number) => {
      const personagem = getPersonagemNaCelula(x, y);
      if (personagem && personagem.id === state.personagemSelecionado?.id) {
        e.dataTransfer.setData('text/plain', `${x},${y}`);
        e.dataTransfer.effectAllowed = 'move';
      } else {
        e.preventDefault();
      }
    },
    [getPersonagemNaCelula, state.personagemSelecionado]
  );

  const handleDragEnd = useCallback(
    (e: React.DragEvent) => {
      const target = e.currentTarget as HTMLElement;
      const x = parseInt(target.dataset.x || '0', 10);
      const y = parseInt(target.dataset.y || '0', 10);

      const personagem = getPersonagemNaCelula(x, y);
      if (personagem) {
        selecionarPersonagem(personagem.id);
      }
    },
    [getPersonagemNaCelula, selecionarPersonagem]
  );

  const handleCelulaClick = useCallback(
    (x: number, y: number) => {
      const personagem = getPersonagemNaCelula(x, y);
      
      // Se já tem personagem selecionado, tenta mover ou atacar
      if (state.personagemSelecionado) {
        if (personagem && personagem.id !== state.personagemSelecionado.id) {
          const dx = Math.abs(state.personagemSelecionado.x - x);
          const dy = Math.abs(state.personagemSelecionado.y - y);
          const distancia = dx + dy;
          
          if (distancia === 1) {
            clickCelula(x, y);
            return;
          }
        }
        
        clickCelula(x, y);
        return;
      }
      
      // Se não tem personagem selecionado, só seleciona se for o da vez
      if (personagem) {
        // Verifica se é o personagem da vez
        const indicePersonagem = state.personagens.findIndex(p => p.id === personagem.id);
        if (indicePersonagem === state.indiceAtual) {
          selecionarPersonagem(personagem.id);
        }
      }
    },
    [getPersonagemNaCelula, state.personagemSelecionado, state.personagens, state.indiceAtual, clickCelula, selecionarPersonagem]
  );

  const renderizarGrade = () => {
    const grade: React.ReactNode[] = [];

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const personagem = getPersonagemNaCelula(x, y);
        const personagemSelecionado = personagem?.id === state.personagemSelecionado?.id;
        const disponivelMovimento = isCelulaDisponivel(x, y, 'movimento');
        const disponivelAtaque = isCelulaDisponivel(x, y, 'ataque');
        const custoMovimento = getCustoCelula(x, y);

        grade.push(
          <Celula
            key={`${x}-${y}`}
            x={x}
            y={y}
            personagem={personagem}
            personagemSelecionado={personagemSelecionado}
            disponivelMovimento={disponivelMovimento}
            disponivelAtaque={disponivelAtaque}
            custoMovimento={custoMovimento}
            onClick={() => handleCelulaClick(x, y)}
            onDragStart={(e) => handleDragStart(e, x, y)}
            onDragEnd={handleDragEnd}
          />
        );
      }
    }

    return grade;
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(24px, 32px))`,
        }}
      >
        {renderizarGrade()}
      </div>
    </div>
  );
}
