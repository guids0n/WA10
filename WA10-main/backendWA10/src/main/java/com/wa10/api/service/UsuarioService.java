package com.wa10.api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wa10.api.model.Usuario;
import com.wa10.api.model.TipoUsuario;
import com.wa10.api.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    /**
     * Salva ou atualiza um usuário, validando duplicidade de CPF
     * e disparando e-mail de primeiro acesso institucional sem expor OTP.
     */
    public Usuario salvar(Usuario usuario) {
        // 1. Validação de CPF único
        Optional<Usuario> existente = usuarioRepository.findByCpf(usuario.getCpf());

        if (existente.isPresent() && !existente.get().getId().equals(usuario.getId())) {
            throw new RuntimeException("CPF já cadastrado para outro usuário!");
        }

        // 2. Lógica de Cadastro pelo Admin (Somente para novos registros)
        if (usuario.getId() == null) {
            usuario.setSenhaHash(null);     // Deixa sem senha para forçar fluxo de primeiro acesso
            usuario.setCodigoOtp(null);     // 👉 CORREÇÃO: Não gera OTP ainda
            usuario.setOtpExpiracao(null);  // 👉 CORREÇÃO: Fica em branco

            // 👉 CORREÇÃO: Envia apenas a rota inicial segura do Next.js
            emailService.enviarEmailBoasVindasSemOtp(usuario.getEmail(), usuario.getNome());
        }

        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarClientes() {
        return usuarioRepository.findAllByTipoUsuarioNot(TipoUsuario.ADMIN);
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    /**
     * Valida se o e-mail pertence a um usuário sem senha e gera novo OTP.
     * Acionado quando o cliente acessa a tela "/primeiro-acesso" no front-end.
     */
    public void validarESolicitarPrimeiroAcesso(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado!"));

        if (usuario.getSenhaHash() != null) {
            throw new RuntimeException("Este usuário já possui senha cadastrada.");
        }

        usuario.setCodigoOtp(gerarCodigoOtp());
        usuario.setOtpExpiracao(LocalDateTime.now().plusMinutes(15));
        usuarioRepository.save(usuario);

        emailService.enviarEmailOtp(usuario.getEmail(), usuario.getNome(), usuario.getCodigoOtp());
    }

    public void definirSenhaInicial(String email, String otp, String novaSenha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado!"));

        validarOtp(usuario, otp);

        usuario.setSenhaHash(passwordEncoder.encode(novaSenha));
        limparDadosOtp(usuario);

        usuarioRepository.save(usuario);
    }

    public void solicitarRecuperacaoSenha(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado!"));

        usuario.setCodigoOtp(gerarCodigoOtp());
        usuario.setOtpExpiracao(LocalDateTime.now().plusMinutes(15));

        usuarioRepository.save(usuario);

        // Dispara o e-mail de recuperação
        emailService.enviarEmailOtp(usuario.getEmail(), usuario.getNome(), usuario.getCodigoOtp());
    }

    public void alternarStatus(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        usuario.setAtivo(!usuario.isAtivo());
        usuarioRepository.save(usuario);
    }

    // Métodos Auxiliares
    private String gerarCodigoOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    private void validarOtp(Usuario usuario, String otp) {
        if (usuario.getCodigoOtp() == null || !usuario.getCodigoOtp().equals(otp)) {
            throw new RuntimeException("Código inválido!");
        }
        if (usuario.getOtpExpiracao().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("O código expirou!");
        }
    }

    private void limparDadosOtp(Usuario usuario) {
        usuario.setCodigoOtp(null);
        usuario.setOtpExpiracao(null);
    }
}