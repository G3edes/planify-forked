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
btnEventos.addEventListener('click', carregarEventos);

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
}

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
      <div id="card-evento">
        <h1>${evento.titulo}</h1>
        <img src="${evento.imagem}" alt="Imagem do evento">
        <p><strong>Descrição:</strong> ${evento.descricao}</p>
        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Horário:</strong> ${horarioFormatado}</p>
        <p><strong>Local:</strong> ${evento.local}</p>
      </div>
    `;

    dadosPrincipal.innerHTML += eventoHTML;
  });
}

async function carregarEventos() {
  dadosPrincipal.innerHTML = '';
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado')) || {};
  const resposta = await fetch(`http://localhost:8080/v1/planify/usuario/evento/${usuario.id_usuario}`);
  const proprietario = await resposta.json();
  let eventos = proprietario.usuario?.[0]?.eventos || [];

  // Filtra somente os eventos CRIADOS pelo usuário atual:
  eventos = eventos.filter(evento => evento.id_usuario === usuario.id_usuario);

  if (!Array.isArray(eventos) || eventos.length === 0) {
    dadosPrincipal.innerHTML = '<p>Nenhum Evento criado encontrado.</p>';
    return;
  }

  eventos.forEach(evento => {
    const dataFormatada = new Date(evento.data_evento).toLocaleDateString('pt-BR');
    const horarioFormatado = new Date(evento.horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const eventoHTML = `
      <div id="card-evento">
        <h1>${evento.titulo}</h1>
        <img src="${evento.imagem}" alt="Imagem do evento">
        <p><strong>Descrição:</strong> ${evento.descricao}</p>
        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Horário:</strong> ${horarioFormatado}</p>
        <p><strong>Local:</strong> ${evento.local}</p>
      </div>
    `;

    dadosPrincipal.innerHTML += eventoHTML;
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
