import { Schema } from "./Schema";
import BaseModel from "./BaseModel";

/**
 * @enum
 * @description Where to display the page in the menu.
 */
export enum MenuPosition {
  Top = 1,
  Bottom,
  Both,
  None
}

/**
 * @function getMenuPositionLabel
 * @description Converts the MenuPosition enum to a readable string.
 * @param position - {MenuPosition} - The value to be converted to string.
 * @return `{string}` - The readable version of the enum.
 */
export const getMenuPositionLabel = (position: MenuPosition): string => {
  switch (position) {
    case MenuPosition.Top: return 'On the top menu';
    case MenuPosition.Bottom: return 'On the footer menu';
    case MenuPosition.Both: return 'On both menus';
    case MenuPosition.None: return 'Hide page';
    default: return '';
  }
};

/**
 * @enum MenuItem
 * @description A single navigation menu item.
 */
export interface MenuItem {
  title: string;
  position: MenuPosition;
  sort: number;
  parentId?: string;
  parentTitle?: string;
  pageId?: string;
  pageTitle: string;
  permalink: string;
}

/**
 * @interface Stats
 * @description Some basic statistics.
 */
interface Stats {
  totalUsers: number;
  totalUsersPendingApproval: number;
  totalPages: number;
}

/**
 * @interface FileRef
 * @description The reference for an uploaded file.
 */
export interface FileRef {
  name: string;
  extension: string;
  path: string;
  downloadUrl: string;
}

/**
 * @interface PodcastRef
 * @description The reference for an shared podcast.
 */
export interface PodcastRef {
  id: string;
  title: string;
  embed: string;
  publishedAt: number;
}

/**
 * @interface Picture
 * @description The reference for an shared podcast.
 */
export interface Picture {
  id: string;
  title: string;
  path: string;
  downloadUrl: string;
}

/**
 * @interface Event
 * @description The reference for an event.
 */
export interface Event {
  id: string;
  date: number;
  title: string;
  description: string;
  path: string;
  downloadUrl: string;
}

/**
 * @interface CMS
 * @description The fields expected to be saved in the database collection.
 */
export interface CMS {
  id?: string;
  stats: Stats;
  menuItems: MenuItem[];
  files: FileRef[]; //TODO!: Put these in a separate admin state.
  podcasts: PodcastRef[]; //TODO!: Put these in a separate admin state and just the most recent in the CMS.
  pictures: Picture[];
  events: Event[]; //TODO!: Put these in a separate admin state and just the most recent in the CMS.
}

/**
 * @const
 * @description The configuration schema for saving and validating some global cms data.
 */
export const CMSSchema: Schema = {
  collection: 'cms',
  fields: []
}

/**
 * @class Creates a new CMS model.
 * @extends BaseModel
 * @see BaseModel - Check the BaseModel<T> type for more info.
 */
export class CMSRepo extends BaseModel<CMS> {
  /**
   * @description The repository instance for cms handling.
   * @static
   * @readonly
   */
  static readonly Instance = new CMSRepo(CMSSchema);

  /**
   * @function Load
   * @return `{CMS}` The CMS information.
   */
  Load = async (): Promise<CMS> => {
    const snapshot = await this.collection.get();
    if (!snapshot.empty)
      return { ...CMSRepo.Default, ...snapshot.docs[0].data(), id: snapshot.docs[0].id } as CMS;
    return CMSRepo.Default;
  }

  static readonly Default: CMS = {
    stats: { totalUsers: 0, totalPages: 0, totalUsersPendingApproval: 0 },
    menuItems: [],
    files: [],
    podcasts: [],
    pictures: [],
    events: []
  };
}