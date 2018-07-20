export class Lesson {

    constructor(
        public name: string,
        public room: string,
        public info: string,
        public teacher: string,
        public date: string,
        public startHour: string,
        public endHour: string,
        public presence: boolean
    ) {}

}