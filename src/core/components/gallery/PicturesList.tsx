import React, { useState, FunctionComponent, useContext } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import SweetAlert from 'sweetalert-react';
import { RoutingProps } from '../../routing/interfaces';
import '../../styles/css/gallery.css';
import { chunk } from '../../utils/utils';
import PictureListColumn from './PictureListColumn';
import { ADMIN_GALLERY_EDIT, ADMIN_GALLERY_UPLOAD } from '../../routing/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { GlobalContext } from '../../utils/globalState';
import { Picture } from '../../models/CMS';
import { deleteFile } from '../../api/fileApi';

/**
 * @interface PictureListProps
 * @description PictureList component props
 */
interface PictureListProps extends RoutingProps {
}

/**
 * @function PictureList
 * @description The gallery component of this CMS.
 */
const PictureList: FunctionComponent<PictureListProps> = props => {
  // Overall state of the component
  const { cms, setCMS } = useContext(GlobalContext);
  const [pictures, setPictures] = useState(cms.pictures);
  const [flaggedToDelete, setFlaggedToDelete] = useState<string | undefined>(undefined);

  // Events
  const cancelDelete = () => setFlaggedToDelete(undefined);

  const confirmDelete = async () => {
    if (flaggedToDelete) {
      await deleteFile(flaggedToDelete);
      cms.pictures = cms.pictures.filter(p => p.path !== flaggedToDelete);
      setCMS(cms);
      // TODO!: Remove this workaround because the cms is not triggering an update.
      filter();
    }
    setFlaggedToDelete(undefined);
  }

  const filter = () => setPictures(cms.pictures);
  const edit = (pic: Picture) => props.history.push(ADMIN_GALLERY_EDIT.replace(':id', pic.id));
  const remove = (pic: Picture) => setFlaggedToDelete(pic.path);

  // Basic layout setup
  // Prepare the podcasts table display
  const pics4Columns = chunk(pictures, 4);
  const pics2Columns = chunk(pictures, 2);

  // JSX
  return (
    <>
      <SweetAlert
        animation='slide-from-bottom'
        show={!!flaggedToDelete}
        title="Careful!"
        type='warning'
        showCancelButton
        confirmButtonText='YES, delete picture'
        cancelButtonText='NO, cancel'
        text='Are you sure you want to delete this picture?'
        confirmButtonColor='#dc3545'
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        onEscapeKey={cancelDelete}
        onOutsideClick={cancelDelete}
      />
      <Container className='flex-fill gallery-adm'>
        <Row>
          <Col>
            <h3 className='page-title'>Gallery Management</h3>
            <div className='w-100 mb-3'>
              <Button
                block
                onClick={() => props.history.push(ADMIN_GALLERY_UPLOAD)}
                color='primary'>
                <FontAwesomeIcon icon={faUpload} /> Upload Picture
              </Button>
            </div>
          </Col>
        </Row>
        <Row className='d-none d-lg-flex'>
          {
            pics4Columns.map((pics: Picture[], i: number) => (
              <Col lg={3} key={i} className='pictures'>
                <PictureListColumn
                  column={i}
                  onEdit={edit}
                  onDelete={remove}
                  items={pics} />
              </Col>
            ))
          }
        </Row>
        <Row className='d-none d-md-flex d-lg-none'>
          {
            pics2Columns.map((pics: Picture[], i: number) => (
              <Col md={6} key={i} className='pictures'>
                <PictureListColumn
                  column={i}
                  onEdit={edit}
                  onDelete={remove}
                  items={pics} />
              </Col>
            ))
          }
        </Row>
        <Row className='d-flex d-md-none'>
          <Col className='pictures'>
            <PictureListColumn
              column={0}
              onEdit={edit}
              onDelete={remove}
              items={pictures} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

/**
* @description Exports the PictureList component.
* @exports
*/
export default PictureList;