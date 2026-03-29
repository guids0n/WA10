"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function DetalhesCliente() {
  const router = useRouter();
  const { id } = useParams();

  const [modalEnvioAberto, setModalEnvioAberto] = useState(false);
  const [modalEditarCliente, setModalEditarCliente] = useState(false);

  const clienteData = { 
    nome: "João Silva Souza", 
    cpf: "111.222.333-44", 
    email: "joao@email.com",
    telefone: "(11) 98888-7777",
    genero: "masculino",
    endereco: {
      cep: "01310-100", logradouro: "Av. Paulista", numero: "1000",
      complemento: "Apto 45", bairro: "Bela Vista", cidade: "São Paulo", uf: "SP"
    }
  };

  const [documentos, setDocumentos] = useState([
    { id: 1, nome: "Comprovante_Renda.pdf", tipo: "Comprovante de Renda", data: "03/12/2025", remetente: "cliente", icon: "fa-file-pdf" },
    { id: 2, nome: "Declaracao_IRPF_Final.pdf", tipo: "Declaração de IRPF", data: "05/12/2025", remetente: "admin", icon: "fa-file-lines" }
  ]);

  const inputStyle = {
    fontFamily: 'Inter', padding: '12px 15px', backgroundColor: '#236B94', 
    borderRadius: '8px', border: 'none', color: '#fff', fontSize: '0.95rem', 
    width: '100%', boxSizing: 'border-box' as const
  };

  const labelStyle = {
    fontFamily: 'Inter', color: '#0C3851', fontWeight: 'bold' as const, 
    fontSize: '0.9rem', display: 'block', marginBottom: '8px'
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* NAVBAR RESPONSIVA */}
      <nav style={{ backgroundColor: '#0C3851', padding: '10px 15px' }}>
        <div className="nav-conteudo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Link href="/portal-admin" style={{ flexShrink: 0 }}>
            <img src="/Icones/Logo.svg" alt="WA10" style={{ height: '35px', width: 'auto' }} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0 }}>
            <span className="hidden-mobile" style={{ color: 'white', fontFamily: 'Inter', fontSize: '0.9rem' }}>
              Área do <strong>Admin</strong>
            </span>
            <button onClick={() => router.push("/")} style={{ cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '6px 15px', borderRadius: '5px', fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 'bold', flexShrink: 0 }}>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main style={{ minHeight: '80vh', padding: '40px 20px', backgroundColor: '#F4F7F6' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <Link href="/portal-admin" style={{ textDecoration: 'none', color: '#0C3851', fontFamily: 'Inter', fontSize: '0.9rem', fontWeight: 'bold' }}>
            <i className="fa-solid fa-arrow-left"></i> Voltar
          </Link>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginTop: '20px', marginBottom: '30px', borderLeft: '5px solid #0C3851', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h2 style={{ fontFamily: 'Inter', color: '#0C3851', margin: '0 0 5px 0' }}>{clienteData.nome}</h2>
              <p style={{ fontFamily: 'Inter', color: '#666', margin: 0, fontSize: '0.95rem' }}>
                <i className="fa-regular fa-id-card" style={{ width: '20px', color: '#236B94' }}></i> <strong>CPF:</strong> {clienteData.cpf} | <strong>E-mail:</strong> {clienteData.email}
              </p>
              <p style={{ fontFamily: 'Inter', color: '#666', margin: 0, fontSize: '0.95rem' }}>
                <i className="fa-solid fa-phone" style={{ width: '20px', color: '#236B94' }}></i> <strong>Telefone:</strong> {clienteData.telefone}
              </p>
              <p style={{ fontFamily: 'Inter', color: '#666', margin: 0, fontSize: '0.95rem' }}>
                <i className="fa-solid fa-location-dot" style={{ width: '20px', color: '#236B94' }}></i> <strong>Endereço:</strong> {clienteData.endereco.logradouro}, {clienteData.endereco.numero} - {clienteData.endereco.cidade}/{clienteData.endereco.uf}
              </p>
            </div>
            <button onClick={() => setModalEditarCliente(true)} style={{ backgroundColor: '#236B94', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 'bold', marginTop: '5px' }}>
              <i className="fa-solid fa-pen"></i> Editar Dados
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <h3 style={{ fontFamily: 'Inter', color: '#0C3851', margin: 0 }}>Documentos do Cliente</h3>
            <button onClick={() => setModalEnvioAberto(true)} style={{ backgroundColor: '#0C3851', color: '#FFF', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 'bold' }}>
              <i className="fa-solid fa-cloud-arrow-up"></i> Enviar IRPF / Guia
            </button>
          </div>

          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div className="hidden-mobile" style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr', backgroundColor: '#0C3851', color: 'white', padding: '15px 20px', fontFamily: 'Inter', fontWeight: 'bold' }}>
              <div>Nome do Arquivo</div>
              <div>Tipo</div>
              <div>Data</div>
              <div style={{ textAlign: 'right' }}>Ações</div>
            </div>

            {documentos.map((doc) => (
              <div key={doc.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', padding: '15px 20px', borderBottom: '1px solid #EEE', alignItems: 'center', fontFamily: 'Inter', color: '#333' }}>
                <div style={{ fontWeight: 'bold', gridColumn: 'span 2' }}>
                  <i className={`fa-solid ${doc.icon}`} style={{ color: doc.remetente === 'admin' ? '#0C3851' : '#236B94', marginRight: '10px', fontSize: '1.2rem' }}></i>
                  {doc.nome}
                  <div style={{ fontSize: '0.75rem', color: doc.remetente === 'admin' ? '#0C3851' : '#888', marginTop: '3px' }}>
                    {doc.remetente === 'admin' ? 'Enviado por: WA10' : 'Enviado por: Cliente'}
                  </div>
                </div>
                <div className="hidden-mobile">{doc.tipo}</div>
                <div className="hidden-mobile">{doc.data}</div>
                <div style={{ textAlign: 'right', gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                  <button title="Baixar" style={{ background: 'none', border: 'none', color: '#0C3851', cursor: 'pointer', fontSize: '1.1rem' }}><i className="fa-solid fa-download"></i></button>
                  {doc.remetente === 'admin' && (
                    <>
                      <button title="Substituir Arquivo" style={{ background: 'none', border: 'none', color: '#236B94', cursor: 'pointer', fontSize: '1.1rem' }}><i className="fa-solid fa-pen-to-square"></i></button>
                      <button title="Excluir" style={{ background: 'none', border: 'none', color: '#d9534f', cursor: 'pointer', fontSize: '1.1rem' }}><i className="fa-solid fa-trash"></i></button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {modalEditarCliente && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(10, 10, 15, 0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '750px', color: '#333', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' }}>
              
              <div style={{ padding: '30px 40px 20px', borderBottom: '1px solid #eee' }}>
                <button onClick={() => setModalEditarCliente(false)} style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', color: '#0C3851', fontSize: '24px', cursor: 'pointer' }}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
                <h3 style={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '2rem', color: '#0C3851', margin: 0 }}>
                  Editar <span style={{ color: '#236B94' }}>Dados do Cliente</span>
                </h3>
              </div>

              <div style={{ padding: '30px 40px', overflowY: 'auto', flex: 1 }}>
                <form onSubmit={(e) => { e.preventDefault(); alert("Dados Atualizados!"); setModalEditarCliente(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h4 style={{ fontFamily: 'Inter', color: '#0C3851', margin: 0, fontSize: '1.2rem', borderLeft: '4px solid #236B94', paddingLeft: '10px' }}>Dados Pessoais</h4>
                    
                    <div>
                      <label style={labelStyle}>Nome Completo:</label>
                      <input type="text" defaultValue={clienteData.nome} required style={inputStyle} />
                    </div>

                    <div className="grid-form-3">
                      <div>
                        <label style={labelStyle}>CPF:</label>
                        <input type="text" defaultValue={clienteData.cpf} required style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>E-mail:</label>
                        <input type="email" defaultValue={clienteData.email} required style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Telefone:</label>
                        <input type="tel" defaultValue={clienteData.telefone} required style={inputStyle} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h4 style={{ fontFamily: 'Inter', color: '#0C3851', margin: 0, fontSize: '1.2rem', borderLeft: '4px solid #236B94', paddingLeft: '10px' }}>Endereço</h4>

                    <div className="grid-form-2">
                      <div>
                        <label style={labelStyle}>CEP:</label>
                        <input type="text" defaultValue={clienteData.endereco.cep} required style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Logradouro (Rua/Av):</label>
                        <input type="text" defaultValue={clienteData.endereco.logradouro} required style={inputStyle} />
                      </div>
                    </div>

                    <div className="grid-form-3">
                      <div>
                        <label style={labelStyle}>Número:</label>
                        <input type="text" defaultValue={clienteData.endereco.numero} required style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Complemento:</label>
                        <input type="text" defaultValue={clienteData.endereco.complemento} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Bairro:</label>
                        <input type="text" defaultValue={clienteData.endereco.bairro} required style={inputStyle} />
                      </div>
                    </div>

                    <div className="grid-form-2-uf">
                      <div>
                        <label style={labelStyle}>Cidade:</label>
                        <input type="text" defaultValue={clienteData.endereco.cidade} required style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Estado (UF):</label>
                        <input type="text" defaultValue={clienteData.endereco.uf} required style={inputStyle} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', marginTop: '10px', paddingBottom: '20px' }}>
                    <button type="button" onClick={() => setModalEditarCliente(false)} style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '2px solid #0C3851', backgroundColor: 'transparent', color: '#0C3851', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Inter' }}>
                      Cancelar
                    </button>
                    <button type="submit" style={{ flex: 2, padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#0C3851', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Inter' }}>
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {modalEnvioAberto && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(10, 10, 15, 0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '550px', color: '#333', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', boxSizing: 'border-box' }}>
              <button onClick={() => setModalEnvioAberto(false)} style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', color: '#0C3851', fontSize: '24px', cursor: 'pointer' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              
              <h3 style={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '1.8rem', color: '#0C3851', marginTop: 0, marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #0C3851' }}>
                Enviar <span style={{ color: '#236B94' }}>Documento Oficial</span>
              </h3>
              <p style={{ fontFamily: 'Inter', color: '#666', marginBottom: '25px', fontSize: '0.95rem' }}>Anexe a Declaração de IRPF ou Guias para o cliente {clienteData.nome}.</p>
              
              <form onSubmit={(e) => { e.preventDefault(); setModalEnvioAberto(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div>
                  <label style={labelStyle}>Tipo de Documento:</label>
                  <select required style={inputStyle}>
                    <option value="" disabled hidden>Selecione...</option>
                    <option value="irpf">Declaração IRPF</option>
                    <option value="guia">Guia de Pagamento</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Selecione o Arquivo:</label>
                  <input type="file" required style={{ ...inputStyle, padding: '10px', backgroundColor: '#f8f9fa', color: '#333', border: '1px solid #236B94' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setModalEnvioAberto(false)} style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '2px solid #0C3851', backgroundColor: 'transparent', color: '#0C3851', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Inter' }}>
                    Cancelar
                  </button>
                  <button type="submit" style={{ flex: 1, padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#0C3851', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Inter' }}>
                    Confirmar Envio
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      <footer style={{ backgroundColor: '#0C3851', color: 'white', textAlign: 'center', fontFamily: 'Inter', marginTop: 'auto' }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Todos os direitos reservados <strong>Eduardo Soares</strong> e <strong>Guidson Barreto</strong> 2026</p>
      </footer>
    </>
  );
}