# 🔧 Guia Prático: Ativar Sincronização em Tempo Real

Siga este guia **linha por linha** para ativar a sincronização multiusuário.

---

## Passo 1: Criar Projeto no Supabase

### 1.1 Acesse Supabase
- Abra: https://supabase.com
- Clique em **"Sign In"** (ou crie uma conta se não tiver)
- Faça login com GitHub (recomendado)

### 1.2 Criar novo projeto
- Clique em **"New Project"**
- **Name**: `natture-estoque` (ou o nome que quiser)
- **Database Password**: gere uma senha segura (salve em local seguro!)
- **Region**: escolha a mais perto de você (ex: `South America (São Paulo)`)
- Clique em **"Create new project"** e aguarde ~2-3 minutos

### 1.3 Aguarde o projeto estar pronto
- Quando carregar, você verá a dashboard do projeto
- Procure por **"Project Settings"** (ícone de engrenagem no canto inferior esquerdo)

---

## Passo 2: Pegar as Credenciais

### 2.1 No Supabase, acesse a página de API
- Clique em **"Settings"** (engrenagem no canto inferior)
- Clique em **"API"** (menu da esquerda)

### 2.2 Copie as URLs e chaves
Você vai ver:
- **Project URL**: começa com `https://xxxxx.supabase.co`
- **anon public key**: uma string longa

**Copie e guarde** ambas (você vai precisar em breve):
```
VITE_SUPABASE_URL = <Project URL>
VITE_SUPABASE_ANON_KEY = <anon public key>
```

---

## Passo 3: Criar a Tabela no Supabase

### 3.1 Acesse o SQL Editor
- No menu esquerdo, clique em **"SQL Editor"**
- Clique em **"New Query"**

### 3.2 Cole o SQL abaixo e execute
Copie todo o bloco abaixo e **cole** no editor SQL do Supabase:

```sql
create table if not exists public.products (
  id uuid primary key,
  name text not null,
  code text,
  quantity integer not null default 0,
  category text not null,
  updatedAt bigint not null default 0,
  deletedAt bigint
);

alter table public.products enable row level security;

drop policy if exists "Public read" on public.products;
drop policy if exists "Public write" on public.products;

create policy "Public read"
on public.products
for select
using (true);

create policy "Public write"
on public.products
for all
using (true)
with check (true);
```

### 3.3 Execute o SQL
- Clique no botão **"Run"** (play verde) ou pressione `Ctrl+Enter`
- Espere a confirmação "Success"

✅ A tabela está criada!

---

## Passo 4: Adicionar Secrets no GitHub

### 4.1 Acesse o repositório no GitHub
- Abra: https://github.com/athirson55/Natture-
- Clique em **"Settings"** (aba superior)

### 4.2 Acesse Secrets
- Menu esquerdo: clique em **"Secrets and variables"**
- Clique em **"Actions"** (subitem)

### 4.3 Crie o primeiro secret
- Clique em **"New repository secret"**
- **Name**: `VITE_SUPABASE_URL`
- **Secret**: cole o **Project URL** que você copiou do Supabase
- Clique em **"Add secret"**

### 4.4 Crie o segundo secret
- Clique novamente em **"New repository secret"**
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Secret**: cole a **anon public key** que você copiou do Supabase
- Clique em **"Add secret"**

✅ Os secrets estão configurados!

---

## Passo 5: Fazer Deploy

### 5.1 Atualize o repositório local
No PowerShell (na pasta `D:\natura-stock-pwa\natura-stock`):

```powershell
git add .
git commit -m "feat: Ativar sincronização Supabase em tempo real"
git push origin main
```

### 5.2 Aguarde o GitHub Actions
- Abra: https://github.com/athirson55/Natture-/actions
- Veja o job "CI/CD Deploy" rodando
- Aguarde ~2-3 minutos até ficar verde ✅

### 5.3 Acesse o app
- Abra: https://athirson55.github.io/Natture-/
- Agora você verá um indicador **"Online · Sincronizado"** no canto superior direito
- Tudo que você adicionar/editar vai sincronizar em tempo real

---

## Passo 6: Testar Sincronização (Opcional)

### 6.1 Abra em dois navegadores
- Navegador 1: https://athirson55.github.io/Natture-/ (seu computador)
- Navegador 2 ou outro dispositivo: mesma URL

### 6.2 Teste
- **Navegador 1**: adicione um produto (ex: "Creatina Teste")
- **Navegador 2**: o produto deve aparecer automaticamente em ~1-2 segundos

---

## ✅ Pronto!

Seu sistema agora é **multiusuário com sincronização em tempo real**!

### Características ativas agora:
- ✅ Sincronização entre dispositivos
- ✅ Funciona offline (cache local)
- ✅ Indicador de status (Online/Offline/Sincronizando)
- ✅ Conflitos resolvidos por "última atualização vence"
- ✅ PWA instalável no celular

---

## Troubleshooting

### "Indicador mostra 'Offline' mas tenho internet"
- Abra DevTools (F12) → Console
- Procure por mensagens vermelhas sobre Supabase
- Verifique se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão corretos no GitHub Secrets

### "Adiciono produto mas não aparece em outro dispositivo"
- Verifique se ambos estão online (indicador verde)
- Aguarde 2-3 segundos (tempo de sincronização)
- Recarregue a página (Ctrl+F5) para forçar uma sincronização

### "Erro 'policy violate' ao adicionar produto"
- A tabela pode não ter sido criada corretamente
- Volte ao passo 3 e execute o SQL novamente

---

**Dúvidas?** Deixe rodar por 1-2 horas e veja se os erros desaparecem (às vezes há delay de propagação de secrets no GitHub).
