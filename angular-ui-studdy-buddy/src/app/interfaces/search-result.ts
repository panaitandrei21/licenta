import {Assignment} from "./course";
import {AssignmentSubmission} from "./assignment-instance";

export interface SearchResults {
  totalPages: number,
  assignments: Assignment[];

}
export interface SearchSubmissionResults {
  totalPages: number,
  submissions: AssignmentSubmission[];

}
