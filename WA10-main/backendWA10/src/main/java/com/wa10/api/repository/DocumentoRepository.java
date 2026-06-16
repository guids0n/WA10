package com.wa10.api.repository;

import com.wa10.api.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {

    Optional<Documento> findByUuid(String uuid);
    List<Documento> findByProprietarioId(Long usuarioId);
}