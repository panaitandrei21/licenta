import {Assignment, Course} from "./course";
import {AssignmentSubmission} from "./assignment-instance";
import {UserDTO} from "./user-dto";

export interface SearchResults {
  totalPages: number,
  assignments: Assignment[];

}
export interface SearchSubmissionResults {
  totalPages: number,
  submissions: AssignmentSubmission[];

}
export interface SearchReviewResults {
  totalPages: number,
  content: Review[];

}
export interface Review {
  grade: number;
  feedback: String;
  courseDTO: Course;
  studentName: UserDTO;
}
