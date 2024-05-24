import {Assignment} from "./course";

export interface ModuleRequest {
   courseId: string;
   moduleId: string;
   title: string;
   description: string;
   filePath: FilePath[];

  assignmentInstances: AssignmentInstance[];
}
export interface AssignmentInstance {
  assignmentInstanceId: string;
  assignment: Assignment;
  dueDate: Date;
}

export interface FilePath {
  fileDescriptionsId: string;
  filePath: string;
}
