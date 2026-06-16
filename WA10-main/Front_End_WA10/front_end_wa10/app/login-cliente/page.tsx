"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/api";

export default function LoginCliente() {
  const router = useRouter();
  const [identificacao, setIdentificacao] = useState(""); 
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(""); 
  const [carregando, setCarregando] = useState(false);

  const lidarComLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErro(""); 
    setCarregando(true);

    try {

      const dadosDoUsuario = await api.auth.login({
        email: identificacao.trim(),
        senha: senha,
      });

      console.log("Login autorizado para o cliente!", dadosDoUsuario);

      localStorage.setItem("token", dadosDoUsuario.token || "token_wa10_cliente_autenticado");
      localStorage.setItem("usuarioId", String(dadosDoUsuario.id));
      localStorage.setItem("usuarioLogado", JSON.stringify(dadosDoUsuario));

      router.push("/portal-cliente");
    } catch (err) {

      const msgErro = err instanceof Error ? err.message : "";

      if (msgErro.includes("Senha incorreta") || msgErro.includes("não encontrado")) {
        setErro("Usuário ou senha incorretos. Tente novamente.");
      } else if (msgErro.includes("inativa")) {
        setErro("Acesso negado. Sua conta está inativa.");
      } else {
        setErro("Não foi possível conectar ao servidor WA10. Verifique sua conexão.");
      }
      console.error("Erro na conexão:", err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <nav style={{ justifyContent: 'center', display: 'flex', backgroundColor: '#0C3851', padding: '15px' }}>
        <div className="nav-conteudo" style={{ justifyContent: 'center', width: 'auto', display: 'flex' }}>
          <Link href="/" className="logo-menu">
            <img className="logo-menu" src="/Icones/Logo.svg" alt="Logo WA10" style={{ width: '180px' }} />
          </Link>
        </div>
      </nav>

      <main id="pag-login" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#F4F7F6' }}>
        <div className="login-card" style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          
          <h2 style={{ fontFamily: 'Inter', color: '#0C3851', marginBottom: '5px' }}>Área do Cliente</h2>
          <p style={{ marginBottom: '25px', color: '#666', fontFamily: 'Inter', fontSize: '0.9rem' }}>
            Acesse para gerenciar seus documentos fiscais.
          </p>

          {erro && (
            <div style={{ 
              backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', 
              borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem',
              fontFamily: 'Inter', border: '1px solid #f5c6cb', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>{erro}</span>
            </div>
          )}

          <div className="formulario" style={{ width: '100%', margin: '0' }}>
            <form onSubmit={lidarComLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ textAlign: 'left' }}>
                <label htmlFor="identificacao" style={{ fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 'bold', color: '#0C3851', display: 'block', marginBottom: '5px' }}>
                  CPF ou E-mail:
                </label>
                <input 
                  type="text" id="identificacao" required disabled={carregando}
                  placeholder="seu@email.com" value={identificacao}
                  onChange={(e) => setIdentificacao(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Inter', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ textAlign: 'left' }}>
                <label htmlFor="senha" style={{ fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 'bold', color: '#0C3851', display: 'block', marginBottom: '5px' }}>
                  Senha:
                </label>
                <input
                  type="password" id="senha" required disabled={carregando}
                  placeholder="••••••••" value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Inter', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                type="submit" 
                className="botao-enviar"
                disabled={carregando}
                style={{ 
                  backgroundColor: '#0C3851', color: 'white', padding: '14px',
                  borderRadius: '8px', border: 'none', fontWeight: 'bold',
                  opacity: carregando ? 0.7 : 1, cursor: carregando ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter', marginTop: '10px'
                }}
              >
                {carregando ? "Autenticando..." : "Autenticar"}
              </button>
            </form>
          </div>

          <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', fontFamily: 'Inter' }}>
            <p style={{ margin: 0, color: '#666' }}>
              Ainda não tem uma senha? <Link href="/primeiro-acesso" style={{ color: '#236B94', fontWeight: 'bold', textDecoration: 'none' }}>Primeiro Acesso</Link>
            </p>
            <p style={{ margin: 0 }}>
              <Link href="/redefinir-senha" style={{ color: '#236B94', textDecoration: 'none' }}>Esqueceu sua senha?</Link>
            </p>
          </div>

        </div>
      </main>

      <footer style={{ backgroundColor: '#0C3851', color: 'white', textAlign: 'center', fontFamily: 'Inter', padding: '15px', fontSize: '0.9rem' }}>
        <p style={{ margin: 0 }}>Todos os direitos reservados <strong>Eduardo Soares</strong> e <strong>Guidson Barreto</strong> 2026</p>
      </footer>
    </>
  );
}