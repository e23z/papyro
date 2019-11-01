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
import { updatePassword } from '../../api/authApi';
import queryString from 'query-string';
import { RoutingProps } from '../../routing/interfaces';

/**
 * @const FieldSchema[] Validations used in the form.
 * @default
*/
const validations: FieldSchema[] = [
    {
      name: 'password',
      validations: [
        { type: ValidationType.Required },
        { type: ValidationType.MinLen, options: { len: 6 } }
      ]
    }
];

/**
 * @interface ResetPasswordProps
 * @description ResetPassword component props
 */
interface ResetPasswordProps extends RoutingProps {
}

/**
 * @function ForgotPassword
 * @description Component that handles resetting the user's password.
 * @param ResetPasswordProps props The properties for this component.
 */
const ResetPassword: FunctionComponent<ResetPasswordProps> = (props) => {
  // Overall state of the component
  const [password, setPassword] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [error, setError] = useState('');

  // Validation state
  const validationResult = validate({ password }, validations);
  const isFormValid = validationResult && validationResult.isValid;

  // Event handling
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setDisableSubmit(true);
      const qs = queryString.parse(props.location.search);
      const code = (qs.code || '') as string;
      await updatePassword(code, password);
      setDisplaySuccess(true);
    }
    catch (ex) {
      setDisableSubmit(false);
      if (ex.code === 'auth/invalid-action-code')
        setError("Sorry, but your password reset code is invalid!");
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
              Password successfully updated!
            </Alert>
            <Alert color='danger' className='app-alert' isOpen={error !== ''}>
              <h6><FontAwesomeIcon icon={faCheckCircle} /></h6>
              {error}
            </Alert>
            <CardTitle>Reset Password</CardTitle>
            <CardSubtitle>Just type your new password.</CardSubtitle>
            <CardBody>
              <Form onSubmit={submit}>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    type="password" />
                </FormGroup>
                <Button
                  disabled={!isFormValid || disableSubmit}
                  block
                  type="submit"
                  color='primary'>
                  Change Password
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
 * @description Exports the Reset Password Component bound to React-Router.
 * @exports
*/
export default withRouter(ResetPassword);