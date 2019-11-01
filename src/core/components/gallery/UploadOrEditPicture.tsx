import React, { FunctionComponent, useState, FormEvent, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, ButtonGroup, Button } from 'reactstrap';
import { RoutingProps } from '../../routing/interfaces';
import Loading from '../shared/Loading';
import Image from '../shared/Image';
import '../../styles/css/gallery.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ADMIN_GALLERY } from '../../routing/routes';
import { GlobalContext } from '../../utils/globalState';
import { Picture } from '../../models/CMS';
import { uuid } from '../../utils/utils';
import { validate, ValidationType } from '../../utils/validation';
import { FieldSchema } from '../../models/Schema';
import { deleteFile } from '../../api/fileApi';

/**
 * @const FieldSchema[] Validations used in the form.
 * @default
*/
const validations: FieldSchema[] = [
  {
    name: 'title',
    validations: [ { type: ValidationType.Required } ]
  },
  {
    name: 'downloadUrl',
    validations: [ { type: ValidationType.Required } ]
  }
];

/**
 * @interface UploadOrEditPictureProps
 * @description UploadOrEditPicture component props
 */
interface UploadOrEditPictureProps extends RoutingProps {
}

/**
 * @function UploadOrEditPicture
 * @description Page to upload pictures to the gallery or edit existing ones.
 */
const UploadOrEditPicture: FunctionComponent<UploadOrEditPictureProps> = props => {
  // Overall state of the component
  const [_id, _setId] = useState<string | undefined>('');
  const [title, setTitle] = useState('');
  const [path, setPath] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>('');
  const [isLoading, setIsLoading] = useState(false);
  const { cms, setCMS } = useContext(GlobalContext);

  useEffect(() => {
    return () => {
      const updatedPicture = cms.pictures.find(p => p.id === _id);
      if (updatedPicture && updatedPicture.path !== path)
        deleteFile(path);
    }
  }, [path]);

  // Basic page information
  const id = props.match.params.id;

  // If we're editing a picture
  if (id && _id !== id) {
    _setId(id);
    const selectedPicture = cms.pictures.find(p => p.id === id);
    if (selectedPicture) {
      setTitle(selectedPicture.title);
      setPath(selectedPicture.path);
      setDownloadUrl(selectedPicture.downloadUrl);
    }
  }
  // Clear up everything if was editing and moved away
  else if (!id && _id !== id) {
    _setId(undefined);
    setTitle('');
    setPath('');
    setDownloadUrl(undefined);
  }

  // Validation state
  const picture: Picture = { id: id || uuid(), title, path, downloadUrl: downloadUrl || '' };
  const validationResult = validate(picture, validations);
  const isFormValid = validationResult && validationResult.isValid;

  // Page basic layout configs
  const pageTitle = id ? 'Edit Gallery Picture' : 'Upload new Picture';
  const saveBtnTitle = id ? 'Update' : 'Save';

  // Events
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Update the CMS structure
    const unchangedPictures = cms.pictures.filter(m => m.id !== picture.id);
    const updatedPicture = cms.pictures.find(p => p.id === picture.id);

    if (updatedPicture && updatedPicture.path !== picture.path)
      await deleteFile(updatedPicture.path);

    cms.pictures = [picture].concat([...unchangedPictures]);
    setCMS(cms);

    // Redirect to the pages list
    props.history.push(ADMIN_GALLERY);
  }

  // JSX
  return (
    <Container className='flex-fill'>
      <Row>
        <Col>
          <h3 className='page-title mb-0 pb-0'>{pageTitle}</h3>
          <p className='page-desc'>The fields marked with an asterisk (<span style={{ color: '#ff3f3f' }}>*</span>) are required.</p>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col md={8} lg={5}>
          <Form onSubmit={submit} className={isLoading ? 'is-loading' : ''}>
            <Loading />
            <FormGroup>
              <Label for='title' className='required'>Title</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                id='title'
                type='text' />
            </FormGroup>
            <FormGroup className='d-flex flex-column h-100 pb-3 img-upload-btn'>
              <Label for='cover' className='required'>Image</Label>
              <Image
                src={downloadUrl}
                onUpload={(id: string, downloadUrl: string, filePath: string) => {
                  console.log(filePath);
                  setPath(filePath);
                  setDownloadUrl(downloadUrl);
                }}
                uploadPath='/gallery'
                autoUpload
              />
            </FormGroup>
            <div className='flex-fill mb-3 d-flex flex-column justify-content-end'>
              <ButtonGroup>
                <Button
                  disabled={!isFormValid}
                  color='primary'
                  type='submit'>
                  <FontAwesomeIcon icon={faCheck} /> {saveBtnTitle}
                </Button>
                <Button
                  onClick={() => props.history.push(ADMIN_GALLERY)}
                  color='secondary'
                  outline>
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </Button>
              </ButtonGroup>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

/**
* @description Exports the UploadOrEditPicture component.
* @exports
*/
export default UploadOrEditPicture;