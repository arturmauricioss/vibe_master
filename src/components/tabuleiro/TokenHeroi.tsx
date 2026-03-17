interface TokenHeroiProps {
  hp: number;
  hpMax: number;
  pa: number;
  selecionado?: boolean;
}

export function TokenHeroi({ hp, hpMax, pa, selecionado }: TokenHeroiProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${selecionado ? 'animate-pulse' : ''}`}
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="#3b82f6"
          stroke={selecionado ? '#fbbf24' : '#1d4ed8'}
          strokeWidth={selecionado ? 4 : 2}
        />
        <text
          x="50"
          y="45"
          textAnchor="middle"
          fill="white"
          fontSize="20"
          fontWeight="bold"
        >
          {hp}
        </text>
        <text
          x="50"
          y="70"
          textAnchor="middle"
          fill="white"
          fontSize="14"
        >
          PA:{pa}
        </text>
      </svg>
    </div>
  );
}
