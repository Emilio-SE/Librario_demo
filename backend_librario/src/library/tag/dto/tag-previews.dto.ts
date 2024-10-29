export class TagPreviewsDto {
    id: string;
    name: string;
  
    constructor(id: number, name: string) {
      this.id = id.toString();
      this.name = name;
    }
  }
  