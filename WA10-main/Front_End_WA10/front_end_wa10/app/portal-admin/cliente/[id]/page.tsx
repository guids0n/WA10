"use client";

import { FormEvent, useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { api, Documento, Usuario } from "@/app/api";

interface DocumentoExibicao {
  id?: number;
  uuid: string;
  nome: string;
  tipo: string;
  data: string;
  icon: string;
  origem: string;
}

export default function DetalhesCliente() {
  const router = useRouter();
  const { id } = useParams();

  const [cliente, setCliente] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [modalEditarCliente, setModalEditarCliente] = useState(false);
  const [editFormData, setEditFormData] = useState<Usuario | null>(null);

  const [documentos, setDocumentos] = useState<DocumentoExibicao[]>([]);
  const [modalEnvioAberto, setModalEnvioAberto] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [enviando, setEnviando] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docEmEdicao, setDocEmEdicao] = useState<string | null>(null);

  const buscarDados = useCallback(async () => {
    if (!id) return;
    try {
      const dados = await api.usuarios.buscarPorId(id as string);
      setCliente(dados);
      setEditFormData(dados);
    } catch (err) {
      console.error("Erro de autenticação ou busca:", err);
      router.push("/portal-admin");
    } finally {
      setCarregando(false);
    }
  }, [id, router]);

  const carregarDocumentos = useCallback(async () => {
    if (!id) return;
    try {
      const dados = await api.documentos.listarPorUsuario(id as string);

      const docsFormatados = dados.map((doc: Documento) => ({
        id: doc.id,
        uuid: doc.uuid,
        nome: doc.nomeOriginal,
        tipo: doc.contentType?.includes("pdf") ? "Documento em PDF" : "Imagem/Anexo",
        data: new Date().toLocaleDateString('pt-BR'),
        icon: doc.contentType?.includes("pdf") ? "fa-file-pdf" : "fa-image",
        origem: doc.origem || 'CLIENTE'
      }));
      setDocumentos(docsFormatados);
    } catch (error) {
      console.error("Erro ao carregar documentos:", error);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    void buscarDados();
    void carregarDocumentos();
  }, [id, buscarDados, carregarDocumentos]);

  const handleSalvarEdicao = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !editFormData) return;
    try {
      await api.usuarios.atualizar(id as string, editFormData);
      alert("✅ Dados atualizados com sucesso!");
      setModalEditarCliente(false);
      void buscarDados();
    } catch (err) {
      const msgErro = err instanceof Error ? err.message : "Erro ao atualizar dados.";
      alert(msgErro);
    }
  };

  const handleEnviarDocumento = async (e: FormEvent) => {
    e.preventDefault();
    if (!arquivoSelecionado || !categoriaSelecionada || !id) return;

    setEnviando(true);
    const formData = new FormData();
    formData.append("file", arquivoSelecionado);
    formData.append("usuarioId", id as string);
    formData.append("origem", "ADMIN");

    try {
      const novoDocBackend = await api.documentos.upload(formData);

      const novoDocFront: DocumentoExibicao = {
        id: novoDocBackend.id,
        uuid: novoDocBackend.uuid,
        nome: novoDocBackend.nomeOriginal,
        tipo: categoriaSelecionada === "IRPF" ? "Declaração IRPF" : "Guia de Pagamento",
        data: new Date().toLocaleDateString('pt-BR'),
        icon: arquivoSelecionado.type.includes("pdf") ? "fa-file-pdf" : "fa-image",
        origem: 'ADMIN'
      };

      setDocumentos([novoDocFront, ...documentos]);
      setArquivoSelecionado(null);
      setCategoriaSelecionada("");
      setModalEnvioAberto(false);
      alert("✅ Documento enviado com sucesso!");
    } catch (error) {
      const msgErro = error instanceof Error ? error.message : "Falha na conexão.";
      alert(msgErro);
    } finally {
      setEnviando(false);
    }
  };

  const handleDownload = async (uuid: string) => {
    try {
      const token = localStorage.getItem("token");

      const resposta = await fetch(`https://wa10-api.onrender.com/api/v1/documentos/download/${uuid}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!resposta.ok) {
        throw new Error(`Erro ao acessar o arquivo (Status: ${resposta.status})`);
      }

      const blob = await resposta.blob();

      const urlBlob = window.URL.createObjectURL(blob);

      window.open(urlBlob, '_blank');

      setTimeout(() => window.URL.revokeObjectURL(urlBlob), 100);
    } catch (error) {
      console.error("Erro no download seguro:", error);
      alert("Não foi possível visualizar o documento de forma segura.");
    }
  };

  const handleExcluir = async (uuid: string) => {
    if (!window.confirm("Apagar este documento permanentemente?")) return;
    try {
      await api.documentos.deletar(uuid);
      setDocumentos(documentos.filter(doc => doc.uuid !== uuid));
    } catch (error) {
      const msgErro = error instanceof Error ? error.message : "Falha ao excluir.";
      alert(msgErro);
    }
  };

  const iniciarEdicao = (uuid: string) => {
    setDocEmEdicao(uuid);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleAlterarArquivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !docEmEdicao) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const docAtualizado = await api.documentos.atualizar(docEmEdicao, formData);

      setDocumentos(documentos.map(doc => {
        if (doc.uuid === docEmEdicao) {
          return {
            ...doc,
            nome: docAtualizado.nomeOriginal,
            icon: docAtualizado.contentType?.includes("pdf") ? "fa-file-pdf" : "fa-image"
          };
        }
        return doc;
      }));
      alert("Arquivo substituído com sucesso!");
    } catch (error) {
      const msgErro = error instanceof Error ? error.message : "Erro ao substituir.";
      alert(msgErro);
    } finally {
      setDocEmEdicao(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatarCPF = (cpf?: string) => cpf ? cpf.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "";
  const inputStyle = { fontFamily: 'Inter', padding: '12px 15px', backgroundColor: '#236B94', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' as const };
  const labelStyle = { fontFamily: 'Inter', color: '#0C3851', fontWeight: 'bold' as const, fontSize: '0.9rem', display: 'block', marginBottom: '8px' };

  const updateEditFormData = (field: keyof Usuario, value: string) => {
    setEditFormData((prev) => ({ ...(prev ?? {}), [field]: value } as Usuario));
  };

  const gridDocumentos = "3.5fr 1.5fr 1.2fr 1fr 1fr";

  if (carregando) return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Inter' }}>Carregando...</div>;
  if (!cliente) return null;

  return (
      <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

        <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".pdf, .jpg, .jpeg, .png, .xml"
            onChange={handleAlterarArquivo}
        />

        <nav style={{ backgroundColor: '#0C3851', padding: '10px 15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <Link href="/portal-admin"><img src="/Icones/Logo.svg" alt="WA10" style={{ height: '35px' }} /></Link>
            <button onClick={() => { localStorage.clear(); router.push("/"); }} style={{ cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '6px 15px', borderRadius: '5px', fontWeight: 'bold' }}>Sair</button>
          </div>
        </nav>

        <main style={{ minHeight: '80vh', padding: '40px 20px', backgroundColor: '#F4F7F6' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <Link href="/portal-admin" style={{ textDecoration: 'none', color: '#0C3851', fontFamily: 'Inter', fontSize: '0.9rem', fontWeight: 'bold' }}>
              <i className="fa-solid fa-arrow-left"></i> Voltar
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginTop: '20px', marginBottom: '30px', borderLeft: '5px solid #0C3851' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h2 style={{ fontFamily: 'Inter', color: '#0C3851', margin: 0 }}>{cliente.nome}</h2>
                <p style={{ fontFamily: 'Inter', color: '#666', margin: 0 }}><strong>CPF:</strong> {formatarCPF(cliente.cpf)} | <strong>E-mail:</strong> {cliente.email}</p>
                <p style={{ fontFamily: 'Inter', color: '#666', margin: 0 }}><strong>Endereço:</strong> {cliente.logradouro}, {cliente.numero} {cliente.complemento ? `- ${cliente.complemento}` : ''} - {cliente.cidade}/{cliente.estado}</p>
              </div>
              <button onClick={() => setModalEditarCliente(true)} style={{ backgroundColor: '#236B94', color: '#fff', padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 'bold', alignSelf: 'flex-start', fontSize: '0.9rem' }}>
                <i className="fa-solid fa-pen"></i> Editar Dados
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Inter', color: '#0C3851' }}>Documentos da Conta</h3>
              <button onClick={() => setModalEnvioAberto(true)} style={{ backgroundColor: '#0C3851', color: '#FFF', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 'bold' }}>
                <i className="fa-solid fa-cloud-arrow-up"></i> Enviar IRPF / Guia
              </button>
            </div>

            {/* LISTA DE DOCUMENTOS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {documentos.length > 0 && (
                  <div style={{ padding: '0 25px 10px 25px', fontFamily: 'Inter', fontWeight: 'bold', color: '#0C3851', fontSize: '0.9rem', opacity: 0.8, display: 'grid', gridTemplateColumns: gridDocumentos }}>
                    <div>Nome do Arquivo</div>
                    <div>Tipo</div>
                    <div>Data</div>
                    <div style={{ textAlign: 'center' }}>Origem</div>
                    <div style={{ textAlign: 'right' }}>Ações</div>
                  </div>
              )}

              {documentos.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '10px', color: '#666', fontFamily: 'Inter' }}>
                    <i className="fa-solid fa-folder-open" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '15px' }}></i>
                    <p>Nenhum documento arquivado.</p>
                  </div>
              ) : (
                  documentos.map((doc) => (
                      <div key={doc.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '15px 25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0', display: 'grid', gridTemplateColumns: gridDocumentos, alignItems: 'center' }}>
                        <div style={{ fontFamily: 'Inter', color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={doc.nome}>
                          <i className={`fa-solid ${doc.icon}`} style={{ color: '#0C3851', marginRight: '8px' }}></i>
                          {doc.nome}
                        </div>
                        <div style={{ fontFamily: 'Inter', color: '#666', fontSize: '0.9rem' }}>{doc.tipo}</div>
                        <div style={{ fontFamily: 'Inter', color: '#666', fontSize: '0.9rem' }}>{doc.data}</div>

                        <div style={{ textAlign: 'center' }}>
                          <span style={{
                            backgroundColor: doc.origem === 'ADMIN' ? '#E8F8F5' : '#EBF5FB',
                            color: doc.origem === 'ADMIN' ? '#117A65' : '#2874A6',
                            padding: '4px 10px',
                            borderRadius: '15px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            fontFamily: 'Inter',
                            display: 'inline-block',
                            minWidth: '95px'
                          }}>
                            {doc.origem === 'ADMIN' ? 'Contabilidade' : 'Cliente'}
                          </span>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                          <button onClick={() => handleDownload(doc.uuid)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#0C3851' }} title="Baixar Arquivo">
                            <i className="fa-solid fa-download"></i>
                          </button>

                          {doc.origem === 'ADMIN' && (
                              <>
                                <button onClick={() => iniciarEdicao(doc.uuid)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#f1c605' }} title="Substituir Arquivo">
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button onClick={() => handleExcluir(doc.uuid)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#dc3545' }} title="Apagar do Sistema">
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </>
                          )}
                        </div>
                      </div>
                  ))
              )}
            </div>
          </div>

          {/* MODAL EDITAR DADOS */}
          {modalEditarCliente && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(10,10,15,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '20px', width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: '40px' }}>
                  <button onClick={() => setModalEditarCliente(false)} style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', color: '#0C3851', fontSize: '24px', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
                  <h3 style={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '2rem', color: '#0C3851', margin: 0 }}>Editar <span style={{ color: '#236B94' }}>Cadastro</span></h3>

                  <form onSubmit={handleSalvarEdicao} style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '25px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h4 style={{ fontFamily: 'Inter', color: '#0C3851', margin: 0, borderLeft: '4px solid #236B94', paddingLeft: '10px' }}>Dados Pessoais</h4>
                      <div>
                        <label style={labelStyle}>Nome Completo:</label>
                        <input style={inputStyle} value={editFormData?.nome ?? ""} onChange={(e) => updateEditFormData("nome", e.target.value)} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                        <div><label style={labelStyle}>CPF:</label><input style={inputStyle} value={editFormData?.cpf ?? ""} onChange={(e) => updateEditFormData("cpf", e.target.value)} /></div>
                        <div><label style={labelStyle}>E-mail:</label><input style={inputStyle} value={editFormData?.email ?? ""} onChange={(e) => updateEditFormData("email", e.target.value)} /></div>
                        <div><label style={labelStyle}>Telefone:</label><input style={inputStyle} value={editFormData?.telefone ?? ""} onChange={(e) => updateEditFormData("telefone", e.target.value)} /></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h4 style={{ fontFamily: 'Inter', color: '#0C3851', margin: 0, borderLeft: '4px solid #236B94', paddingLeft: '10px' }}>Endereço Completo</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px' }}>
                        <div><label style={labelStyle}>CEP:</label><input style={inputStyle} value={editFormData?.cep ?? ""} onChange={(e) => updateEditFormData("cep", e.target.value)} /></div>
                        <div><label style={labelStyle}>Logradouro (Rua):</label><input style={inputStyle} value={editFormData?.logradouro ?? ""} onChange={(e) => updateEditFormData("logradouro", e.target.value)} /></div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                        <div><label style={labelStyle}>Número:</label><input style={inputStyle} value={editFormData?.numero ?? ""} onChange={(e) => updateEditFormData("numero", e.target.value)} /></div>
                        <div><label style={labelStyle}>Complemento:</label><input style={inputStyle} value={editFormData?.complemento ?? ""} onChange={(e) => updateEditFormData("complemento", e.target.value)} placeholder="Apto, Bloco..." /></div>
                        <div><label style={labelStyle}>Bairro:</label><input style={inputStyle} value={editFormData?.bairro ?? ""} onChange={(e) => updateEditFormData("bairro", e.target.value)} /></div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                        <div><label style={labelStyle}>Cidade:</label><input style={inputStyle} value={editFormData?.cidade ?? ""} onChange={(e) => updateEditFormData("cidade", e.target.value)} /></div>
                        <div><label style={labelStyle}>Estado (UF):</label><input style={inputStyle} value={editFormData?.estado ?? ""} onChange={(e) => updateEditFormData("estado", e.target.value)} /></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                      <button type="button" onClick={() => setModalEditarCliente(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '2px solid #0C3851', color: '#0C3851', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
                      <button type="submit" style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#0C3851', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Salvar Alterações</button>
                    </div>
                  </form>
                </div>
              </div>
          )}

          {modalEnvioAberto && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '20px', maxWidth: '500px', width: '100%', position: 'relative' }}>
                  <button onClick={() => setModalEnvioAberto(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#0C3851', fontSize: '20px', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
                  <h3 style={{ fontFamily: 'Inter', color: '#0C3851', margin: 0, fontSize: '1.6rem' }}>Enviar Documento</h3>

                  <form onSubmit={handleEnviarDocumento} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                    <div>
                      <label style={labelStyle}>Tipo de Documento:</label>
                      <select style={inputStyle} required value={categoriaSelecionada} onChange={(e) => setCategoriaSelecionada(e.target.value)}>
                        <option value="" disabled hidden>Selecione o Tipo...</option>
                        <option value="IRPF">Declaração IRPF</option>
                        <option value="GUIA">Guia de Pagamento</option>
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Arquivo:</label>
                      <input type="file" required accept=".pdf, .jpg, .jpeg, .png, .xml" onChange={(e) => setArquivoSelecionado(e.target.files ? e.target.files[0] : null)} style={{...inputStyle, backgroundColor: '#236B94', color: '#fff'}} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button type="button" onClick={() => setModalEnvioAberto(false)} disabled={enviando} style={{ flex: 1, padding: '12px', borderRadius: '8px', cursor: enviando ? 'not-allowed' : 'pointer', border: '1px solid #0C3851', color: '#0C3851', backgroundColor: 'transparent', fontWeight: 'bold' }}>Cancelar</button>
                      <button type="submit" disabled={enviando} style={{ flex: 2, backgroundColor: '#0C3851', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: enviando ? 'not-allowed' : 'pointer', opacity: enviando ? 0.7 : 1 }}>
                        {enviando ? "Enviando..." : "Confirmar Envio"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
          )}
        </main>
      </>
  );
}
