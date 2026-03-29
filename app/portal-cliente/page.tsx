"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PortalCliente() {
  const router = useRouter();


  const [documentos, setDocumentos] = useState([
    {
      id: 1,
      nome: "Comprovante_Renda_Jan.pdf",
      tipo: "Comprovante de Renda",
      data: "03/12/2025",
      status: "enviado",
      icon: "fa-file-pdf"
    },
    {
      id: 2,
      nome: "Declaracao_IRPF_Final.pdf",
      tipo: "Declaração Final",
      data: "01/12/2025",
      status: "pendente",
      icon: "fa-file-lines"
    },
    {
      id: 3,
      nome: "Recibo_Medico_Unimed.jpg",
      tipo: "Despesa Médica",
      data: "28/11/2025",
      status: "enviado",
      icon: "fa-image"
    }
  ]);

  const handleSair = () => {
    router.push("/login-cliente");
  };

  const [modalAberto, setModalAberto] = useState(false);

  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

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

          <Link href="/" style={{ flexShrink: 0 }}>
            <img 
              src="/Icones/Logo.svg" 
              alt="Logo WA10" 
              style={{ height: '35px', width: 'auto' }} 
            />
          </Link>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            flexShrink: 0 
          }}>

            <span style={{ 
              color: 'white', 
              fontFamily: 'Inter', 
              fontSize: '0.85rem',
              whiteSpace: 'nowrap' 
            }}>
              Olá, <strong>Cliente</strong>
            </span>

            <button 
              onClick={handleSair} 
              className="btn-sair" 
              style={{ 
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid white',
                borderRadius: '5px',
                padding: '5px 12px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                fontFamily: 'Inter',
                minWidth: '60px' 
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main id="pag-portal">
        <div className="portal-header">
          <div>
            <h2>Meus Documentos</h2>
            <p>Gerencie seus envios e downloads fiscais.</p>
          </div>
          <button className="botao-acao" onClick={() => setModalAberto(true)}>
            <i className="fa-solid fa-cloud-arrow-up"></i> Novo Envio
          </button>
        </div>

        <div className="lista-docs-container">
          <div className="doc-header">
            <div>Nome do Arquivo</div>
            <div>Tipo</div>
            <div>Data</div>
            <div>Status</div>
            <div style={{ textAlign: 'right' }}>Ações</div>
          </div>

        {modalAberto && (

          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(10, 10, 15, 0.8)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>

            <div style={{
              backgroundColor: '#ffffff', padding: '40px', borderRadius: '15px',
              width: '90%', maxWidth: '550px', color: 'white', position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)', 
            }}>

              <button 
                onClick={() => setModalAberto(false)} 
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

             <h3 style={{ 
                fontFamily: 'inter', fontWeight: 'bold', fontSize: '1.8rem', color: '#0C3851',
                marginTop: 0, marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #0C3851' 
              }}>
                Enviar <span style={{ color: '#0C3851' }}>Novo Documento</span>
              </h3>
              
              <p style={{ fontFamily: 'Inter', color: '#3f3f3f', marginBottom: '25px', fontSize: '0.95rem' }}>
                Preencha as informações e anexe o arquivo (PDF ou imagem).
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); setModalAberto(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontFamily: 'Inter', color: '#0C3851', fontWeight: 'bold' }}>Tipo de Documento:</label>
                  <select 
                    required 
                    value={categoriaSelecionada} 
                    onChange={(e) => setCategoriaSelecionada(e.target.value)}
                    style={{
                    fontFamily: 'Inter',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#236B94',
                    fontSize: '0.9rem',
                    color: '#FFFFFF'
                  }}>
                    <option value="" disabled hidden>Selecione uma categoria...</option>
                    <option value="renda">Comprovante de Renda</option>
                    <option value="medico">Despesa Médica</option>
                    <option value="outros">Outros Recibos</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontFamily: 'Inter', color: '#0C3851', fontWeight: 'bold' }}>Selecione o Arquivo:</label>
                  <input type="file" required style={{
                    fontFamily: 'Inter',
                    padding: '12px 15px',
                    backgroundColor: '#236B94',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }} />
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                                    <button type="submit" style={{ 
                    fontFamily: 'Inter', fontWeight: 'bold', fontSize: '1rem', padding: '15px', flex: 1,
                    backgroundColor: '#0C3851', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer'
                  }}>
                    Confirmar Envio
                  </button>
                  
                  <button type="button" onClick={() => setModalAberto(false)} style={{ 
                    fontFamily: 'Inter', fontWeight: 'bold', fontSize: '1rem', padding: '15px', flex: 1,
                    backgroundColor: 'transparent', color: '#0C3851', border: '1px solid #0C3851', borderRadius: '10px', cursor: 'pointer'
                  }}>
                    Cancelar
                  </button>

                </div>
              </form>

              <div style={{ textAlign: 'center', marginTop: '30px', fontFamily: 'Inter', color: '#bbbbbb', fontSize: '0.8rem' }}>
                WA10 Soluções Contábeis &copy; 2025
              </div>

            </div>
          </div>
        )}

          {documentos.map((doc) => (
            <div className="doc-item" key={doc.id}>
              <div className="doc-col" data-label="Arquivo">
                <span className="file-icon">
                  <i className={`fa-solid ${doc.icon}`}></i>
                </span>
                {doc.nome}
              </div>
              <div className="doc-col" data-label="Tipo">{doc.tipo}</div>
              <div className="doc-col" data-label="Data">{doc.data}</div>
              <div className="doc-col" data-label="Status">
                <span className={`status ${doc.status}`}>
                  {doc.status === 'enviado' ? 'Enviado' : 'Processando'}
                </span>
              </div>
              <div className="doc-col acoes" data-label="Ações">
                <div className="doc-col acoes" data-label="Ações">

                <button className="btn-icon" title="Baixar" style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>
                  <i className="fa-solid fa-download" style={{ color: '#0C3851' }}></i>
                </button>
                
                {doc.status === 'enviado' && (
                  <>
                  
                    <button className="btn-icon" title="Editar Envio" style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', marginLeft: '15px' }}>
                      <i className="fa-solid fa-pen-to-square" style={{ color: '#f1c605' }}></i>
                    </button>
                    
                    <button className="btn-icon" title="Excluir" style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', marginLeft: '15px' }}>
                      <i className="fa-solid fa-trash" style={{ color: '#dc3545' }}></i>
                    </button>
                  </>
                )}
              </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <p>Todos os direitos reservados <strong>Eduardo Soares</strong> e <strong>Guidson Barreto</strong> 2025</p>
      </footer>
    </>
  );
}