export class User {

    public $key: string;

    constructor(
        public name: string,
        public username: string,
        public email: string,
        public photo: string,
        public country: string,
        public birthDate: string,
        public sex: string,
        public passwordDate: any,
        public createDate: any,
        public accountType: string
    ) {}

}