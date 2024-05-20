import {UserDTO} from "./user-dto";

export interface Course {
courseId: string;
courseName: string;
description: string | null;

category: string;
logo?: Blob;

}

export interface Assignment {
  assignmentId?: string;
  moduleId?: string;
  title?: string;
  content?: any[];
  solution?: any[];
  dueDate?: string;
  createdBy?: string;
  createdDate?: Date;
  category?: string;
}
