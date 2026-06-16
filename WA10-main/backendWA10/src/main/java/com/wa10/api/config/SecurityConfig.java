package com.wa10.api.config;

// ... mantenha todos os seus imports originais e adicione estes dois:
import org.springframework.web.filter.CorsFilter;

// ... dentro da sua classe SecurityConfig ...

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Desativa CSRF
                .csrf(csrf -> csrf.disable())
                
                // 2. AQUI A MUDANÇA: Em vez de usar .cors() com source, 
                // vamos confiar que o CorsFilter (bean abaixo) vai tratar tudo
                .cors(cors -> {}) 
                
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/contatos").permitAll()
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/usuarios/**").authenticated()
                        .requestMatchers("/api/v1/documentos/**").authenticated()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 3. Este Bean cria um filtro de CORS que é aplicado antes de QUALQUER coisa
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        String frontendUrl = System.getenv("WA10_FRONTEND_URL");
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000", 
            (frontendUrl != null ? frontendUrl : "https://wa10-portal.onrender.com")));
            
        config.setAllowCredentials(true);
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
