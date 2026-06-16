"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/api";

export default function LoginAdmin() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const lidarComLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await api.auth.login({
        email: usuario.trim(),
        senha: senha,
      });

      if (resposta.tipoUsuario !== "ADMIN") {
        setErro("Acesso negado. Esta área é exclusiva para administradores.");
        setCarregando(false);
        return;
      }

      if (resposta.token) {
        localStorage.setItem("token", resposta.token);
        localStorage.setItem("usuarioId", String(resposta.id));
        localStorage.setItem("tipoUsuario", resposta.tipoUsuario);
        localStorage.setItem("usuarioLogado", JSON.stringify(resposta));

        console.log("🚀 [WA10] Login autorizado para o Admin:", resposta.nome);
        router.push("/portal-admin");
      } else {
        throw new Error("Token de autenticação não foi fornecido pelo servidor.");
      }

    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : "";

      if (mensagemErro.includes("Senha incorreta") || mensagemErro.includes("não encontrado")) {
        setErro("Usuário ou senha incorretos. Tente novamente.");
      } else if (mensagemErro.includes("inativa")) {
        setErro("Acesso negado. Sua conta está inativa.");
      } else {
        setErro("Não foi possível conectar ao servidor WA10. Verifique se o Backend está rodando.");
      }
      console.error("Erro na autenticação:", err);
    } finally {
      setCarregando(false);
    }
  }

  return (
      <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

        <nav style={{ justifyContent: 'center', display: 'flex', backgroundColor: '#0C3851' }}>
          <div className="nav-conteudo" style={{ justifyContent: 'center', width: 'auto', display: 'flex' }}>
            <Link href="/" className="logo-menu">
              <img className="logo-menu" src="/Icones/Logo.svg" alt="Logo WA10" style={{ width: '200px' }} />
            </Link>
          </div>
        </nav>

        <main id="pag-login" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#F4F7F6' }}>
          <div className="login-card" style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>

            <div style={{ color: '#dc3545', marginBottom: '10px', fontSize: '2rem' }}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>

            <h2 style={{ fontFamily: 'Inter', color: '#0C3851', marginBottom: '5px' }}>Área Restrita</h2>
            <p style={{ marginBottom: '25px', color: '#666', fontFamily: 'Inter', fontSize: '0.9rem' }}>
              Acesso exclusivo para a equipe WA10.
            </p>

            {/* ALERTA DE ERRO DINÂMICO */}
            {erro && (
                <div style={{
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '0.85rem',
                  fontFamily: 'Inter',
                  border: '1px solid #f5c6cb'
                }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i>
                  {erro}
                </div>
            )}

            <div className="formulario" style={{ width: '100%', margin: '0' }}>
              <form onSubmit={lidarComLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                <div style={{ textAlign: 'left' }}>
                  <label htmlFor="usuario" style={{ fontFamily: 'Inter', fontWeight: 'bold', color: '#0C3851', display: 'block', marginBottom: '5px' }}>Usuário / E-mail:</label>
                  <input
                      type="text"
                      id="usuario"
                      required
                      disabled={carregando}
                      placeholder="admin@wa10.com.br"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Inter', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label htmlFor="senha" style={{ fontFamily: 'Inter', fontWeight: 'bold', color: '#0C3851', display: 'block', marginBottom: '5px' }}>Senha de Acesso:</label>
                  <input
                      type="password"
                      id="senha"
                      required
                      disabled={carregando}
                      placeholder="••••••••"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Inter', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                    type="submit"
                    className="botao-enviar"
                    disabled={carregando}
                    style={{
                      opacity: carregando ? 0.7 : 1,
                      cursor: carregando ? 'not-allowed' : 'pointer'
                    }}
                >
                  {carregando ? "Autenticando..." : "Acessar Painel"}
                </button>
              </form>
            </div>
          </div>
        </main>

        <footer style={{ backgroundColor: '#0C3851', color: 'white', textAlign: 'center', fontFamily: 'Inter', padding: '15px' }}>
          <p>Todos os direitos reservados <strong>Eduardo Soares</strong> e <strong>Guidson Barreto</strong> 2026</p>
        </footer>
      </>
  );
}