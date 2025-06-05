import promClient, { register } from "prom-client";


const nominatimApiCalls = new promClient.Counter({

  name: "chatbot_nominatim_api_calls_total",
  help: "Total de chamadas feitas à API Nominatim",
  labelNames: ["status"],

});

const openMeteoApiCalls = new promClient.Counter({

  name: "chatbot_openmeteo_api_calls_total",
  help: "Total de chamadas feitas à API Open-Meteo",
  labelNames: ["status"],
  
});



export {

  nominatimApiCalls,
  openMeteoApiCalls,
  
};
