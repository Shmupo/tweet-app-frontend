export class Post{
    constructor(
        public userId?: number,
        public title?: string,
        public content?: string,
        public tag?:string,
    ){}
}