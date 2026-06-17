package com.wa10.api.config;

import com.wa10.api.repository.UsuarioRepository;
import com.wa10.api.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        var token = recoverToken(request);

        if (token != null) {
            try {
                var email = tokenService.validarToken(token);

                if (!email.isEmpty()) {
                    var usuario = usuarioRepository.findByEmail(email)
                            .orElseThrow(() -> new UsernameNotFoundException("Utilizador não encontrado"));

                    // CORREÇÃO: Em vez de 'null', passamos 'Collections.emptyList()' 
                    // para garantir que o Spring não bloqueie por falta de permissões (Authorities).
                    var authentication = new UsernamePasswordAuthenticationToken(usuario, null, Collections.emptyList());
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("DEBUG: Autenticação definida com sucesso para: " + email);
                } else {
                    System.err.println("DEBUG: Token validado, mas e-mail retornado está vazio.");
                }
            } catch (Exception e) {
                System.err.println("DEBUG: Erro crítico ao validar token no SecurityFilter: " + e.getMessage());
            }
        } else {
            System.out.println("DEBUG: Nenhuma requisição com token (Acesso não autenticado).");
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        return authHeader.replace("Bearer ", "");
    }
}
