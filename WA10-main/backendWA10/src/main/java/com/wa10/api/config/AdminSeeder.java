package com.wa10.api.config;

import com.wa10.api.model.TipoUsuario;
import com.wa10.api.model.Usuario;
import com.wa10.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value; 
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class AdminSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${WA10_ADMIN_EMAIL}")
    private String emailAdmin;

    @Value("${WA10_ADMIN_PASSWORD}")
    private String senhaAdmin;

    @Value("${WA10_ADMIN_CPF}")
    private String cpfAdmin;

    public AdminSeeder(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        Optional<Usuario> adminExistente = usuarioRepository.findByEmail(emailAdmin);

        if (adminExistente.isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador WA10");
            admin.setCpf(cpfAdmin);
            admin.setEmail(emailAdmin);

            admin.setSenhaHash(passwordEncoder.encode(senhaAdmin)); 
            
            admin.setTipoUsuario(TipoUsuario.ADMIN);
            admin.setTelefone("61999999999");

            admin.setAtivo(true); 

            usuarioRepository.save(admin);
            System.out.println("🚀 [WA10] Administrador Root criado e ATIVADO via variáveis de ambiente!");
        } else {

            Usuario admin = adminExistente.get();
            admin.setAtivo(true);
            admin.setSenhaHash(passwordEncoder.encode(senhaAdmin));
            
            usuarioRepository.save(admin);
            System.out.println("⚡ [WA10] Administrador atualizado");
        }
    }
}