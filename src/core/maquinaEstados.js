import inquirer from "inquirer";
import { getCoordenadas } from "../services/nominatimService.js";
import { getClima } from "../services/openMeteoService.js";
import { obterDescricaoCondicao, formatarDataHora } from "../services/utils.js";

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
    handleEstado(estado);
}

function getCidadeAtual() {
    return cidadeAtual;
}

function setCidadeAtual(cidade) {
    cidadeAtual = cidade;
}

function setCoordenadas(lat, lon) {
    latitude = lat;
    longitude = lon;
}

function setDadosTempo(dados) {
    dadosTempo = dados;
}

function opcaoEntrada(opcao){
    if (opcao === "1" || opcao.toLowerCase() === "sim") {
        return ESTADOS.AGUARDANDO_CIDADE;
    } else if (opcao === "2" || opcao.toLowerCase() === "sair" || opcao.toLowerCase() === "nao" || opcao.toLowerCase() === "não") {
        return ESTADOS.FIM;
    } else {
        console.log("Opção inválida.");
        return ESTADOS.INICIO;
    }
}

async function handleEstado(estado) {
    switch (estado) {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.INICIO:

            console.log("\nO que você deseja fazer?");
            console.log("[1] Consultar clima de uma cidade");
            console.log("[2] Sair");

            const opcaoInicio = await inquirer.prompt({
                type: "input",
                name: "opcao",
                message: ""
            });

            setEstadoAtual(opcaoEntrada(opcaoInicio.opcao));

            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.AGUARDANDO_CIDADE:

            const cidade = await inquirer.prompt({
                type: "input",
                name: "cidade",
                message: "Digite o nome da cidade: "
            });
            
            setCidadeAtual(cidade.cidade);
            setEstadoAtual(ESTADOS.BUSCANDO_CIDADE);

            break;
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.BUSCANDO_CIDADE:

            //console.log(`Buscando coordenadas da cidade ${cidadeAtual}`);

            const coordenadas = await getCoordenadas(cidadeAtual);

            try{
                if (coordenadas && coordenadas.name && coordenadas.lat && coordenadas.lon) {
                    setCidadeAtual(coordenadas.name);
                    setCoordenadas(coordenadas.lat, coordenadas.lon);
                    //console.log(`Coordenadas da cidade ${coordenadas.name}: Lat ${coordenadas.lat}, Lon ${coordenadas.lon}`);
                    setEstadoAtual(ESTADOS.BUSCANDO_CLIMA);

                } else if (coordenadas && coordenadas.name) {
                    setCidadeAtual(coordenadas.name);
                    console.log(`O endereço ${cidadeAtual} não é de uma cidade cadastrada.`);
                    setEstadoAtual(ESTADOS.INICIO);

                }  else if (coordenadas === 0) {
                    console.log(`Nenhuma coordenada encontrada para a cidade ${cidadeAtual}.`);
                    setEstadoAtual(ESTADOS.INICIO);

                } else {
                    //console.log(`Erro ao buscar coordenadas para a cidade ${cidadeAtual}.`);
                    setCidadeAtual(ESTADOS.ERRO_API_CIDADE);

                }
            } catch (error) {
                //console.log(`Erro ao buscar coordenadas para a cidade ${cidadeAtual}: ${error.message}`);
                setCidadeAtual(ESTADOS.ERRO_API_CIDADE);
            }

            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.ERRO_API_CIDADE:

            console.log(`Erro ao buscar coordenadas para a cidade ${cidadeAtual}. Tente novamente.`);

            setEstadoAtual(ESTADOS.INICIO);

            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.BUSCANDO_CLIMA:

            console.log(`Buscando dados da cidade ${cidadeAtual}`);

            try{
                const clima = await getClima(latitude, longitude);
                
                if (clima) {
                    setDadosTempo(clima);
                    setEstadoAtual(ESTADOS.MOSTRANDO_INFORMACOES);
                } else {
                    //console.log(`Erro ao buscar clima para a cidade ${cidadeAtual}.`);
                    setCidadeAtual(ESTADOS.ERRO_API_CLIMA);
                }
            } catch (error) {
                //console.log(`Erro ao buscar clima para a cidade ${cidadeAtual}: ${error.message}`);
                setCidadeAtual(ESTADOS.ERRO_API_CLIMA);
            }

            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.ERRO_API_CLIMA:

            console.log(`Erro ao buscar clima para a cidade ${cidadeAtual}. Tente novamente.`);

            setEstadoAtual(ESTADOS.INICIO);

            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.MOSTRANDO_INFORMACOES:

            console.log(`\n--- Dados do Tempo Atual da cidade ${cidadeAtual} ---`);
            console.log(`Data: ${formatarDataHora(dadosTempo.time.toLocaleString())}`);
            console.log(`Temperatura: ${dadosTempo.temperature2m}°C`);
            console.log(`Humidade Relativa: ${dadosTempo.relativeHumidity2m}%`);
            console.log(`Sensação Térmica: ${dadosTempo.apparentTemperature}°C`);
            console.log(`Precipitação: ${dadosTempo.precipitation} mm`);
            console.log(`Condição atual: ${obterDescricaoCondicao(dadosTempo.weatherCode)}`);
            console.log(`Velocidade do Vento: ${dadosTempo.windSpeed10m} km/h`);

            setEstadoAtual(ESTADOS.INICIO);

            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case ESTADOS.FIM:

            console.log("Obrigado por usar o MandaChuva! Até mais!");

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