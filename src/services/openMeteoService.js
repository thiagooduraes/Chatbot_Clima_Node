import axios from 'axios';
import { fetchWeatherApi } from 'openmeteo';
import { logger } from "../config/logger.js";
import { openMeteoApiCalls } from "../config/metrics.js";
import { register } from "prom-client";

async function getClima(lat, lon) {

    const params = {
        latitude: lat,
        longitude: lon,
        current: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "precipitation",
            "weather_code",
            "wind_speed_10m"
        ],
        timezone: "auto"
    };

    const url = "https://api.open-meteo.com/v1/forecast";

    logger.info("Buscando clima", { 
        url: url,
        params: params
    });
    
    try {
        const response = await axios.get(url, { params: params });

        openMeteoApiCalls.labels('success').inc();
        logger.info("Informações encontradas", {
            response: response
        })

        const current = response.data.current;
        
        const dadosTempo = {
            time: current.time,
            temperature2m: current.temperature_2m,
            relativeHumidity2m: current.relative_humidity_2m,
            apparentTemperature: current.apparent_temperature,
            precipitation: current.precipitation,
            weatherCode: current.weather_code,
            windSpeed10m: current.wind_speed_10m,
        };

        return dadosTempo;
    } catch (error) {
        openMeteoApiCalls.labels('failure').inc();
        console.error("Erro ao buscar clima:", error);
        logger.error("Erro ao buscar clima", {
            error: error
        })
        return null;
    }

}

export { getClima };