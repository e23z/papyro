import React, { FunctionComponent, FormEvent, useState, useContext } from 'react';
import {
  Card, CardBody, CardTitle, CardSubtitle,
  FormGroup, Input, Form, Label, Container, Row, Col,
  Button,
  Alert
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { withRouter } from "react-router-dom";
import FormSeparator from '../ui/FormSeparator';
import { ADMIN_PRE_REGISTER, ADMIN_FORGOT_PASSWORD } from '../../routing/routes';
import '../../styles/css/account.css';
import { RoutingProps } from '../../routing/interfaces';
import { validate, ValidationType } from '../../utils/validation';
import { FieldSchema } from '../../models/Schema';
import { signInWithFacebook, signOut, signInWithGoogle, signInWithEmail } from '../../api/authApi';
import SweetAlert from 'sweetalert-react';
import { renderToStaticMarkup } from 'react-dom/server';
import 'sweetalert/dist/sweetalert.css';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../utils/auth';

/**
 * @const FieldSchema[] Validations used in the form.
 * @default
*/
const validations: FieldSchema[] = [
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
];

/**
 * @interface LoginProps
 * @description Login component props
 */
interface LoginProps extends RoutingProps {
}

/**
 * @function Login
 * @description Component that handles login.
 * @param LoginProps props The properties for this component.
 */
const Login: FunctionComponent<LoginProps> = (props) => {
  // Overall state of the component
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [alert, setAlert] = useState('');
  const [error, setError] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [disableGoogle, setDisableGoogle] = useState(false);
  const [disableFacebook, setDisableFacebook] = useState(false);

  // Validation state
  const user = { email, password };
  const validationResult = validate(user, validations);
  const isFormValid = validationResult && validationResult.isValid;

  // Authentication state
  const { login } = useContext(AuthContext);

  // Event handling
  const submit = (e: FormEvent) => {
    e.preventDefault();
    signInUser(
      async () => {
        setDisableSubmit(true);
        await signInWithEmail(email, password);
      },
      (ex) => { setDisableSubmit(false); }
    );
  };

  const signInUser = async (exec: Function, onCatch: (ex: any) => void) => {
    try {
      exec && await exec();
      login();
    }
    catch (ex) {
      onCatch && onCatch(ex);
      switch (ex.code) {
        case 'auth/email-already-in-use':
          setError('E-mail already registered!');
          break;
        case 'auth/user-just-created':
          setDisplaySuccess(true);
          break;
        case 'auth/user-not-found':
          setError('You are not registered yet.');
          break;
        case 'auth/account-exists-with-different-credential':
          setError('This e-mail is registered by another authentication method.');
          break;
        case 'auth/wrong-password':
          setError('Wrong user and password combination.');
          break;
        case 'auth/user-not-approved':
          setAlert('Your user is pending approval.');
          break;
        default:
          setError("Sorry, we couldn't log you in this time. Please, try again later!");
          break;
      }
    }
  }

  const signInWithFacebookAccount = async () => {
    signInUser(
      async () => {
        setDisableFacebook(true);
        await signInWithFacebook();
      },
      (ex) => { setDisableFacebook(false); }
    );
  };
  
  const signInWithGoogleAccount = async () => {
    signInUser(
      async () => {
        setDisableGoogle(true);
        await signInWithGoogle();
      },
      (ex) => { setDisableGoogle(false); }
    );
  };

  // JSX
  return (
    <>
      <SweetAlert
        show={displaySuccess}
        title="Success!"
        html
        type='success'
        confirmButtonText='OK'
        text={renderToStaticMarkup(
          <div className="register flex-column">
            <p className='swal-text'>Your account has been created successfully.</p>
            <Alert color='warning' fade={false} className='mt-4 mb-0'>
              <h6><FontAwesomeIcon icon={faExclamationTriangle} /></h6>
              Your login will undergo an approval process. Only when accepted you'll be able to login.
            </Alert>
          </div>
        )}
        onConfirm={() => { setDisplaySuccess(false); }}
      />
      <SweetAlert
        show={error !== ''}
        title="Oops!"
        type='error'
        confirmButtonText='Try Again'
        text={error}
        onConfirm={() => { setError(''); }}
      />
      <SweetAlert
        show={alert !== ''}
        title="Hold on!"
        type='warning'
        confirmButtonText='OK'
        text={alert}
        onConfirm={() => { setAlert(''); }}
      />
      <Container className="login">
        <Row>
          <Col xs={12} md={8} lg={5}>
            <Card>
              <CardTitle>Login</CardTitle>
              <CardSubtitle>Please, sign in to start managing your page.</CardSubtitle>
              <CardBody>
                <Form onSubmit={submit}>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      type="email"
                      placeholder="john@doe.com" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      name="password"
                      type="password"
                      placeholder="******" />
                  </FormGroup>
                  <Button
                    disabled={!isFormValid || disableSubmit}
                    block
                    type="submit"
                    color='primary'>
                    Sign in
                  </Button>
                  <Button
                    onClick={() => props.history.push(ADMIN_PRE_REGISTER)}
                    block
                    outline
                    type="button"
                    color='secondary'>
                    Pre-register my Account
                </Button>
                  <Button
                    onClick={() => props.history.push(ADMIN_FORGOT_PASSWORD)}
                    block
                    type="button"
                    color='link'>
                    Forgot My Password
                </Button>
                </Form>
                <FormSeparator />
                <h6 className='login-with'>Login with</h6>
                <Row>
                  <Col xs={12} md={6} className='mb-3 mb-md-0'>
                    <Button
                      disabled={disableGoogle}
                      onClick={() => signInWithGoogleAccount()}
                      block
                      className='google'>
                      <FontAwesomeIcon icon={faGoogle} /> Google
                  </Button>
                  </Col>
                  {/* <Col xs={12} md={6}>
                    <Button
                      disabled={disableFacebook}
                      onClick={() => signInWithFacebookAccount()}
                      block
                      className='facebook'>
                      <FontAwesomeIcon icon={faFacebookF} /> Facebook
                    </Button>
                  </Col> */}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

/**
 * @description Exports the Login Component bound to React-Router.
 * @exports
*/
export default withRouter(Login);