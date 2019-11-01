import React, { useState, FormEvent, useEffect } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { FieldSchema } from '../../core/models/Schema';
import { ValidationType, validate } from '../../core/utils/validation';
import ButterToast, { Cinnamon, POS_RIGHT } from 'butter-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../core/components/shared/Loading';
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
    name: 'phone',
    validations: [{ type: ValidationType.Required }]
  },
  {
    name: 'address',
    validations: [{ type: ValidationType.Required }]
  },
  {
    name: 'email',
    validations: [
      { type: ValidationType.Required },
      { type: ValidationType.Email }
    ]
  }
];

/**
 * @function BecomeMember
 * @description The BecomeMember
 */
const BecomeMember = () => {
  // Overall state of the component
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
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
  const event = { name, email, phone, address };
  const validationResult = validate(event, validations);
  const isFormValid = validationResult && validationResult.isValid;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new URLSearchParams();
    data.set('name', name);
    data.set('email', email);
    data.set('phone', phone);
    data.set('message', address);
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
            content="Thanks! Your request to become a member has been sent successfully."
            title="Success" />
        });
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
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
            <h3 className='page-title mb-0 pb-0'>Become a Member</h3>
            <p className='page-desc'>Please, fill up all the fields in the form below. Then, we'll contact you about the next steps on how to become a member of NNZFSC.</p>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col>
            <Form onSubmit={submit} className={isLoading ? 'is-loading' : ''}>
              <Loading />
              <Row>
                <Col xs={12}>
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
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label for='phone' className='required'>Phone</Label>
                    <Input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      id='phone'
                      type='tel' />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <Label for='address' className='required'>Address</Label>
                    <Input
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      id='address'
                      type='text' />
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
                    <FontAwesomeIcon icon={faPaperPlane} /> Send Request
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
* @description Exports the BecomeMember component.
* @exports
*/
export default BecomeMember;