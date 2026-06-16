package com.wa10.api.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                // 👉 AQUI ESTÁ A MÁGICA: Conectando o CORS com o nosso Bean lá embaixo
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(HttpMethod.POST, "/api/contatos").permitAll()
                        .requestMatchers("/api/v1/auth/**").permitAll()

                        .requestMatchers("/usuarios/**").authenticated()
                        .requestMatchers("/api/v1/documentos/**").authenticated()

                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/swagger-ui.html").permitAll()

                        .anyRequest().authenticated()
                );

        http.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 👉 O BEAN QUE LIBERA O SEU FRONT-END NO RENDER E O SEU LOCALHOST
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Lê a URL do seu Front-End lá das variáveis do Render
        String frontendUrl = System.getenv("WA10_FRONTEND_URL");

        if (frontendUrl != null && !frontendUrl.isEmpty()) {
            configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", frontendUrl));
        } else {
            configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        }

        // Métodos e cabeçalhos permitidos para a sua API funcionar 100%
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
