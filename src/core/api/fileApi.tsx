import client from './firebaseClient';
import firebase from 'firebase/app';

/**
 * @const
 * @description The client to access Firebase storage features.
 */
const storageCli = client.storage().ref();

/**
 * @enum UploadStatus `{(Uploading | Canceled | Complete)}`
 * @description The status of the upload process.
 */
export enum UploadStatus {
  Uploading,
  Canceled,
  Complete
}

/**
 * @interface UploadEvent
 * @description General information about the progress of the upload.
 */
export interface UploadEvent {
  status: UploadStatus;
  progress?: number;
  downloadUrl?: string;
}

/**
 * @interface UploadChanged
 * @description Callback executed when the upload status changes.
 */
export interface UploadChanged {
  (event: UploadEvent): void;
}

/**
 * @function uploadFile
 * @description Upload a file to Google's Firebase Storage
 * @param file {any} - The file object that is going to be uploaded.
 * @param filename {string} - The name of the file.
 * @param directory {string} - Where the file should be placed at.
 * @param onStatusChanged {UploadChanged | null} - Callback executed on progress changes.
 */
export const uploadFile = (file: any, filename: string, directory: string = '', onStatusChanged: UploadChanged | null = null) => {
  // Extracts file information and create the upload task
  const metadata = { contentType: file.type };
  const fileRef = storageCli.child(`${directory}/${filename}`);
  const uploadTask = fileRef.put(file, metadata);

  // Events
  // Listens to upload changes
  uploadTask.on('state_changed', (snapshot: any) => {
    var progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    onStatusChanged && onStatusChanged({ status: UploadStatus.Uploading, progress });
  });

  // On upload complete
  uploadTask.then(async (snapshot: any) => {
    switch (snapshot.state) {
      case firebase.storage.TaskState.SUCCESS:
        const downloadUrl = await snapshot.ref.getDownloadURL();
        onStatusChanged && onStatusChanged({ status: UploadStatus.Complete, downloadUrl });
        break;
      case firebase.storage.TaskState.CANCELED:
        onStatusChanged && onStatusChanged({ status: UploadStatus.Canceled });
        break;
      default: break;
    }
  });
}

/**
 * @function deleteFile
 * @description Delete the file from firebase storage.
 * @param filePath {string} - The file to the deleted.
 */
export const deleteFile = async (filePath: string) => {
  await storageCli.child(filePath).delete();
}