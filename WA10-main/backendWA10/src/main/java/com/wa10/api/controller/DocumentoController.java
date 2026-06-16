package com.wa10.api.controller;

import com.wa10.api.model.Documento;
import com.wa10.api.model.Usuario;
import com.wa10.api.repository.DocumentoRepository;
import com.wa10.api.service.DocumentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/v1/documentos")
public class DocumentoController {

    @Autowired
    private DocumentoService documentoService;

    @Autowired
    private DocumentoRepository documentoRepository;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Documento> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("usuarioId") Long usuarioId,
            @RequestParam("origem") String origem) {

        Usuario usuarioFake = new Usuario();
        usuarioFake.setId(usuarioId);

        Documento novoDoc = documentoService.upload(file, usuarioFake, origem);
        return ResponseEntity.ok(novoDoc);
    }

    @GetMapping("/download/{uuid}")
    public ResponseEntity<Resource> download(@PathVariable String uuid) {
        Documento doc = documentoService.buscarPorUuid(uuid);
        Resource arquivo = documentoService.carregarArquivo(doc.getPathArmazenamento());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(doc.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getNomeOriginal() + "\"")
                .body(arquivo);
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<Void> deletarDocumento(@PathVariable String uuid) {
        documentoService.excluirDocumento(uuid);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{uuid}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Documento> atualizarDocumento(
            @PathVariable String uuid,
            @RequestParam("file") MultipartFile novoFile) {

        Documento docAtualizado = documentoService.alterarDocumento(uuid, novoFile);
        return ResponseEntity.ok(docAtualizado);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Documento>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<Documento> docs = documentoRepository.findByProprietarioId(usuarioId);
        return ResponseEntity.ok(docs);
    }

    @GetMapping
    public ResponseEntity<List<Documento>> listarTodos() {
        List<Documento> todosDocs = documentoRepository.findAll();
        return ResponseEntity.ok(todosDocs);
    }
}
