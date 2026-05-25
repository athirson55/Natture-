# 🌿 Natture Estoque — Controle de Estoque PWA

Sistema de controle de estoque para loja de produtos naturais.
Totalmente offline, instalável no celular, mobile-first.

## Checklist de produção

- Build: `npm run build` (ok)
- Lint: `npm run lint` (corrigir erros antes do deploy)
- Backup / migração: exportar JSON via Configurações ou usar `migrateDatabase(newName)` no console do app
- Testes manuais: repor item, repor todos, adicionar/editar/excluir produtos, importar/exportar backup
- CI: GitHub Actions adicionada em `.github/workflows/ci.yml` (build + lint)

Considere revisar os códigos duplicados detectados no catálogo antes do release (já atualizados para evitar colisões automáticas).

# 🌿 Natture Estoque — Controle de Estoque PWA

Sistema de controle de estoque para loja de produtos naturais.
Totalmente offline, instalável no celular, mobile-first.

## Rodar Localmente

```bash
npm install
npm run dev
# Acesse http://localhost:5173
```

## Gerar Build PWA

```bash
npm run build
npm run preview
```

## Instalar no Celular

**Android (Chrome):** Menu ⋮ → "Adicionar à tela inicial"
**iOS (Safari):** Compartilhar 📤 → "Adicionar à Tela Inicial"

## Estrutura

```text
src/
├── components/    # BottomNav, Toast, ConfirmDialog, CategoryBadge
├── hooks/         # useProducts, useDarkMode
├── pages/         # Dashboard, Products, ProductForm, Replenishment, Settings
├── storage/       # db.js (IndexedDB)
└── App.jsx
```

## Tecnologias

- React + Vite + TailwindCSS
- IndexedDB (offline)
- vite-plugin-pwa + Workbox (Service Worker)

## Funcionalidades

- Dashboard com KPIs em tempo real
- Cadastro, edição e exclusão de produtos
- Pesquisa instantânea + filtros
- Controle de estoque com botões +/-
- Lista automática de reposição (zerados)
- Copiar lista para clipboard
- Modo escuro
- Exportar/importar backup JSON
- 100% offline
