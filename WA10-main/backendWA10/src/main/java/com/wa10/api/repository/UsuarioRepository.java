package com.wa10.api.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.wa10.api.model.Usuario;
import com.wa10.api.model.TipoUsuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByEmail(String email);
    
    Optional<Usuario> findByCpf(String cpf);

    List<Usuario> findAllByTipoUsuarioNot(TipoUsuario tipoUsuario);

    List<Usuario> findAllByAtivoTrueAndTipoUsuarioNot(TipoUsuario tipoUsuario);

    List<Usuario> findAllByAtivoFalseAndTipoUsuarioNot(TipoUsuario tipoUsuario);
}