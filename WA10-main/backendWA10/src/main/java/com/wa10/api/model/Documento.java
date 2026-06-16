package com.wa10.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "documento")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Column(unique = true, nullable = false)
    private String uuid = UUID.randomUUID().toString(); 

    private String nomeOriginal;
    private String pathArmazenamento;
    private String contentType;
    private String checksum; 
    
    // NOVO CAMPO: Identifica se veio da 'CONTABILIDADE' ou do 'CLIENTE'
    private String origem; 

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario proprietario;
}