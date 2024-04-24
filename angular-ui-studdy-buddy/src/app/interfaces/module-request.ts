export interface ModuleRequest {
   courseId: string;
   moduleId: string;
   title: string;
   description: string;
   filePath: FilePath[];

}

export interface FilePath {
  fipeDescriptionsId: string;
  filePath: string;
}
