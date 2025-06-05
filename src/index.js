import maquinaEstados from "./core/maquinaEstados.js";
import { logger } from "./config/logger.js";
import http from "http";
import { register } from "prom-client";

const serverMetricas = http.createServer(async (req, res ) => {

    if (req.url === "/metrics") {

        try {

            const metricsRegistryContent = await register.getMetricsAsJSON();
            console.log("DEBUG: Conteúdo do Registro de Métricas:", JSON.stringify(metricsRegistryContent, null, 2));
            
            res.setHeader("Content-Type", register.contentType);
            res.end(await register.metrics());

        } catch (ex) {
            console.error("Erro ao gerar métricas:", ex);
            res.writeHead(500).end(ex);

        }

    } else {

        res.writeHead(404).end("Not Found");

    }

});

const metricsPort = process.env.METRICS_PORT || 9090;

serverMetricas.listen(metricsPort, () => {

    logger.info(`Servidor de Métricas rodando em http://localhost:${metricsPort}` );

});

console.log("\nBem vindo ao MandaChuva, seu chat de previsão do tempo!");

logger.info("Iniciando o chatbot...");
maquinaEstados.inicio();