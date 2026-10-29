const formatarReal = (valor) => {
    return `R$ ${valor.toFixed(2)}`;
};
const formatarMeses = (meses) => {
    const anos = Math.floor(meses / 12);
    const restoMeses = meses % 12;
    if (anos === 0) {
        return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    }
    else if (restoMeses === 0) {
        return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    }
    else {
        const textoAnos = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
        const textoMeses = `${restoMeses} ${restoMeses === 1 ? 'mês' : 'meses'}`;
        return `${textoAnos} e ${textoMeses}`;
    }
};
function calcularSimulacao(meta, deposito, taxa = 0.5) {
    let saldo = 0;
    let depositado = 0;
    let meses = 0;
    const taxaDecimal = taxa / 100;
    while (saldo < meta && meses < 600) {
        meses++;
        // 1. O saldo rende primeiro
        saldo = saldo * (1 + taxaDecimal);
        // 2. Entra o depósito mensal normal
        let depositoAtual = deposito;
        // Todo mês 12, 24, 36... (dezembro), recebe o 13º salário e deposita o dobro (mais um depósito extra)
        if (meses % 12 === 0) {
            depositoAtual += deposito;
        }
        saldo += depositoAtual;
        depositado += depositoAtual;
    }
    return { meses, saldo, depositado };
}
function exibirValor(rotulo, valor, formatar) {
    return `${rotulo}: ${formatar(valor)}`;
}
const botaoCalcular = document.getElementById("calcular");
if (botaoCalcular) {
    botaoCalcular.addEventListener("click", () => {
        const inputMeta = document.getElementById("meta");
        const inputDeposito = document.getElementById("deposito");
        const inputTaxa = document.getElementById("taxa");
        const divResultado = document.getElementById("resultado");
        const meta = parseFloat(inputMeta.value);
        const deposito = parseFloat(inputDeposito.value);
        const taxaStr = inputTaxa.value.trim();
        if (isNaN(meta) || isNaN(deposito) || meta <= 0 || deposito <= 0) {
            divResultado.textContent = "Informe valores positivos";
            divResultado.className = "erro";
            return;
        }
        let resultadoSimulacao;
        if (taxaStr === "") {
            resultadoSimulacao = calcularSimulacao(meta, deposito);
        }
        else {
            const taxa = parseFloat(taxaStr);
            if (isNaN(taxa) || taxa < 0) {
                divResultado.textContent = "Informe valores positivos";
                divResultado.className = "erro";
                return;
            }
            resultadoSimulacao = calcularSimulacao(meta, deposito, taxa);
        }
        const { meses, saldo, depositado } = resultadoSimulacao;
        const rendimento = saldo > depositado ? saldo - depositado : 0;
        if (meses >= 600 && saldo < meta) {
            const linhaSaldo = exibirValor("Saldo após 600 meses", saldo, formatarReal);
            divResultado.textContent = `Meta inalcançável em 50 anos. ${linhaSaldo}.`;
            divResultado.className = "erro";
        }
        else {
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
}
export {};
//# sourceMappingURL=ex04.js.map