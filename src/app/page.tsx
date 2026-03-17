'use client';

import { GameProvider } from '@/contexts/GameContext';
import { Tabuleiro, AsideOrdem, HeaderPersonagens } from '@/components/tabuleiro';

export default function Home() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderPersonagens />
        <div className="flex-1 flex">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <Tabuleiro />
            </div>
          </div>
          <AsideOrdem />
        </div>
      </div>
    </GameProvider>
  );
}
