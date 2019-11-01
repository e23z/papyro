import { Schema } from "./Schema";
import { ValidationType } from '../utils/validation';
import BaseModel from "./BaseModel";

/**
 * @interface Podcast
 * @description The fields expected to be saved in the database collection.
 */
export interface Podcast {
  id?: string;
  title: string;
  embed: string;
  createdAt?: number;
}

/**
 * @const
 * @description The configuration schema for saving and validating podcasts.
 */
export const PodcastSchema: Schema = {
  collection: 'podcasts',
  fields: [
    {
      name: 'title',
      validations: [{ type: ValidationType.Required }]
    },
    {
      name: 'embed',
      validations: [{ type: ValidationType.Required }]
    }
  ]
}

/**
 * @class Creates a new podcast model.
 * @extends BaseModel
 * @see BaseModel - Check the BaseModel<T> type for more info.
 */
export class PodcastRepo extends BaseModel<Podcast> {
  /**
   * @description The repository instance for podcast handling.
   * @static
   * @readonly
   */
  static readonly Instance = new PodcastRepo(PodcastSchema);

  /**
   * @function Save
   * @description Save a Podcast.
   * @override
   * @param T model - The data object to be saved.
   * @return string - The uid generated for the saved entry.
   */
  async Save(model: Podcast): Promise<string> {
    //TODO?: Maybe this should be applied system-wide?
    model.createdAt = Math.round(new Date().getTime() / 1000);
    return await super.Save(model);
  }
}