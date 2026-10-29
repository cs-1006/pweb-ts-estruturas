function calcularMedia(n1, n2) {
    return (n1 + n2) / 2;
}
function dadosValidos(n1, n2, frequencia) {
    return n1 >= 0 && n1 <= 10 && n2 >= 0 && n2 <= 10 && frequencia >= 0 && frequencia <= 100;
}
function situacao(media, frequencia) {
    if (frequencia < 75) {
        return "Reprovado por falta";
    }
    else if (media >= 7) {
        return "Aprovado";
    }
    else if (media >= 4) {
        const notaExame = 10 - media;
        return `Exame final (precisa tirar ${notaExame.toFixed(1)})`;
    }
    else {
        return "Reprovado por nota";
    }
}
const botaoCalcular = document.getElementById("calcular");
if (botaoCalcular) {
    botaoCalcular.addEventListener("click", () => {
        const inputNome = document.getElementById("nome");
        const inputN1 = document.getElementById("n1");
        const inputN2 = document.getElementById("n2");
        const inputFrequencia = document.getElementById("frequencia");
        const divResultado = document.getElementById("resultado");
        const nome = inputNome.value.trim();
        const n1 = parseFloat(inputN1.value);
        const n2 = parseFloat(inputN2.value);
        const frequencia = parseFloat(inputFrequencia.value);
        if (!dadosValidos(n1, n2, frequencia)) {
            divResultado.textContent = "Dados inválidos";
            divResultado.className = "erro";
            return;
        }
        const media = calcularMedia(n1, n2);
        const status = situacao(media, frequencia);
        divResultado.textContent = `${nome}: média ${media.toFixed(1)}. ${status}.`;
        divResultado.className = status === "Aprovado" ? "sucesso" : "erro";
    });
}
export {};
//# sourceMappingURL=ex01.js.map