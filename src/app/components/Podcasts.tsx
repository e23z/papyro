import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import PodcastEpisodes from './PodcastEpisodes';
/**
 * @function Podcasts
 * @description The Podcasts
 */
const Podcasts = () => {
  // JSX
  return (
    <Container className='flex-fill'>
      <Row>
        <Col>
          <h3 className='page-title mb-0 pb-0'>Nepali FM</h3>
          <p className='page-desc'>Check out previous episodes from our weekly radio show.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <PodcastEpisodes showTitles />
        </Col>
      </Row>
    </Container>
  );
}

/**
* @description Exports the Podcasts component.
* @exports
*/
export default Podcasts;