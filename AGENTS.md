# Ysf-AI — Contexte pour Agents IA

## Stack Technique
- **Frontend**: Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- **Backend/DB**: Convex (backend-as-a-service avec DB temps réel)
- **Auth**: Convex Auth (OAuth GitHub/Google)
- **API IA**: OpenRouter (gateway multi-modèles)
- **Paiement**: Stripe
- **UI**: Composants core personnalisés, Lucide icons

## Structure du Projet
```
shoura/
├── convex/              # Backend Convex
│   ├── schema.ts        # Schéma DB
│   ├── auth.ts          # Configuration Convex Auth
│   ├── auth.config.ts   # Providers OAuth
│   ├── mutations/       # Mutations (écritures DB)
│   ├── queries/         # Queries (lectures DB)
│   ├── actions/         # Actions (appels API externes)
│   └── _generated/      # Généré automatiquement
├── src/
│   ├── app/             # Pages Next.js (App Router)
│   │   ├── layout.tsx   # Layout racine
│   │   ├── page.tsx     # Page d'accueil (sign-in)
│   │   ├── dashboard/   # Dashboard principal
│   │   └── middleware.ts # Middleware auth
│   ├── components/
│   │   ├── core/        # Composants UI réutilisables
│   │   ├── auth/        # Composants auth
│   │   ├── chat/        # Composants de chat
│   │   └── sidebar/     # Composants sidebar
│   └── lib/
│       ├── utils.ts     # Utilitaires (cn)
│       └── models.ts    # Configuration des modèles IA
```

## Règles de Code
1. Toujours utiliser `@/` pour les imports absolus
2. Composants UI dans `core/` avec `forwardRef` et `cn()` pour les classes
3. Les "use client" directives uniquement quand nécessaire (hooks, interactivité)
4. Convex functions: mutations dans `mutations/`, queries dans `queries/`, actions dans `actions/`
5. Utiliser `"use node"` pour les actions qui font des appels API externes
6. Ne jamais exposer les clés API côté client
7. Préférer les Server Components par défaut, Client Components seulement pour l'interactivité

## Commandes
- `pnpm dev` → Démarrer le dev server
- `npx convex dev` → Démarrer Convex en local
- `pnpm build` → Build production
- `pnpm lint` → Linting
