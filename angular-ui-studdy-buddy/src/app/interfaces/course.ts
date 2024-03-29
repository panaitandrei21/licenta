import {UserDTO} from "./user-dto";

export interface Course {
courseId: string | null;
courseName: string;
description: string | null;

category: string;
// logo: string | null;
//
// teachers: UserDTO[] | null;
//
// students: UserDTO[] | null;
}
