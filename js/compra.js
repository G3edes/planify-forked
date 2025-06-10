const evento = JSON.parse(localStorage.getItem('eventoSelecionado'));

if (evento) {
  document.querySelector('.card-header h1').textContent = evento.titulo;
  document.querySelector('.card-header p:nth-of-type(1)').innerHTML = `<strong>Hora:</strong> ${new Date(evento.horario).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}`;
  document.querySelector('.card-header p:nth-of-type(2)').innerHTML = `<strong>Data:</strong> ${new Date(evento.data_evento).toLocaleDateString('pt-BR')}`;
  document.querySelector('.card-header p:nth-of-type(3)').innerHTML = `<strong>Local:</strong> ${evento.local}`;
  document.querySelector('.header-img').src = evento.imagem;
  document.querySelector('.header-img').alt = `Imagem do evento ${evento.titulo}`;

  const descricao = evento.descricao || "Descrição não disponível.";
  document.querySelector('.card-body p').textContent = descricao;
} else {
  document.querySelector('.card').innerHTML = '<p>Nenhum evento selecionado.</p>';
}
