# Vibe Master - AGENTS.md

## Projeto

Sistema de tabletop focado no mestre (DM), para uso local com compartilhamento de tela no Discord.

## Stack

- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript
- **Database:** PostgreSQL com Drizzle ORM
- **Styling:** Tailwind CSS
- **UI:** Shadcn/ui

## Estrutura de Pastas

```
vibe_master/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   └── page.tsx           # Página principal
├── components/            # Componentes React
├── db/                    # Drizzle config e schema
├── lib/                   # Utilitários
└── public/                # Arquivos estáticos
```

## Convenções

### Componentes
- PascalCase: `Tabuleiro.tsx`, `BotaoDados.tsx`
- Arquivos co-locados quando possível

### Database (Drizzle)
- Schema em `db/schema/`
- Migrações em `db/migrations/`
- Queries em `db/queries/`

### Commits
- Conventional Commits
- Branch: `feature/nome`, `bugfix/nome`, `docs/nome`

## Comandos Úteis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build
npm run db:push      # Aplicar schema ao banco
npm run db:studio   # Abrir Drizzle Studio
```
