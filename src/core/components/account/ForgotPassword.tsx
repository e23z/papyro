import React, { FunctionComponent, FormEvent, useState } from 'react';
import {
  Card, CardBody, CardTitle, CardSubtitle,
  FormGroup, Input, Form, Label, Container, Row, Col,
  Button, Alert
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from "react-router-dom";
import { ADMIN_HOME } from '../../routing/routes';
import '../../styles/css/account.css';
import { validate, ValidationType } from '../../utils/validation';
import { FieldSchema } from '../../models/Schema';
import { sendPasswordReset } from '../../api/authApi';
import { RoutingProps } from '../../routing/interfaces';

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
    }
];

/**
 * @interface PreRegisterProps
 * @description PreRegister component props
 */
interface ForgotPasswordProps extends RoutingProps {
}

/**
 * @function ForgotPassword
 * @description Component that handles sending password reset
 * emails to users.
 * @param ForgotPasswordProps props The properties for this component.
 */
const ForgotPassword: FunctionComponent<ForgotPasswordProps> = (props) => {
  // Overall state of the component
  const [email, setEmail] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [error, setError] = useState('');

  // Validation state
  const validationResult = validate({ email }, validations);
  const isFormValid = validationResult && validationResult.isValid;

  // Event handling
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setDisableSubmit(true);
      await sendPasswordReset(email);
      setDisplaySuccess(true);
    }
    catch (ex) {
      setDisableSubmit(false);
      if (ex.code === 'auth/user-not-found')
        setError("Sorry, but there's no user registered with this e-mail!");
      else
        setError("Sorry, we couldn't send a password reset this time. Please, try again!");
    }
  };

  // JSX
  return (
    <Container className="login">
      <Row>
        <Col xs={12} md={8} lg={5}>
          <Card>
            <Alert color='success' className='app-alert' isOpen={displaySuccess}>
              <h6><FontAwesomeIcon icon={faCheckCircle} /></h6>
              Password reset e-mail successfully sent!
            </Alert>
            <Alert color='danger' className='app-alert' isOpen={error !== ''}>
              <h6><FontAwesomeIcon icon={faCheckCircle} /></h6>
              {error}
            </Alert>
            <CardTitle>Forgot Password</CardTitle>
            <CardSubtitle>Recovering your password is really easy.</CardSubtitle>
            <CardBody>
              <Form onSubmit={submit}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    type="email" />
                </FormGroup>
                <Button
                  disabled={!isFormValid || disableSubmit}
                  block
                  type="submit"
                  color='primary'>
                  Send Recover Password E-mail
                </Button>
                <Button
                  onClick={() => props.history.push(ADMIN_HOME)}
                  block
                  outline
                  type="button"
                  color='secondary'>
                  Go to Login
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

/**
 * @description Exports the Forgot Password Component bound to React-Router.
 * @exports
*/
export default withRouter(ForgotPassword);