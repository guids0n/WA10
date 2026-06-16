package com.wa10.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "contatos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String telefone;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    @Column(name = "data_envio", updatable = false)
    private LocalDateTime dataEnvio;

    @PrePersist
    protected void onCreate() {
        this.dataEnvio = LocalDateTime.now();
    }
}