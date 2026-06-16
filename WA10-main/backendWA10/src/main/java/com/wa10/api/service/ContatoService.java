package com.wa10.api.service;

import com.wa10.api.dto.ContatoRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContatoService {

    @Autowired
    private EmailService emailService;

    public void processarContato(ContatoRequest request) {

        emailService.enviarEmailContato(request);
    }
}