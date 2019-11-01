import { notContains } from './utils';
import { FieldSchema } from '../models/Schema';

/**
 * @description The validation type
 * @enum (Required | MinLen | Email | IsEqual)
 * @readonly
*/
export enum ValidationType {
  Required,
  MinLen,
  Email,
  IsEqual
}

/**
 * @interface ValidationResult
 * @description The result of the validation process.
 */
export interface ValidationResult {
  isValid: boolean;
  invalidFields: string[];
  hints: string[];
}

/**
 * @interface Validation
 * @description Configuration on how to validate an object field.
 */
export interface Validation {
  type: ValidationType;
  msg?: string;
  options?: any;
  hint?: string;
}

/**
 * @class
 * @description A custom exception to break the validation loop.
 */
const BreakException = {};

/**
 * @function useValidation
 * @description A hook to validate form fields.
 * @param model {any} - The object with the data to be validated.
 * @param schemas {FieldSchema[]} - The validation rules.
 * @return `{ValidationResult}` - The result of the validation.
 */
export const validate = (model: any, schemas: FieldSchema[]): ValidationResult | null => {
  // Set default results
  const invalidFields = new Array();
  const hints = new Array();
  let isFormValid = true;

  // For each field to be checked
  schemas.forEach(schema => {
    // Ignore if it doesn't have validations
    if (!schema.validations)
      return;
    
    let isFieldValid = true;

    try {
      // For each validation to be checked against the field
      schema.validations.forEach(validation => {
        // Check the field validity
        isFieldValid = isFieldValid && checkFieldValid(validation, schema.name, model);

        // If the field if invalid:
        // Break the loop and add the field error hint to the list
        if (!isFieldValid) {
          validation.hint && hints.push(validation.hint);
          throw BreakException;
        }
      });
    } catch { }
    
    // If the field is invalid, add it to the error list
    if (!isFieldValid && notContains(invalidFields, schema.name))
      invalidFields.push(schema.name);
    
    // Update the form validity status
    isFormValid = isFormValid && isFieldValid;
  });

  return { isValid: isFormValid, invalidFields, hints };
}

/**
 * @function checkFieldValid
 * @description Check if a field is valid according to the specified rule.
 * @param validation {Validation} - The validation to be performed.
 * @param fieldName {string} - The name of the property to be checked.
 * @param model {any} - The object to be validated.
 * @return `{boolean}` True or false, depending on the validation method configured.
 */
const checkFieldValid = (validation: Validation, fieldName: string, model: any) => {
  switch (validation.type) {
    case ValidationType.Required:
      return isEmpty(getValue(model, fieldName));
    case ValidationType.MinLen:
      return hasMinLen(getValue(model, fieldName), validation.options.len);
    case ValidationType.Email:
      return isEmail(getValue(model, fieldName));
    case ValidationType.IsEqual:
      return isEqual(getValue(model, fieldName), model[validation.options.compareTo]);
  }
}

/**
 * @function getValue
 * @description Gets a value from an object path.
 * @param model {any} - The model to be searched on.
 * @param fieldName {string} - The field of the object to be searched for.
 * Accepts simple navigation like 'field1.field2'.
 * @return `{any}` - Returns the value of the field.
 */
const getValue = (model: any, fieldName: string) => {
  if (fieldName.indexOf('.') === -1)
    return model[fieldName];
  let path = fieldName.split('.');
  let value = model;
  while (path.length > 0)
    value = value[path.shift() as string];
  return value;
};

/**
 * @function isEmpty
 * @description Check if the value provided is empty, null, undefined, 0, false.
 * @param value {any} - The value to be checked.
 * @return `{boolean}` - True if the field is either empty, null, undefined, 0 or false. Otherwise, false.
 */
const isEmpty = (value: any) => {
  if (value === undefined || value === null)
    return true;

  if (value !== '' && !isNaN(value))
    return value !== 0;

  return value.trim().length !== 0;
}

/**
 * @function hasMinLen
 * @description Check if the string has the minimum required length.
 * @param value {string} - The string to be checked.
 * @param minLen {number} - The minimum length the string must have.
 * @return `{boolean}` - True if the string has either more or at least the
 * minimum number of characters. Otherwise, false.
 */
const hasMinLen = (value: string, minLen: number) => {
  return value.trim().length >= minLen;
}

/**
 * @function isEmail
 * @description Check if the string is in a valid email format.
 * @param value {string} - The string to be checked.
 * @return `{boolean}` - True if the value is a valid email. Otherwise, false.
 */
const isEmail = (value: string) => {
  const emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
  return emailRegex.test(value);
}

/**
 * @function isEqual
 * @description Check if one field of the object is equal another.
 * @param value {any} - The first value to be compared.
 * @param compare {any} - The second value to be compared.
 * @return `{boolean}` - True if both values are equal. Otherwise, false.
 */
const isEqual = (value: any, compare: any) => value === compare;
