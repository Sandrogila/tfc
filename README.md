# 🎓 TFC Manager — Sistema de Gestão de Trabalhos de Fim de Curso

O **TFC Manager** é uma plataforma web moderna e robusta para automatizar, organizar e monitorizar todo o ciclo de vida dos Trabalhos de Fim de Curso (TFC) na instituição de ensino (IMETRO). O sistema conecta estudantes, docentes e a coordenação científica num fluxo de trabalho estruturado e auditável.
 
---
##Grupo
**Sangamba Mussumba**
**Katchilimbe Moutinho**
**Felizardo**

## 🚀 Visão Geral e Funcionalidades do Sistema

A plataforma implementa um controlo de acessos baseado em perfis (**RBAC**), oferecendo ecrãs e fluxos dedicados a cada ator do processo:

### 1. 👨‍🎓 Portal do Estudante
* **Submissão de Propostas**: Criação de propostas de TFC com título, área científica, resumo, objetivos e metodologia.
* **Modo Rascunho vs. Submissão**: Salvar o trabalho como rascunho para edição posterior ou submeter diretamente para a avaliação da coordenação/docente.
* **Proposta de Orientador**: Possibilidade de indicar um docente de preferência para guiar o trabalho.
* **Edição e Exclusão**: Gestão autónoma de propostas nos estados de Rascunho ou Submetida.
* **Acompanhamento de Entregas & Diário de Bordo**: Submissão das etapas do TFC (pré-projeto, entregas parciais, versão final) e registo dos diários de bordo sobre os avanços.

### 2. 👩‍🏫 Portal do Docente
* **Gestão de Convites de Orientação**: Visualização das propostas onde foi sugerido como orientador e opção de aceitar ou rejeitar a orientação (com justificativa obrigatória).
* **Controlo de Carga de Trabalho**: O sistema impede que um docente ultrapasse o limite de **5 orientações ativas** em simultâneo (garantindo a qualidade de tutoria).
* **Feedback de Entregas**: Revisão e avaliação dos documentos enviados pelos estudantes com comentários inline.

### 3. 🏛️ Portal da Coordenação (Gestão de Propostas)
* **Painel de Avaliação Centralizado**: Acompanhamento de todas as propostas submetidas na instituição.
* **Aprovação de Propostas**: Aprovação direta do tema de TFC com designação oficial do orientador (o coordenador pode confirmar a sugestão do estudante ou designar outro docente elegível).
* **Rejeição com Justificativa**: Devolução de propostas que não cumpram os critérios metodológicos com fundamentação por escrito.
* **Cadastro de Utilizadores**: Registo unificado de novos estudantes, docentes e coordenadores no sistema.

---

## 🛠️ Stack Tecnológica

* **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
* **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
* **Base de Dados**: [PostgreSQL](https://www.postgresql.org/) (Hospedado no [Supabase](https://supabase.com/))
* **ORM**: [Prisma](https://www.prisma.io/)
* **Autenticação**: [NextAuth.js v5 (Auth.js)](https://authjs.dev/) com criptografia segura via `bcryptjs`.
* **Estilização**: CSS Vanilla moderno com componentes altamente responsivos utilizando design minimalista e moderno (glassmorphism, micro-animações, layout fluido).
* **Validação**: [Zod](https://zod.dev/) para validação rigorosa de esquemas de dados tanto no cliente como no servidor.

---

## 🔌 Possíveis Integrações com Outros Sistemas

O TFC Manager foi arquitetado de forma modular, permitindo a sua extensão para interagir com o ecossistema tecnológico universitário e serviços externos:

### 1. 🏫 Integração com o Sistema Académico Central (ex: SAP / Portal do Aluno)
* **Sincronização de Matrículas**: Importação automática de dados de estudantes aptos a realizar TFC (baseado em créditos concluídos ou disciplinas específicas).
* **Lançamento de Notas**: Envio automático da nota final atribuída pela banca examinadora de TFC diretamente para a folha de notas oficial do aluno no sistema académico central.

### 2. 📄 Integração com Repositórios Digitais Académicos (ex: DSpace / Repositório do IMETRO)
* **Publicação Automática**: Após a aprovação da versão final do TFC pela banca e orientador, o PDF e os metadados (autor, resumo, área) são exportados de forma automática para o repositório institucional aberto.

### 3. ✉️ Notificações e Mensajeria (ex: Resend / SendGrid / WhatsApp API)
* **Alertas em Tempo Real**: Envio de notificações automáticas via E-mail ou WhatsApp quando:
  - Um estudante submete uma proposta (notifica o orientador pretendido).
  - A coordenação avalia ou altera o status da proposta (notifica o estudante).
  - Um prazo de entrega de capítulo está próximo (lembrete automático).

### 4. 🔍 Deteção de Plágio e Inteligência Artificial (ex: Turnitin / CopySpider API)
* **Análise de Originalidade**: Integração com ferramentas de deteção de plágio para fazer o scan automático dos documentos (.pdf, .docx) enviados pelos estudantes na área de entregas.
* **Assistente de Sumarização IA**: Uso de LLMs para gerar resumos executivos automáticos de TFCs concluídos ou analisar a aderência do tema à linha de pesquisa do departamento.

### 5. 📂 Armazenamento de Arquivos em Nuvem (ex: AWS S3 / Azure Blob Storage)
* **Escalabilidade de Arquivos**: Transferência do armazenamento dos documentos entregues pelos estudantes de armazenamento local/base de dados para buckets de alta disponibilidade (como Amazon S3 ou Supabase Storage), otimizando custos e largura de banda.

---

## 📦 Como Instalar e Configurar o Projeto

### Pré-requisitos
* Node.js v18 ou superior instalado.
* Instância do PostgreSQL ativa (ex: projeto criado no Supabase).

### Passo 1: Clonar o Repositório e Instalar Dependências
```bash
git clone https://github.com/seu-usuario/tfc-imetro.git
cd tfc-imetro
npm install
```

### Passo 2: Configurar as Variáveis de Ambiente
Copie o ficheiro `.env.example` para `.env`:
```bash
cp .env.example .env
```
Abra o ficheiro `.env` e configure os seguintes parâmetros:
```env
# URL de conexão transacional para o Supabase (Porta 6543 / pgbouncer)
DATABASE_URL="postgresql://postgres.[SEU-PROJETO]:[SUA-SENHA]@aws-0-[REGIAO].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# URL de conexão direta para o Supabase (Usada pelo Prisma para migrações)
DIRECT_URL="postgresql://postgres.[SEU-PROJETO]:[SUA-SENHA]@aws-0-[REGIAO].pooler.supabase.com:5432/postgres"

# Segredo de segurança do NextAuth (gere com: openssl rand -base64 32)
AUTH_SECRET="seu-segredo-aqui"

# URL do servidor
NEXTAUTH_URL="http://localhost:3000"
```

### Passo 3: Executar as Migrações do Banco de Dados
Para sincronizar o esquema de dados do Prisma com o Supabase:
```bash
npx prisma db push
```

### Passo 4: Semear a Base de Dados (Seed)
Popule a base de dados com contas de teste predefinidas (Estudantes, Docentes e Coordenação):
```bash
npm run db:seed
```

As credenciais geradas por padrão no seed são:
* **Coordenação**: `coord@imetro.ao` / Senha: `Password123`
* **Docente**: `docente1@imetro.ao` / Senha: `Password123`
* **Estudante**: `estudante1@imetro.ao` / Senha: `Password123`

### Passo 5: Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o sistema em funcionamento.

---

## 📁 Estrutura de Pastas Principal

```text
├── app/                  # Roteamento baseado em App Router do Next.js
│   ├── (auth)/           # Rotas de login e registo de conta
│   └── (dashboard)/      # Rotas internas protegidas (estudante, docente, coordenação)
├── components/           # Componentes de UI reutilizáveis (layout, forms, feedbacks)
├── lib/                  # Utilitários de configuração (Prisma client, NextAuth)
├── prisma/               # Esquema da base de dados e scripts de seed
├── repositories/         # Padrão Repository para isolar queries ao banco de dados
├── services/             # Regras de negócio e lógica de validação do domínio
└── public/               # Ativos estáticos (imagens, ícones)
```
