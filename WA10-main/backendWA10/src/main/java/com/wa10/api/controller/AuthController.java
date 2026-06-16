package com.wa10.api.controller;

import com.wa10.api.dto.LoginRequest;
import com.wa10.api.dto.LoginResponseDTO;
import com.wa10.api.dto.RedefinirSenhaDTO;
import com.wa10.api.repository.UsuarioRepository;
import com.wa10.api.service.UsuarioService;
import com.wa10.api.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return usuarioRepository.findByEmail(request.email().trim())
                .map(user -> {
                    if (!user.isAtivo()) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body("Acesso negado. Sua conta está inativa.");
                    }

                    if (passwordEncoder.matches(request.senha(), user.getSenhaHash())) {

                        String tokenGerado = tokenService.gerarToken(user);

                        LoginResponseDTO response = new LoginResponseDTO(
                                user.getId(),
                                user.getNome(),
                                user.getEmail(),
                                user.getTipoUsuario().name(),
                                "Login autorizado!",
                                tokenGerado
                        );

                        return ResponseEntity.ok(response);
                    }

                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta.");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado."));
    }

    @PostMapping("/definir-senha")
    public ResponseEntity<String> definirSenha(@RequestBody RedefinirSenhaDTO request) {
        try {
            usuarioService.definirSenhaInicial(
                    request.getEmail(),
                    request.getCodigoOtp(),
                    request.getNovaSenha()
            );
            return ResponseEntity.ok("Senha cadastrada com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<String> esqueciSenha(@RequestParam String email) {
        try {
            usuarioService.solicitarRecuperacaoSenha(email);
            return ResponseEntity.ok("Código de recuperação enviado para o e-mail.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
