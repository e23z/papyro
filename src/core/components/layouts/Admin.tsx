import React, { FunctionComponent } from 'react';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
import appConfigs from '../../../app/appConfigs';
import { cleanRelativePath } from '../../utils/utils';
import '../../styles/css/admin.css';

/**
 * @cont The configured logo image.
 */
const logo = require('../../../app/' + cleanRelativePath(appConfigs.logo));

/**
 * @function Admin
 * @description The Admin pages master layout.
 * @param any props The default React props.
 */
const Admin: FunctionComponent = (props) => {
  // Changes the page title to whatever is configured
  document.title = `${appConfigs.alias} - CMS`;

  // JSX
  return (
    <div className='admin-container'>
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700,800" rel="stylesheet" />
      <Header logoPath={logo} title={appConfigs.alias} />
      {props.children}
      <Footer title={appConfigs.title} />
    </div>
  );
};

/**
* @description Exports the Admin component.
* @exports
*/
export default Admin;