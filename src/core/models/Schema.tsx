import { Validation } from '../utils/validation';

/**
 * @interface FieldSchema
 * @description The configuration and validation form a single
 * model field.
 */
export interface FieldSchema {
  name: string;
  validations?: Validation[];
}

/**
 * @interface Schema
 * @description Database configuration for the model.
 */
export interface Schema {
  collection: string;
  fields: FieldSchema[];
}