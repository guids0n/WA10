"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginAdmin() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const lidarComLogin = (e: React.FormEvent) => {
    e.preventDefault(); 
    
    console.log("Admin tentando logar:", usuario);
    
    router.push("/portal-admin"); 
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <nav style={{ justifyContent: 'center', display: 'flex', backgroundColor: '#0C3851'}}>
        <div className="nav-conteudo" style={{ justifyContent: 'center', width: 'auto', display: 'flex' }}>
          <a href="/" className="logo-menu">
            <img className="logo-menu" src="/Icones/Logo.svg" alt="Logo WA10" style={{ width: '200px' }} />
          </a>
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

          <div className="formulario" style={{ width: '100%', margin: '0' }}>
            <form onSubmit={lidarComLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ textAlign: 'left' }}>
                <label htmlFor="usuario" style={{ fontFamily: 'Inter', fontWeight: 'bold', color: '#0C3851', display: 'block', marginBottom: '5px' }}>Usuário / E-mail:</label>
                <input 
                  type="text" 
                  id="usuario" 
                  required 
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
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Inter', boxSizing: 'border-box' }}
                />
              </div>

              <button type="submit" className="botao-enviar">
                Acessar Painel
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer style={{ backgroundColor: '#0C3851', color: 'white', textAlign: 'center', fontFamily: 'Inter' }}>
        <p>Todos os direitos reservados <strong>Eduardo Soares</strong> e <strong>Guidson Barreto</strong> 2026</p>
      </footer>
    </>
  );
}