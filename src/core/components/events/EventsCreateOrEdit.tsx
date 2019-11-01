import React, { FunctionComponent, useState, FormEvent, useContext } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, ButtonGroup, Button } from 'reactstrap';
import { RoutingProps } from '../../routing/interfaces';
import Loading from '../shared/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ADMIN_EVENTS } from '../../routing/routes';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import '../../styles/css/events.css';
import { FieldSchema } from '../../models/Schema';
import { ValidationType, validate } from '../../utils/validation';
import { GlobalContext } from '../../utils/globalState';
import { uuid } from '../../utils/utils';
import { Event } from '../../models/CMS';
import WYSIWYG, { RichEditor } from '../shared/WYSIWYG';
import { deleteFile } from '../../api/fileApi';
import Image from '../shared/Image';

/**
 * @const FieldSchema[] Validations used in the form.
 * @default
*/
const validations: FieldSchema[] = [
  {
    name: 'date',
    validations: [{ type: ValidationType.Required }]
  },
  {
    name: 'title',
    validations: [{ type: ValidationType.Required }]
  },
  {
    name: 'description',
    validations: [{ type: ValidationType.Required }]
  }
];

/**
 * @interface EventsCreateOrEditProps
 * @description EventsCreateOrEdit component props
 */
interface EventsCreateOrEditProps extends RoutingProps {
}

/**
 * @function EventsCreateOrEdit
 * @description The list of events that should be displayed to users.
 */
const EventsCreateOrEdit: FunctionComponent<EventsCreateOrEditProps> = props => {
  // Overall state of the component
  const [_id, _setId] = useState<string | undefined>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(RichEditor.createEmpty());
  const [date, setDate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [path, setPath] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>('');
  const { cms, setCMS } = useContext(GlobalContext);

  // Basic page information
  const id = props.match.params.id;

  // If we're editing a picture
  if (id && _id !== id) {
    _setId(id);
    const selectedEvent = cms.events.find(e => e.id === id);
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setContent(RichEditor.createFromHtmlString(selectedEvent.description));
      setDate(selectedEvent.date);
      setPath(selectedEvent.path);
      setDownloadUrl(selectedEvent.downloadUrl);
    }
  }
  // Clear up everything if was editing and moved away
  else if (!id && _id !== id) {
    _setId(undefined);
    setTitle('');
    setContent(RichEditor.createEmpty());
    setDate(0);
    setPath('');
    setDownloadUrl(undefined);
  }

  // Validation state
  let description = RichEditor.valueToHtml(content);
  if (description === '<p><br></p>') description = '';
  const event: Event = { id: id || uuid(), title, description, date: date || 0, path, downloadUrl: downloadUrl || '' };
  const validationResult = validate(event, validations);
  const isFormValid = validationResult && validationResult.isValid;

  // Page basic layout configs
  const pageTitle = id ? 'Edit Event' : 'Create new Event';
  const saveBtnTitle = id ? 'Update' : 'Save';

  // Events
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Update the CMS structure
    const unchangedEvents = cms.events.filter(e => e.id !== event.id);
    const updatedEvent = cms.events.find(e => e.id === event.id);

    if (updatedEvent && updatedEvent.path !== event.path && updatedEvent.path)
      await deleteFile(updatedEvent.path);

    cms.events = [event].concat([...unchangedEvents]);
    setCMS(cms);

    // Redirect to the pages list
    props.history.push(ADMIN_EVENTS);
  }

  // JSX
  return (
    <Container className='flex-fill admin-events'>
      <Row>
        <Col>
          <h3 className='page-title mb-0 pb-0'>{pageTitle}</h3>
          <p className='page-desc'>The fields marked with an asterisk (<span style={{ color: '#ff3f3f' }}>*</span>) are required.</p>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col xs={12}  lg={9}>
          <Form onSubmit={submit} className={isLoading ? 'is-loading' : ''}>
            <Loading />
            <Row>
              <Col sm={12} md='auto' className='text-center'>
                <FormGroup className='d-flex flex-column text-left pb-3 img-upload-btn'>
                  <Label for='cover'>Image</Label>
                  <Image
                    src={downloadUrl}
                    onUpload={(id: string, downloadUrl: string, filePath: string) => {
                      setPath(filePath);
                      setDownloadUrl(downloadUrl ? downloadUrl : undefined);
                    }}
                    uploadPath='/events'
                    autoUpload
                    showDeleteBtn
                  />
                </FormGroup>
                <FormGroup className='d-flex justify-content-center'>
                  <Flatpickr
                    options={{
                      inline: true,
                      enableTime: true,
                      minDate: new Date(),
                      defaultDate: new Date(),
                      time_24hr: true
                    }}
                    value={date}
                    onChange={(date, dateStr, instance) => {
                      if (!date || date.length === 0)
                        return;
                      setDate(Math.round(date[0].getTime()));
                    }}
                  />
                </FormGroup>
              </Col>
              <Col className='d-flex flex-column'>
                <FormGroup>
                  <Label for='title' className='required'>Title</Label>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    id='title'
                    type='text' />
                </FormGroup>
                <WYSIWYG
                  title='Description'
                  required
                  basicControls
                  value={content}
                  onChange={value => setContent(value)} />
                {/* <FormGroup className='flex-fill d-flex flex-column'>
                  <Label for='description' className='required'>Description</Label>
                  <Input
                    className='flex-fill'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    id='description'
                    type='textarea' />
                </FormGroup> */}
                <div className='mb-3 d-flex flex-column justify-content-end'>
                  <ButtonGroup>
                    <Button
                      disabled={!isFormValid}
                      color='primary'
                      type='submit'>
                      <FontAwesomeIcon icon={faCheck} /> {saveBtnTitle}
                    </Button>
                    <Button
                      onClick={() => props.history.push(ADMIN_EVENTS)}
                      color='secondary'
                      outline>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </Button>
                  </ButtonGroup>
                </div>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

/**
* @description Exports the EventsCreateOrEdit component.
* @exports
*/
export default EventsCreateOrEdit;