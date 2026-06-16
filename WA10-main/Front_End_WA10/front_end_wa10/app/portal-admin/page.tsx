"use client";

import { FormEvent, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, Usuario } from "@/app/api";

export default function PortalAdmin() {
  const router = useRouter();

  const [clientes, setClientes] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "ativos" | "inativos">("todos");
  const [modalAberto, setModalAberto] = useState(false);

  const [carregando, setCarregando] = useState(true);

  const [novoUsuario, setNovoUsuario] = useState<Usuario>({
    nome: "", cpf: "", email: "", telefone: "", senhaHash: "wa10@2026",
    tipoUsuario: "CLIENTE", cep: "", logradouro: "", numero: "",
    complemento: "", bairro: "", cidade: "", estado: "", ativo: true
  });

  const formatarCPF = (cpf?: string) => {
    const limpo = cpf?.replace(/\D/g, "") ?? "";
    return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const carregarClientes = useCallback(async () => {
    try {

      const dados = await api.usuarios.listarTodos();
      setClientes(dados);
      setCarregando(false);
    } catch (error) {
      console.error("Acesso negado ou token expirado:", error);
      localStorage.clear();
      router.push("/login-admin");
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login-admin");
    } else {
      const timer = setTimeout(() => {
        void carregarClientes();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [router, carregarClientes]);

  const handleAlternarStatus = async (id: number, statusAtual: boolean) => {
    const acao = statusAtual ? "desativar" : "reativar";
    if (!confirm(`Deseja realmente ${acao} o acesso deste cliente?`)) return;

    try {
      if (id !== undefined) {
        await api.usuarios.alternarStatus(id);
        void carregarClientes();
      }
    } catch (error) {
      const msgErro = error instanceof Error ? error.message : "Erro ao alterar o acesso.";
      alert(msgErro);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

      await api.usuarios.cadastrar(novoUsuario);

      alert("🚀 Cliente cadastrado com sucesso!");
      setModalAberto(false);
      void carregarClientes();
      setNovoUsuario({ nome: "", cpf: "", email: "", telefone: "", senhaHash: "wa10@2026", tipoUsuario: "CLIENTE", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", ativo: true });
    } catch (error) {
      const msgErro = error instanceof Error ? error.message : "Erro ao salvar. Verifique se o CPF/Email já existem.";
      alert(`❌ ${msgErro}`);
    }
  };

  const clientesExibidos = clientes.filter(cliente => {
    if (filtro === "ativos") return cliente.ativo;
    if (filtro === "inativos") return !cliente.ativo;
    return true;
  });

  const handleSair = () => {
    localStorage.clear();
    router.push("/");
  };

  const inputStyle = { fontFamily: 'Inter', padding: '12px 15px', backgroundColor: '#236B94', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' as const };
  const labelStyle = { fontFamily: 'Inter', color: '#0C3851', fontWeight: 'bold' as const, fontSize: '0.9rem', display: 'block', marginBottom: '8px' };

  const btnFiltroStyle = (tipo: string) => ({
    padding: '8px 20px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Inter',
    fontWeight: 'bold' as const,
    fontSize: '0.85rem',
    backgroundColor: filtro === tipo ? '#0C3851' : '#E0E0E0',
    color: filtro === tipo ? '#FFF' : '#666',
    transition: 'all 0.2s ease'
  });

  const gridLayout = "2.5fr 1.5fr 1fr 1.2fr 0.8fr";

  if (carregando) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#F4F7F6', fontFamily: 'Inter' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '3rem', color: '#0C3851', marginBottom: '15px' }}></i>
          <h3 style={{ color: '#0C3851', margin: 0 }}>Verificando credenciais seguras...</h3>
        </div>
    );
  }

  return (
      <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

        <nav style={{ backgroundColor: '#0C3851', padding: '10px 15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <Link href="/portal-admin">
              <img src="/Icones/Logo.svg" alt="Logo WA10" style={{ height: '35px', width: 'auto' }} />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: 'white', fontFamily: 'Inter', fontSize: '0.9rem' }}>Painel do <strong>Administrador</strong></span>
              <button onClick={handleSair} style={{ cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '6px 15px', borderRadius: '5px', fontWeight: 'bold', fontFamily: 'Inter' }}>Sair</button>
            </div>
          </div>
        </nav>

        <main style={{ minHeight: '80vh', padding: '40px 20px', backgroundColor: '#F4F7F6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div>
                <h2 style={{ fontFamily: 'Inter', color: '#0C3851', fontSize: '2rem', margin: 0 }}>Gestão de Clientes</h2>
                <p style={{ fontFamily: 'Inter', color: '#666', marginTop: '5px' }}>Gerencie os acessos e documentos da sua carteira.</p>
              </div>
              <button className="botao-acao" onClick={() => setModalAberto(true)} style={{ fontFamily: 'Inter' }}>
                <i className="fa-solid fa-user-plus" style={{ marginRight: '8px' }}></i> Novo Cliente
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
              <button onClick={() => setFiltro("todos")} style={btnFiltroStyle("todos")}>Todos ({clientes.length})</button>
              <button onClick={() => setFiltro("ativos")} style={btnFiltroStyle("ativos")}>Ativos ({clientes.filter(c => c.ativo).length})</button>
              <button onClick={() => setFiltro("inativos")} style={btnFiltroStyle("inativos")}>Inativos ({clientes.filter(c => !c.ativo).length})</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ padding: '0 25px 10px 25px', fontFamily: 'Inter', fontWeight: 'bold', color: '#0C3851', fontSize: '0.9rem', opacity: 0.8, display: 'grid', gridTemplateColumns: gridLayout }}>
                <div>Nome do Cliente</div>
                <div>CPF / Documento</div>
                <div style={{ textAlign: 'center' }}>Status</div>
                <div style={{ textAlign: 'center' }}>Detalhes</div>
                <div style={{ textAlign: 'right' }}>Acesso</div>
              </div>

              {clientesExibidos.map((cliente: Usuario) => (
                  <div key={cliente.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px 25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0', display: 'grid', gridTemplateColumns: gridLayout, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ backgroundColor: cliente.ativo ? '#E8F8F5' : '#F4F4F4', color: cliente.ativo ? '#4DD3C1' : '#999', width: '45px', height: '45px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><i className="fa-solid fa-user"></i></div>
                      <div style={{ fontFamily: 'Inter' }}>
                        <div style={{ fontWeight: 'bold', color: '#0C3851' }}>{cliente.nome}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>ID: #00{cliente.id}WA10</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Inter', color: '#444' }}>{formatarCPF(cliente.cpf)}</div>
                    <div style={{ textAlign: 'center' }}>
                  <span style={{
                    backgroundColor: cliente.ativo ? '#E8F8F5' : '#FADBD8',
                    color: cliente.ativo ? '#117A65' : '#7B241C',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    fontFamily: 'Inter'
                  }}>
                    {cliente.ativo ? "Ativo" : "Inativo"}
                  </span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Link href={`/portal-admin/cliente/${cliente.id}`} style={{ backgroundColor: '#0C3851', color: 'white', padding: '10px 15px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem', fontFamily: 'Inter', display: 'inline-block' }}>Ver Detalhes</Link>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <button
                          onClick={() => handleAlternarStatus(cliente.id!, cliente.ativo!)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '2.2rem', display: 'flex', alignItems: 'center' }}
                          title={cliente.ativo ? "Bloquear Acesso" : "Liberar Acesso"}
                      >
                        <i className={cliente.ativo ? "fa-solid fa-toggle-on" : "fa-solid fa-toggle-off"} style={{ color: cliente.ativo ? '#27ae60' : '#c0392b' }}></i>
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {modalAberto && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(10, 10, 15, 0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '850px', maxHeight: '90vh', color: '#333', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ padding: '30px 40px 20px', borderBottom: '1px solid #eee' }}>
                    <button onClick={() => setModalAberto(false)} style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', color: '#0C3851', fontSize: '24px', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
                    <h3 style={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '2rem', color: '#0C3851' }}>Adicionar <span style={{ color: '#236B94' }}>Novo Cliente</span></h3>
                  </div>
                  <div style={{ padding: '30px 40px', overflowY: 'auto', flex: 1 }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h4 style={{ fontFamily: 'Inter', color: '#0C3851', margin: 0, fontSize: '1.2rem', borderLeft: '4px solid #236B94', paddingLeft: '10px' }}>Dados Pessoais</h4>
                        <div>
                          <label style={labelStyle}>Nome Completo:</label>
                          <input type="text" required style={inputStyle} value={novoUsuario.nome} onChange={(e) => setNovoUsuario({...novoUsuario, nome: e.target.value})} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                          <div><label style={labelStyle}>CPF:</label><input type="text" required style={inputStyle} value={novoUsuario.cpf} onChange={(e) => setNovoUsuario({...novoUsuario, cpf: e.target.value})} /></div>
                          <div><label style={labelStyle}>E-mail:</label><input type="email" required style={inputStyle} value={novoUsuario.email} onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})} /></div>
                          <div><label style={labelStyle}>Telefone:</label><input type="tel" style={inputStyle} value={novoUsuario.telefone || ""} onChange={(e) => setNovoUsuario({...novoUsuario, telefone: e.target.value})} /></div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h4 style={{ fontFamily: 'Inter', color: '#0C3851', margin: 0, fontSize: '1.2rem', borderLeft: '4px solid #236B94', paddingLeft: '10px' }}>Endereço</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                          <div><label style={labelStyle}>CEP:</label><input type="text" style={inputStyle} value={novoUsuario.cep || ""} onChange={(e) => setNovoUsuario({...novoUsuario, cep: e.target.value})} /></div>
                          <div><label style={labelStyle}>Logradouro:</label><input type="text" style={inputStyle} value={novoUsuario.logradouro || ""} onChange={(e) => setNovoUsuario({...novoUsuario, logradouro: e.target.value})} /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                          <div><label style={labelStyle}>Número:</label><input type="text" style={inputStyle} value={novoUsuario.numero || ""} onChange={(e) => setNovoUsuario({...novoUsuario, numero: e.target.value})} /></div>
                          <div><label style={labelStyle}>Bairro:</label><input type="text" style={inputStyle} value={novoUsuario.bairro || ""} onChange={(e) => setNovoUsuario({...novoUsuario, bairro: e.target.value})} /></div>
                          <div><label style={labelStyle}>Cidade:</label><input type="text" style={inputStyle} value={novoUsuario.cidade || ""} onChange={(e) => setNovoUsuario({...novoUsuario, cidade: e.target.value})} /></div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', paddingBottom: '20px' }}>
                        <button type="button" onClick={() => setModalAberto(false)} style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '2px solid #0C3851', color: '#0C3851', fontWeight: 'bold', fontFamily: 'Inter' }}>Cancelar</button>
                        <button type="submit" style={{ flex: 2, padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#0C3851', color: '#fff', fontWeight: 'bold', fontFamily: 'Inter' }}>Salvar Cadastro</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
          )}
        </main>
      </>
  );
}