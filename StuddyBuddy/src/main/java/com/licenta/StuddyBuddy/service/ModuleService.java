package com.licenta.StuddyBuddy.service;

import com.licenta.StuddyBuddy.dto.AssignmentInstanceResponse;
import com.licenta.StuddyBuddy.dto.AssignmentResponse;
import com.licenta.StuddyBuddy.dto.ModuleRequest;
import com.licenta.StuddyBuddy.dto.ModuleResponse;
import com.licenta.StuddyBuddy.model.Assignment;
import com.licenta.StuddyBuddy.model.AssignmentInstance;
import com.licenta.StuddyBuddy.model.Course;
import com.licenta.StuddyBuddy.model.Module;
import com.licenta.StuddyBuddy.repository.ModuleRepository;
import jakarta.transaction.Transactional;
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
                .collect(Collectors.toList());
    }

    private ModuleResponse convertToModuleResponse(Module module) {
        return new ModuleResponse(
                module.getModuleId(),
                module.getTitle(),
                module.getDescription(),
                module.getFilePath(),
                module.getAssignmentInstances().stream()
                        .map(this::convertToAssignmentInstanceResponse)
                        .collect(Collectors.toList())
        );
    }

    private AssignmentInstanceResponse convertToAssignmentInstanceResponse(AssignmentInstance instance) {
        return new AssignmentInstanceResponse(
                instance.getAssignmentInstanceId(),
                convertToAssignmentResponse(instance.getAssignment()),
                instance.getDueDate()
        );
    }

    private AssignmentResponse convertToAssignmentResponse(Assignment assignment) {
        return AssignmentResponse.builder()
                .assignmentId(assignment.getAssignmentId())
                .title(assignment.getTitle())
                .build();
    }

    public Optional<Module> getModuleByModuleId(String moduleId) {
        return moduleRepository.findById(moduleId);
    }

    public Module saveModule(Module module) {
        return moduleRepository.save(module);
    }

    public String editModule(ModuleResponse moduleResponse) throws Exception {
        Optional<Module> optionalModule = moduleRepository.findById(moduleResponse.getModuleId());
        if (optionalModule.isEmpty()) {
            throw new Exception("Module not found");
        }
        Module module = optionalModule.get();
        module.setTitle(moduleResponse.getTitle());
        module.setDescription(moduleResponse.getDescription());
        moduleRepository.save(module);
        return "Module updated Succesfully";
    }
    @Transactional
    public void deleteModule(String moduleId) throws Exception {
        descriptionsService.deleteFileDescriptions(moduleId);
        moduleRepository.deleteById(moduleId);
    }
}
