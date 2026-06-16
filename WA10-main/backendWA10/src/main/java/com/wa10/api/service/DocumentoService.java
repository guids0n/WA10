package com.wa10.api.service;

import com.wa10.api.model.Documento;
import com.wa10.api.model.Usuario;
import com.wa10.api.repository.DocumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

@Service
public class DocumentoService {

    @Autowired private StorageService storageService;
    @Autowired private DocumentoRepository repository;

    // ATUALIZADO: Agora recebe a String origem vinda do Controller
    public Documento upload(MultipartFile file, Usuario user, String origem) {
        // 1. Validar Tipo (PDF, XML e incluí imagens para os ícones funcionarem)
        List<String> allowedTypes = Arrays.asList(
            "application/pdf", 
            "text/xml", 
            "image/jpeg", 
            "image/png"
        );
        
        if (!allowedTypes.contains(file.getContentType())) {
            throw new RuntimeException("Tipo de arquivo não permitido.");
        }

        // 2. Gerar Checksum (Integridade)
        String hash = gerarHash(file);

        // 3. Armazenar
        String path = storageService.store(file);

        // 4. Salvar Metadados
        Documento doc = new Documento();
        doc.setNomeOriginal(file.getOriginalFilename());
        doc.setPathArmazenamento(path);
        doc.setContentType(file.getContentType());
        doc.setChecksum(hash);
        doc.setProprietario(user);
        
        // 👉 A MÁGICA ACONTECE AQUI: Gravando quem enviou o arquivo
        doc.setOrigem(origem); 

        return repository.save(doc);
    }

    private String gerarHash(MultipartFile file) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256").digest(file.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) { return null; }
    }

    public void excluirDocumento(String uuid) {
        Documento doc = buscarPorUuid(uuid);
        storageService.delete(doc.getPathArmazenamento());
        repository.delete(doc);
    }

    public Documento alterarDocumento(String uuid, MultipartFile novoFile) {
        Documento docExistente = buscarPorUuid(uuid);

        // Mantendo a validação consistente com o upload
        List<String> allowedTypes = Arrays.asList("application/pdf", "text/xml", "image/jpeg", "image/png");
        if (!allowedTypes.contains(novoFile.getContentType())) {
            throw new RuntimeException("Tipo de arquivo não permitido.");
        }

        storageService.delete(docExistente.getPathArmazenamento());

        String novoPath = storageService.store(novoFile);
        String novoHash = gerarHash(novoFile);

        docExistente.setNomeOriginal(novoFile.getOriginalFilename());
        docExistente.setPathArmazenamento(novoPath);
        docExistente.setContentType(novoFile.getContentType());
        docExistente.setChecksum(novoHash);

        return repository.save(docExistente);
    }

    public Documento buscarPorUuid(String uuid) {
        return repository.findByUuid(uuid)
            .orElseThrow(() -> new RuntimeException("Documento não encontrado com UUID: " + uuid));
    }

    public Resource carregarArquivo(String path) {
        return storageService.loadAsResource(path);
    }
}