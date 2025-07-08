let choicesColaboradores;
let choicesUnidades;

document.addEventListener('DOMContentLoaded', function () {
  const colaboradoresSelect = document.getElementById('colaboradores');
  const unidadeSelect = document.getElementById('unidade');

  // Inicializa Choices para colaboradores
  choicesColaboradores = new Choices(colaboradoresSelect, {
    removeItemButton: true,
    placeholderValue: 'Selecione os colaboradores',
    searchPlaceholderValue: 'Buscar...',
    shouldSort: false,
    duplicateItemsAllowed: false,
    searchEnabled: true,
    itemSelectText: '',
    addItems: true,
    renderSelectedChoices: 'always'
  });

  // Inicializa Choices para unidades
  choicesUnidades = new Choices(unidadeSelect, {
    removeItemButton: true,
    placeholderValue: 'Selecione as unidades',
    searchPlaceholderValue: 'Buscar...',
    shouldSort: false,
    duplicateItemsAllowed: false,
    searchEnabled: true,
    itemSelectText: '',
    addItems: true,
    renderSelectedChoices: 'always'
  });

  // Fecha dropdown e desfoca input após adicionar item
  choicesColaboradores.passedElement.element.addEventListener('addItem', () => {
    setTimeout(() => {
      choicesColaboradores.hideDropdown();
      blurChoicesInput(choicesColaboradores);
    }, 100);
  });

  choicesUnidades.passedElement.element.addEventListener('addItem', () => {
    setTimeout(() => {
      choicesUnidades.hideDropdown();
      blurChoicesInput(choicesUnidades);
    }, 100);
  });

  // Tachar itens já selecionados ao abrir dropdown
  colaboradoresSelect.addEventListener('showDropdown', () => {
    tacharSelecionados(choicesColaboradores);
  });

  unidadeSelect.addEventListener('showDropdown', () => {
    tacharSelecionados(choicesUnidades);
  });

  // Fecha datetime-local se for "agora"
  const inputDataHora = document.getElementById('dataHora');
  inputDataHora.addEventListener('input', () => {
    const agora = new Date();
    const selecionada = new Date(inputDataHora.value);
    const diferencaSegundos = Math.abs((agora - selecionada) / 1000);
    if (diferencaSegundos <= 60) {
      inputDataHora.blur();
    }
  });
});

const colaboradoresGenero = {
  "Abraão Francisco": "M",
  "Amauri Gomes": "M",
  "Djalmaci Bezerra": "M",
  "Doriedson Ferreira": "M",
  "Edivaldo Amaro": "M",
  "Edmilson Ramiro": "M",
  "Elinaldo Carvalho": "M",
  "Geandro Luiz": "M",
  "Gilberto dos": "M",
  "Gilberto Ferreira": "M",
  "Jefferson Vasconcelos": "M",
  "João Alves": "M",
  "Jonas Rodrigo": "M",
  "Jose Fabio": "M",
  "José Geraldo": "M",
  "Jose Lira": "M",
  "Jose Tefla": "M",
  "Leonardo Rodrigues": "M",
  "Luanne Holanda (ADM)": "F",
  "Marcenildo José": "M",
  "Marcos Antonio": "M",
  "Renato Henrique (ADM)": "M",
  "Severino João": "M",
  "Talita Priscila (ADM)": "F",
  "Iranilda Carmo (COMPESA)": "F",
  "Flávio Rosendo (COMPESA)": "M",
  "Flávio Simões (COMPESA)": "M",
  "Fabrício (COMPESA)": "M",
  "Swami Arrecifes (COMPESA)": "M",
  "Jéssica Ysabelly (COMPESA)": "F",
  "Paulo Braz (COMPESA)": "M",
  "Cássia (COMPESA)": "F"
};

function gerarColaboradoresComIcone(colaboradores) {
  const itens = colaboradores.map(nome => {
    const genero = colaboradoresGenero[nome] || "M";
    const icone = genero === "F" ? "avatar_mulher.png" : "avatar_homem.png";
    return `
      <span style="
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        background-color: #f0f4ff;
        border-radius: 8px;
        margin: 4px;
        font-size: 14px;
      ">
        <img src="img/${icone}" alt="avatar" style="width: 20px;"> ${nome}
      </span>
    `;
  }).join('');

  return `
    <div style="
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-top: 5px;
    ">
      ${itens}
    </div>
  `;
}


// Função para remover foco do campo de busca do Choices
function blurChoicesInput(instance) {
  const input = instance.choiceList.element?.querySelector('input');
  if (input) input.blur();
}

// Função para tachar itens já selecionados
function tacharSelecionados(instance) {
  const selectedValues = instance.getValue().map(item => item.value);
  const choices = instance.choiceList.element.querySelectorAll('.choices__item');

  choices.forEach(choice => {
    const label = choice.innerText.trim();
    if (selectedValues.includes(label)) {
      choice.classList.add('striked');
    } else {
      choice.classList.remove('striked');
    }
  });
}

function formatarDataHora(valor) {
  const data = new Date(valor);
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  const dataFormatada = data.toLocaleDateString('pt-BR');
  return `${hora} ${diaSemana} - ${dataFormatada}`;
}

function adicionarServico() {
  const tipo = document.getElementById('tipoServico').value;
  const colaboradoresSel = choicesColaboradores.getValue().map(o => o.value);
  const unidadesSel = choicesUnidades.getValue().map(o => o.value);
  const veiculo = document.querySelector('input[name="veiculo"]:checked')?.value || '';
  const dataHora = document.getElementById('dataHora').value;
  const observacao = document.getElementById('observacao').value;

  if (!tipo || !colaboradoresSel.length || !unidadesSel.length || !veiculo || !dataHora) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const itemHTML = `
    <div class="servico-item">
      <div class="linha tipo"><strong>Tipo de Serviço:</strong> ${tipo}</div>
      <div class="linha colaboradores"><strong>Colaboradores:</strong></div>
	${gerarColaboradoresComIcone(colaboradoresSel)}
      <div class="linha unidade"><strong>Unidade:</strong> ${unidadesSel.join(', ')}</div>
      <div class="linha veiculo"><strong>Veículo:</strong> ${veiculo}</div>
      <img src="img/${veiculo}.png" alt="${veiculo}" style="width: 120px; margin-top: 5px; border-radius: 6px;">
      <div class="linha inicio"><strong>Início:</strong> ${formatarDataHora(dataHora)}</div>
      <br>
      <div class="linha observacao"><strong>Serviço:</strong> ${observacao || '-'}</div>
      <button class="btn-excluir" onclick="excluirServico(this)">🗑️ Excluir</button>
    </div>
  `;

  document.getElementById('listaServicos').innerHTML += itemHTML;

  // Resetar campos
  document.getElementById('tipoServico').value = '';
  document.getElementById('dataHora').value = '';
  document.getElementById('observacao').value = '';
  document.querySelectorAll('input[name="veiculo"]').forEach(input => input.checked = false);
  choicesColaboradores.removeActiveItems();
  choicesUnidades.removeActiveItems();

  // Limpa estilo tachado
  document.querySelectorAll('.choices__item--choice').forEach(item => item.classList.remove('striked'));

  document.getElementById('btnBaixar').style.display = 'inline-block';
}

function excluirServico(botao) {
  const item = botao.closest('.servico-item');
  if (item) {
    item.remove();
    const aindaTemServicos = document.querySelectorAll('.servico-item').length > 0;
    document.getElementById('btnBaixar').style.display = aindaTemServicos ? 'inline-block' : 'none';
  }
}

function compartilhar() {
  const relatorio = document.getElementById('relatorio');
  const botoesExcluir = relatorio.querySelectorAll('.btn-excluir');
  const btnBaixar = document.getElementById('btnBaixar');

  // Esconde botões antes da captura
  botoesExcluir.forEach(btn => btn.style.display = 'none');
  btnBaixar.style.visibility = 'hidden';
  const larguraOriginal = relatorio.style.width;
  relatorio.style.width = '600px';

  html2canvas(relatorio, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff"
  }).then(canvas => {
    relatorio.style.width = larguraOriginal;
    botoesExcluir.forEach(btn => btn.style.display = '');
    btnBaixar.style.visibility = 'visible';

    canvas.toBlob(blob => {
      if (!navigator.canShare || !navigator.canShare({ files: [new File([blob], "relatorio.png", { type: "image/png" })] })) {
        alert("Este navegador não suporta compartilhamento de arquivos.");
        return;
      }

      const file = new File([blob], "relatorio_servico.png", { type: "image/png" });

      navigator.share({
        files: [file],
        title: 'Relatório de Serviço',
        text: 'Segue em anexo o relatório gerado.',
      }).catch(err => {
        console.error("Compartilhamento cancelado ou falhou:", err);
      });
    }, 'image/png');
  });
}

function baixarRelatorio() {
  const relatorio = document.getElementById('relatorio');
  const btnBaixar = document.getElementById('btnBaixar');
  const botoesExcluir = relatorio.querySelectorAll('.btn-excluir');

  btnBaixar.style.visibility = 'hidden';
  botoesExcluir.forEach(btn => btn.style.display = 'none');

  const larguraOriginal = relatorio.style.width;
  relatorio.style.width = '600px';

  html2canvas(relatorio, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'relatorio_servico.png';
    link.href = canvas.toDataURL();
    link.click();

    relatorio.style.width = larguraOriginal;
    btnBaixar.style.visibility = 'visible';
    botoesExcluir.forEach(btn => btn.style.display = '');
  });
}
