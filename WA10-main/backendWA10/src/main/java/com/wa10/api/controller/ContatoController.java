package com.wa10.api.controller;

import com.wa10.api.dto.ContatoRequest;
import com.wa10.api.service.ContatoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contatos")
@CrossOrigin(origins = "http://localhost:3000")
public class ContatoController {

    @Autowired
    private ContatoService service;

    @PostMapping
    public ResponseEntity<String> criarContato(@RequestBody ContatoRequest request) {
        try {
            service.processarContato(request);
            return ResponseEntity.ok("Sua mensagem foi enviada com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao enviar mensagem: " + e.getMessage());
        }
    }
}