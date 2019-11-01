import React, { FunctionComponent, useState, useContext } from 'react';
import { Container, Row, Col, Button, Table, ButtonGroup } from 'reactstrap';
import { RoutingProps } from '../../routing/interfaces';
import SweetAlert from 'sweetalert-react';
import { ADMIN_EVENTS_ADD, ADMIN_EVENTS_EDIT } from '../../routing/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import EventsFilters from './EventsFilters';
import UnmanagedTooltip from '../shared/UnmanagedTooltip';
import { GlobalContext } from '../../utils/globalState';
import { Event } from '../../models/CMS';
import moment from 'moment';
import '../../styles/css/events.css';
import { deleteFile } from '../../api/fileApi';

/**
 * @interface EventListProps
 * @description EventList component props
 */
interface EventListProps extends RoutingProps {
}

/**
 * @function EventList
 * @description The list of events that should be displayed to users.
 */
const EventList: FunctionComponent<EventListProps> = props => {
  // Overall state of the component
  const { cms, setCMS } = useContext(GlobalContext);
  const [events, setEvents] = useState(cms.events);
  const [flaggedToDelete, setFlaggedToDelete] = useState<string | undefined>(undefined);

  // Events
  const flagToDelete = (e: any, id: string | undefined) => {
    e.currentTarget.blur();
    setFlaggedToDelete(id);
  }

  const cancelDelete = () => setFlaggedToDelete(undefined);

  const confirmDelete = async () => {
    if (flaggedToDelete) {
      const deleted = cms.events.find(e => e.id !== flaggedToDelete);

      if (deleted && deleted.path)
        await deleteFile(deleted.path);

      cms.events = cms.events.filter(e => e.id !== flaggedToDelete);
      setCMS(cms);
      //TODO!: Remove this workaround because the cms is not triggering an update.
      filter('', 0);
    }
    setFlaggedToDelete(undefined);
  }

  const filter = (title: string, date: number) => {
    const startAt = moment(date, 'x').startOf('day').unix() * 1000;
    const endAt = moment(date, 'x').endOf('day').unix() * 1000;
    setEvents(cms.events.filter(e =>
      (!title || e.title.toLowerCase().indexOf(title.toLowerCase()) !== -1) &&
      (date === 0 || (e.date <= endAt && e.date >= startAt))
    ));
  };

  // Basic layout setup
  // Prepare the podcasts table display
  let data: any = events
    .map((event: Event) => (
      <tr key={event.id}>
        <td className='d-none d-md-table-cell collapsing'>{moment(event.date).format('DD/MM/YYYY HH:mm')}</td>
        <td className='collapsing'>
          <span className='d-block d-md-none event-title-date'>{moment(event.date).format('DD/MM/YYYY HH:mm')}</span>
          {event.title}
        </td>
        <td className='d-none d-md-table-cell' dangerouslySetInnerHTML={{ __html: event.description }}></td>
        <td className='d-table-cell d-md-none'></td>
        <td className='collapsing'>
          <ButtonGroup>
            <Button
              onClick={() => props.history.push(ADMIN_EVENTS_EDIT.replace(':id', event.id))}
              id={`edt-${event.id}`}
              color='primary'
              outline>
              <FontAwesomeIcon icon={faPen} />
              <UnmanagedTooltip placement="top" target={`edt-${event.id}`} hideArrow={true}>
                Edit
              </UnmanagedTooltip>
            </Button>
            <Button
              onClick={(e: any) => flagToDelete(e, event.id)}
              id={`del-${event.id}`}
              color='danger'
              outline>
              <FontAwesomeIcon icon={faTrash} />
              <UnmanagedTooltip placement="top" target={`del-${event.id}`} hideArrow={true}>
                Delete
              </UnmanagedTooltip>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    ));

  if (events.length === 0)
    data = (
      <tr>
        <td colSpan={4} className='text-center'>
          No podcasts registered so far or found with the filters.
        </td>
      </tr>
    );

  // JSX
  return (
    <>
      <SweetAlert
        animation='slide-from-bottom'
        confirmButtonColor='#dc3545'
        show={!!flaggedToDelete}
        title="Careful!"
        type='warning'
        showCancelButton
        confirmButtonText='YES, delete event'
        cancelButtonText='NO, cancel'
        text='Are you sure you want to delete this event?'
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        onEscapeKey={cancelDelete}
        onOutsideClick={cancelDelete}
      />
      <Container fluid className='flex-fill'>
        <Row>
          <Col>
            <h3 className='page-title'>Events Management</h3>
          </Col>
        </Row>
        <Row>
          <Col md={4} lg={3}>
            <div className='w-100 mb-3'>
              <Button
                block
                onClick={() => props.history.push(ADMIN_EVENTS_ADD)}
                color='primary'>
                <FontAwesomeIcon icon={faCalendarPlus} /> Create new Event
              </Button>
            </div>
            <EventsFilters onApply={filter} />
          </Col>
          <Col>
            <Table striped className='mt-3 mt-md-0'>
              <thead>
                <tr>
                  <th className='d-none d-md-table-cell'>Date</th>
                  <th>Title</th>
                  <th className='d-none d-md-table-cell'>Description</th>
                  <th className='d-table-cell d-md-none'></th>
                  <th className='text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

/**
* @description Exports the EventList component.
* @exports
*/
export default EventList;