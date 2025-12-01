# 🛒 Sistema PDV - Frontend

Interface web moderna para sistema de Ponto de Venda, desenvolvida com Next.js 14+ (App Router), TypeScript e Tailwind CSS.

# 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- Node.js (Versão 18 ou superior recomendada)

- Gerenciador de pacotes `npm` (geralmente vem com o Node) ou `yarn`.

# 🚀 Instalação e Configuração

Siga os passos abaixo para configurar o projeto localmente.

#### 1. Instalar Dependências

Abra o terminal na pasta `frontend` e execute:

    bash npm install
    #ou
    yarn install


#### 2. Configurar Variáveis de Ambiente

O Next.js precisa saber onde está rodando sua API (Backend).

Crie uma cópia do arquivo de exemplo:

    cp .env.local.example .env.local
    # No Windows (PowerShell): copy .env.local.example .env.local


Abra o arquivo .env.local criado e verifique se a URL aponta para o seu Backend FastAPI:

    NEXT_PUBLIC_API_URL=http://localhost:8000


(Caso seu backend esteja em outra porta ou servidor, altere este valor).

# 💻 Executando o Projeto

#### Modo de Desenvolvimento

Para programar e ver alterações em tempo real (Hot Reload):

    npm run dev


O sistema estará acessível em: http://localhost:3000

#### Modo de Produção (Recomendado para Uso Real)

Para rodar o sistema com máxima performance e otimização em um único comando:

    npm run prod


Este comando irá compilar o projeto automaticamente e iniciar o servidor.

# 🛠️ Funcionalidades Principais

- Ponto de Venda (PDV): Interface ágil com suporte a leitor de código de barras.

- Caixa: Abertura e fechamento de turno, controle de operador e terminal.

- Gestão: Cadastro de produtos, controle de estoque e usuários.

- Relatórios: Dashboard gerencial e histórico de vendas.

- Backup: Ferramenta integrada de backup e restauração.

# 📦 Estrutura de Pastas

- `src/app`: Páginas e rotas da aplicação.

- `src/components`: Componentes reutilizáveis (Modais, Cards, etc).

- `src/context`: Gerenciamento de estado global (Autenticação).

- `src/services`: Configuração do Axios e API.

# ⚠️ Solução de Problemas Comuns

Erro de Conexão (Network Error):

- Verifique se o Backend FastAPI está rodando (`http://localhost:8000`).

- Verifique se o arquivo `.env.local` está configurado corretamente.

- Reinicie o servidor frontend após alterar variáveis de ambiente.

Erro de CORS:

Verifique no arquivo `main.py` do Backend se `http://localhost:3000` está na lista de origins.
