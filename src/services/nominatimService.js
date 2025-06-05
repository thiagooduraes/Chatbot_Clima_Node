import axios from 'axios';

async function getCoordenadas(cidade) {

    //let nomeCidade = encodeURI(cidade);

    const url = `https://nominatim.openstreetmap.org/search`;
    
    //console.log(nomeCidade);
    //console.log(url);
    
    try {
        const response = await axios.get(url, {
            params: {
                q: cidade,
                format: 'jsonv2',
                addressdetails: 1,
                limit: 1,
                countrycodes: 'BR'
            },
            headers: {
                'User-Agent': 'Chatbot_Clima_Node/1.0 (thiagooduraes@gmail.com)'
            }
        });

        if (response.data && response.data.length > 0) {
            if (response.data[0].addresstype === 'municipality') { 
                const { name, lat, lon } = response.data[0];
                return { name, lat, lon };  
            } else {
                const{name} = response.data[0];
                return {name};
            }
        } else {
            return 0;
        }
    } catch (error) {
        console.error(`Erro: ${error.message}`);
        return null;
    }
}

export { getCoordenadas };