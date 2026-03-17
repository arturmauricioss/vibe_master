interface TokenMonstroProps {
  hp: number;
  hpMax: number;
  pa: number;
  selecionado?: boolean;
}

export function TokenMonstro({ hp, hpMax, pa, selecionado }: TokenMonstroProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${selecionado ? 'animate-pulse' : ''}`}
      >
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          fill="#ef4444"
          stroke={selecionado ? '#fbbf24' : '#b91c1c'}
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
