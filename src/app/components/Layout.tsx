import React, { FunctionComponent } from 'react';
import appConfigs from '../appConfigs';
import { cleanRelativePath } from '../../core/utils/utils';
import '../styles/css/app.css';
import Header from './Header';
import { Row, Col, Container } from 'reactstrap';
import Footer from './Footer';
import Events from './Events';

/**
 * @cont The configured logo image.
 */
const logo = require('../' + cleanRelativePath(appConfigs.logo));

/**
 * @function Admin
 * @description The Admin pages master layout.
 * @param any props The default React props.
 */
const Admin: FunctionComponent = (props) => {
  // Changes the page title to whatever is configured
  document.title = `${appConfigs.alias}`;

  // JSX
  return (
    <div className='app-container'>
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700,800" rel="stylesheet" />
      <Header
        facebook={appConfigs.social.facebook}
        twitter={appConfigs.social.twitter}
        logoPath={logo}
        title={appConfigs.title} />
      <Container className='flex-fill'>
        <Row>
          <Col className='pl-0 sm-pad-x-zero'>{props.children}</Col>
          <Col className='pr-0' lg={4}><Events /></Col>
        </Row>
      </Container>
      <Footer title={appConfigs.title} />
    </div>
  );
};

/**
* @description Exports the Admin component.
* @exports
*/
export default Admin;