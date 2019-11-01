import { Schema } from './Schema';
import client from '../api/firebaseClient';

/**
 * @interface BaseModel
 * @template {T} A data model schema.
 * @see {Schema} Check the Schema type for more info.
 */
interface BaseModel<T> {
  FindById: (id: string) => Promise<T | null>;
  Save: (model: T) => Promise<string>;
  Delete: (id: string) => Promise<void>;
  Update: (model: T) => Promise<void>;
  Upsert: (model: T) => Promise<string | null>;
  UnsafeUpdate: (model: any) => Promise<void>;
}

/**
 * @class Creates a new model with the given base schema.
 * @implements BaseModel
 * @template T - A data model schema.
 * @see Schema - Check the Schema type for more info.
 * @param Schema schema - The schema for this model.
 */
export default abstract class <T> implements BaseModel<T> {
  /**
   * @property The Firebase collection that this model is related.
   * @readonly
   */
  protected collection: firebase.firestore.CollectionReference;

  constructor(schema: Schema) {
    this.collection = client.firestore().collection(schema.collection);
  }

  /**
   * @function Save
   * @param T model - The data object to be saved.
   * @return string - The uid generated for the saved entry.
   */
  async Save(model: T): Promise<string> {
    const docData = await this.collection.add(model);
    return docData.id;
  }

  /**
   * @function Subscribe
   * @param `{(docs: T[]) => void}` - onAddItems - Callback called when the collection
   * is loaded or new items are added.
   * @returns `{() => void}` - An unsubscribe function to stop listening to updates.
   */
  Subscribe = (onAddItems: (docs: T[]) => void): Function => {
    // Subscribe to the collection snapshot
    return this.collection.onSnapshot(snapshot => {
      // Ignore if the collection is empty
      if (snapshot.empty)
        return;
      // Map all data and cast to the model type
      onAddItems && onAddItems((snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown[]) as T[]);
    });
  }

  /**
   * @function Delete
   * @param  id {string} - The id of the item to be deleted.
   */
  Delete = async (id: string) => {
    await this.collection.doc(id).delete();
  }

  /**
   * @function Update
   * @param T model - The data object to be updated.
   */
  Update = async (model: T): Promise<void> => {
    const docRef = this.collection.doc((model as any).id);
    await docRef.set(model, { merge: true });
  }

  /**
   * @function Upsert
   * @param T model - The data object to be inserted or saved.
   * @return string - The uid generated for the saved entry. Null, if model was only updated.
   */
  Upsert = async (model: T): Promise<string | null> => {
    if (!(model as any).id)
      return await this.Save(model);
    await this.Update(model);
    return null;
  }

  /**
   * @function FindById
   * @param id {string} - The id of the document to be retrieved.
   * @return `{T | null}` - Returns of a copy of the data or null.
   */
  FindById = async (id: string): Promise<T | null> => {
    const snapshot = await this.collection.doc(id).get();
    if (snapshot.exists)
      return ({ id: snapshot.id, ...snapshot.data() } as unknown) as T;
    return null;
  }

  /**
   * @function UnsafeUpdate
   * @description Updates the object without checking the type.
   * @param model {any} - The model to be updated. The `id` is required.
   */
  UnsafeUpdate = async (model: any): Promise<void> => {
    await this.collection.doc(model.id).set(model, { merge: true });
  }
}