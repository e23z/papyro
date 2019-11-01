import React, { FunctionComponent, useState, FormEvent, useContext } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, ButtonGroup, Button } from 'reactstrap';
import { RoutingProps } from '../../routing/interfaces';
import Loading from '../shared/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ADMIN_PODCASTS } from '../../routing/routes';
import { GlobalContext } from '../../utils/globalState';
import { PodcastSchema } from '../../models/Podcast';
import { validate } from '../../utils/validation';
import { PodcastRef } from '../../models/CMS';
import { nowEpoch, uuid } from '../../utils/utils';

/**
 * @interface PodcastCreateOrEditProps
 * @description PodcastCreateOrEdit component props
 */
interface PodcastCreateOrEditProps extends RoutingProps {
}

/**
 * @function PodcastCreateOrEdit
 * @description Page to create or edit podcasts.
 */
const PodcastCreateOrEdit: FunctionComponent<PodcastCreateOrEditProps> = props => {
  // Overall state of the component
  const [_id, _setId] = useState<string | undefined>('');
  const [title, setTitle] = useState('');
  const [embed, setEmbed] = useState('');
  const [publishedAt, setPublishedAt] = useState(nowEpoch());
  const [isLoading, setIsLoading] = useState(false);
  const { cms, setCMS } = useContext(GlobalContext);

  // Basic page information
  const id = props.match.params.id;
  
  // If we're editing a podcast
  if (id && _id !== id) {
    _setId(id);
    const selectedPodcast = cms.podcasts.find(p => p.id === id);
    if (selectedPodcast) {
      setTitle(selectedPodcast.title);
      setEmbed(selectedPodcast.embed);
      setPublishedAt(selectedPodcast.publishedAt);
    }
  }
  // Clear up everything if was editing and moved away
  else if (!id && _id !== id) {
    _setId(undefined);
    setTitle('');
    setEmbed('');
    setPublishedAt(nowEpoch());
  }

  // Validation state
  const podcast: PodcastRef = { id: id || uuid(), title, embed, publishedAt };
  const validationResult = validate(podcast, PodcastSchema.fields);
  const isFormValid = validationResult && validationResult.isValid;

  // Page basic layout configs
  const pageTitle = id ? 'Edit Podcast' : 'Create new Podcast';
  const saveBtnTitle = id ? 'Update' : 'Save';

  // Events
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Update the CMS structure
    const unchangedPodcasts = cms.podcasts.filter(m => m.id !== podcast.id);
    cms.podcasts = [podcast].concat([...unchangedPodcasts]);
    setCMS(cms);

    // Redirect to the pages list
    props.history.push(ADMIN_PODCASTS);
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
            <FormGroup className='flex-fill d-flex flex-column'>
              <Label for='embed' className='required'>Embed</Label>
              <Input
                className='flex-fill'
                value={embed}
                onChange={e => setEmbed(e.target.value)}
                id='embed'
                {...{ rows: 5 }}
                type='textarea' />
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
                  onClick={() => props.history.push(ADMIN_PODCASTS)}
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
* @description Exports the PodcastCreateOrEdit component.
* @exports
*/
export default PodcastCreateOrEdit;