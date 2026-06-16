package com.wa10.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;


@Entity
@Table(name = "usuario")
@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Convert(converter = CriptografiaConverter.class)
    @Column(unique = true, nullable = false, length = 255)
    private String cpf;

    @Convert(converter = CriptografiaConverter.class)
    @Column(nullable = false, length = 255)
    private String nome;

    @Convert(converter = CriptografiaConverter.class)
    @Column(unique = true, length = 255)
    private String email;

    @Convert(converter = CriptografiaConverter.class)
    @Column(length = 255)
    private String telefone;

    @Convert(converter = CriptografiaConverter.class)
    @Column(length = 255)
    private String cep;

    @Convert(converter = CriptografiaConverter.class)
    @Column(length = 255)
    private String logradouro;

    @Convert(converter = CriptografiaConverter.class)
    @Column(length = 255)
    private String numero;

    @Convert(converter = CriptografiaConverter.class)
    @Column(length = 255)
    private String complemento;

    @Convert(converter = CriptografiaConverter.class)
    @Column(length = 255)
    private String bairro;

    @Convert(converter = CriptografiaConverter.class)
    @Column(length = 255)
    private String cidade;

    @Convert(converter = CriptografiaConverter.class)
    @Column(length = 255)
    private String estado;

    @JsonIgnore
    @Column(name = "senha_hash", nullable = true)
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_usuario")
    private TipoUsuario tipoUsuario;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(name = "codigo_otp", length = 6)
    private String codigoOtp;

    @Column(name = "otp_expiracao")
    private LocalDateTime otpExpiracao;
}
@Converter
class CriptografiaConverter implements AttributeConverter<String, String> {

    private static final String CHAVE = "Wa10SecretKey123";
    private static final String ALGORITMO = "AES";

    @Override
    public String convertToDatabaseColumn(String dadoOriginal) {
        if (dadoOriginal == null) return null;
        try {
            Cipher cipher = Cipher.getInstance(ALGORITMO);
            SecretKeySpec key = new SecretKeySpec(CHAVE.getBytes(), ALGORITMO);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return Base64.getEncoder().encodeToString(cipher.doFinal(dadoOriginal.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao ocultar dado", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dadoDoBanco) {
        if (dadoDoBanco == null) return null;
        try {
            Cipher cipher = Cipher.getInstance(ALGORITMO);
            SecretKeySpec key = new SecretKeySpec(CHAVE.getBytes(), ALGORITMO);
            cipher.init(Cipher.DECRYPT_MODE, key);
            return new String(cipher.doFinal(Base64.getDecoder().decode(dadoDoBanco)));
        } catch (Exception e) {

            return dadoDoBanco;
        }
    }
}