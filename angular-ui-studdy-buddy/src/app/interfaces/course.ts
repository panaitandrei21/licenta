import {UserDTO} from "./user-dto";

export interface Course {
courseId: string;
courseName: string;
description: string | null;

category: string;
logo?: Blob;

}
