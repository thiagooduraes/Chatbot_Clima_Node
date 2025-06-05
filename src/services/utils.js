function obterDescricaoCondicao(weatherCode) {
  let condicaoAtual = "Desconhecido";

  switch (weatherCode) {
    case 0:
      condicaoAtual = "Céu limpo";
      break;
    case 1:
      condicaoAtual = "Principalmente limpo";
      break;
    case 2:
      condicaoAtual = "Parcialmente nublado";
      break;
    case 3:
      condicaoAtual = "Nublado";
      break;
    case 45:
      condicaoAtual = "Névoa";
      break;
    case 48:
      condicaoAtual = "Névoa úmida congelante";
      break;
    case 51:
      condicaoAtual = "Chuvisco: Leve";
      break;
    case 53:
      condicaoAtual = "Chuvisco: Moderado";
      break;
    case 55:
      condicaoAtual = "Chuvisco: Denso";
      break;
    case 56:
      condicaoAtual = "Chuvisco Congelante: Leve";
      break;
    case 57:
      condicaoAtual = "Chuvisco Congelante: Denso";
      break;
    case 61:
      condicaoAtual = "Chuva: Leve";
      break;
    case 63:
      condicaoAtual = "Chuva: Moderada";
      break;
    case 65:
      condicaoAtual = "Chuva: Forte";
      break;
    case 66:
      condicaoAtual = "Chuva Congelante: Leve";
      break;
    case 67:
      condicaoAtual = "Chuva Congelante: Forte";
      break;
    case 71:
      condicaoAtual = "Nevasca: Leve";
      break;
    case 73:
      condicaoAtual = "Nevasca: Moderada";
      break;
    case 75:
      condicaoAtual = "Nevasca: Forte";
      break;
    case 77:
      condicaoAtual = "Grãos de neve";
      break;
    case 80:
      condicaoAtual = "Pancadas de Chuva: Leves";
      break;
    case 81:
      condicaoAtual = "Pancadas de Chuva: Moderadas";
      break;
    case 82:
      condicaoAtual = "Pancadas de Chuva: Fortes/Violentas";
      break;
    case 85:
      condicaoAtual = "Pancadas de Neve: Leves";
      break;
    case 86:
      condicaoAtual = "Pancadas de Neve: Fortes";
      break;
    case 95:
      condicaoAtual = "Tempestade com Trovões: Leve ou Moderada";
      break;
    case 96:
      condicaoAtual = "Tempestade com Trovões e Granizo Leve";
      break;
    case 99:
      condicaoAtual = "Tempestade com Trovões e Granizo Forte";
      break;
    default:
      condicaoAtual = "Código de clima desconhecido";
  }

  return condicaoAtual;
}

function formatarDataHora(dataString) {
  const data = new Date(dataString);

  const horas = data.getUTCHours().toString().padStart(2, '0');
  const minutos = data.getUTCMinutes().toString().padStart(2, '0');


  const dia = data.getUTCDate().toString().padStart(2, '0');
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const mes = meses[data.getUTCMonth()];
  const ano = data.getUTCFullYear();

  return `${horas}:${minutos} horas do dia ${dia} de ${mes} de ${ano}`;
}

export { obterDescricaoCondicao, formatarDataHora };