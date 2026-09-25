const API_URL = "http://localhost:3955"

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page

  if (page === "home") {
    prepararPaginaInicial()
  }

  if (page === "cadastrar") {
    prepararFormularioCadastro()
  }

  if (page === "editar") {
    prepararFormularioEdicao()
  }
})

async function prepararPaginaInicial() {
  const sectionFilmes = document.querySelector(".filmes")

  try {
    const resposta = await fetch(`${API_URL}/filmes`)
    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os filmes.")
    }

    const filmes = await resposta.json()

    if (!filmes.length) {
      sectionFilmes.innerHTML = '<p class="empty-state">Ainda não há filmes cadastrados.</p>'
      return
    }

    sectionFilmes.innerHTML = filmes
      .map(
        (filme) => `
          <article class="movie-card">
            <div class="movie-card__top">
              <span class="movie-tag">${filme.genero}</span>
              <button class="btn btn-delete" data-id="${filme.id}" type="button">Apagar</button>
            </div>

            <h3>${filme.nomeDoFilme}</h3>

            <ul class="movie-info">
              <li><strong>Duração:</strong> ${filme.duracao} min</li>
              <li><strong>Classificação:</strong> ${filme.classificacao}</li>
            </ul>

            <div class="movie-card__actions">
              <a class="btn btn-secondary" href="editar.html?id=${filme.id}">Editar</a>
            </div>
          </article>
        `
      )
      .join("")

    sectionFilmes.querySelectorAll(".btn-delete").forEach((botao) => {
      botao.addEventListener("click", async () => {
        await apagarFilme(botao.dataset.id)
      })
    })
  } catch (erro) {
    sectionFilmes.innerHTML = `<p class="empty-state error">${erro.message}</p>`
  }
}

async function apagarFilme(id) {
  const confirmar = window.confirm("Tem certeza que deseja apagar este filme?")

  if (!confirmar) {
    return
  }

  try {
    const resposta = await fetch(`${API_URL}/apagar-filme/${id}`, {
      method: "DELETE"
    })

    if (!resposta.ok) {
      throw new Error("Não foi possível apagar o filme.")
    }

    window.location.reload()
  } catch (erro) {
    alert(erro.message)
  }
}

function prepararFormularioCadastro() {
  const form = document.querySelector("#form-cadastro")

  form.addEventListener("submit", async (event) => {
    event.preventDefault()

    const dados = Object.fromEntries(new FormData(form).entries())
    dados.duracao = Number(dados.duracao)

    try {
      const resposta = await fetch(`${API_URL}/adicionar-filme`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      })

      if (!resposta.ok) {
        throw new Error("Não foi possível cadastrar o filme.")
      }

      alert("Filme cadastrado com sucesso!")
      window.location.href = "index.html"
    } catch (erro) {
      alert(erro.message)
    }
  })
}

async function prepararFormularioEdicao() {
  const form = document.querySelector("#form-editar")
  const params = new URLSearchParams(window.location.search)
  const id = params.get("id")

  if (!id) {
    alert("Filme não encontrado.")
    window.location.href = "index.html"
    return
  }

  try {
    const resposta = await fetch(`${API_URL}/filmes`)

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar o filme para edição.")
    }

    const filmes = await resposta.json()
    const filme = filmes.find((item) => String(item.id) === String(id))

    if (!filme) {
      throw new Error("Filme não encontrado.")
    }

    form.nomeDoFilme.value = filme.nomeDoFilme
    form.genero.value = filme.genero
    form.duracao.value = filme.duracao
    form.classificacao.value = filme.classificacao

    form.addEventListener("submit", async (event) => {
      event.preventDefault()

      const dados = Object.fromEntries(new FormData(form).entries())
      dados.duracao = Number(dados.duracao)

      try {
        const respostaEdit = await fetch(`${API_URL}/editar-filme/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dados)
        })

        if (!respostaEdit.ok) {
          throw new Error("Não foi possível atualizar o filme.")
        }

        alert("Filme atualizado com sucesso!")
        window.location.href = "index.html"
      } catch (erro) {
        alert(erro.message)
      }
    })
  } catch (erro) {
    alert(erro.message)
    window.location.href = "index.html"
  }
}
