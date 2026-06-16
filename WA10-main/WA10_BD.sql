CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL, 
    status VARCHAR(20) DEFAULT 'ATIVO',    
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE endereco (
    id BIGINT AUTO_INCREMENT NOT NULL,
    usuario_id BIGINT NOT NULL UNIQUE, 
    cep VARCHAR(10),
    logradouro VARCHAR(150),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf CHAR(2),
    PRIMARY KEY (id),
    CONSTRAINT fk_endereco_usuario 
        FOREIGN KEY (usuario_id) 
        REFERENCES usuario (id) 
        ON DELETE CASCADE 
);

CREATE TABLE documento (
    id BIGINT AUTO_INCREMENT NOT NULL,
    usuario_id BIGINT NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    caminho_arquivo VARCHAR(500) NOT NULL,
    data_envio DATETIME NOT NULL,
    remetente VARCHAR(20) NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,   
    tamanho_arquivo BIGINT,  
    extensao_arquivo VARCHAR(10),
    PRIMARY KEY (id),
    CONSTRAINT fk_documento_usuario 
        FOREIGN KEY (usuario_id) 
        REFERENCES usuario (id)
        ON UPDATE CASCADE
);