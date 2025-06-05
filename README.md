# Chatbot_Clima_Node

Chatbot de linha de comando para consulta de previsão do tempo utilizando Node.js, Docker e APIs externas.

## Objetivos

Desenvolver um chatbot CLI que permita ao usuário consultar a previsão do tempo atual para uma cidade brasileira, utilizando uma máquina de estados simples, Node.js e incorporando ferramentas de observabilidade (logs estruturados e métricas básicas de API).

## Funcionalidades Implementadas

*   **Consulta de Clima:** Permite ao usuário informar o nome de uma cidade brasileira para obter a previsão do tempo atual.

    Utiliza a API Nominatim (baseada no OpenStreetMap) para buscar as coordenadas geográficas (latitude e longitude) da cidade informada.

    Utiliza a API Open-Meteo para obter os dados de tempo atuais (temperatura, sensação térmica, umidade, etc.) com base nas coordenadas encontradas.

*   **Interface Interativa:** Interage com o usuário via linha de comando (CLI) através de um fluxo de perguntas e respostas (utilizando `inquirer`).

    O usuário pode consultar o tempo, optar por fazer uma nova consulta para outra cidade ou encerrar a aplicação.

    A lógica de interação é gerenciada por uma máquina de estados simples implementada em Node.js.

*   **Observabilidade - Logs:** Eventos internos importantes, sucessos e erros são registrados em formato JSON estruturado no arquivo `chatbot.log` dentro do container (utilizando `winston`). A saída direta para o usuário no console é mantida limpa.

*   **Observabilidade - Métricas:** Métricas básicas sobre as chamadas às APIs externas (Nominatim e Open-Meteo), contando sucessos e falhas, são coletadas (utilizando `prom-client`) e expostas em formato Prometheus.

*   **Docker:** O projeto é totalmente containerizado utilizando Docker e Docker Compose para facilitar a configuração do ambiente e a execução.

## Configurações do ambiente

*   **Node.js:** Versão LTS

*   **Docker** Necessário para construir e executar o container.

*   **Bibliotecas Principais:** `inquirer` (interação CLI), `axios` (chamadas HTTP), `winston` (logs), `prom-client` (métricas).

*   **APIs Externas:** Nominatim (OpenStreetMap), Open-Meteo.

## Utilização

*   **Pré-requisitos:** É necessário ter o Docker instalado e em execução.

Na pasta raiz do projeto, no terminal, execute o comando para construir a imagem:

    docker-compose build

*   **Execução em Segundo Plano (Servidor de Métricas):** Para rodar o servidor de métricas, execute:

    docker-compose up -d

*   **Execução Interativa do Chatbot:** Para usar o chatbot e interagir com ele via terminal, execute:

    docker-compose run --rm app

*   **Acesso às Métricas:** Enquanto o chatbot está em execução (via `docker-compose run`), o servidor de métricas também estará ativo. Você pode acessar as métricas expostas em formato Prometheus abrindo o seguinte endereço no seu navegador:

    http://localhost:9090/metrics

*   **Parar a Execução:**

    *Opção "Sair" do chatbot ou pressionar Ctrl+C.

    *Se estiver rodando em segundo plano com `up -d`, use o comando para parar e remover os containers:

        docker-compose down

*   **Verificação dos Logs:** Os logs internos detalhados da aplicação são salvos no arquivo `chatbot.log` dentro do diretório `/app` do projeto.