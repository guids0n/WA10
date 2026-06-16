package com.wa10.api.dto;

public record ContatoRequest(
        String nome,
        String telefone,
        String email,
        String mensagem
) {}