import { Schema } from "./Schema";
import { ValidationType } from '../utils/validation';
import BaseModel from "./BaseModel";
import { MenuItem } from './CMS';

/**
 * @interface Page
 * @description The fields expected to be saved in the database collection.
 */
export interface Page {
  id?: string;
  title: string;
  permalink: string;
  coverImage?: string;
  content?: string;
  menuDetails: MenuItem;
}

/**
 * @const
 * @description The configuration schema for saving and validating pages.
 */
export const PageSchema: Schema = {
  collection: 'pages',
  fields: [
    {
      name: 'title',
      validations: [{ type: ValidationType.Required }]
    },
    {
      name: 'permalink',
      validations: [{ type: ValidationType.Required }]
    },
    {
      name: 'menuDetails.title',
      validations: [{ type: ValidationType.Required }]
    },
    {
      name: 'menuDetails.position',
      validations: [{ type: ValidationType.Required }]
    }
  ]
}

/**
 * @class Creates a new page model.
 * @extends BaseModel
 * @see BaseModel - Check the BaseModel<T> type for more info.
 */
export class PageRepo extends BaseModel<Page> {
  /**
   * @description The repository instance for page handling.
   * @static
   * @readonly
   */
  static readonly Instance = new PageRepo(PageSchema);

  /**
   * @function FindByPermalink
   * @param permalink {string} The page permalink.
   * @return `{Page | null}` The page information. Otherwise, `null`.
   */
  FindByPermalink = async (permalink: string): Promise<Page | null> => {
    if (!permalink) return null;
    const snapshot = await this.collection.where('permalink', '==', permalink).get();
    return !snapshot.empty ? snapshot.docs[0].data() as Page : null;
  }
}