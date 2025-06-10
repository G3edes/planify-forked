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
