export type TipoPersonagem = 'heroi' | 'monstro';

export interface Personagem {
  id: string;
  nome: string;
  tipo: TipoPersonagem;
  hp: number;
  hpMax: number;
  forca: number;
  agilidade: number;
  movimento: number;
  pa: number;
  paMax: number;
  jaAtuouNaRodada: boolean;
  jaMoveuNaRodada: boolean;
  x: number;
  y: number;
}

export interface Posicao {
  x: number;
  y: number;
  custo?: number;
}

export type FaseTurno = 'selecionar' | 'mover' | 'atacar' | 'pularVez';

export interface GameState {
  personagens: Personagem[];
  indiceAtual: number;
  fase: FaseTurno;
  personagemSelecionado: Personagem | null;
  celulasDisponiveis: Posicao[];
  celulasAtaque: Posicao[];
  mensagem: string;
  vencedor: TipoPersonagem | null;
  emRodada: boolean;
}
