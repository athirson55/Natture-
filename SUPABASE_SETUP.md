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
- Você verá a página: `https://github.com/athirson55/Natture-/settings/secrets/actions`

### 4.3 Crie o primeiro secret (VITE_SUPABASE_URL)

- Clique em **"New repository secret"** (botão verde)
- **Name**: `VITE_SUPABASE_URL`
- **Secret**: Cole aqui:
  ```
  https://gabmdwlscwuocmytvfjg.supabase.co
  ```
- Clique em **"Add secret"**

### 4.4 Crie o segundo secret (VITE_SUPABASE_ANON_KEY)

- Clique novamente em **"New repository secret"** (botão verde)
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Secret**: Cole aqui a **Publishable key** que você pegou no Supabase (começa com `sb_publishable_...`)
- Clique em **"Add secret"**

✅ Os dois secrets aparecem agora na lista com um símbolo de ✓

---

## Passo 5: Fazer Deploy

⚠️ **IMPORTANTE**: Os secrets devem estar criados no GitHub ANTES de fazer push!

### 5.1 Abra o PowerShell

- Pressione: `Windows + R`
- Digite: `powershell`
- Pressione: `Enter`

### 5.2 Navegue até a pasta do projeto

```powershell
cd D:\natura-stock-pwa\natura-stock
```

Pressione `Enter`.

### 5.3 Faça o git push

```powershell
git push origin main
```

Pressione `Enter` e aguarde a mensagem de sucesso:

```
To https://github.com/athirson55/Natture-.git
   e5d9c30..xxxxx  main -> main
```

✅ Push feito com sucesso!

### 5.4 Aguarde o GitHub Actions

- Abra: https://github.com/athirson55/Natture-/actions
- Você verá um job chamado **"feat: Sincronizacao multiusuario..."** rodando
- Espere até ficar **verde** (✅) - leva ~2-3 minutos
- Se ficar vermelho (❌), veja a seção **Troubleshooting**

### 5.5 Acesse o app e veja a magia acontecer!

- Abra: https://athirson55.github.io/Natture-/
- Você verá no **canto superior direito** um indicador:
  - 🟢 **"Online · Sincronizado"** = tudo funcionando!
  - 🔵 **"Online · Sincronizando..."** = sincronização em andamento
  - ⚫ **"Offline"** = sem conexão (vai funcionar com cache local)

---

## Passo 6: Testar Sincronização em Tempo Real (Opcional)

### 6.1 Abra em dois navegadores/dispositivos

- **Navegador 1**: https://athirson55.github.io/Natture-/ (seu computador)
- **Navegador 2** ou **celular**: https://athirson55.github.io/Natture-/ (mesma URL)

### 6.2 Teste a sincronização

1. **Navegador 1**: Clique em **"Adicionar Produto"** (ou acesse o form)
2. **Navegador 1**: Preencha:
   - **Nome**: "Creatina Teste"
   - **Código**: "TEST001"
   - **Categoria**: "Suplementos"
   - **Quantidade**: 10
3. **Navegador 1**: Clique em **"Salvar"**
4. **Navegador 2**: Aguarde 1-2 segundos...
   - O produto aparece automaticamente! 🚀

### 6.3 Teste edição em tempo real

1. **Navegador 1**: Clique em "Creatina Teste" para editar
2. **Navegador 1**: Mude a quantidade para 20
3. **Navegador 1**: Clique em "Salvar"
4. **Navegador 2**: A quantidade muda sozinha em 1-2 segundos!

---

## ✅ Checklist Final

Antes de fazer push, verifique:

- ✅ Supabase Project URL: `https://gabmdwlscwuocmytvfjg.supabase.co`
- ✅ SQL executado no Supabase (tabela `products` criada)
- ✅ GitHub Secret `VITE_SUPABASE_URL` adicionado
- ✅ GitHub Secret `VITE_SUPABASE_ANON_KEY` adicionado
- ✅ PowerShell na pasta `D:\natura-stock-pwa\natura-stock`
- ✅ Pronto para fazer `git push origin main`

---

## ✅ Pronto!

Seu sistema agora é **multiusuário com sincronização em tempo real**!

### Características ativas agora:

- ✅ Sincronização entre dispositivos em tempo real (~1-2s)
- ✅ Funciona offline (cache local com IndexedDB)
- ✅ Indicador de status (Online/Offline/Sincronizando)
- ✅ Conflitos resolvidos por "última atualização vence"
- ✅ PWA instalável no celular
- ✅ CI/CD automático no GitHub Actions

---

## 🔧 Troubleshooting

### ❌ "GitHub Actions falhou (workflow vermelho)"

**Causa**: Secrets não foram criados ou estão com nome errado

**Solução**:

1. Abra: https://github.com/athirson55/Natture-/settings/secrets/actions
2. Verifique se aparecem:
   - `VITE_SUPABASE_URL` ✓
   - `VITE_SUPABASE_ANON_KEY` ✓
3. Se não estiverem, crie novamente (Passo 4)
4. Faça novo push: `git push origin main`

### ❌ "Indicador mostra 'Offline' mas tenho internet"

**Causa 1**: Secrets incorretos ou não propagados ainda

**Solução 1**:

- Abra DevTools (pressione `F12`)
- Vá em **Console**
- Procure por mensagens vermelhas sobre Supabase (ex: "VITE_SUPABASE_URL is not defined")
- Se houver, aguarde ~5-10 minutos (delay de propagação de secrets)
- Recarregue a página (Ctrl+F5)

**Causa 2**: Banco de dados não foi criado

**Solução 2**:

- Abra DevTools (F12) → Console
- Procure por erro: `relation "public.products" does not exist`
- Volte ao Passo 3 e execute o SQL novamente no Supabase

### ❌ "Adiciono produto mas não aparece em outro dispositivo"

**Verificação**:

1. Ambos os navegadores mostram indicador verde (Online)?
2. Aguardou 2-3 segundos?
3. Tente recarregar (Ctrl+F5)

**Se ainda não funcionar**:

- Abra DevTools (F12) → Console
- Procure por erros relacionados a Supabase
- Verifique se a tabela `products` existe no Supabase SQL Editor

### ❌ "Erro 'policy violate' ao adicionar produto"

**Causa**: Políticas de RLS não foram criadas

**Solução**:

1. Abra Supabase → SQL Editor
2. Copie novamente TODO o bloco SQL do Passo 3.2
3. Cole em um novo query
4. Clique "Run"
5. Recarregue o app (Ctrl+F5)

### ✅ "Tudo funcionando mas tá lento"

Normal! Supabase free tier tem latência de ~1-2 segundos. Se for muito mais, pode ser:

- Conexão lenta
- Muitos produtos sendo sincronizados
- Problemas de rede (teste em outro WiFi)

---

## 📞 Precisa de ajuda?

Se algo der errado:

1. **Leia o Troubleshooting** acima
2. **Veja os logs do GitHub Actions**:
   - https://github.com/athirson55/Natture-/actions
   - Clique no job que falhou
   - Veja a mensagem de erro
3. **Verifique DevTools**:
   - Pressione F12 → Console
   - Procure por mensagens vermelhas
   - Copie a mensagem de erro
