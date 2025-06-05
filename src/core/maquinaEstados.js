import inquirer from "inquirer";
import { getCoordenadas } from "../services/nominatimService.js";
import { getClima } from "../services/openMeteoService.js";
import { obterDescricaoCondicao, formatarDataHora } from "../services/utils.js";
import { logger } from "../config/logger.js";

const ESTADOS = {
    INICIO: "INICIO",
    AGUARDANDO_CIDADE: "AGUARDANDO_CIDADE",
    BUSCANDO_CIDADE: "BUSCANDO_CIDADE",
    ERRO_API_CIDADE: "ERRO_API_CIDADE",
    BUSCANDO_CLIMA: "BUSCANDO_CLIMA",
    ERRO_API_CLIMA: "ERRO_API_CLIMA",
    MOSTRANDO_INFORMACOES: "MOSTRANDO_INFORMACOES",
    FIM: "FIM"
}

let estadoAtual = ESTADOS.INICIO;
let cidadeAtual = null;
let latitude = null;
let longitude = null;
let dadosTempo = null;

function getEstadoAtual() {
    return estadoAtual;
}

function setEstadoAtual(estado) {
    estadoAtual = estado;

    logger.info("Estado atual alterado", { 
        estado: estado
    });

    handleEstado(estado);
}

function getCidadeAtual() {
    return cidadeAtual;
}

function setCidadeAtual(cidade) {
    cidadeAtual = cidade;

    logger.info("Cidade atual alterada", { 
        cidade: cidade
    });
}

function setCoordenadas(lat, lon) {
    latitude = lat;
    longitude = lon;

    logger.info("Coordenadas alteradas", { 
        latitude: latitude,
        longitude: longitude
    });
}

function setDadosTempo(dados) {
    dadosTempo = dados;

    logger.info("Dados do tempo alterados", { 
        dados: dados
    });
}

function opcaoEntrada(opcao){

    if (opcao === "1" || opcao.toLowerCase() === "sim") {
        return ESTADOS.AGUARDANDO_CIDADE;

    } else if (opcao === "2" || opcao.toLowerCase() === "sair" || opcao.toLowerCase() === "nao" || opcao.toLowerCase() === "não") {
        return ESTADOS.FIM;

    } else {
        console.log("Opção inválida.");
        logger.info("Opção de entrada inválida");

        return ESTADOS.INICIO;
    }
}

async function handleEstado(estado) {
    switch (estado) {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.INICIO:
            logger.info("Estado INICIO - Pergunta se deseja consultar clima");
 
            console.log("\nO que você deseja fazer?");
            console.log("[1] Consultar clima de uma cidade");
            console.log("[2] Sair");

            const opcaoInicio = await inquirer.prompt({
                type: "input",
                name: "opcao",
                message: ""
            });

            logger.info("Opção escolhida", {
                opcao: opcaoInicio.opcao
            });

            setEstadoAtual(opcaoEntrada(opcaoInicio.opcao));

            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.AGUARDANDO_CIDADE:
            logger.info("Estado AGUARDANDO_CIDADE - Solicita nome da cidade");

            const cidade = await inquirer.prompt({
                type: "input",
                name: "cidade",
                message: "Digite o nome da cidade: "
            });

            logger.info("Nome da cidade informada", {
                cidade: cidade.cidade
            });
            
            setCidadeAtual(cidade.cidade);
            setEstadoAtual(ESTADOS.BUSCANDO_CIDADE);

            break;
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.BUSCANDO_CIDADE:
            logger.info("Estado BUSCANDO_CIDADE - Busca coordenadas da cidade informada");

            const coordenadas = await getCoordenadas(cidadeAtual);

            try{
                if (coordenadas && coordenadas.name && coordenadas.lat && coordenadas.lon) {
                    setCidadeAtual(coordenadas.name);
                    setCoordenadas(coordenadas.lat, coordenadas.lon);
                    setEstadoAtual(ESTADOS.BUSCANDO_CLIMA);

                } else if (coordenadas && coordenadas.name) {
                    setCidadeAtual(coordenadas.name);

                    console.log(`O endereço ${cidadeAtual} não é de uma cidade cadastrada.`);
                    logger.info("Nome de cidade não é de uma cidade cadastrada na API", {
                        cidade: cidadeAtual
                    })

                    setEstadoAtual(ESTADOS.INICIO);

                }  else if (coordenadas === 0) {

                    console.log(`Nenhuma coordenada encontrada para a cidade ${cidadeAtual}.`);
                    logger.info("Nenhuma coordenada encontrada para a cidade", {
                        cidade: cidadeAtual
                    })

                    setEstadoAtual(ESTADOS.INICIO);

                } else {

                    logger.error("Erro ao buscar coordenadas para a cidade", {
                        cidade: cidadeAtual
                    });

                    setCidadeAtual(ESTADOS.ERRO_API_CIDADE);

                }
            } catch (error) {
                
                logger.error("Erro na API de coordenadas", {
                    error: error
                });

                setCidadeAtual(ESTADOS.ERRO_API_CIDADE);
            }

            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.ERRO_API_CIDADE:
            logger.info("Estado ERRO_API_CIDADE - Erro ao buscar coordenadas da cidade informada");

            console.log(`Erro ao buscar coordenadas para a cidade ${cidadeAtual}. Tente novamente.`);

            setEstadoAtual(ESTADOS.INICIO);

            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.BUSCANDO_CLIMA:
            logger.info("Estado BUSCANDO_CLIMA - Busca clima da cidade informada");

            console.log(`Buscando dados da cidade ${cidadeAtual}`);

            try{
                const clima = await getClima(latitude, longitude);
                
                if (clima) {

                    setDadosTempo(clima);
                    setEstadoAtual(ESTADOS.MOSTRANDO_INFORMACOES);

                } else {

                    logger.error("Erro ao buscar clima para a cidade", {
                        cidade: cidadeAtual
                    });

                    setEstadoAtual(ESTADOS.ERRO_API_CLIMA);
                }

            } catch (error) {

                logger.error("Erro na API de clima", {
                    error: error
                });

                setEstadoAtual(ESTADOS.ERRO_API_CLIMA);
            }

            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.ERRO_API_CLIMA:
            logger.info("Estado ERRO_API_CLIMA - Erro ao buscar clima da cidade informada");

            console.log(`Erro ao buscar clima para a cidade ${cidadeAtual}. Tente novamente.`);

            setEstadoAtual(ESTADOS.INICIO);

            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.MOSTRANDO_INFORMACOES:
            logger.info("Estado MOSTRANDO_INFORMACOES - Mostra informações do clima da cidade informada");

            console.log(`\n------ Dados do Tempo Atual da cidade ${cidadeAtual} ------`);
            console.log(`\nData da informação: ${formatarDataHora(dadosTempo.time.toLocaleString())}`);
            console.log(`\nTemperatura: ${dadosTempo.temperature2m}°C`);
            console.log(`Humidade Relativa: ${dadosTempo.relativeHumidity2m}%`);
            console.log(`Sensação Térmica: ${dadosTempo.apparentTemperature}°C`);
            console.log(`Precipitação: ${dadosTempo.precipitation} mm`);
            console.log(`Condição atual: ${obterDescricaoCondicao(dadosTempo.weatherCode)}`);
            console.log(`Velocidade do Vento: ${dadosTempo.windSpeed10m} km/h`);

            setEstadoAtual(ESTADOS.INICIO);

            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.FIM:
            logger.info("Estado FIM - Encerra o chatbot");

            console.log("Obrigado por usar o MandaChuva! Até mais!");
            
            process.exit(0);
            break;
    }
}

function inicio() {
    handleEstado(estadoAtual);
}

export default {
    ESTADOS,
    getEstadoAtual,
    setEstadoAtual,
    getCidadeAtual,
    setCidadeAtual,
    inicio
}