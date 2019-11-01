import client from './firebaseClient';
import { UserRepo } from '../models/User';
import firebase from 'firebase/app';

/**
 * @function registerWithEmail
 * @description Register a user in Firebase Auth with email and password combination.
 * @param  {string} name The name of the user.
 * @param  {string} email The user email.
 * @param  {string} password The user password.
 */
export const registerWithEmail = async (name: string, email: string, password: string) => {
  const auth = client.auth();

  await auth.createUserWithEmailAndPassword(email, password);

  const user = auth.currentUser;

  if (user) {
    await user.updateProfile({ displayName: name, photoURL: null });
    await UserRepo.Instance.Save({
      name: user.displayName || '',
      email: user.email || '',
      uid: user.uid,
      approved: false,
      provider: 'email'
    });
  }

  auth.signOut();
};

/**
 * @function registerWithGoogle
 * @descriptionRegister a user in Firebase Auth with Google's OAuth.
 */
export const registerWithGoogle = async () => {
  const auth = client.auth();

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  await auth.signInWithPopup(provider);

  const user = auth.currentUser;
  
  if (user) {
    if (await UserRepo.Instance.FindByEmail(user.email))
      throw { code: 'auth/email-already-in-use', message: '' };

    await UserRepo.Instance.Save({
      name: user.displayName || '',
      email: user.email || '',
      uid: user.uid,
      approved: false,
      picture: user.photoURL || '',
      provider: 'google'
    });
  }
  
  auth.signOut();
}

/**
 * @function registerWithFacebook
 * @description Register a user in Firebase Auth with Facebook's Login.
 */
export const registerWithFacebook = async () => {
  const auth = client.auth();

  const provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('email');

  await auth.signInWithPopup(provider);

  const user = auth.currentUser;

  if (user) {
    if (await UserRepo.Instance.FindByEmail(user.email))
      throw { code: 'auth/email-already-in-use', message: '' };

    await UserRepo.Instance.Save({
      name: user.displayName || '',
      email: user.email || '',
      uid: user.uid,
      approved: false,
      picture: user.photoURL || '',
      provider: 'facebook'
    });
  }

  auth.signOut();
}

/**
 * @function sendPasswordReset
 * @description Send a password reset e-mail to the user.
 * @param  {string} email The email of registered user that wants a reset.
 */
export const sendPasswordReset = async (email: string) => {
  await client.auth().sendPasswordResetEmail(email);
}

/**
 * @function updatePassword
 * @description Validates the password reset token and updates the user password.
 * @param  {string} code The password reset code sent by email.
 * @param  {string} password The new password.
 */
export const updatePassword = async (code: string, password: string) => {
  await client.auth().confirmPasswordReset(code, password);
}

/**
 * @function signInWithFacebook
 * @description Sign in a user in Firebase Auth with Facebook's Login.
 */
export const signInWithFacebook = async () => {
  // Handle Facebook authentication
  const auth = client.auth();

  const provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('email');

  await auth.signInWithPopup(provider);

  // Get the current logged user
  const currUser = auth.currentUser;

  // If the auth was a success
  if (currUser) {
    // Try to fetch a user with the same email from the database
    const user = await UserRepo.Instance.FindByEmail(currUser.email);

    // If there's a user registered on the database with that email
    if (user) {
      // Check if the user has been cleared to access the admin panel
      // If not, disconnect and throw an error
      if (!user.approved) {
        auth.signOut();
        throw { code: 'auth/user-not-approved' };
      }
      // Login was successful
      return;
    }

    // If the user doesn't exist, save it to the database
    await UserRepo.Instance.Save({
      name: currUser.displayName || '',
      email: currUser.email || '',
      uid: currUser.uid,
      approved: false,
      picture: currUser.photoURL || '',
      provider: 'facebook'
    });

    // Logout and throw an exception
    auth.signOut();
    throw { code: 'auth/user-just-created' };
  }
}

/**
 * @function signInWithGoogle
 * @description Sign in a user in Firebase Auth with Google's Login.
 */
export const signInWithGoogle = async () => {
  // Handle Facebook authentication
  const auth = client.auth();

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  await auth.signInWithPopup(provider);

  // Get the current logged user
  const currUser = auth.currentUser;

  // If the auth was a success
  if (currUser) {
    // Try to fetch a user with the same email from the database
    const user = await UserRepo.Instance.FindByEmail(currUser.email);

    // If there's a user registered on the database with that email
    if (user) {
      // Check if the user has been cleared to access the admin panel
      // If not, disconnect and throw an error
      if (!user.approved) {
        auth.signOut();
        throw { code: 'auth/user-not-approved' };
      }
      // Login was successful
      return;
    }

    // If the user doesn't exist, save it to the database
    await UserRepo.Instance.Save({
      name: currUser.displayName || '',
      email: currUser.email || '',
      uid: currUser.uid,
      approved: false,
      picture: currUser.photoURL || '',
      provider: 'google'
    });

    // Logout and throw an exception
    auth.signOut();
    throw { code: 'auth/user-just-created' };
  }
}

/**
 * @function signOut
 * @description Signs out the current logged user.
 */
export const signOut = () => {
  client.auth().signOut();
}

/**
 * @function signInWithEmail
 * @description Sign in a user in Firebase Auth with email and password combination.
 * @param  {string} email The user email.
 * @param  {string} password The user password.
 */
export const signInWithEmail = async (email: string, password: string) => {
  // Handles the authentication
  const auth = client.auth();

  await auth.signInWithEmailAndPassword(email, password);

  // Get the current logged user
  const currUser = auth.currentUser;

  if (currUser) {
    // Try to fetch a user with the same email from the database
    const user = await UserRepo.Instance.FindByEmail(currUser.email);

    // If there's a user registered on the database with that email
    if (user) {
      // Check if the user has been cleared to access the admin panel
      // If not, disconnect and throw an error
      if (!user.approved) {
        auth.signOut();
        throw { code: 'auth/user-not-approved' };
      }
      // Login was successful
      return;
    }
  }
};

/**
 * @function isAuthenticated
 * @description Check if the user is currently logged.
 * @return `{boolean}` True if the user is logged. Otherwise, false.
 */
export const isAuthenticated = () => client.auth().currentUser !== null;

/**
 * @interface LoggedUser
 * @description Information about the current logged user.
 */
export interface LoggedUser {
  name: string;
  email: string;
}

/**
 * @function getCurrUser
 * @description Get the information about the current logged user.
 * @return `{LoggedUser} | null` Returns the current user information if logged in. Otherwise, null.
 */
export const getCurrUser = (): LoggedUser | null => {
  const currUser = client.auth().currentUser;

  if (!currUser)
    return null;
  
  return {
    name: currUser.displayName || '',
    email: currUser.email || ''
  };
};

/**
 * @function waitForAuth
 * @description Wait for the user state to be set by the Firebase API.
 * @param onAuthStateChanged {(user: LoggedUser | null)} - The callback to be executed when
 * Firebase reloaded the user status.
 * @returns `{firebase.Unsubscribe}` - The method to unsubscribe the listener.
 */
export const waitForAuth = (onAuthStateChanged: (user: LoggedUser | null) => void): firebase.Unsubscribe => {
  return client.auth().onAuthStateChanged(user => {
    if (!user) {
      onAuthStateChanged(null);
      return;
    }

    onAuthStateChanged({
      name: user.displayName || '',
      email: user.email || ''
    });
  });
}