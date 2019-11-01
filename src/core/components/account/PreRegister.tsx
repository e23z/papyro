import React, { FunctionComponent, FormEvent, useEffect, useRef, useState, useContext } from 'react';
import {
  Card, CardBody, CardTitle, CardSubtitle,
  FormGroup, Input, Form, Label, Container, Row, Col,
  Button, Alert, FormText
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from "react-router-dom";
import { ADMIN_HOME } from '../../routing/routes';
import VerticalFormSeparator from '../ui/VerticalFormSeparator';
import '../../styles/css/account.css';
import '../../styles/css/register.css';
import { loadReCaptcha, ReCaptcha } from 'react-recaptcha-google'
import { RoutingProps } from '../../routing/interfaces';
import appConfigs from '../../../app/appConfigs';
import { registerWithEmail, registerWithGoogle, registerWithFacebook } from '../../api/authApi';
import { UserSchema } from '../../models/User';
import { validate } from '../../utils/validation';
import SweetAlert from 'sweetalert-react';
import { renderToStaticMarkup } from 'react-dom/server';
import 'sweetalert/dist/sweetalert.css';
import { AuthContext } from '../../utils/auth';

/**
 * @interface PreRegisterProps
 * @description PreRegister component props
 */
interface PreRegisterProps extends RoutingProps {
}

/**
 * @function PreRegister
 * @description Component that handles user registration.
 * @param PreRegisterProps props The properties for this component.
 */
const PreRegister: FunctionComponent<PreRegisterProps> = (props) => {
  // Recaptcha Integration
  const recaptcha = useRef(null);
  useEffect(() => { loadReCaptcha(); }, []);

  // Overall state of the component
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [error, setError] = useState('');
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [disableGoogle, setDisableGoogle] = useState(false);
  const [disableFacebook, setDisableFacebook] = useState(false);

  // Validation state
  const user = { name, email, password };
  const validationResult = validate(user, UserSchema.fields);
  const isFormValid = validationResult && validationResult.isValid && recaptchaToken;

  // Authentication state
  const { disableLogin } = useContext(AuthContext);
  disableLogin();

  // Event handling
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setDisableSubmit(true);
      await registerWithEmail(name, email, password);
      setDisplaySuccess(true);
    }
    catch (ex) {
      if (ex.code === 'auth/email-already-in-use')
        setError('E-mail already registered!');
      else
        setError("Sorry, we couldn't register you this time. Please, try again!");
    }
    finally {
      setDisableSubmit(false);
    }
  };

  const registerWithGoogleAccount = async () => {
    try {
      setDisableGoogle(true);
      await registerWithGoogle();
      setDisplaySuccess(true);
    }
    catch (ex) {
      if (ex.code === 'auth/email-already-in-use')
        setError('E-mail already registered!');
      else
        setError("Sorry, we couldn't register you this time. Please, try again!");
    }
    finally {
      setDisableGoogle(false);
    }
  };
  
  const registerWithFacebookAccount = async () => {
    try {
      setDisableFacebook(true);
      await registerWithFacebook();
      setDisplaySuccess(true);
    }
    catch (ex) {
      console.log(ex);
      if (ex.code === 'auth/email-already-in-use')
        setError('E-mail already registered!');
      else
        setError("Sorry, we couldn't register you this time. Please, try again!");
    }
    finally {
      setDisableFacebook(false);
    }
  };

  const onLoadedRecaptcha = () => {
    const recaptchaEl: any = recaptcha.current;
    recaptchaEl && recaptchaEl.reset();
  };

  // JSX
  return (
    <>
      <SweetAlert
        show={displaySuccess}
        title="Success!"
        html
        type='success'
        confirmButtonText='Go to Login'
        text={renderToStaticMarkup(
          <div className="register flex-column">
            <p className='swal-text'>Your account has been created successfully.</p>
            <Alert color='warning' fade={false} className='mt-4 mb-0'>
              <h6><FontAwesomeIcon icon={faExclamationTriangle} /></h6>
              Your login will undergo an approval process. Only when accepted you'll be able to login.
            </Alert>
          </div>
        )}
        onConfirm={() => { setDisplaySuccess(false); props.history.push(ADMIN_HOME); }}
      />
      <SweetAlert
        show={error !== ''}
        title="Oops!"
        type='error'
        confirmButtonText='Try Again'
        text={error}
        onConfirm={() => { setError(''); }}
      />
      <Container className="register">
        <Row>
          <Col xs={12} md={8} lg={8}>
            <Card>
              <CardTitle>Register an Account</CardTitle>
              <CardSubtitle>Request to be an administrator.</CardSubtitle>
              <CardBody>
                <Row>
                  <Col>
                    <Form onSubmit={submit}>
                      <FormGroup>
                        <Label for="name">Name</Label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          name="name"
                          type="text"
                          placeholder="John Doe" />
                      </FormGroup>
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
                        <FormText>Minimum 6 characters.</FormText>
                      </FormGroup>
                      <div className='mb-3 d-flex justify-content-center'>
                        <ReCaptcha
                          ref={recaptcha}
                          size={window.innerWidth <= 575 ? 'compact' : 'normal'}
                          render="explicit"
                          sitekey={appConfigs.keys.recaptcha.siteKey}
                          onloadCallback={onLoadedRecaptcha}
                          verifyCallback={(token: any) => setRecaptchaToken(token)}
                        />
                      </div>
                      <Row className='mb-4'>
                        <Col xs={12} md={6} className='mb-3 mb-md-0'>
                          <Button
                            disabled={!isFormValid || disableSubmit}
                            block
                            type="submit"
                            color='primary'>
                            Pre-Register
                        </Button>
                        </Col>
                        <Col xs={12} md={6}>
                          <Button
                            onClick={() => props.history.push(ADMIN_HOME)}
                            block
                            outline
                            type="button"
                            color='secondary'>
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <VerticalFormSeparator className='d-none d-lg-block' />
                  <Col lg={4}>
                    <h6 className='login-with mt-0'>Register with</h6>
                    <div>
                      <Button
                        disabled={disableGoogle}
                        onClick={() => registerWithGoogleAccount()}
                        block
                        className='google mb-3'>
                        <FontAwesomeIcon icon={faGoogle} /> Google
                    </Button>
                      {/* <Button
                        disabled={disableFacebook}
                        onClick={() => registerWithFacebookAccount()}
                        block
                        className='facebook'>
                        <FontAwesomeIcon icon={faFacebookF} /> Facebook
                    </Button> */}
                    </div>
                  </Col>
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
 * @description Exports the Registration Component bound to React-Router.
 * @exports
*/
export default withRouter(PreRegister);