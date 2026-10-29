type Formatador = (valor: number) => string;

const formatarReal: Formatador = (valor: number): string => {
    return `R$ ${valor.toFixed(2)}`;
};

interface LeituraPrecos {
    precos: number[];
    ignorados: number;
}

function lerPrecos(texto: string): LeituraPrecos {
    const linhas: string[] = texto.split('\n');
    const precos: number[] = [];
    let ignorados: number = 0;
    let totalItens: number = 0;

    for (const linha of linhas) {
        const linhaTrim: string = linha.trim();

        // Pula linhas vazias
        if (linhaTrim === "") {
            continue;
        }

       
        if (totalItens >= 20) {
            break;
        }

        // Trata o preço permitindo vírgula ou ponto
        const precoNormalizado: string = linhaTrim.replace(',', '.');
        const valor: number = parseFloat(precoNormalizado);

        
        if (isNaN(valor) || valor <= 0) {
            ignorados++;
            continue;
        }

        precos.push(valor);
        totalItens++;
    }

    return { precos, ignorados };
}

function somarItens(...precos: number[]): number {
    let soma: number = 0;
    for (const p of precos) {
        soma += p;
    }
    return soma;
}


function calcularDesconto(total: number, percentual: number): number;
function calcularDesconto(total: number, cupom: string): number;
function calcularDesconto(total: number, arg: number | string): number {
    if (typeof arg === 'number') {
        return (total * arg) / 100;
    } else {
        const cupomUpper: string = arg.trim().toUpperCase();

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

const botaoFechar = document.getElementById("fechar") as HTMLButtonElement | null;

if (botaoFechar) {
    botaoFechar.addEventListener("click", (): void => {
        const textareaItens = document.getElementById("itens") as HTMLTextAreaElement;
        const inputCupom = document.getElementById("cupom") as HTMLInputElement;
        const checkboxFidelidade = document.getElementById("fidelidade") as HTMLInputElement;
        const divResultado = document.getElementById("resultado") as HTMLDivElement;

        const textoItens: string = textareaItens.value;
        const cupomTexto: string = inputCupom.value.trim();
        const temFidelidade: boolean = checkboxFidelidade.checked;

        const resultadoLeitura: LeituraPrecos = lerPrecos(textoItens);
        const { precos, ignorados } = resultadoLeitura;

        if (precos.length === 0) {
            divResultado.textContent = "Nenhum item válido";
            divResultado.className = "erro";
            return;
        }

        const subtotal: number = somarItens(...precos);
        let descontoCupom: number = 0;
        let mensagemCupom: string = "";
        let cupomValidoAplicado: boolean = false;

        if (cupomTexto !== "") {
            const cupomUpper: string = cupomTexto.toUpperCase();
            descontoCupom = calcularDesconto(subtotal, cupomTexto);

            if (cupomUpper === 'BEMVINDO10' || cupomUpper === 'PROMO20') {
                cupomValidoAplicado = true;
                mensagemCupom = `Cupom ${cupomTexto}: - ${formatarReal(descontoCupom)}`;
            } else if (cupomUpper === 'MENOS15') {
                if (subtotal >= 100) {
                    cupomValidoAplicado = true;
                    mensagemCupom = `Cupom ${cupomTexto}: - ${formatarReal(descontoCupom)}`;
                } else {
                    mensagemCupom = "Cupom inválido ou não aplicável";
                }
            } else {
                mensagemCupom = "Cupom inválido ou não aplicável";
            }
        }

        const subtotalComCupom: number = subtotal - descontoCupom;
        let descontoFidelidade: number = 0;

        if (temFidelidade) {
            descontoFidelidade = calcularDesconto(subtotalComCupom, 5);
        }

        const totalFinal: number = subtotalComCupom - descontoFidelidade;

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