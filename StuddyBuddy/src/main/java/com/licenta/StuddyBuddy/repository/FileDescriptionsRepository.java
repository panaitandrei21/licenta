package com.licenta.StuddyBuddy.repository;

import com.licenta.StuddyBuddy.model.FileDescriptions;
import com.licenta.StuddyBuddy.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileDescriptionsRepository extends JpaRepository<FileDescriptions, String> {

    public List<FileDescriptions> findAllByModule(Module module);
}
