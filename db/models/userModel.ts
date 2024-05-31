import { ObjectId } from 'mongodb';

interface User {
    _id: ObjectId;
    email: string;
    password: string;
    name: string;
    username: string;
    defaultSpace: ObjectId;
}

export default User;
