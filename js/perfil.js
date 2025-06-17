const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

if (!usuario) {
  window.location.href = 'index.html';
} else {
  document.getElementById('usuario-nome').textContent = usuario.nome || 'Não informado';
  document.getElementById('usuario-email').textContent = usuario.email || 'Não informado';
  document.getElementById('usuario-dataNascimento').textContent = usuario.data_nascimento
    ? new Date(usuario.data_nascimento).toLocaleDateString('pt-BR')
    : 'Não informado';
  document.getElementById('usuario-senha').textContent = usuario.senha ? '********' : 'Não informado';

  if (usuario.foto_perfil) {
    document.getElementById('foto-perfil').src = usuario.foto_perfil;
  }
}

function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'index.html';
}

const btnPerfil = document.getElementById('header-perfil');
const btnIngresso = document.getElementById('header-ingresso');
const btnEventos = document.getElementById('header-eventos');
const dadosPrincipal = document.getElementById('dados-principal');

btnPerfil.addEventListener('click', carregarPerfil);
btnIngresso.addEventListener('click', carregarTickets);
btnEventos.addEventListener('click', carregarEventosCriados);

function carregarPerfil() {
  dadosPrincipal.innerHTML = '';

  const usuario = JSON.parse(localStorage.getItem('usuarioLogado')) || {};

  const dataFormatada = usuario.data_nascimento
    ? new Date(usuario.data_nascimento).toLocaleDateString('pt-BR')
    : 'Não informado';

  const perfilHTML = `
    <div id="dados-perfil">
      <div id="dados">
        <p>Nome:</p>
        <p class="dados-usuario" id="usuario-nome">${usuario.nome || 'Não informado'}</p>
        
        <p>Email:</p>
        <p class="dados-usuario" id="usuario-email">${usuario.email || 'Não informado'}</p>
        
        <p>Data Nascimento:</p>
        <p class="dados-usuario" id="usuario-dataNascimento">${dataFormatada}</p>
        
        <p>Senha:</p>
        <p class="dados-usuario" id="usuario-senha">${usuario.senha ? '********' : 'Não informado'}</p>
      </div>

      <div id="dados-foto">
        <img src="${usuario.foto_perfil || '../img/Test Account.png'}" alt="Foto do perfil" id="foto-perfil">
        <button id="button-edit">Editar Perfil</button>
      </div>
    </div>
  `;

  dadosPrincipal.innerHTML = perfilHTML;

  // Evento do botão "Editar Perfil"
  document.getElementById('button-edit').addEventListener('click', () => {
    renderizarEdicao(usuario);
  });
}
function renderizarEdicao(usuario) {
  const dataPadrao = usuario.data_nascimento
    ? new Date(usuario.data_nascimento).toISOString().split('T')[0]
    : '';

  dadosPrincipal.innerHTML = `
    <div id="dados-perfil">
      <div id="dados">
        <p>Nome:</p>
        <input type="text" id="input-nome" value="${usuario.nome || ''}">
        
        <p>Email:</p>
        <input type="email" id="input-email" value="${usuario.email || ''}" disabled>
        
        <p>Data Nascimento:</p>
        <input type="date" id="input-dataNascimento" value="${dataPadrao}">
        
        <p>Senha:</p>
        <input type="password" id="input-senha" value="${usuario.senha || ''}">
      </div>
      <div id="dados-foto">
        <img src="${usuario.foto_perfil || '../img/Test Account.png'}" alt="Foto do perfil" id="foto-perfil">
        <input type="text" id="input-fotoPerfil" value="${usuario.foto_perfil || ''}" placeholder="URL da imagem">
        <button id="button-salvar">Salvar</button>
      </div>
    </div>
  `;

  // Evento de salvar
  document.getElementById('button-salvar').addEventListener('click', async () => {
    const dadosAtualizados = {
      nome: document.getElementById('input-nome').value,
      email: document.getElementById('input-email').value,
      senha: document.getElementById('input-senha').value,
      data_nascimento: document.getElementById('input-dataNascimento').value,
      foto_perfil: document.getElementById('input-fotoPerfil').value
    };

    try {
      const response = await fetch(`http://localhost:8080/v1/planify/usuario/${usuario.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAtualizados)
      });

      // ✅ Só ler a resposta uma vez!
      const resposta = await response.json();
      console.log("Resposta do PUT:", resposta);

      if (response.ok && resposta.status === true && resposta.usuario && resposta.usuario.length > 0) {
        // Pegamos o primeiro objeto do array usuario
        const usuarioAtualizado = resposta.usuario[0];

        // Salva no localStorage com os dados atualizados
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));

        alert('Perfil atualizado com sucesso!');
        carregarPerfil();
      } else {
        alert('Erro ao atualizar: resposta inválida.');
      }

    } catch (error) {
      alert('Erro de conexão: ' + error.message);
    }
  });
}

btnIngresso.addEventListener('click', carregarTickets);

async function carregarTickets() {
  dadosPrincipal.innerHTML = '';
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado')) || {};
  const eventos = usuario.eventos || [];

  if (!Array.isArray(eventos) || eventos.length === 0) {
    dadosPrincipal.innerHTML = '<p>Nenhum ingresso encontrado.</p>';
    return;
  }

  eventos.forEach(evento => {
    const dataFormatada = new Date(evento.data_evento).toLocaleDateString('pt-BR');
    const horarioFormatado = new Date(evento.horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const eventoHTML = `
      <div id="card-evento" data-evento-id="${evento.id_evento}">
        <h1>${evento.titulo}</h1>
        <img src="${evento.imagem}" alt="Imagem do evento">
        <p><strong>Descrição:</strong> ${evento.descricao}</p>
        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Horário:</strong> ${horarioFormatado}</p>
        <p><strong>Local:</strong> ${evento.local}</p>
        <button class="btn-sair-evento">Sair do Evento</button>
      </div>
    `;

    dadosPrincipal.innerHTML += eventoHTML;
  });

  const botoesSair = document.querySelectorAll('.btn-sair-evento');
  botoesSair.forEach(botao => {
    botao.addEventListener('click', async (e) => {
      const card = e.target.closest('#card-evento');
      const idEvento = card.getAttribute('data-evento-id');
      const idUsuario = usuario.id_usuario;

      if (!confirm('Tem certeza que deseja sair deste evento?')) return;

      try {
        const resposta = await fetch('http://localhost:8080/v1/planify/participar', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_usuario: idUsuario, id_evento: Number(idEvento) })
        });

        const data = await resposta.json();

        if (resposta.ok && data.status === true) {
          // 🔄 Recarrega os dados atualizados do usuário
          const resUsuario = await fetch(`http://localhost:8080/v1/planify/usuario/${idUsuario}`);
          const dadosAtualizados = await resUsuario.json();
          const novoUsuario = dadosAtualizados.usuario?.[0];

          if (novoUsuario) {
            localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
            alert('Você saiu do evento com sucesso!');
            carregarTickets(); // Atualiza a tela com os dados atualizados
          } else {
            alert('Saiu do evento, mas não conseguiu atualizar os dados do usuário.');
          }

        } else {
          alert('Erro ao sair do evento: ' + (data.message || 'Resposta inválida.'));
        }
      } catch (error) {
        alert('Erro de conexão: ' + error.message);
      }
    });
  });
}


async function carregarEventosCriados() {
  dadosPrincipal.innerHTML = '';
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado')) || {};

  const resposta = await fetch(`http://localhost:8080/v1/planify/evento`);
  const dados = await resposta.json();

  const eventos = dados.eventos || [];

  const eventosCriados = eventos.filter(evento => evento.usuario?.[0]?.id_usuario === usuario.id_usuario);

  if (eventosCriados.length === 0) {
    dadosPrincipal.innerHTML = '<p>Você não criou nenhum evento.</p>';
    return;
  }

  eventosCriados.forEach(evento => {
    const dataFormatada = new Date(evento.data_evento).toLocaleDateString('pt-BR');
    const horarioFormatado = new Date(evento.horario).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const eventoHTML = `
      <div id="card-evento" data-evento-id="${evento.id_evento}">
        <h1>${evento.titulo}</h1>
        <img src="${evento.imagem}" alt="Imagem do evento">
        <p><strong>Descrição:</strong> ${evento.descricao}</p>
        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Horário:</strong> ${horarioFormatado}</p>
        <p><strong>Local:</strong> ${evento.local}</p>
        <button class="btn-excluir-evento">Excluir Evento</button>
      </div>
    `;

    dadosPrincipal.innerHTML += eventoHTML;
  });

  // Adiciona evento de clique nos botões excluir evento
  const botoesExcluir = document.querySelectorAll('.btn-excluir-evento');
  botoesExcluir.forEach(botao => {
    botao.addEventListener('click', async (e) => {
      const card = e.target.closest('#card-evento');
      const idEvento = card.getAttribute('data-evento-id');

      if (!confirm('Tem certeza que deseja excluir este evento? Esta ação é irreversível.')) return;

      try {
        const resposta = await fetch(`http://localhost:8080/v1/planify/evento/${idEvento}`, {
          method: 'DELETE'
        });

        const data = await resposta.json();

        if (resposta.ok && data.status === true) {
          alert('Evento excluído com sucesso!');
          carregarEventosCriados(); // Recarrega a lista
        } else {
          alert('Erro ao excluir evento: ' + (data.message || 'Resposta inválida.'));
        }
      } catch (error) {
        alert('Erro de conexão: ' + error.message);
      }
    });
  });
}

// Verifica se veio parâmetro de aba (ex: ?tab=tickets)
const urlParams = new URLSearchParams(window.location.search);
const abaSelecionada = urlParams.get('tab');

switch (abaSelecionada) {
  case 'tickets':
    carregarTickets();
    break;
  case 'eventos':
    carregarEventos();
    break;
  default:
    carregarPerfil();
    break;
}
