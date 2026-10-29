const formatarReal = (valor) => {
    return `R$ ${valor.toFixed(2)}`;
};
function lerPrecos(texto) {
    const linhas = texto.split('\n');
    const precos = [];
    let ignorados = 0;
    let totalItens = 0;
    for (const linha of linhas) {
        const linhaTrim = linha.trim();
        // Pula linhas vazias
        if (linhaTrim === "") {
            continue;
        }
        if (totalItens >= 20) {
            break;
        }
        // Trata o preço permitindo vírgula ou ponto
        const precoNormalizado = linhaTrim.replace(',', '.');
        const valor = parseFloat(precoNormalizado);
        if (isNaN(valor) || valor <= 0) {
            ignorados++;
            continue;
        }
        precos.push(valor);
        totalItens++;
    }
    return { precos, ignorados };
}
function somarItens(...precos) {
    let soma = 0;
    for (const p of precos) {
        soma += p;
    }
    return soma;
}
function calcularDesconto(total, arg) {
    if (typeof arg === 'number') {
        return (total * arg) / 100;
    }
    else {
        const cupomUpper = arg.trim().toUpperCase();
        switch (cupomUpper) {
            case 'BEMVINDO10':
                return (total * 10) / 100;
            case 'PROMO20':
                return (total * 20) / 100;
            case 'MENOS15':
                // Apenas para compras a partir de R$ 100,00
                if (total >= 100) {
                    return 15.00;
                }
                return 0;
            default:
                return 0;
        }
    }
}
const botaoFechar = document.getElementById("fechar");
if (botaoFechar) {
    botaoFechar.addEventListener("click", () => {
        const textareaItens = document.getElementById("itens");
        const inputCupom = document.getElementById("cupom");
        const checkboxFidelidade = document.getElementById("fidelidade");
        const divResultado = document.getElementById("resultado");
        const textoItens = textareaItens.value;
        const cupomTexto = inputCupom.value.trim();
        const temFidelidade = checkboxFidelidade.checked;
        const resultadoLeitura = lerPrecos(textoItens);
        const { precos, ignorados } = resultadoLeitura;
        if (precos.length === 0) {
            divResultado.textContent = "Nenhum item válido";
            divResultado.className = "erro";
            return;
        }
        const subtotal = somarItens(...precos);
        let descontoCupom = 0;
        let mensagemCupom = "";
        let cupomValidoAplicado = false;
        if (cupomTexto !== "") {
            const cupomUpper = cupomTexto.toUpperCase();
            descontoCupom = calcularDesconto(subtotal, cupomTexto);
            if (cupomUpper === 'BEMVINDO10' || cupomUpper === 'PROMO20') {
                cupomValidoAplicado = true;
                mensagemCupom = `Cupom ${cupomTexto}: - ${formatarReal(descontoCupom)}`;
            }
            else if (cupomUpper === 'MENOS15') {
                if (subtotal >= 100) {
                    cupomValidoAplicado = true;
                    mensagemCupom = `Cupom ${cupomTexto}: - ${formatarReal(descontoCupom)}`;
                }
                else {
                    mensagemCupom = "Cupom inválido ou não aplicável";
                }
            }
            else {
                mensagemCupom = "Cupom inválido ou não aplicável";
            }
        }
        const subtotalComCupom = subtotal - descontoCupom;
        let descontoFidelidade = 0;
        if (temFidelidade) {
            descontoFidelidade = calcularDesconto(subtotalComCupom, 5);
        }
        const totalFinal = subtotalComCupom - descontoFidelidade;
        let textoItensInfo = `${precos.length} ${precos.length === 1 ? 'item' : 'itens'}`;
        if (ignorados > 0) {
            textoItensInfo += ` (${ignorados} ${ignorados === 1 ? 'linha ignorada' : 'linhas ignoradas'})`;
        }
        let htmlSaida = `Itens: ${textoItensInfo}<br>
Subtotal: ${formatarReal(subtotal)}<br>`;
        if (cupomTexto !== "") {
            htmlSaida += `${mensagemCupom}<br>`;
        }
        if (temFidelidade && descontoFidelidade > 0) {
            htmlSaida += `Fidelidade (5%): - ${formatarReal(descontoFidelidade)}<br>`;
        }
        htmlSaida += `Total a pagar: ${formatarReal(totalFinal)}`;
        divResultado.innerHTML = htmlSaida;
        divResultado.className = "sucesso";
    });
}
export {};
//# sourceMappingURL=ex05.js.map