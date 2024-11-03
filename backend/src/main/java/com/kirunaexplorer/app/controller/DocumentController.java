package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentResponseDTO;
import com.kirunaexplorer.app.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/documents")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    /***
     * Endpoint to get all documents in brief format
     * @return List of DocumentBriefResponseDTO
     */
    @GetMapping
    public ResponseEntity<List<DocumentBriefResponseDTO>> getAllDocuments() {
        List<DocumentBriefResponseDTO> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    /***
     * Endpoint to get a document by id
     * @param id Document id
     * @return DocumentResponseDTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponseDTO> getDocumentById(@PathVariable Long id) {
        DocumentResponseDTO document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }
}

