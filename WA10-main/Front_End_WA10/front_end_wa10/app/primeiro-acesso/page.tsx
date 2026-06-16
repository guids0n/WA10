"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/app/api";

export default function RedefinirSenha() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [form, setForm] = useState({
    email: "",
    codigoOtp: "",
    novaSenha: "",
    confirmarSenha: ""
  });

  const solicitarCodigo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {

      await api.auth.esqueciSenha(form.email);

      alert("Código enviado! Verifique sua caixa de entrada no Mailtrap.");
      setEtapa(2);
    } catch (err) {

      const msgErro = err instanceof Error ? err.message : "Falha ao conectar com o servidor.";
      alert(`Erro: ${msgErro}`);
    } finally {
      setLoading(false);
    }
  };

  const finalizarCadastro = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.novaSenha !== form.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    try {

      await api.auth.definirSenha({
        email: form.email,
        codigoOtp: form.codigoOtp,
        novaSenha: form.novaSenha
      });

      alert("Sucesso! Sua nova senha foi cadastrada.");
      router.push("/login-cliente");
    } catch (err) {

      const msgErro = err instanceof Error ? err.message : "Falha na conexão.";
      alert(`Erro: ${msgErro}`);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0C3851 0%, #236B94 100%)',
    fontFamily: 'Inter, sans-serif'
  };

  const cardStyle = {
    backgroundColor: '#ffffffff',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '420px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #DDD',
    fontSize: '1rem',
    boxSizing: 'border-box' as const
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#0C3851',
    color: '#FFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '10px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#0C3851',
    fontSize: '0.85rem'
  };

  return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src="/Icones/Logo.svg" alt="WA10" style={{ height: '45px', marginBottom: '15px' }} />
            <h2 style={{ color: '#0C3851', margin: 0, fontSize: '1.5rem' }}>
              {etapa === 1 ? "Primeiro Acesso" : "Definir Nova Senha"}
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '8px' }}>
              {etapa === 1
                  ? "Informe seu e-mail para receber o código de validação para cadastro de senha."
                  : `Código enviado para ${form.email}`}
            </p>
          </div>

          {etapa === 1 ? (
              /* FORMULÁRIO ETAPA 1 */
              <form onSubmit={solicitarCodigo}>
                <label style={labelStyle}>E-mail de Cadastro</label>
                <input
                    type="email"
                    required
                    style={inputStyle}
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    placeholder="exemplo@email.com"
                />
                <button type="submit" disabled={loading} style={buttonStyle}>
                  {loading ? "Enviando..." : "Receber Código no E-mail"}
                </button>
              </form>
          ) : (
              /* FORMULÁRIO ETAPA 2 */
              <form onSubmit={finalizarCadastro}>
                <label style={labelStyle}>Código OTP (6 dígitos)</label>
                <input
                    type="text"
                    required
                    maxLength={6}
                    style={inputStyle}
                    value={form.codigoOtp}
                    onChange={(e) => setForm({...form, codigoOtp: e.target.value})}
                    placeholder="Digite o código do e-mail"
                />

                <label style={labelStyle}>Nova Senha</label>
                <input
                    type="password"
                    required
                    style={inputStyle}
                    value={form.novaSenha}
                    onChange={(e) => setForm({...form, novaSenha: e.target.value})}
                />

                <label style={labelStyle}>Confirmar Senha</label>
                <input
                    type="password"
                    required
                    style={inputStyle}
                    value={form.confirmarSenha}
                    onChange={(e) => setForm({...form, confirmarSenha: e.target.value})}
                />

                <button type="submit" disabled={loading} style={buttonStyle}>
                  {loading ? "Processando..." : "Finalizar e Entrar"}
                </button>
                <button
                    type="button"
                    onClick={() => setEtapa(1)}
                    style={{ ...buttonStyle, backgroundColor: 'transparent', color: '#666', fontWeight: 'normal' }}
                >
                  Alterar e-mail
                </button>
              </form>
          )}

          <div style={{ marginTop: '25px', textAlign: 'center', borderTop: '1px solid #EEE', paddingTop: '15px' }}>
            <Link href="/login-cliente" style={{ color: '#236B94', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '500' }}>
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
  );
}