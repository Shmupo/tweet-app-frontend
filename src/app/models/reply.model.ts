export class Reply{
    constructor(
        public postId?: number,
        public userId?: number,
        public content?: string,
        public tag?:string,
    ){}
}