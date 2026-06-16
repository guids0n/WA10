"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { api, Documento } from "@/app/api";

interface DocumentoExibicao {
    id?: number;
    uuid: string;
    nome: string;
    tipo: string;
    data: string;
    status: string;
    icon: string;
    origem: string;
}

export default function PortalCliente() {
    const router = useRouter();

    const [clienteId, setClienteId] = useState<string | null>(null);

    const [modalAberto, setModalAberto] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
    const [enviando, setEnviando] = useState(false);

    const [documentos, setDocumentos] = useState<DocumentoExibicao[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [docEmEdicao, setDocEmEdicao] = useState<string | null>(null);

    const handleSair = () => {

        localStorage.clear();
        router.push("/login-cliente");
    };

    useEffect(() => {
        const idSalvo = localStorage.getItem("usuarioId");
        if (!idSalvo) {
            router.push("/login-cliente");
        } else {
            setClienteId(idSalvo);
        }
    }, [router]);

    useEffect(() => {
        if (!clienteId) return;

        const carregarDocumentos = async () => {
            try {

                const dadosDoBanco = await api.documentos.listarPorUsuario(clienteId);

                const docsFormatados = dadosDoBanco.map((doc: Documento & { tipoDocumento?: string }) => ({
                    id: doc.id,
                    uuid: doc.uuid,
                    nome: doc.nomeOriginal,
                    tipo: formatarTipoDocumento(doc.tipoDocumento || ""),
                    data: new Date().toLocaleDateString('pt-BR'),
                    status: "enviado",
                    icon: doc.contentType?.includes("pdf") ? "fa-file-pdf" : "fa-image",
                    origem: doc.origem || 'CLIENTE'
                }));
                setDocumentos(docsFormatados);
            } catch (error) {
                console.error("Erro ao carregar documentos:", error);
            }
        };

        void carregarDocumentos();
    }, [clienteId]);

    const formatarTipoDocumento = (tipo: string) => {
        const tipos: { [key: string]: string } = {
            comprovanteRenda: "Comprovante de Renda",
            despesaMedica: "Despesa Médica",
            InformeBancario: "Informe Bancário",
            reciboPagamento: "Recibo de Pagamento",
            declaracaoFinal: "Declaração Final",
            outro: "Outro"
        };
        return tipos[tipo] || "Documento";
    };

    const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!arquivoSelecionado || !categoriaSelecionada || !clienteId) return;

        setEnviando(true);
        const formData = new FormData();
        formData.append("file", arquivoSelecionado);
        formData.append("usuarioId", clienteId);
        formData.append("origem", "CLIENTE");
        formData.append("tipo", categoriaSelecionada);

        try {

            const novoDocBackend = await api.documentos.upload(formData);

            const novoDocFront: DocumentoExibicao = {
                id: novoDocBackend.id,
                uuid: novoDocBackend.uuid,
                nome: novoDocBackend.nomeOriginal,
                tipo: formatarTipoDocumento(categoriaSelecionada),
                data: new Date().toLocaleDateString('pt-BR'),
                status: "enviado",
                icon: arquivoSelecionado.type.includes("pdf") ? "fa-file-pdf" : "fa-image",
                origem: 'CLIENTE'
            };

            setDocumentos([novoDocFront, ...documentos]);
            setArquivoSelecionado(null);
            setCategoriaSelecionada("");
            setModalAberto(false);
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

            const resposta = await fetch(`http://localhost:8080/api/v1/documentos/download/${uuid}`, {
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
        if (!window.confirm("Deseja excluir permanentemente?")) return;
        try {

            await api.documentos.deletar(uuid);
            setDocumentos(documentos.filter(doc => doc.uuid !== uuid));
        } catch (err) {
            const msgErro = err instanceof Error ? err.message : "Erro de conexão.";
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

            const docAtu = await api.documentos.atualizar(docEmEdicao, formData);

            setDocumentos(documentos.map(doc =>
                doc.uuid === docEmEdicao
                    ? { ...doc, nome: docAtu.nomeOriginal, icon: docAtu.contentType?.includes("pdf") ? "fa-file-pdf" : "fa-image" }
                    : doc
            ));
            alert("Arquivo substituído com sucesso!");
        } catch (err) {
            const msgErro = err instanceof Error ? err.message : "Erro ao substituir.";
            alert(msgErro);
        } finally {
            setDocEmEdicao(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const gridTemplate = "2.5fr 1.5fr 1fr 1fr 1fr";

    if (!clienteId) return null;

    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf, .jpg, .jpeg, .png, .xml"
                onChange={handleAlterarArquivo}
            />

            <nav
                style={{
                    backgroundColor: '#0C3851',
                    padding: '10px 15px'
                }}
            >
                <div
                    className="nav-conteudo"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        width: '100%'
                    }}
                >
                    <Link
                        href="/"
                        style={{ flexShrink: 0 }}
                    >
                        <img
                            src="/Icones/Logo.svg"
                            alt="Logo WA10"
                            style={{
                                height: '35px',
                                width: 'auto'
                            }}
                        />
                    </Link>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            flexShrink: 0
                        }}
                    >
            <span
                style={{
                    color: 'white',
                    fontFamily: 'Inter',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap'
                }}
            >
              Olá, <strong>Cliente</strong>
            </span>
                        <button
                            onClick={handleSair}
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

            <main
                id="pag-portal"
                style={{
                    padding: '40px 20px',
                    backgroundColor: '#F4F7F6',
                    minHeight: '85vh'
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '30px'
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    fontFamily: 'Inter',
                                    color: '#0C3851',
                                    margin: 0
                                }}
                            >
                                Meus Documentos
                            </h2>
                            <p
                                style={{
                                    fontFamily: 'Inter',
                                    color: '#666',
                                    marginTop: '5px'
                                }}
                            >
                                Gerencie seus envios e downloads fiscais.
                            </p>
                        </div>
                        <button
                            onClick={() => setModalAberto(true)}
                            style={{
                                backgroundColor: '#0C3851',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'Inter',
                                fontWeight: 'bold'
                            }}
                        >
                            <i className="fa-solid fa-cloud-arrow-up"></i> Novo Envio
                        </button>
                    </div>

                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: gridTemplate,
                                padding: '15px 25px',
                                backgroundColor: '#0C3851',
                                color: 'white',
                                fontWeight: 'bold',
                                fontFamily: 'Inter',
                                fontSize: '0.9rem'
                            }}
                        >
                            <div>Nome do Arquivo</div>
                            <div>Tipo</div>
                            <div>Data</div>
                            <div style={{ textAlign: 'center' }}>Origem</div>
                            <div style={{ textAlign: 'right' }}>Ações</div>
                        </div>

                        {documentos.length === 0 ? (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '60px',
                                    color: '#ccc',
                                    fontFamily: 'Inter'
                                }}
                            >
                                <i
                                    className="fa-solid fa-folder-open"
                                    style={{
                                        fontSize: '3rem',
                                        marginBottom: '15px'
                                    }}
                                ></i>
                                <p>Nenhum documento encontrado.</p>
                            </div>
                        ) : (
                            documentos.map((doc) => (
                                <div
                                    key={doc.id}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: gridTemplate,
                                        padding: '18px 25px',
                                        borderBottom: '1px solid #eee',
                                        alignItems: 'center',
                                        fontFamily: 'Inter',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <i
                                            className={`fa-solid ${doc.icon}`}
                                            style={{
                                                color: '#0C3851',
                                                fontSize: '1.1rem'
                                            }}
                                        ></i>
                                        <span
                                            style={{
                                                fontWeight: 500,
                                                color: '#333',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                      {doc.nome}
                    </span>
                                    </div>
                                    <div style={{ color: '#666' }}>{doc.tipo}</div>
                                    <div style={{ color: '#666' }}>{doc.data}</div>

                                    <div style={{ textAlign: 'center' }}>
                    <span
                        style={{
                            backgroundColor: doc.origem === 'ADMIN' ? '#EBF5FB' : '#F4F7F6',
                            color: doc.origem === 'ADMIN' ? '#2874A6' : '#666',
                            padding: '4px 12px',
                            borderRadius: '15px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            display: 'inline-block',
                            minWidth: '100px'
                        }}
                    >
                      {doc.origem === 'ADMIN' ? 'Contabilidade' : 'Você'}
                    </span>
                                    </div>

                                    <div
                                        style={{
                                            textAlign: 'right',
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            gap: '15px'
                                        }}
                                    >
                                        <button
                                            onClick={() => handleDownload(doc.uuid)}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                cursor: 'pointer',
                                                color: '#0C3851',
                                                fontSize: '1.1rem'
                                            }}
                                            title="Baixar"
                                        >
                                            <i className="fa-solid fa-download"></i>
                                        </button>
                                        {doc.origem === 'CLIENTE' && (
                                            <>
                                                <button
                                                    onClick={() => iniciarEdicao(doc.uuid)}
                                                    style={{
                                                        border: 'none',
                                                        background: 'none',
                                                        cursor: 'pointer',
                                                        color: '#f1c605',
                                                        fontSize: '1.1rem'
                                                    }}
                                                    title="Substituir"
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleExcluir(doc.uuid)}
                                                    style={{
                                                        border: 'none',
                                                        background: 'none',
                                                        cursor: 'pointer',
                                                        color: '#dc3545',
                                                        fontSize: '1.1rem'
                                                    }}
                                                    title="Excluir"
                                                >
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

                {modalAberto && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            zIndex: 1000,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backdropFilter: 'blur(4px)'
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: 'white',
                                padding: '40px',
                                borderRadius: '20px',
                                width: '100%',
                                maxWidth: '500px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                            }}
                        >
                            <h3
                                style={{
                                    fontFamily: 'Inter',
                                    fontWeight: 'bold',
                                    fontSize: '1.5rem',
                                    color: '#0C3851',
                                    marginTop: 0
                                }}
                            >
                                Novo Envio
                            </h3>
                            <form
                                onSubmit={handleUpload}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px',
                                    marginTop: '20px'
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            fontFamily: 'Inter',
                                            fontWeight: 'bold',
                                            color: '#0C3851',
                                            fontSize: '0.9rem',
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}
                                    >
                                        Tipo de Documento:
                                    </label>
                                    <select
                                        required
                                        value={categoriaSelecionada}
                                        onChange={(e) => setCategoriaSelecionada(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontFamily: 'Inter',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="" disabled hidden>Selecione uma categoria...</option>
                                        <option value="comprovanteRenda">Comprovante de Renda</option>
                                        <option value="despesaMedica">Despesa Médica</option>
                                        <option value="InformeBancario">Informe Bancário</option>
                                        <option value="reciboPagamento">Recibo de Pagamento</option>
                                        <option value="declaracaoFinal">Declaração Final</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontFamily: 'Inter',
                                            fontWeight: 'bold',
                                            color: '#0C3851',
                                            fontSize: '0.9rem',
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}
                                    >
                                        Arquivo:
                                    </label>
                                    <input
                                        type="file"
                                        required
                                        accept=".pdf, .jpg, .jpeg, .png, .xml"
                                        onChange={(e) => setArquivoSelecionado(e.target.files ? e.target.files[0] : null)}
                                        style={{
                                            fontFamily: 'Inter',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '15px',
                                        marginTop: '10px'
                                    }}
                                >
                                    <button
                                        type="submit"
                                        disabled={enviando}
                                        style={{
                                            flex: 1,
                                            backgroundColor: '#0C3851',
                                            color: 'white',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {enviando ? "Enviando..." : "Enviar"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setModalAberto(false)}
                                        style={{
                                            flex: 1,
                                            backgroundColor: 'white',
                                            border: '1px solid #ddd',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <footer
                style={{
                    backgroundColor: '#0C3851',
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Inter',
                    padding: '20px'
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: '0.8rem'
                    }}
                >
                    Todos os direitos reservados <strong>Eduardo Soares</strong> e <strong>Guidson Barreto</strong> 2026
                </p>
            </footer>
        </>
    );
}