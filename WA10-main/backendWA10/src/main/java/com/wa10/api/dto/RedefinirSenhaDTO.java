package com.wa10.api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RedefinirSenhaDTO {
    private String email;
    private String codigoOtp;
    private String novaSenha;
}