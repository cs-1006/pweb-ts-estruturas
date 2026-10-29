function calcularMedia(n1: number, n2: number): number {
    return (n1 + n2) / 2;
}

function dadosValidos(n1: number, n2: number, frequencia: number): boolean {
    return n1 >= 0 && n1 <= 10 && n2 >= 0 && n2 <= 10 && frequencia >= 0 && frequencia <= 100;
}

function situacao(media: number, frequencia: number): string {
    if (frequencia < 75) {
        return "Reprovado por falta";
    } else if (media >= 7) {
        return "Aprovado";
    } else if (media >= 4) {
        const notaExame: number = 10 - media;
        return `Exame final (precisa tirar ${notaExame.toFixed(1)})`;
    } else {
        return "Reprovado por nota";
    }
}

const botaoCalcular = document.getElementById("calcular") as HTMLButtonElement | null;

if (botaoCalcular) {
    botaoCalcular.addEventListener("click", (): void => {
        const inputNome = document.getElementById("nome") as HTMLInputElement;
        const inputN1 = document.getElementById("n1") as HTMLInputElement;
        const inputN2 = document.getElementById("n2") as HTMLInputElement;
        const inputFrequencia = document.getElementById("frequencia") as HTMLInputElement;
        const divResultado = document.getElementById("resultado") as HTMLDivElement;

        const nome: string = inputNome.value.trim();
        const n1: number = parseFloat(inputN1.value);
        const n2: number = parseFloat(inputN2.value);
        const frequencia: number = parseFloat(inputFrequencia.value);

        if (!dadosValidos(n1, n2, frequencia)) {
            divResultado.textContent = "Dados inválidos";
            divResultado.className = "erro";
            return;
        }

        const media: number = calcularMedia(n1, n2);
        const status: string = situacao(media, frequencia);
        
        divResultado.textContent = `${nome}: média ${media.toFixed(1)}. ${status}.`;
        divResultado.className = status === "Aprovado" ? "sucesso" : "erro";
    });
}