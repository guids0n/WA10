package com.wa10.api.dto;

public record LoginResponseDTO(
    Long id,
    String nome,
    String email,
    String tipoUsuario,
    String mensagem,
    String token
) {}