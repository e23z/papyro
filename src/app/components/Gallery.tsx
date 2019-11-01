import React, { useContext, FunctionComponent } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { GlobalContext } from '../../core/utils/globalState';
import { chunk } from '../../core/utils/utils';
import { Picture } from '../../core/models/CMS';
import ModalImage from 'react-modal-image';


/**
 * @interface GalleryColumnProps
 * @description The properties for a column of images
 */
interface GalleryColumnProps {
  pictures: Picture[];
}

/**
 * @function GalleryColumn
 * @description A column of pictures from the gallery
 */
const GalleryColumn: FunctionComponent<GalleryColumnProps> = props => (
  <>
    {
      props.pictures.map(p => (
        <ModalImage
          key={p.id}
          small={p.downloadUrl}
          large={p.downloadUrl}
          className='img-fluid mb-3'
          alt={p.title}
        />
      ))
    }
  </>
);

/**
 * @function Gallery
 * @description The Gallery
 */
const Gallery = () => {
  // Overall state of the component
  const { cms } = useContext(GlobalContext);

  // Basic layout setup
  const pics4Columns = chunk(cms.pictures, 4);
  const pics2Columns = chunk(cms.pictures, 2);

  // JSX
  return (
    <Container className='flex-fill'>
      <Row>
        <Col>
          <h3 className='page-title mb-0 pb-0'>Picture Gallery</h3>
          <p className='page-desc'>Check out the pictures of previous events.</p>
        </Col>
      </Row>
      <Row className='d-none d-lg-flex'>
        {
          pics4Columns.map((pics: Picture[], i: number) => (
            <Col lg={3} key={`lg-${i}`} className='pictures'>
              <GalleryColumn pictures={pics} />
            </Col>
          ))
        }
      </Row>
      <Row className='d-none d-md-flex d-lg-none'>
        {
          pics2Columns.map((pics: Picture[], i: number) => (
            <Col md={6} key={`md-${i}`} className='pictures'>
              <GalleryColumn pictures={pics} />
            </Col>
          ))
        }
      </Row>
      <Row className='d-flex d-md-none'>
        <Col className='pictures'>
          <GalleryColumn pictures={cms.pictures} />
        </Col>
      </Row>
    </Container>
  );
}

/**
* @description Exports the Gallery component.
* @exports
*/
export default Gallery;