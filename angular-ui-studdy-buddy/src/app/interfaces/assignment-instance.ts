import {Assignment} from "./course";
import {UserDTO} from "./user-dto";

export interface AssignmentInstance {
  assignmentInstanceId: string;
  assignment: Assignment;
  dueDate: Date;
  title: string;
}
export interface AssignmentSubmission {
  submissionId: string;
  user: UserDTO;
  submissionDate: Date;

  submittedFilePath: string;
  assignmentInstanceId: string;
  assignmentInstanceName: string;
  grade: number;
}
