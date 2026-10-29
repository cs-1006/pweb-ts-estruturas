function calcularTotal(valorFinanciado: number, parcelas: number): number {
    if (parcelas <= 3) {
        return valorFinanciado;
    } else {
        // Juros compostos de 2% ao mês: total = financiado * (1.02 ** parcelas)
        return valorFinanciado * Math.pow(1.02, parcelas);
    }
}

function simularParcelamento(preco: number, entrada?: number): string {
    let valorFinanciado: number = preco;

    if (typeof entrada !== 'undefined') {
        valorFinanciado = preco - entrada;
    }

    let linhasHtml: string = "";

    for (let i = 1; i <= 12; i++) {
        // A loja não oferece 7, 8, 9 e 11 parcelas
        if (i === 7 || i === 8 || i === 9 || i === 11) {
            continue;
        }

        const total: number = calcularTotal(valorFinanciado, i);
        const valorParcela: number = total / i;

        if (valorParcela < 50) {
            break;
        }

        const jurosTexto: string = i <= 3 ? "sem juros" : "2% a.m.";

        linhasHtml += `
            <tr>
                <td>${i}x</td>
                <td>R$ ${valorParcela.toFixed(2)}</td>
                <td>R$ ${total.toFixed(2)}</td>
                <td>${jurosTexto}</td>
            </tr>
        `;
    }

    return linhasHtml;
}

const botaoSimular = document.getElementById("simular") as HTMLButtonElement | null;

if (botaoSimular) {
    botaoSimular.addEventListener("click", (): void => {
        const inputPreco = document.getElementById("preco") as HTMLInputElement;
        const inputEntrada = document.getElementById("entrada") as HTMLInputElement;
        const divResultado = document.getElementById("resultado") as HTMLDivElement;
        const tbodyParcelas = document.getElementById("parcelas") as HTMLTableSectionElement;

        const preco: number = parseFloat(inputPreco.value);
        const entradaStr: string = inputEntrada.value.trim();

        if (isNaN(preco) || preco <= 0) {
            divResultado.textContent = "Informe um preço válido.";
            divResultado.className = "erro";
            tbodyParcelas.innerHTML = "";
            return;
        }

        if (entradaStr === "") {
            const linhas: string = simularParcelamento(preco);
            divResultado.textContent = `Valor financiado: R$ ${preco.toFixed(2)}`;
            divResultado.className = "sucesso";
            tbodyParcelas.innerHTML = linhas;
        } else {
            const entrada: number = parseFloat(entradaStr);

            if (isNaN(entrada) || entrada < 0) {
                divResultado.textContent = "Informe uma entrada válida.";
                divResultado.className = "erro";
                tbodyParcelas.innerHTML = "";
                return;
            }

            if (entrada >= preco) {
                divResultado.textContent = "A entrada cobre o valor total. Não há parcelas.";
                divResultado.className = "sucesso";
                tbodyParcelas.innerHTML = "";
                return;
            }

            const valorFinanciado: number = preco - entrada;
            const linhas: string = simularParcelamento(preco, entrada);
            divResultado.textContent = `Valor financiado: R$ ${valorFinanciado.toFixed(2)}`;
            divResultado.className = "sucesso";
            tbodyParcelas.innerHTML = linhas;
        }
    });
}