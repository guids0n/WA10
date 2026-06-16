package com.wa10.api.service;

import com.wa10.api.dto.ContatoRequest;

public interface EmailService {

    void enviarEmailOtp(String destinatario, String nome, String codigo);

    void enviarEmailContato(ContatoRequest contato);

    void enviarEmailBoasVindasSemOtp(String destinatario, String nome);
}