package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.model.FileDescriptions;
import com.licenta.StuddyBuddy.model.Module;
import com.licenta.StuddyBuddy.repository.FileDescriptionsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FileDescriptionsService {
    private final FileDescriptionsRepository fileDescriptionsRepository;


    public FileDescriptions saveFileDescription(FileDescriptions fileDescriptions) {
        return fileDescriptionsRepository.save(fileDescriptions);
    }

    public List<FileDescriptions> getFileDescriptions(Module module) {
        return fileDescriptionsRepository.findAllByModule(module);
    }

    public void deleteFileDescriptions(String moduleId) {

        List<FileDescriptions> files = fileDescriptionsRepository.findAllByModule_ModuleId(moduleId);
        fileDescriptionsRepository.deleteAll(files);

    }

}
