package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.model.FileDescriptions;
import com.licenta.StuddyBuddy.model.Module;
import com.licenta.StuddyBuddy.repository.FileDescriptionsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FileDescriptionsService {
    private final FileDescriptionsRepository fileDescriptionsRepository;
    public static final Path DIRECTORY = Path.of("upload");


    public FileDescriptions saveFileDescription(FileDescriptions fileDescriptions) {
        return fileDescriptionsRepository.save(fileDescriptions);
    }

    public List<FileDescriptions> getFileDescriptions(Module module) {
        return fileDescriptionsRepository.findAllByModule(module);
    }

    public void deleteFileDescriptions(String moduleId) throws Exception {

        List<FileDescriptions> files = fileDescriptionsRepository.findAllByModule_ModuleId(moduleId);
        for (FileDescriptions fileDescription : files) {
            deleteFileDescription(fileDescription.getFileDescriptionsId());
        }

    }
    public void deleteFileDescription(String fileId) throws Exception {
        Optional<FileDescriptions> filenameOpt = fileDescriptionsRepository.findById(fileId);
        if (filenameOpt.isEmpty()) {
            throw new Exception("No file found");
        }
        FileDescriptions filename = filenameOpt.get();
        Path filePath = DIRECTORY.resolve(filename.getFilePath());

        try {
            Files.deleteIfExists(filePath);
            fileDescriptionsRepository.deleteById(fileId);
        } catch (Exception e) {
            throw new Exception("Failed to delete file on path: " + filePath, e);
        }
    }
}
