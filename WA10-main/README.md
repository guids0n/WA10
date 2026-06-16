# Sistema Contábil WA10 - Diagrama de Classes

```mermaid
classDiagram
    direction LR

    class BaseEntity {
        -Long id
        +Long getId()
        +void setId(Long id)
    }
    <<abstract>> BaseEntity

    class Usuario {
        -String cpf
        -String senhaHash
        -TipoUsuario tipoUsuario
        +String getCpf()
        +TipoUsuario getTipoUsuario()
        +String getSenhaHash()
    }

    class Documento {
        -String nomeArquivo
        -String caminhoArquivo
        -LocalDate dataEnvio
        -Usuario proprietario
        -TipoDocumento tipoDocumento
        +String getNomeArquivo()
        +void setNomeArquivo(String)
        +Usuario getProprietario()
        +void setProprietario(Usuario)
    }

    class Service {
        -List~Usuario~ repositorioUsuarios
        -String hashSenha(String)
        +void criarEArmazenarUsuario(...)
        +Usuario realizarLogin(...)
        +void editarEnvio(Usuario)
        +void removerEnvio(Usuario)
        +List~Documento~ visualizarDocumentosEnviados(Usuario)
    }

    class MainWA {
        +void main(String[] args)
    }

    %% Enum Classes (Sintaxe Básica Corrigida)
    class TipoUsuario {
        COMUM
        ADMINISTRADOR
    }
    <<enum>> TipoUsuario
    
    class TipoDocumento {
        comprovanteRenda
        despesaMedica
        InformeBancario
        ...
    }
    <<enum>> TipoDocumento

    %% Relacionamentos
    Documento --|> BaseEntity : Herda de 
    Usuario --|> BaseEntity : Herda de

    Service ..> Usuario : <<usa>>
    Service ..> Documento : <<usa>>
    Service ..> TipoUsuario : <<usa>>

    MainWA ..> Service : Chama
    MainWA ..> Usuario : Cria
    MainWA ..> Documento : Usa Getters/Setters

    Documento --> Usuario : proprietario 1 -- 1

    Usuario --> TipoUsuario : possui 1 -- 1
    Documento --> TipoDocumento : é do tipo 1 -- 1
