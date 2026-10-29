type Formatador = (valor: number) => string;

const formatarReal: Formatador = (valor: number): string => {
    return `R$ ${valor.toFixed(2)}`;
};

const formatarMeses = (meses: number): string => {
    const anos: number = Math.floor(meses / 12);
    const restoMeses: number = meses % 12;

    if (anos === 0) {
        return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    } else if (restoMeses === 0) {
        return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    } else {
        const textoAnos = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
        const textoMeses = `${restoMeses} ${restoMeses === 1 ? 'mês' : 'meses'}`;
        return `${textoAnos} e ${textoMeses}`;
    }
};

interface ResultadoEconomia {
    meses: number;
    saldo: number;
    depositado: number;
}

function calcularSimulacao(meta: number, deposito: number, taxa: number = 0.5): ResultadoEconomia {
    let saldo: number = 0;
    let depositado: number = 0;
    let meses: number = 0;

    const taxaDecimal: number = taxa / 100;

    while (saldo < meta && meses < 600) {
        meses++;
        
        // 1. O saldo rende primeiro
        saldo = saldo * (1 + taxaDecimal);

        // 2. Entra o depósito mensal normal
        let depositoAtual: number = deposito;

        // Todo mês 12, 24, 36... (dezembro), recebe o 13º salário e deposita o dobro (mais um depósito extra)
        if (meses % 12 === 0) {
            depositoAtual += deposito;
        }

        saldo += depositoAtual;
        depositado += depositoAtual;
    }

    return { meses, saldo, depositado };
}

function exibirValor(rotulo: string, valor: number, formatar: Formatador): string {
    return `${rotulo}: ${formatar(valor)}`;
}

const botaoCalcular = document.getElementById("calcular") as HTMLButtonElement | null;

if (botaoCalcular) {
    botaoCalcular.addEventListener("click", (): void => {
        const inputMeta = document.getElementById("meta") as HTMLInputElement;
        const inputDeposito = document.getElementById("deposito") as HTMLInputElement;
        const inputTaxa = document.getElementById("taxa") as HTMLInputElement;
        const divResultado = document.getElementById("resultado") as HTMLDivElement;

        const meta: number = parseFloat(inputMeta.value);
        const deposito: number = parseFloat(inputDeposito.value);
        const taxaStr: string = inputTaxa.value.trim();

        if (isNaN(meta) || isNaN(deposito) || meta <= 0 || deposito <= 0) {
            divResultado.textContent = "Informe valores positivos";
            divResultado.className = "erro";
            return;
        }

        let resultadoSimulacao: ResultadoEconomia;

        if (taxaStr === "") {
            resultadoSimulacao = calcularSimulacao(meta, deposito);
        } else {
            const taxa: number = parseFloat(taxaStr);
            if (isNaN(taxa) || taxa < 0) {
                divResultado.textContent = "Informe valores positivos";
                divResultado.className = "erro";
                return;
            }
            resultadoSimulacao = calcularSimulacao(meta, deposito, taxa);
        }

        const { meses, saldo, depositado } = resultadoSimulacao;
        const rendimento: number = saldo > depositado ? saldo - depositado : 0;

        if (meses >= 600 && saldo < meta) {
            const linhaSaldo = exibirValor("Saldo após 600 meses", saldo, formatarReal);
            divResultado.textContent = `Meta inalcançável em 50 anos. ${linhaSaldo}.`;
            divResultado.className = "erro";
        } else {
            const tempoFormatado = formatarMeses(meses);
            const linhaSaldo = exibirValor("Saldo final", saldo, formatarReal);
            const linhaDepositado = exibirValor("Total depositado", depositado, formatarReal);
            const linhaRendimento = exibirValor("Rendimento", rendimento, formatarReal);

            divResultado.innerHTML = `
                Você atinge a meta em ${meses} meses (${tempoFormatado}).<br>
                ${linhaSaldo}<br>
                ${linhaDepositado}<br>
                ${linhaRendimento}
            `;
            divResultado.className = "sucesso";
        }
    });
