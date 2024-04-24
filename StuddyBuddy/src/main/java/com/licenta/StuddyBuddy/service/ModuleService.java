package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.dto.ModuleRequest;
import com.licenta.StuddyBuddy.dto.ModuleResponse;
import com.licenta.StuddyBuddy.model.Course;
import com.licenta.StuddyBuddy.model.Module;
import com.licenta.StuddyBuddy.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModuleService {
    private final CourseService courseService;
    private final ModuleRepository moduleRepository;
    private final FileDescriptionsService descriptionsService;
    public void addModuleToCourse(ModuleRequest module) throws ChangeSetPersister.NotFoundException {
        Course course = courseService.findByCourseId(module.getCourseId());

        if (course != null) {
            Module newModule = Module.builder()
                    .course(course)
                    .description(module.getDescription())
                    .title(module.getTitle())
                    .build();
            moduleRepository.save(newModule);
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    public List<ModuleResponse> getAllModules(String courseId) {
        List<Module> modules = moduleRepository.findByCourseCourseId(courseId);
        return modules.stream()
                .map(this::convertToModuleResponse)
                .collect(Collectors.toList());    }

    private ModuleResponse convertToModuleResponse(Module module) {
        return new ModuleResponse(
                module.getModuleId(),
                module.getTitle(),
                module.getDescription(),
                module.getFilePath()
        );
    }

    public Optional<Module> getModuleByModuleId(String moduleId) {
        return moduleRepository.findById(moduleId);
    }

    public Module saveModule(Module module) {
        return moduleRepository.save(module);
    }
}
