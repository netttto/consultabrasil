document.addEventListener("DOMContentLoaded", () => {
  const estadosContainer = document.getElementById("estados-container");
  if (estadosContainer) {
    fetch("https://brasilapi.com.br/api/ibge/uf/v1")
      .then(res => res.json())
      .then(estados => {
        estados.forEach(estado => {
          const card = document.createElement("div");
          card.classList.add("card");
          card.innerHTML = `
            <h3>${estado.nome} (${estado.sigla})</h3>
            <p><strong>Região:</strong> ${estado.regiao}</p>
          `;
          estadosContainer.appendChild(card);
        });
      })
      .catch(err => {
        estadosContainer.innerHTML = `<p style="color:red;">Erro ao carregar estados: ${err.message}</p>`;
      });
  }
  const btnBuscar = document.getElementById("buscar-cep");
  if (btnBuscar) {
    btnBuscar.addEventListener("click", () => {
      let cep = document.getElementById("cep-input").value.trim();
      const resultado = document.getElementById("cep-resultado");
      resultado.innerHTML = "";
      const cepRegex = /^\d{5}-?\d{3}$/;
      if (!cepRegex.test(cep)) {
        resultado.innerHTML = `<p style="color:red;">Digite um CEP válido (ex: 68640-000 ou 68640000).</p>`;
        return;
      }
      cep = cep.replace("-", "");
      fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)
        .then(res => {
          if (!res.ok) throw new Error("CEP não encontrado");
          return res.json();
        })
        .then(dados => {
          const card = document.createElement("div");
          card.classList.add("card");
          card.innerHTML = `
            <h3>CEP: ${dados.cep}</h3>
            <p><strong>Logradouro:</strong> ${dados.street || "Não informado"}</p>
            <p><strong>Bairro:</strong> ${dados.neighborhood || "Não informado"}</p>
            <p><strong>Cidade:</strong> ${dados.city}</p>
            <p><strong>Estado:</strong> ${dados.state}</p>
          `;
          resultado.appendChild(card);
        })
        .catch(err => {
          resultado.innerHTML = `<p style="color:red;">Erro: ${err.message}</p>`;
        });
    });
  }
});

