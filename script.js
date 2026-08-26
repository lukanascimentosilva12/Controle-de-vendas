// ==============================
// PEGANDO OS ELEMENTOS DO HTML
// ==============================

let nome = document.getElementById("nome");

let local = document.getElementById("local");

let valor = document.getElementById("valor");

let qtd = document.getElementById("qtd");

let unidade = document.getElementById("unidade");

let pagamento = document.getElementById("pagamento");

let data = document.getElementById("data");

let botao = document.getElementById("adicionar");

let listaVendas = document.getElementById("lista-vendas");


// FILTROS

let mesVenda = document.getElementById("mesVenda");

let mesPagamento = document.getElementById("mesPagamento");

let limparFiltros = document.getElementById("limparFiltros");


// RESUMO

let totalVendido = document.getElementById("total-vendido");

let totalRecebido = document.getElementById("total-recebido");

let totalPendente = document.getElementById("total-pendente");


// ==============================
// PEGAR VENDAS SALVAS
// ==============================

let vendas = JSON.parse(
    localStorage.getItem("vendas")
) || [];


// ==============================
// FUNÇÃO PARA SALVAR
// ==============================

function salvarVendas() {

    localStorage.setItem(
        "vendas",
        JSON.stringify(vendas)
    );

}


// ==============================
// ADICIONAR VENDA
// ==============================

botao.addEventListener("click", function(event) {

    event.preventDefault();


    // ==========================
    // VALIDAÇÕES
    // ==========================

    if (nome.value === "") {

        alert("Preencha o nome!");

        return;
    }


    if (local.value === "") {

        alert("Preencha o local!");

        return;
    }


    if (valor.value === "") {

        alert("Preencha o valor!");

        return;
    }


    if (Number(valor.value) <= 0) {

        alert("O valor deve ser maior que zero!");

        return;
    }


    if (qtd.value === "") {

        alert("Preencha a quantidade!");

        return;
    }


    if (Number(qtd.value) <= 0) {

        alert("A quantidade deve ser maior que zero!");

        return;
    }


    if (data.value === "") {

        alert("Selecione a data da venda!");

        return;
    }


    // ==========================
    // CRIAR OBJETO DA VENDA
    // ==========================

    let novaVenda = {

        nome: nome.value,

        local: local.value,

        valor: Number(valor.value),

        qtd: Number(qtd.value),

        unidade: unidade.value,

        pagamento: pagamento.value,

        data: data.value,

        status: "Pendente",

        dataPagamento: ""

    };


    // ==========================
    // ADICIONAR AO ARRAY
    // ==========================

    vendas.push(novaVenda);


    // ==========================
    // SALVAR
    // ==========================

    salvarVendas();


    // ==========================
    // ATUALIZAR TELA
    // ==========================

    mostrarVendas();


    // ==========================
    // LIMPAR FORMULÁRIO
    // ==========================

    nome.value = "";

    local.value = "";

    valor.value = "";

    qtd.value = "";

    data.value = "";

});


// ==============================
// MOSTRAR VENDAS
// ==============================

function mostrarVendas() {

    // limpa a lista
    listaVendas.innerHTML = "";


    // ==========================
    // PERCORRER TODAS AS VENDAS
    // ==========================

    vendas.forEach(function(venda, index) {


        // ======================
        // FILTRO
        // ======================

        let mostrar = true;


        // FILTRO PELO MÊS DA VENDA

        if (mesVenda.value !== "") {

            if (!venda.data.startsWith(mesVenda.value)) {

                mostrar = false;

            }

        }


        // FILTRO PELO MÊS DO PAGAMENTO

        if (mesPagamento.value !== "") {

            if (venda.dataPagamento === "") {

                mostrar = false;

            }
            else if (
                !venda.dataPagamento.startsWith(
                    mesPagamento.value
                )
            ) {

                mostrar = false;

            }

        }


        // SE NÃO PASSAR NO FILTRO
        // NÃO MOSTRA

        if (!mostrar) {

            return;

        }


        // ==========================
        // CRIAR CARD
        // ==========================

        let card = document.createElement("div");

        card.classList.add("venda");


        // ==========================
        // HTML DO CARD
        // ==========================

        card.innerHTML = `

            <h3>
                ${venda.nome}
            </h3>

            <p>
                Local: ${venda.local}
            </p>

            <p>
                Valor:
                R$ ${Number(venda.valor).toFixed(2)}
            </p>

            <p>
                Quantidade:
                ${venda.qtd}
                ${venda.unidade}
            </p>

            <p>
                Forma de pagamento:
                ${venda.pagamento}
            </p>

            <p>
                Data da venda:
                ${venda.data}
            </p>

            <p>
                Status:
                <strong>
                    ${venda.status}
                </strong>
            </p>

            ${
                venda.status === "Pago"

                ?

                `
                    <p>
                        Data do pagamento:
                        ${venda.dataPagamento}
                    </p>
                `

                :

                `
                    <button class="dar-baixa">
                        Dar baixa
                    </button>
                `
            }

            <button class="excluir">
                Excluir
            </button>

        `;


        // ==========================
        // BOTÃO DAR BAIXA
        // ==========================

        let botaoBaixa =
            card.querySelector(".dar-baixa");


        if (botaoBaixa) {

            botaoBaixa.addEventListener(
                "click",
                function() {


                    let dataPagamento = prompt(
                        "Digite a data do pagamento (AAAA-MM-DD):"
                    );


                    // CANCELAR

                    if (
                        dataPagamento === null ||
                        dataPagamento === ""
                    ) {

                        return;

                    }


                    // ALTERAR VENDA

                    vendas[index].status = "Pago";

                    vendas[index].dataPagamento =
                        dataPagamento;


                    // SALVAR

                    salvarVendas();


                    // ATUALIZAR

                    mostrarVendas();

                }
            );

        }


        // ==========================
        // BOTÃO EXCLUIR
        // ==========================

        let botaoExcluir =
            card.querySelector(".excluir");


        botaoExcluir.addEventListener(
            "click",
            function() {


                let confirmar = confirm(
                    "Tem certeza que deseja excluir esta venda?"
                );


                if (!confirmar) {

                    return;

                }


                // REMOVE

                vendas.splice(index, 1);


                // SALVA

                salvarVendas();


                // ATUALIZA

                mostrarVendas();

            }
        );


        // ==========================
        // COLOCAR CARD NA TELA
        // ==========================

        listaVendas.appendChild(card);

    });


    // ==========================
    // ATUALIZAR RESUMO
    // ==========================

    atualizarResumo();

}


// ==============================
// ATUALIZAR RESUMO
// ==============================

function atualizarResumo() {


    let vendido = 0;

    let recebido = 0;

    let pendente = 0;


    // ==========================
    // PERCORRER VENDAS
    // ==========================

    vendas.forEach(function(venda) {


        // ========================
        // TOTAL VENDIDO
        // ========================

        if (mesVenda.value === "") {

            vendido += Number(venda.valor);

        }
        else if (
            venda.data.startsWith(
                mesVenda.value
            )
        ) {

            vendido += Number(venda.valor);

        }


        // ========================
        // TOTAL PENDENTE
        // ========================

        if (venda.status === "Pendente") {

            if (mesVenda.value === "") {

                pendente += Number(venda.valor);

            }
            else if (
                venda.data.startsWith(
                    mesVenda.value
                )
            ) {

                pendente += Number(venda.valor);

            }

        }


        // ========================
        // TOTAL RECEBIDO
        // ========================

        if (venda.status === "Pago") {

            if (mesPagamento.value === "") {

                recebido += Number(venda.valor);

            }
            else if (
                venda.dataPagamento.startsWith(
                    mesPagamento.value
                )
            ) {

                recebido += Number(venda.valor);

            }

        }

    });


    // ==========================
    // MOSTRAR NA TELA
    // ==========================

    totalVendido.textContent =
        "R$ " + vendido.toFixed(2);


    totalRecebido.textContent =
        "R$ " + recebido.toFixed(2);


    totalPendente.textContent =
        "R$ " + pendente.toFixed(2);

}


// ==============================
// ALTEROU MÊS DA VENDA
// ==============================

mesVenda.addEventListener(
    "change",
    function() {

        mostrarVendas();

    }
);


// ==============================
// ALTEROU MÊS DO PAGAMENTO
// ==============================

mesPagamento.addEventListener(
    "change",
    function() {

        mostrarVendas();

    }
);


// ==============================
// LIMPAR FILTROS
// ==============================

limparFiltros.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        mesVenda.value = "";

        mesPagamento.value = "";

        mostrarVendas();

    }
);


// ==============================
// MOSTRAR AO ABRIR A PÁGINA
// ==============================

mostrarVendas();