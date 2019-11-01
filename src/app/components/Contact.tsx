import React, { useState, FormEvent, useEffect } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { FieldSchema } from '../../core/models/Schema';
import { ValidationType, validate } from '../../core/utils/validation';
import Loading from '../../core/components/shared/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import ButterToast, { Cinnamon, POS_RIGHT } from 'butter-toast';
import appConfigs from '../appConfigs';
import { Page, PageRepo } from '../../core/models/Page';

/**
 * @const FieldSchema[] Validations used in the form.
 * @default
*/
const validations: FieldSchema[] = [
  {
    name: 'name',
    validations: [{ type: ValidationType.Required }]
  },
  {
    name: 'email',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.Email }
    ]
  },
  {
    name: 'message',
    validations: [{ type: ValidationType.Required }]
  }
];

/**
 * @function Contact
 * @description The Contact
 */
const Contact = () => {
  // Overall state of the component
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [trap, setTrap] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contactDetails, setContactDetails] = useState<Page | null>(null);

  const setContactDetailsFallback = () => {
    setContactDetails({
      title: '',
      permalink: '',
      menuDetails: {} as any,
      content: `
          <p>You can also send us an email at: <a href="mailto:nnzfs08@gmail.com">nnzfs08@gmail.com</a></p>
          <p>Or, contact us at:</p>
          <p><b>P.O. Box 6147</b><br />Sockburn, Christchurch, 8042</p>
        `
    });
  };

  useEffect(() => {
    PageRepo.Instance.FindByPermalink('contact-details').then((p: Page | null) => {
      if (!p) {
        setContactDetailsFallback();
        return;
      }
      setContactDetails(p);
    }).catch(() => { setContactDetailsFallback(); });
  }, []);

  // Validation state
  const event = { name, email, message };
  const validationResult = validate(event, validations);
  const isFormValid = validationResult && validationResult.isValid;

  // Events
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new URLSearchParams();
    data.set('name', name);
    data.set('email', email);
    data.set('message', message);
    data.set('trapit', trap);
    fetch(appConfigs.keys.jumprock.alias, {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data.toString()
    }).then(r => {
      if (r.ok) {
        ButterToast.raise({
          content: <Cinnamon.Crisp
            scheme={Cinnamon.Crisp.SCHEME_GREEN}
            icon={<FontAwesomeIcon icon={faCheckCircle} size='2x' />}
            content="Thanks! Your message has been sent successfully."
            title="Success" />
        });
        setName('');
        setEmail('');
        setMessage('');
        setTrap('');
        setIsLoading(false);
      }
    });
  }

  // Basic layout configs
  let content: any = (
    <div className='mb-3'>
      <div className='placeholder line-placeholder w-50'></div>
      <div className='placeholder line-placeholder w-25'></div>
      <div className='placeholder line-placeholder w-25'></div>
      <div className='placeholder line-placeholder w-50'></div>
    </div>
  );

  if (contactDetails)
    content = <div dangerouslySetInnerHTML={{ __html: contactDetails.content || '' }} />;

  // JSX
  return (
    <>
      <ButterToast position={{ horizontal: POS_RIGHT }} />
      <Container className='flex-fill'>
        <Row>
          <Col>
            <h3 className='page-title mb-0 pb-0'>Contact</h3>
            <p className='page-desc'>Please, fill up all the fields in the form below to contact us.</p>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col>
            <Form onSubmit={submit} className={isLoading ? 'is-loading' : ''}>
              <Loading />
              <Row>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label for='name' className='required'>Name</Label>
                    <Input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      id='name'
                      type='text' />
                  </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label for='email' className='required'>Email</Label>
                    <Input
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      id='email'
                      type='email' />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup className='flex-fill d-flex flex-column'>
                    <Label for='message' className='required'>Message</Label>
                    <Input
                      className='flex-fill'
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      id='message'
                      {...{ rows: 5 }}
                      type='textarea' />
                  </FormGroup>
                  <Input
                    value={trap}
                    onChange={e => setTrap(e.target.value)}
                    type='text'
                    className='d-none' />
                  <Button
                    disabled={!isFormValid}
                    color='primary'
                    type='submit'>
                    <FontAwesomeIcon icon={faPaperPlane} /> Send Message
                </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col>
            {content}
          </Col>
        </Row>
      </Container>
    </>
  );
}

/**
* @description Exports the Contact component.
* @exports
*/
export default Contact;