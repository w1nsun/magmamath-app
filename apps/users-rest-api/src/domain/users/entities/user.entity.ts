import { ObjectId } from 'mongodb';

export class User {
  private _id: string;
  name: string;
  email: string;
  createdAt: Date;

  constructor(id: string, name: string, email: string) {
    this._id = id;
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }

  static fromDocument(document: UserDocument) {
    const user = new User(document._id.toString(), document.name, document.email);
    user.createdAt = document.createdAt;

    return user;
  }

  get id() {
    return this._id;
  }
}

export type UserDocument = {
  _id: ObjectId;
  name: string;
  email: string;
  createdAt: Date;
};
