// src/pages/CriarOrcamento.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import '../styles/Orcamento/criarOrcamento.css';
import { getCookie } from '../services/csrf';

function CriarOrcamento() {
  const [statusList, setStatusList] = useState([]);
  const [statusSelecionado, setStatusSelecionado] = useState("");
  const [procedimentos, setProcedimentos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState("");
  const [procedimentosSelecionados, setProcedimentosSelecionados] = useState([]);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState("");
  const [parceiros, setParceiros] = useState([]);
  const [subtipos, setSubtipos] = useState([]);
  const [parceiroSelecionado, setParceiroSelecionado] = useState("");
  const [subtipoSelecionado, setSubtipoSelecionado] = useState("");
  const [parceirosSelecionados, setParceirosSelecionados] = useState([]);
  const [dropdownAbertoPara, setDropdownAbertoPara] = useState(null);
  const [produtosDropdown, setProdutosDropdown] = useState([]);
  const dropdownRef = useRef(null);
  const [nomePacienteInput, setNomePacienteInput] = useState("");
  const [nomePaciente, setNomePaciente] = useState("");
  const [idPacienteSelecionado, setIdPacienteSelecionado] = useState(null);
  const [sugestoesPacientes, setSugestoesPacientes] = useState([]);
  const inputRef = useRef(null);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/status/")
      .then((res) => {
        setStatusList(res.data);

        const pendente = res.data.find((status) => status.nome.toLowerCase() === "pendente");
        if (pendente) {
          setStatusSelecionado(pendente.id);
        }

      })
      .catch((err) => console.error("Erro ao carregar status:", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/procedimentos/").then(res => setProcedimentos(res.data));
    axios.get("http://localhost:8000/api/especialidades/").then(res => setEspecialidades(res.data));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/parceiros/").then(res => setParceiros(res.data));
    axios.get("http://localhost:8000/api/subtipos/").then(res => setSubtipos(res.data));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownAbertoPara(null); // Fecha dropdown
      }
    }

    if (dropdownAbertoPara !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownAbertoPara]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setSugestoesPacientes([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const query = nomePacienteInput.trim();

      if (query.length < 1 || query === nomePaciente) {
        setSugestoesPacientes([]);
        return;
      }

      axios
        .get(`http://localhost:8000/api/buscar_pacientes/`, {
          params: { q: query },
        })
        .then((res) => {
          setSugestoesPacientes(res.data);
        })
        .catch((err) => {
          console.error("Erro ao buscar pacientes:", err);
          setSugestoesPacientes([]);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [nomePacienteInput, nomePaciente]);

  const handleAdicionarProcedimento = () => {
    const id = parseInt(procedimentoSelecionado);
    const procedimento = procedimentos.find(p => p.id === id);

    if (!id || !procedimento) {
      alert("Selecione um procedimento válido.");
      return;
    }

    const jaExiste = procedimentosSelecionados.some(p => p.id === id);
    if (jaExiste) return;

    setProcedimentosSelecionados([...procedimentosSelecionados, procedimento]);
    setProcedimentoSelecionado("");
  };

  const handleAdicionarParceiro = () => {
    const parceiro = parceiros.find(p => p.id === parseInt(parceiroSelecionado));
    if (!parceiro) {
      alert("Selecione um parceiro válido.");
      return;
    }

    const jaExiste = parceirosSelecionados.some(p => p.id === parceiro.id);
    if (jaExiste) return;

    const novoParceiro = {
      ...parceiro,
      produtos: [],
      subtotal: 0
    };

    setParceirosSelecionados([...parceirosSelecionados, novoParceiro]);
    setParceiroSelecionado("");
  };

  const handleAdicionarProduto = async (parceiroId, parceiroNome) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/buscar_produtos_por_parceiro/`, {
        params: { parceiro_nome: parceiroNome }
      });

      if (!response.data.length) {
        alert("Nenhum produto disponível para este parceiro.");
        return;
      }

      setProdutosDropdown(response.data);
      setDropdownAbertoPara(parceiroId);
    } catch (error) {
      console.error("Erro ao buscar produtos do parceiro:", error);
    }
  };

  const handleSalvarPaciente = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    fetch('http://localhost:8000/api/salvar_paciente/', {
      method: 'POST',
      headers: {
        "X-CSRFToken": getCookie('csrftoken')
      },
      credentials: 'include',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert(data.message);
          setModalAberto(false);
          form.reset();
        } else {
          alert('Erro: ' + data.error);
        }
      })
      .catch(error => {
        console.error('Erro:', error);
        alert("Erro ao salvar paciente.");
      });
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Valores globais */}
        <div className="valores-globais-container">
          <button onClick={() => console.log("Abrir modal config")}>Aplicar valores globais</button>
          <button onClick={() => console.log("Abrir modal tabela")}>Resumo</button>
        </div>

        {/* Status */}
        <div className="status-container">
          <label htmlFor="status">Status do Orçamento:</label>
          <select id="status" name="status" value={statusSelecionado} onChange={(e) => setStatusSelecionado(e.target.value)}>
            {statusList.map((status) => (
              <option key={status.id} value={status.id}>
                {status.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Paciente */}
        <div className="filter-paciente">
          <label htmlFor="paciente">Paciente:</label>
          <div className="paciente-container-wrapper"> { }
            <div className="paciente-container">
              <input
                type="text"
                id="paciente"
                placeholder="Digite o nome do paciente..."
                value={nomePacienteInput}
                ref={inputRef}
                onChange={(e) => {
                  setNomePacienteInput(e.target.value);
                  setIdPacienteSelecionado(null);
                }}
                onFocus={() => {
                  const query = nomePacienteInput.trim();
                  if (query.length >= 1 && query !== nomePaciente) {
                    axios
                      .get(`http://localhost:8000/api/buscar_pacientes/`, {
                        params: { q: query },
                      })
                      .then((res) => {
                        setSugestoesPacientes(res.data);
                      })
                      .catch((err) => {
                        console.error("Erro ao buscar pacientes:", err);
                      });
                  }
                }}
              />
              <button id="novo-paciente" onClick={() => setModalAberto(true)}>➕</button>
            </div>

            {/* DROPDOWN */}
            {sugestoesPacientes.length > 0 && (
              <div className="dropdown" id="sugestoes-pacientes" ref={dropdownRef}>
                {sugestoesPacientes.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setNomePacienteInput(p.nome);
                      setNomePaciente(p.nome);
                      setIdPacienteSelecionado(p.id);
                      setSugestoesPacientes([]);
                    }}
                  >
                    {p.nome}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


        {/* Procedimentos */}
        <div className="filter-procedimentos">
          <label htmlFor="procedimentos-select">Procedimentos</label>
          <div id="procedimentos-specialty">
            <select id="procedimentos-select" value={procedimentoSelecionado} onChange={(e) => setProcedimentoSelecionado(e.target.value)}>
              <option value="">Selecione o procedimento</option>

              {procedimentos
                .filter(p =>
                  !especialidadeSelecionada || p.especialidade.id === parseInt(especialidadeSelecionada)
                )
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))
              }
            </select>

            <select id="specialty-select" name="specialty" onChange={(e) => setEspecialidadeSelecionada(e.target.value)}>
              <option value="">Todos</option>
              {especialidades.map(especialidade => (
                <option key={especialidade.id} value={especialidade.id}>
                  {especialidade.nome}
                </option>
              ))}
            </select>
          </div>
          <button id="filter-procedimentos-add-button" onClick={handleAdicionarProcedimento}>Adicionar procedimento</button>

          <div id="lista-procedimentos">
            <h4>Procedimentos Selecionados:</h4>
            <div id="procedimentos-list">
              <ul id="procedimentos-list" className="procedimento-lista">
                {procedimentosSelecionados.map((p) => (
                  <li key={p.id} className="procedimento-item" data-id={p.id}>
                    <span>{p.nome}</span>
                    <button onClick={() =>
                      setProcedimentosSelecionados(procedimentosSelecionados.filter(item => item.id !== p.id))
                    }>
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {modalAberto && (
        <div className="modal" id="modal-paciente" style={{ display: 'flex' }}>
          <div className="modal-content">
            <span className="close" onClick={() => setModalAberto(false)}>&times;</span>
            <h2>Adicionar Paciente</h2>
            <form id="form-adicionar-paciente" onSubmit={handleSalvarPaciente}>
              <div className="form-row">
                <label htmlFor="nome">Nome:</label>
                <input type="text" id="nome" name="nome" required />
              </div>

              <div class="form-row">
                <label for="cpf">CPF:</label>
                <input type="text" id="cpf" name="cpf" required />
              </div>

              <div class="form-row">
                <label for="telefone">Telefone:</label>
                <input type="text" id="telefone" name="telefone" required />
              </div>

              <div class="form-row">
                <label for="email">E-mail:</label>
                <input type="email" id="email" name="email" />
              </div>

              <div class="form-row">
                <label for="rua">Rua:</label>
                <input type="text" id="rua" name="rua" required />
              </div>

              <div class="form-row">
                <label for="numero">Número:</label>
                <input type="text" id="numero" name="numero" required />
              </div>

              <div class="form-row">
                <label for="bairro">Bairro:</label>
                <input type="text" id="bairro" name="bairro" required />
              </div>

              <div class="form-row">
                <label for="cidade">Cidade:</label>
                <input type="text" id="cidade" name="cidade" required />
              </div>

              <div class="form-row">
                <label for="estado">Estado:</label>
                <input type="text" id="estado" name="estado" required />
              </div>

              <div class="form-row">
                <label for="cep">CEP:</label>
                <input type="text" id="cep" name="cep" required />
              </div>

              <div class="form-row">
                <label for="complemento">Complemento:</label>
                <input type="text" id="complemento" name="complemento" />
              </div>

              <div class="form-row">
                <label for="ponto_referencia">Ponto de referência:</label>
                <input type="text" id="ponto_referencia" name="ponto_referencia" />
              </div>

              <div class="form-row">
                <label for="data_nascimento">Data de nascimento:</label>
                <input type="date" id="data_nascimento" name="data_nascimento" required />
              </div>

              <div class="form-row">
                <label for="genero">Gênero:</label>
                <select id="genero" name="genero" required>
                  <option value="">Selecione...</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div class="form-row">
                <label for="anamnese">Anamnese:</label>
                <textarea id="anamnese" name="anamnese" rows="4"></textarea>
              </div>

              <button type="submit">Salvar Paciente</button>
            </form>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="main-container">
        <div className="header">
          <div className="main-header">Orçamento</div>
          <a href="/" className="back-btn">⬅ Voltar para Home</a>
        </div>

        <div className="main-box">
          {/* Parceiro */}
          <div id="filter-parceiro">
            <label htmlFor="parceiro">Parceiro:</label>
            <div id="parceiro-subtype">
              <select id="parceiro" name="parceiro" value={parceiroSelecionado} onChange={(e) => setParceiroSelecionado(e.target.value)}>
                <option value="">Selecione o parceiro</option>
                {parceiros
                  .filter(p =>
                    !subtipoSelecionado || p.subtipo.id === parseInt(subtipoSelecionado)
                  ).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
              </select>

              <select id="subtipo-select" value={subtipoSelecionado} onChange={(e) => setSubtipoSelecionado(e.target.value)}>
                <option value="">Todos</option>
                {subtipos.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>
            </div>
            <button id="filter-parceiro-add-button" onClick={handleAdicionarParceiro}>Adicionar parceiro</button>

            <div id="lista-parceiros">
              <h4>Parceiros Selecionados:</h4>
              <div id="parceiro-list">
                {parceirosSelecionados.map(parceiro => (
                  <div key={parceiro.id} className="parceiro-card">
                    <div className="produtos-container-header">
                      <button onClick={() =>
                        setParceirosSelecionados(prev =>
                          prev.filter(p => p.id !== parceiro.id)
                        )
                      }>
                        ❌
                      </button>
                      <h5>{parceiro.nome}</h5>
                    </div>

                    <div className="produtos-container">
                      {dropdownAbertoPara === parceiro.id && (
                        <div ref={dropdownRef} className="dropdown-produtos">
                          {produtosDropdown.map(produto => (
                            <div
                              key={produto.id}
                              className="dropdown-item"
                              onClick={() => {
                                const novoProduto = {
                                  ...produto,
                                  valor_input: produto.valor_venda,
                                  _uid: Date.now() + Math.random()
                                };

                                setParceirosSelecionados(prev =>
                                  prev.map(p => {
                                    if (p.id !== parceiro.id) return p;

                                    const produtosAtualizados = [...p.produtos, novoProduto];
                                    const subtotalAtualizado = produtosAtualizados.reduce(
                                      (soma, prod) => soma + parseFloat(prod.valor_input || 0),
                                      0
                                    );

                                    return {
                                      ...p,
                                      produtos: produtosAtualizados,
                                      subtotal: subtotalAtualizado
                                    };
                                  })
                                );

                                setDropdownAbertoPara(null);
                              }}
                            >
                              {produto.nome} R$ {produto.valor_venda}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="produtos-container-buttons">
                        <button onClick={() =>
                          handleAdicionarProduto(parceiro.id, parceiro.nome)
                          // console.log(parceiro.id)
                        }>
                          Adicionar Produto
                        </button>
                      </div>

                      <div className="produtos-lista">
                        {parceiro.produtos.map(produto => (
                          <div key={produto._uid} className="produto-item">
                            <span>{produto.nome}</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={produto.valor_input}
                              onChange={(e) => {
                                const novoValor = parseFloat(e.target.value) || 0;

                                setParceirosSelecionados(prev =>
                                  prev.map(p => {
                                    if (p.id !== parceiro.id) return p;

                                    const produtosAtualizados = p.produtos.map(prod =>
                                      prod.id === produto.id
                                        ? { ...prod, valor_input: novoValor }
                                        : prod
                                    );

                                    const subtotalAtualizado = produtosAtualizados.reduce(
                                      (soma, prod) => soma + parseFloat(prod.valor_input || 0),
                                      0
                                    );

                                    return {
                                      ...p,
                                      produtos: produtosAtualizados,
                                      subtotal: subtotalAtualizado
                                    };
                                  })
                                );
                              }}
                            />
                            <button
                              onClick={() => {
                                setParceirosSelecionados(prev =>
                                  prev.map(p => {
                                    if (p.id !== parceiro.id) return p;

                                    const produtosAtualizados = p.produtos.filter(prod => prod._uid !== produto._uid);
                                    const subtotalAtualizado = produtosAtualizados.reduce(
                                      (soma, prod) => soma + parseFloat(prod.valor_input || 0),
                                      0
                                    );

                                    return {
                                      ...p,
                                      produtos: produtosAtualizados,
                                      subtotal: subtotalAtualizado
                                    };
                                  })
                                );
                              }}
                            >
                              ❌
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>

                    <p className="subtotal">
                      Subtotal: R$ {parceiro.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="total-particular">
              <h3 id="total-particular">Total particular: R$ 0,00</h3>
            </div>
          </div>
        </div>

        {/* Total e botão */}
        <div className="total-container">
          <h3 id="total-geral">Total: R$ 0,00</h3>
          <button id="proximo-passo">Finalizar Orçamento</button>
        </div>
      </div>
    </div>



  );
}

export default CriarOrcamento;
