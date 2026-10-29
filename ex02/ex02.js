function tarifaPorKwh(tipo) {
    switch (tipo) {
        case 'residencial':
        case 'rural':
            return 0.80;
        case 'comercial':
        case 'industrial':
            return 0.95;
    }
}
function adicionalBandeira(consumo, bandeira = 'verde') {
    switch (bandeira) {
        case 'verde':
            return 0;
        case 'amarela':
            return consumo * 0.02;
        case 'vermelha1':
            return consumo * 0.04;
        case 'vermelha2':
            return consumo * 0.08;
    }
}
function mensagemBandeira(bandeira) {
    switch (bandeira) {
        case 'verde':
            return "Condições favoráveis de geração de energia.";
        case 'amarela':
            return "Condições de geração menos favoráveis.";
        case 'vermelha1':
        case 'vermelha2':
            return "Condições mais caras de geração. Economize!";
        default:
            return "";
    }
}
// Teste do parâmetro padrão (Tarefa 8)
// Resultado: 0. O motivo é que ao omitir o argumento da bandeira, o parâmetro assume 'verde' por padrão, cujo adicional por kWh é R$ 0,00.
console.log(`Teste adicionalBandeira(100) sem bandeira: R$ ${adicionalBandeira(100).toFixed(2)}`);
const botaoCalcular = document.getElementById("calcular");
if (botaoCalcular) {
    botaoCalcular.addEventListener("click", () => {
        const inputConsumo = document.getElementById("consumo");
        const selectTipo = document.getElementById("tipo");
        const selectBandeira = document.getElementById("bandeira");
        const divResultado = document.getElementById("resultado");
        const consumo = parseFloat(inputConsumo.value);
        const tipo = selectTipo.value;
        const bandeira = selectBandeira.value;
        if (consumo <= 0 || isNaN(consumo)) {
            divResultado.textContent = "Informe um consumo válido";
            divResultado.className = "erro";
            return;
        }
        const valorEnergia = consumo * tarifaPorKwh(tipo);
        const valorAdicional = adicionalBandeira(consumo, bandeira);
        const valorTotal = valorEnergia + valorAdicional;
        const mensagem = mensagemBandeira(bandeira);
        divResultado.innerHTML = `
            Energia: R$ ${valorEnergia.toFixed(2)}<br>
            Bandeira ${bandeira}: R$ ${valorAdicional.toFixed(2)}<br>
            Total: R$ ${valorTotal.toFixed(2)}<br>
            ${mensagem}
        `;
        divResultado.className = bandeira !== 'verde' ? 'alerta' : 'sucesso';
    });
}
export {};
//# sourceMappingURL=ex02.js.map