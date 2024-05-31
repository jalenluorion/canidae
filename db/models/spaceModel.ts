import { ObjectId } from 'mongodb';

interface Space {
    owner: ObjectId;
    name: string;
    settings: object;
    _id: ObjectId;
}

export default Space;
