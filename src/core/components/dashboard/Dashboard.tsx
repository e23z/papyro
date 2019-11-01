import React, { useContext } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { GlobalContext } from '../../utils/globalState';

/**
 * @function Dashboard
 * @description The dashboard panel loaded of useful information for the admin.
 */
const Dashboard = () => {
  // Overall state of the component
  const { cms } = useContext(GlobalContext);

  // JSX
  return (
    <Container className='flex-fill dashboard'>
      <Row>
        <Col>
          <h3 className='page-title mb-0 pb-0'>Dashboard</h3>
          <p className='page-desc'>Welcome, from here you can manage all the content of your website.</p>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col lg={5}>
          <Row>
            <Col xs={4} className='text-center'>
              <h2>{cms.stats.totalUsers}</h2>
              <p>Total Active Users</p>
            </Col>
            <Col xs={4} className='text-center'>
              <h2>{cms.stats.totalUsersPendingApproval}</h2>
              <p>Pending Approval Users</p>
            </Col>
            <Col xs={4} className='text-center'>
              <h2>{cms.menuItems.length}</h2>
              <p>Total Pages</p>
            </Col>
            <Col xs={4} className='text-center'>
              <h2>{cms.events.length}</h2>
              <p>Total Events</p>
            </Col>
            <Col xs={4} className='text-center'>
              <h2>{cms.pictures.length}</h2>
              <p>Total Pictures</p>
            </Col>
            <Col xs={4} className='text-center'>
              <h2>{cms.files.length}</h2>
              <p>Total Files</p>
            </Col>
            <Col xs={4} className='text-center'>
              <h2>{cms.podcasts.length}</h2>
              <p>Total Podcasts</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

/**
* @description Exports the Dashboard component.
* @exports
*/
export default Dashboard;