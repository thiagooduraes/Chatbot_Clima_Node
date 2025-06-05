import axios from 'axios';
import { fetchWeatherApi } from 'openmeteo';

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
    
    try {
        const response = await axios.get(url, { params: params });

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
        console.error("Erro ao buscar clima:", error);
        return null;
    }

}

export { getClima };