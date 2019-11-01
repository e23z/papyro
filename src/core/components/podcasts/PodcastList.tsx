import React, { FunctionComponent, useState, useContext } from 'react';
import { Container, Row, Col, Button, Table, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { RoutingProps } from '../../routing/interfaces';
import SweetAlert from 'sweetalert-react';
import { ADMIN_PODCASTS_ADD, ADMIN_PODCASTS_EDIT } from '../../routing/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faMicrophone, faHeadphones } from '@fortawesome/free-solid-svg-icons';
import UnmanagedTooltip from '../shared/UnmanagedTooltip';
import PodcastsFilters from './PodcastFilters';
import { GlobalContext } from '../../utils/globalState';
import { PodcastRef } from '../../models/CMS';
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * @interface PodcastListProps
 * @description PodcastList component props
 */
interface PodcastListProps extends RoutingProps {
}

/**
 * @function PodcastList
 * @description The list of events that should be displayed to users.
 */
const PodcastList: FunctionComponent<PodcastListProps> = props => {
  // Overall state of the component
  const { cms, setCMS } = useContext(GlobalContext);
  const [podcasts, setPodcasts] = useState(cms.podcasts);
  const [flaggedToDelete, setFlaggedToDelete] = useState<string | undefined>(undefined);
  const [listening, setListening] = useState<PodcastRef | null>(null);

  // Events
  const flagToDelete = (e: any, id: string | undefined) => {
    e.currentTarget.blur();
    setFlaggedToDelete(id);
  }

  const cancelDelete = () => setFlaggedToDelete(undefined);

  const confirmDelete = () => {
    if (flaggedToDelete) {
      cms.podcasts = cms.podcasts.filter(m => m.id !== flaggedToDelete);
      setCMS(cms);
      //TODO!: Remove this workaround because the cms is not triggering an update.
      filter('');
    }
    setFlaggedToDelete(undefined);
  }

  const filter = (title: string) => {
    setPodcasts(cms.podcasts.filter(p =>
      !title || p.title.toLowerCase().indexOf(title.toLowerCase()) !== -1
    ));
  };

  // Basic layout setup
  // Prepare the podcasts table display
  let data: any = podcasts
    .sort((a, b) => a.publishedAt > b.publishedAt ? -1 : 1)
    .map((podcast: PodcastRef) => (
      <tr key={podcast.id}>
        <td className='collapsing'>{podcast.title}</td>
        <td></td>
        <td className='collapsing'>
          <ButtonGroup>
            <Button
              onClick={() => setListening(podcast)}
              id={`play-${podcast.id}`}
              color='success'
              outline>
              <FontAwesomeIcon icon={faHeadphones} />
              <UnmanagedTooltip placement="top" target={`play-${podcast.id}`} hideArrow={true}>
                Play Podcast
              </UnmanagedTooltip>
            </Button>
            <Button
              onClick={() => props.history.push(ADMIN_PODCASTS_EDIT.replace(':id', podcast.id))}
              id={`edt-${podcast.id}`}
              color='primary'
              outline>
              <FontAwesomeIcon icon={faPen} />
              <UnmanagedTooltip placement="top" target={`edt-${podcast.id}`} hideArrow={true}>
                Edit
              </UnmanagedTooltip>
            </Button>
            <Button
              onClick={(e: any) => flagToDelete(e, podcast.id)}
              id={`del-${podcast.id}`}
              color='danger'
              outline>
              <FontAwesomeIcon icon={faTrash} />
              <UnmanagedTooltip placement="top" target={`del-${podcast.id}`} hideArrow={true}>
                Delete
              </UnmanagedTooltip>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    ));

  if (podcasts.length === 0)
    data = (
      <tr>
        <td colSpan={3} className='text-center'>
          No podcasts registered so far or found with the filters.
        </td>
      </tr>
    );

  // JSX
  return (
    <>
      <SweetAlert
        animation='slide-from-bottom'
        show={!!flaggedToDelete}
        title="Careful!"
        type='warning'
        showCancelButton
        confirmButtonText='YES, delete podcast'
        cancelButtonText='NO, cancel'
        text='Are you sure you want to delete this podcast?'
        confirmButtonColor='#dc3545'
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        onEscapeKey={cancelDelete}
        onOutsideClick={cancelDelete}
      />
      <Modal isOpen={!!listening} toggle={() => setListening(null)}>
        <ModalHeader className="text-uppercase">{listening && listening.title}</ModalHeader>
        {
          listening ?
            listening.embed.indexOf('iframe') !== -1 ?
              <ModalBody dangerouslySetInnerHTML={{ __html: listening.embed || '' }} />
              : <ModalBody><iframe className='nepali-fm' src={listening.embed + "&autoPlay=false"}></iframe></ModalBody>
            : null
        }
        <ModalFooter>
          <Button color="secondary" onClick={() => setListening(null)}>Close</Button>
        </ModalFooter>
      </Modal>
      <Container fluid className='flex-fill'>
        <Row>
          <Col>
            <h3 className='page-title'>Podcasts Management</h3>
          </Col>
        </Row>
        <Row>
          <Col md={4} lg={3}>
            <div className='w-100 mb-3'>
              <Button
                block
                onClick={() => props.history.push(ADMIN_PODCASTS_ADD)}
                color='primary'>
                <FontAwesomeIcon icon={faMicrophone} /> Add new Podcast
              </Button>
            </div>
            <PodcastsFilters onApply={filter} />
          </Col>
          <Col>
            <Table striped className='mt-3 mt-md-0'>
              <thead>
                <tr>
                  <th>Title</th>
                  <th></th>
                  <th className='text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data}
              </tbody>
            </Table>
            {/* <div className='text-center'>
            <Button color='success'>
              <FontAwesomeIcon icon={faSpinner} /> Load More
            </Button>
          </div> */}
          </Col>
        </Row>
      </Container>
    </>
  );
}

/**
* @description Exports the PodcastList component.
* @exports
*/
export default PodcastList;