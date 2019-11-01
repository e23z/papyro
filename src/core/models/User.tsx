import { Schema } from "./Schema";
import { ValidationType } from '../utils/validation';
import BaseModel from "./BaseModel";

/**
 * @enum
 * @description The access status of the user.
 */
export enum ApprovalStatus {
  All,
  Approved,
  NotApproved
}

/**
 * @interface User
 * @description The fields expected to be saved in the database collection.
 */
export interface User {
  id?: string;
  name: string;
  email: string;
  uid: string;
  approved: boolean;
  picture?: string;
  provider: string;
}

/**
 * @const
 * @description The configuration schema for saving and validating users.
 */
export const UserSchema: Schema = {
  collection: 'users',
  fields: [
    {
      name: 'name',
      validations: [{ type: ValidationType.Required }]
    },
    {
      name: 'email',
      validations: [
        { type: ValidationType.Required },
        { type: ValidationType.Email }
      ]
    },
    {
      name: 'password',
      validations: [
        { type: ValidationType.Required },
        { type: ValidationType.MinLen, options: { len: 6 } }
      ]
    }
  ]
}

/**
 * @class Creates a new user model.
 * @extends BaseModel
 * @see BaseModel - Check the BaseModel<T> type for more info.
 */
export class UserRepo extends BaseModel<User> {
  /**
   * @description The repository instance for user handling.
   * @static
   * @readonly
   */
  static readonly Instance = new UserRepo(UserSchema);

  /**
   * @function FindByEmail
   * @param email {string | null} The email to be searched.
   * @return `{User | null}` The user information. Otherwise, `null`.
   */
  FindByEmail = async (email: string | null): Promise<User | null> => {
    if (!email) return null;
    const snapshot = await this.collection.where('email', '==', email).get();
    return !snapshot.empty ? snapshot.docs[0].data() as User : null;
  }

  /**
   * @function SetApprovalStatus
   * @param id {string} - The id of the user to have its approval changed.
   * @param approved {boolean} - The approval status.
   */
  SetApprovalStatus = async (id: string, approved: boolean) => {
    await this.collection.doc(id).set({ approved }, { merge: true });
  }
}