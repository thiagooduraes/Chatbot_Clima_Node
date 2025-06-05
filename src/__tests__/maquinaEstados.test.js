import {inicio, ESTADOS} from "../core/maquinaEstados.js";
import inquirer from "inquirer";
import * as nominatim from "../services/nominatimService.js";
import * as openMeteo from "../services/openMeteoService.js";


jest.mock('inquirer', () => ({
    prompt: jest.fn()
}));

jest.mock('../services/nominatimService.js', () => ({
    getCoordenadas: jest.fn()
}));

jest.mock('../services/openMeteoService.js', () => ({
    getClima: jest.fn()
}));

const mockSaida = jest.spyOn(process, 'exit').mockImplementation(() => {});

describe("Maquina de estados", () => {

    const mockedInquirer = inquirer;
    const mockedNominatim = nominatim;
    const mockedOpenMeteo = openMeteo;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Fluxo principal com cidade válida', async () => {

        mockedInquirer.prompt
            .mockResolvedValueOnce({ opcao: "1" })
            .mockResolvedValueOnce({ cidade: "montes claros" })
            .mockResolvedValueOnce({ opcao: "sAiR" });
        
        mockedNominatim.getCoordenadas.mockResolvedValue({ lat: 1, lon: 1 });
        mockedOpenMeteo.getClima.mockResolvedValue({ current: { 
                                                        temperature_2m: 1, 
                                                        relative_humidity_2m: 1, 
                                                        apparent_temperature: 1, 
                                                        precipitation: 1, 
                                                        weather_code: 1, 
                                                        wind_speed_10m: 1 } });

        await inicio();
        
        expect(mockedNominatim.getCoordenadas).toHaveBeenCalledWith("montes claros");
        expect(mockedOpenMeteo.getClima).toHaveBeenCalledWith(1, 1);

        expect(mockedInquirer.prompt).toHaveBeenCalledTimes(3);

        expect(mockSaida).toHaveBeenCalledWith(0);

    });
});