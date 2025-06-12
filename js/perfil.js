const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

if (!usuario) {
  window.location.href = 'index.html';
} else {
  document.getElementById('perfil-container').innerHTML += `
    <div class="perfil-conteudo">
      <img src="${usuario.foto_perfil}" alt="Foto de perfil" />
      <p><strong>Nome:</strong> ${usuario.nome}</p>
      <p><strong>Email:</strong> ${usuario.email}</p>
      <button onclick="logout()">Sair</button>
    </div>
  `;
}

function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'index.html';
}

async function mostrarIngressos() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  const evento = JSON.parse(localStorage.getItem('eventoSelecionado'));

  if (!usuario || !evento) {
    alert("Erro: usuário ou evento não encontrado.");
    return;
  }

  const payload = {
    id_usuario: usuario.id_usuario,
    id_evento: evento.id_evento
  };

  try {
    const resposta = await fetch("http://localhost:8080/v1/planify/participar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (resposta.ok) {
      const container = document.getElementById('eventos-container');
      container.style.display = 'block';
      container.innerHTML = `
        <h3>Ingresso Confirmado</h3>
        <p><strong>Evento:</strong> ${evento.titulo}</p>
        <p><strong>Data:</strong> ${new Date(evento.data_evento).toLocaleDateString('pt-BR')}</p>
        <p><strong>Horário:</strong> ${new Date(evento.horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Local:</strong> ${evento.local}</p>
      `;
    } else {
      const erro = await resposta.json();
      alert(`Erro ao registrar ingresso: ${erro.message || resposta.statusText}`);
    }
  } catch (erro) {
    alert("Erro ao conectar com o servidor.");
    console.error(erro);
  }
}
