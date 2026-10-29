type TipoCliente = 'residencial' | 'rural' | 'comercial' | 'industrial';
type Bandeira = 'verde' | 'amarela' | 'vermelha1' | 'vermelha2';

function tarifaPorKwh(tipo: TipoCliente): number {
    switch (tipo) {
        case 'residencial':
        case 'rural':
            return 0.80;
        case 'comercial':
        case 'industrial':
            return 0.95;
    }
}

function adicionalBandeira(consumo: number, bandeira: Bandeira = 'verde'): number {
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

function mensagemBandeira(bandeira: Bandeira): string {
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

const botaoCalcular = document.getElementById("calcular") as HTMLButtonElement | null;

if (botaoCalcular) {
    botaoCalcular.addEventListener("click", (): void => {
        const inputConsumo = document.getElementById("consumo") as HTMLInputElement;
        const selectTipo = document.getElementById("tipo") as HTMLSelectElement;
        const selectBandeira = document.getElementById("bandeira") as HTMLSelectElement;
        const divResultado = document.getElementById("resultado") as HTMLDivElement;

        const consumo: number = parseFloat(inputConsumo.value);
        const tipo: TipoCliente = selectTipo.value as TipoCliente;
        const bandeira: Bandeira = selectBandeira.value as Bandeira;

        if (consumo <= 0 || isNaN(consumo)) {
            divResultado.textContent = "Informe um consumo válido";
            divResultado.className = "erro";
            return;
        }

        const valorEnergia: number = consumo * tarifaPorKwh(tipo);
        const valorAdicional: number = adicionalBandeira(consumo, bandeira);
        const valorTotal: number = valorEnergia + valorAdicional;
        const mensagem: string = mensagemBandeira(bandeira);

        divResultado.innerHTML = `
            Energia: R$ ${valorEnergia.toFixed(2)}<br>
            Bandeira ${bandeira}: R$ ${valorAdicional.toFixed(2)}<br>
            Total: R$ ${valorTotal.toFixed(2)}<br>
            ${mensagem}
        `;

        divResultado.className = bandeira !== 'verde' ? 'alerta' : 'sucesso';
    });
}