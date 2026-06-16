package com.wa10.api.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LocalFileSystemStorageService implements StorageService {
    
    private final Path rootLocation = Paths.get("upload-dir");

    @Override
    public String store(MultipartFile file) {
        try {
            if (file.isEmpty()) throw new RuntimeException("Arquivo vazio.");
            
            // Cria a pasta caso não exista
            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }

            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo", e);
        }
    }
    
    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Não foi possível ler o arquivo: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Arquivo não encontrado", e);
        }
    }

    @Override
    public void delete(String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new RuntimeException("Falha ao excluir o arquivo físico: " + filename, e);
        }
    }
}