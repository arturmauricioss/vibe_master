'use client';

import { useState, useCallback } from 'react';
import { GameState, Personagem, Posicao, TipoPersonagem } from '@/types/game';

const GRID_SIZE = 20;
const PA_MAX = 5;

function calcularDano(forca: number): number {
  return Math.floor((forca - 10) / 2);
}

function calcularRegeneracao(agilidade: number): number {
  return Math.floor((agilidade - 8) / 2);
}

function calcularCustoMovimento(distancia: number): number {
  if (distancia <= 1) return 1;
  if (distancia <= 3) return 2;
  return 2;
}

const PERSONAGENS_INICIAIS: Personagem[] = [
  {
    id: 'heroi',
    nome: 'Herói',
    tipo: 'heroi',
    hp: 10,
    hpMax: 10,
    forca: 14,
    agilidade: 12,
    movimento: 3,
    pa: 5,
    paMax: 5,
    jaAtuouNaRodada: false,
    jaMoveuNaRodada: false,
    x: 5,
    y: 10,
  },
  {
    id: 'monstro',
    nome: 'Monstro',
    tipo: 'monstro',
    hp: 7,
    hpMax: 7,
    forca: 12,
    agilidade: 10,
    movimento: 3,
    pa: 5,
    paMax: 5,
    jaAtuouNaRodada: false,
    jaMoveuNaRodada: false,
    x: 15,
    y: 10,
  },
];

function ordenarPorPA(personagens: Personagem[]): Personagem[] {
  return [...personagens].sort((a, b) => {
    if (b.pa !== a.pa) {
      return b.pa - a.pa;
    }
    return b.agilidade - a.agilidade;
  });
}

export function useGame() {
  const [state, setState] = useState<GameState>(() => {
    const personagensOrdenados = ordenarPorPA([...PERSONAGENS_INICIAIS]);
    return {
      personagens: personagensOrdenados,
      indiceAtual: 0,
      fase: 'selecionar',
      personagemSelecionado: null,
      celulasDisponiveis: [],
      celulasAtaque: [],
      mensagem: 'Selecione um personagem para começar.',
      vencedor: null,
      emRodada: false,
    };
  });

  const isCelulaOcupada = useCallback(
    (x: number, y: number) => {
      return state.personagens.some(
        (p) => p.x === x && p.y === y
      );
    },
    [state.personagens]
  );

  const getCelulasDisponiveis = useCallback(
    (personagem: Personagem): Posicao[] => {
      if (personagem.jaMoveuNaRodada) return [];
      
      const celulas: Posicao[] = [];
      const alcance = personagem.movimento;

      for (let dx = -alcance; dx <= alcance; dx++) {
        for (let dy = -alcance; dy <= alcance; dy++) {
          const nx = personagem.x + dx;
          const ny = personagem.y + dy;

          if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
            const distancia = Math.abs(dx) + Math.abs(dy);
            const custo = calcularCustoMovimento(distancia);
            
            if (distancia > 0 && distancia <= alcance && !isCelulaOcupada(nx, ny) && custo <= personagem.pa) {
              celulas.push({ x: nx, y: ny, custo });
            }
          }
        }
      }

      return celulas;
    },
    [isCelulaOcupada]
  );

  const getCelulasAtaque = useCallback(
    (personagem: Personagem): Posicao[] => {
      const celulas: Posicao[] = [];
      const custoAtaque = 3;
      
      if (personagem.pa < custoAtaque) return celulas;

      const oponente = state.personagens.find((p) => p.tipo !== personagem.tipo);

      if (oponente) {
        const dx = Math.abs(personagem.x - oponente.x);
        const dy = Math.abs(personagem.y - oponente.y);
        const distancia = dx + dy;

        if (distancia === 1) {
          celulas.push({ x: oponente.x, y: oponente.y });
        }
      }

      return celulas;
    },
    [state.personagens]
  );

  const verificarFimDeRodada = useCallback((personagens: Personagem[]): boolean => {
    return personagens.every(p => p.jaAtuouNaRodada);
  }, []);

  const proximoPersonagem = useCallback((personagens: Personagem[], indiceAtual: number): number => {
    for (let i = 1; i <= personagens.length; i++) {
      const idx = (indiceAtual + i) % personagens.length;
      if (!personagens[idx].jaAtuouNaRodada) {
        return idx;
      }
    }
    return -1;
  }, []);

  const regenerarRodada = useCallback((personagens: Personagem[]): { personagens: Personagem[], indice: number, mensagem: string } => {
    const personagensRegenerados = personagens.map(p => ({
      ...p,
      pa: Math.min(p.paMax, p.pa + calcularRegeneracao(p.agilidade)),
      jaAtuouNaRodada: false,
      jaMoveuNaRodada: false,
    }));
    
    const personagensOrdenados = ordenarPorPA(personagensRegenerados);
    
    return {
      personagens: personagensOrdenados,
      indice: 0,
      mensagem: `Rodada completa! ${personagensOrdenados[0].nome} começa com ${personagensOrdenados[0].pa} PA!`
    };
  }, []);

  const selecionarPersonagem = useCallback(
    (personagemId: string) => {
      if (state.vencedor) return;

      const personagem = state.personagens.find((p) => p.id === personagemId);
      if (!personagem || personagem.pa <= 0 || personagem.jaAtuouNaRodada) return;

      // Verifica se é o personagem da vez
      const indice = state.personagens.findIndex(p => p.id === personagemId);
      if (indice !== state.indiceAtual) return;
      
      const celulasDisponiveis = getCelulasDisponiveis(personagem);
      const celulasAtaque = getCelulasAtaque(personagem);

      setState((prev) => ({
        ...prev,
        personagemSelecionado: personagem,
        indiceAtual: indice,
        celulasDisponiveis,
        celulasAtaque,
        fase: 'selecionar',
        emRodada: true,
        mensagem: `${personagem.nome} - ${personagem.pa} PA. Pode fazer múltiplas ações!`,
      }));
    },
    [state.personagens, state.vencedor, state.indiceAtual, getCelulasDisponiveis, getCelulasAtaque]
  );

  const moverPersonagem = useCallback(
    (x: number, y: number) => {
      if (!state.personagemSelecionado) return;

      const celula = state.celulasDisponiveis.find(
        (c) => c.x === x && c.y === y
      );

      if (!celula) return;

      const custo = celula.custo || calcularCustoMovimento(
        Math.abs(state.personagemSelecionado.x - x) + Math.abs(state.personagemSelecionado.y - y)
      );

      setState((prev) => {
        const novoPa = prev.personagemSelecionado!.pa - custo;
        
        const personagensAtualizados = prev.personagens.map((p) =>
          p.id === prev.personagemSelecionado?.id 
            ? { ...p, x, y, pa: novoPa, jaMoveuNaRodada: true } 
            : p
        );

        const personagemAtualizado = personagensAtualizados.find(p => p.id === prev.personagemSelecionado!.id)!;
        const celulasDisponiveis = getCelulasDisponiveis(personagemAtualizado);
        const celulasAtaque = getCelulasAtaque(personagemAtualizado);

        let novaMensagem = `${prev.personagemSelecionado?.nome} moveu (-${custo} PA). PA restantes: ${novoPa}`;

        return {
          ...prev,
          personagens: personagensAtualizados,
          personagemSelecionado: personagemAtualizado,
          celulasDisponiveis,
          celulasAtaque,
          mensagem: novaMensagem,
        };
      });
    },
    [state.personagemSelecionado, state.celulasDisponiveis, getCelulasDisponiveis, getCelulasAtaque]
  );

  const atacarPersonagem = useCallback(
    (x: number, y: number) => {
      if (!state.personagemSelecionado) return;
      if (state.personagemSelecionado.pa < 3) {
        setState(prev => ({
          ...prev,
          mensagem: 'PA insuficiente! Precisa de 3 PA para atacar.'
        }));
        return;
      }

      const isAtaque = state.celulasAtaque.some(
        (c) => c.x === x && c.y === y
      );

      if (!isAtaque) return;

      const alvo = state.personagens.find((p) => p.x === x && p.y === y);
      if (!alvo) return;

      const dano = calcularDano(state.personagemSelecionado.forca);
      const novoHp = alvo.hp - dano;
      const custo = 3;

      let vencedor: TipoPersonagem | null = null;
      if (novoHp <= 0) {
        vencedor = state.personagemSelecionado.tipo;
      }

      setState((prev) => {
        const personagensAtualizados = prev.personagens.map((p) => {
          if (p.id === alvo.id) {
            return { ...p, hp: Math.max(0, novoHp) };
          }
          if (p.id === prev.personagemSelecionado?.id) {
            return { ...p, pa: p.pa - custo };
          }
          return p;
        });

        const personagemAtualizado = personagensAtualizados.find(p => p.id === prev.personagemSelecionado!.id)!;
        const celulasDisponiveis = getCelulasDisponiveis(personagemAtualizado);
        const celulasAtaque = getCelulasAtaque(personagemAtualizado);

        let novaMensagem = `${prev.personagemSelecionado?.nome} atacou ${alvo.nome} por ${dano} de dano!${novoHp <= 0 ? ` ${alvo.nome} derrotado!` : ''} PA restantes: ${personagemAtualizado.pa}`;

        return {
          ...prev,
          personagens: personagensAtualizados,
          personagemSelecionado: personagemAtualizado,
          celulasDisponiveis,
          celulasAtaque,
          mensagem: novaMensagem,
          vencedor,
        };
      });
    },
    [state.personagemSelecionado, state.celulasAtaque, getCelulasDisponiveis, getCelulasAtaque]
  );

  const pularVez = useCallback(() => {
    if (!state.personagemSelecionado || state.vencedor) return;

    setState((prev) => {
      const personagensAtualizados = prev.personagens.map((p) => {
        if (p.id === prev.personagemSelecionado?.id) {
          return { ...p, jaAtuouNaRodada: true, jaMoveuNaRodada: false };
        }
        return p;
      });

      const fimDaRodada = verificarFimDeRodada(personagensAtualizados);

      if (fimDaRodada) {
        const resultado = regenerarRodada(personagensAtualizados);
        return {
          ...prev,
          personagens: resultado.personagens,
          indiceAtual: resultado.indice,
          celulasDisponiveis: [],
          celulasAtaque: [],
          personagemSelecionado: null,
          fase: 'selecionar',
          mensagem: `${prev.personagemSelecionado?.nome} pulou a vez! ${resultado.mensagem}`,
          emRodada: true,
        };
      }

      const proximoIndice = proximoPersonagem(personagensAtualizados, prev.indiceAtual);
      const nomeProximo = personagensAtualizados[proximoIndice].nome;

      return {
        ...prev,
        personagens: personagensAtualizados,
        indiceAtual: proximoIndice,
        celulasDisponiveis: [],
        celulasAtaque: [],
        personagemSelecionado: null,
        fase: 'selecionar',
        mensagem: `${prev.personagemSelecionado?.nome} pulou a vez! Próximo: ${nomeProximo}`,
        emRodada: true,
      };
    });
  }, [state.personagemSelecionado, state.vencedor, verificarFimDeRodada, proximoPersonagem, regenerarRodada]);

  const clickCelula = useCallback(
    (x: number, y: number) => {
      if (state.vencedor || !state.personagemSelecionado) return;

      const personagem = state.personagemSelecionado;

      // Verificar ataque primeiro
      const personagemNaCelula = state.personagens.find(
        (p) => p.x === x && p.y === y && p.id !== personagem.id
      );

      if (personagemNaCelula && personagemNaCelula.tipo !== personagem.tipo) {
        const dx = Math.abs(personagem.x - x);
        const dy = Math.abs(personagem.y - y);
        const distancia = dx + dy;

        if (distancia === 1 && personagem.pa >= 3) {
          atacarPersonagem(x, y);
          return;
        }
      }

      // Verificar movimento
      const celula = state.celulasDisponiveis.find(
        (c) => c.x === x && c.y === y
      );

      if (celula) {
        moverPersonagem(x, y);
      }
    },
    [state.vencedor, state.personagemSelecionado, state.celulasDisponiveis, state.personagens, moverPersonagem, atacarPersonagem]
  );

  const reiniciarJogo = useCallback(() => {
    const personagensOrdenados = ordenarPorPA([...PERSONAGENS_INICIAIS]);
    setState({
      personagens: personagensOrdenados,
      indiceAtual: 0,
      fase: 'selecionar',
      personagemSelecionado: null,
      celulasDisponiveis: [],
      celulasAtaque: [],
      mensagem: 'Novo jogo! Selecione um personagem.',
      vencedor: null,
      emRodada: false,
    });
  }, []);

  return {
    state,
    selecionarPersonagem,
    clickCelula,
    pularVez,
    reiniciarJogo,
  };
}
