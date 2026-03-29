"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginCliente() {
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");

  const lidarComLogin = (e: React.FormEvent) => {
    e.preventDefault(); 
    console.log("Tentando login com:", cpf, senha);
    router.push("/portal-cliente"); 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F4F7F6' }}>
      
      <nav style={{ backgroundColor: '#0C3851', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0, padding: 0 }}>
        <Link href="/">

          <img src="/Icones/Logo.svg" alt="Logo WA10" style={{ height: '40px', width: 'auto', display: 'block' }} />
        </Link>
      </nav>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          
          <h2 style={{ fontFamily: 'Inter', color: '#0C3851', marginBottom: '10px', fontSize: '1.8rem', marginTop: 0 }}>Área do Cliente</h2>
          <p style={{ marginBottom: '30px', color: '#666', fontFamily: 'Inter', fontSize: '0.95rem' }}>
            Acesse para gerenciar seus documentos fiscais.
          </p>

          <form onSubmit={lidarComLogin} style={{ textAlign: 'left' }}>
            
            <label htmlFor="cpf" style={{ display: 'block', fontFamily: 'Inter', fontWeight: 'bold', color: '#0C3851', marginBottom: '8px', fontSize: '0.9rem' }}>CPF:</label>
            <input 
              type="text" 
              id="cpf" 
              name="cpf" 
              required 
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="input-claro"
              style={{ padding: '12px 15px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', width: '100%', boxSizing: 'border-box', fontFamily: 'Inter', color: '#333', backgroundColor: '#fff', fontSize: '0.95rem' }}
            />

            <label htmlFor="senha" style={{ display: 'block', fontFamily: 'Inter', fontWeight: 'bold', color: '#0C3851', marginBottom: '8px', fontSize: '0.9rem' }}>Senha:</label>
            <input
              type="password"
              id="senha"
              name="senha"
              required
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="input-claro"
              style={{ padding: '12px 15px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', width: '100%', boxSizing: 'border-box', fontFamily: 'Inter', color: '#333', backgroundColor: '#fff', fontSize: '0.95rem' }}
            />

            <button type="submit" style={{ 
              width: '100%', padding: '15px', backgroundColor: '#0C3851', color: '#fff', 
              border: 'none', borderRadius: '8px', fontFamily: 'Inter', fontWeight: 'bold', 
              fontSize: '1rem', cursor: 'pointer', transition: 'background-color 0.3s', marginTop: '10px'
            }}>
              Entrar no Portal
            </button>
          </form>

        </div>
      </main>

      {/* 3. FOOTER */}
      <footer style={{ backgroundColor: '#0C3851', color: 'white', textAlign: 'center', fontFamily: 'Inter' }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Todos os direitos reservados <strong>Eduardo Soares</strong> e <strong>Guidson Barreto</strong> 2026</p>
      </footer>
    </div>
  );
}