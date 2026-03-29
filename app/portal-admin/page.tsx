"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PortalAdmin() {
  const router = useRouter();

  const [clientes, setClientes] = useState([
    { id: 1, nome: "João Silva", cpf: "111.222.333-44", status: "Ativo" },
    { id: 2, nome: "Maria Oliveira", cpf: "555.666.777-88", status: "Pendente" },
    { id: 3, nome: "Carlos Souza", cpf: "999.888.777-66", status: "Ativo" }
  ]);

  const handleSair = () => {
    router.push("/");
  };

  const [modalAberto, setModalAberto] = useState(false);

  const inputStyle = {
    fontFamily: 'Inter',
    padding: '12px 15px',
    backgroundColor: '#236B94',
    borderRadius: '8px',
    border: 'none',
    color: '#fff',
    fontSize: '0.95rem',
    width: '100%',
    boxSizing: 'border-box' as const
  };

  const labelStyle = {
    fontFamily: 'Inter',
    color: '#0C3851',
    fontWeight: 'bold' as const,
    fontSize: '0.9rem',
    display: 'block',
    marginBottom: '8px'
  };
  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <nav style={{ backgroundColor: '#0C3851', padding: '10px 15px' }}>
        <div className="nav-conteudo" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>

          <Link href="/portal-admin" style={{ flexShrink: 0 }}>
            <img src="/Icones/Logo.svg" alt="Logo WA10" style={{ height: '35px', width: 'auto' }} />
          </Link>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px',
            flexShrink: 0 
          }}>

            <span className="hidden-mobile" style={{ color: 'white', fontFamily: 'Inter', fontSize: '0.9rem' }}>
              Painel do <strong>Administrador</strong>
            </span>
            
            <button onClick={handleSair} style={{ 
              cursor: 'pointer', 
              backgroundColor: 'transparent', 
              border: '1px solid white', 
              color: 'white', 
              padding: '6px 15px', 
              borderRadius: '5px',
              fontFamily: 'Inter',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main id="pag-portal" style={{ minHeight: '80vh', padding: '40px 20px', backgroundColor: '#F4F7F6' }}>
        
        <div className="portal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', maxWidth: '1200px', margin: '0 auto 30px' }}>
          <div>
            <h2 style={{ fontFamily: 'Inter', color: '#0C3851', fontSize: '2rem', marginBottom: '5px' }}>Gestão de Clientes</h2>
            <p style={{ fontFamily: 'Inter', color: '#666' }}>Gerencie os acessos e documentos da sua carteira de clientes.</p>
          </div>
          
          <button className="botao-acao" onClick={() => setModalAberto(true)} >
            <i className="fa-solid fa-user-plus" style={{ marginRight: '8px' }}></i> Novo Cliente
          </button>
        </div>

        {modalAberto && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(10, 10, 15, 0.85)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '20px' 
          }}>
            <div style={{
              backgroundColor: '#ffffff', 
              borderRadius: '20px',
              width: '100%', 
              maxWidth: '850px', 
              maxHeight: '90vh', 
              color: '#333', 
              position: 'relative',
              boxShadow: '0 25px 50px rgba(0,0,0,0.4)', 
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              
              <div style={{ padding: '30px 40px 20px', borderBottom: '1px solid #eee' }}>
                <button 
                  onClick={() => setModalAberto(false)} 
                  style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', color: '#0C3851', fontSize: '24px', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>

                <h3 style={{ 
                  fontFamily: 'Inter', fontWeight: 'bold', fontSize: '2rem', color: '#0C3851',
                  margin: 0
                }}>
                  Adicionar <span style={{ color: '#236B94' }}>Novo Cliente</span>
                </h3>
              </div>

              <div style={{ padding: '30px 40px', overflowY: 'auto', flex: 1 }}>
                <form onSubmit={(e) => { e.preventDefault(); alert("Cliente Cadastrado!"); setModalAberto(false); }} 
                      style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h4 style={{ fontFamily: 'Inter', color: '#0C3851', margin: 0, fontSize: '1.2rem', borderLeft: '4px solid #236B94', paddingLeft: '10px' }}>Dados Pessoais</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontFamily: 'Inter', color: '#0C3851', fontWeight: 'bold', fontSize: '0.9rem' }}>Nome Completo:</label>
                      <input type="text" required placeholder="Ex: João Silva Souza" style={inputStyle} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                      <div className="field">
                        <label style={labelStyle}>CPF:</label>
                        <input type="text" required placeholder="000.000.000-00" style={inputStyle} />
                      </div>
                      <div className="field">
                        <label style={labelStyle}>E-mail:</label>
                        <input type="email" required placeholder="joao@wa10.com.br" style={inputStyle} />
                      </div>
                      <div className="field">
                        <label style={labelStyle}>Telefone:</label>
                        <input type="tel" required placeholder="(11) 90000-0000" style={inputStyle} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h4 style={{ fontFamily: 'Inter', color: '#0C3851', margin: 0, fontSize: '1.2rem', borderLeft: '4px solid #236B94', paddingLeft: '10px' }}>Endereço Normalizado</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                      <div className="field">
                        <label style={labelStyle}>CEP:</label>
                        <input type="text" required placeholder="00000-000" style={inputStyle} />
                      </div>
                      <div className="field">
                        <label style={labelStyle}>Logradouro (Rua/Avenida):</label>
                        <input type="text" required placeholder="Ex: Avenida Paulista" style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                      <div className="field">
                        <label style={labelStyle}>Número:</label>
                        <input type="text" required placeholder="123" style={inputStyle} />
                      </div>
                      <div className="field">
                        <label style={labelStyle}>Complemento:</label>
                        <input type="text" placeholder="Apto, Bloco..." style={inputStyle} />
                      </div>
                      <div className="field">
                        <label style={labelStyle}>Bairro:</label>
                        <input type="text" required placeholder="Centro" style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                      <div className="field">
                        <label style={labelStyle}>Cidade:</label>
                        <input type="text" required placeholder="São Paulo" style={inputStyle} />
                      </div>
                      <div className="field">
                        <label style={labelStyle}>Estado (UF):</label>
                        <select required defaultValue="" style={inputStyle}>
                          <option value="" disabled hidden>Selecione...</option>
                          <option value="SP">São Paulo - SP</option>
                          <option value="RJ">Rio de Janeiro - RJ</option>
                          <option value="MG">Minas Gerais - MG</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', marginTop: '20px', paddingBottom: '20px' }}>
                    <button type="button" onClick={() => setModalAberto(false)} style={{ 
                      flex: 1, padding: '15px', borderRadius: '10px', border: '2px solid #0C3851',
                      backgroundColor: 'transparent', color: '#0C3851', fontWeight: 'bold', cursor: 'pointer'
                    }}>
                      Cancelar
                    </button>
                    <button type="submit" style={{ 
                      flex: 2, padding: '15px', borderRadius: '10px', border: 'none',
                      backgroundColor: '#0C3851', color: '#fff', fontWeight: 'bold', cursor: 'pointer'
                    }}>
                      Salvar Cadastro
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>

          <div className="cabecalho-grid hidden-mobile" style={{ 
            padding: '0 25px 10px 25px', 
            fontFamily: 'Inter', 
            fontWeight: 'bold', 
            color: '#0C3851',
            fontSize: '0.9rem',
            opacity: 0.8
          }}>
            <div>Nome do Cliente</div>
            <div>CPF / Documento</div>
            <div className="coluna-centro">Status de Acesso</div>
            <div className="coluna-direita">Ação</div>
          </div>

          {clientes.map((cliente) => (
            <div key={cliente.id} className="cliente-card-grid" style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '20px 25px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #F0F0F0',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ 
                  backgroundColor: '#E8F8F5', color: '#4DD3C1', 
                  width: '45px', height: '45px', borderRadius: '12px', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem',
                  flexShrink: 0 
                }}>
                  <i className="fa-solid fa-user"></i>
                </div>
                <div style={{ fontFamily: 'Inter' }}>
                  <div style={{ fontWeight: 'bold', color: '#0C3851', fontSize: '1.05rem' }}>{cliente.nome}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>ID: #00{cliente.id}WA10</div>
                </div>
              </div>

              <div style={{ fontFamily: 'Inter', color: '#444', fontSize: '0.95rem', fontWeight: '500' }}>
                {cliente.cpf}
              </div>

              <div className="coluna-centro">
                <span style={{ 
                  backgroundColor: cliente.status === 'Ativo' ? '#E8F8F5' : '#FEF9E7', 
                  color: cliente.status === 'Ativo' ? '#117A65' : '#B9770E', 
                  padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                  display: 'inline-block', border: cliente.status === 'Ativo' ? '1px solid #D1F2EB' : '1px solid #FCF3CF', fontFamily: 'Inter'
                }}>
                  {cliente.status}
                </span>
              </div>

              <div className="coluna-direita">
                <Link href={`/portal-admin/cliente/${cliente.id}`} className="btn-detalhes" style={{ 
                  backgroundColor: '#0C3851', color: 'white', padding: '10px 20px', 
                  borderRadius: '8px', textDecoration: 'none', fontFamily:'Inter', fontSize: '0.85rem', 
                  fontWeight: 'bold', transition: 'background 0.3s'
                }}>
                  Ver Detalhes <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', marginLeft: '5px' }}></i>
                </Link>
              </div>

            </div>
          ))}
        </div>
      </main>

      <footer style={{ backgroundColor: '#0C3851', color: 'white', textAlign: 'center', fontFamily: 'Inter' }}>
        <p>Todos os direitos reservados <strong>Eduardo Soares</strong> e <strong>Guidson Barreto</strong> 2026</p>
      </footer>
    </>
  );
}