import React, { useContext } from 'react';
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import * as Path from "./routes";
import AdminLayout from '../components/layouts/Admin';
import Login from '../components/account/Login';
import PreRegister from '../components/account/PreRegister';
import ForgotPassword from '../components/account/ForgotPassword';
import ResetPassword from '../components/account/ResetPassword';
import Auth from '../components/account/Auth';
import Error404 from '../../app/components/Error404';
import { RoutingProps } from './interfaces';
import { AuthContext } from '../utils/auth';
import Dashboard from '../components/dashboard/Dashboard';
import UserManagement from '../components/users/UserManagement';
import PageList from '../components/pages/PageList';
import PageCreateOrEdit from '../components/pages/PageCreateOrEdit';
import PageReorder from '../components/pages/PageReorder';
import PictureList from '../components/gallery/PicturesList';
import UploadOrEditPicture from '../components/gallery/UploadOrEditPicture';
import EventList from '../components/events/EventsList';
import EventsCreateOrEdit from '../components/events/EventsCreateOrEdit';
import { ADMIN_FILES, ADMIN_PODCASTS, ADMIN_PODCASTS_ADD, ADMIN_PODCASTS_EDIT } from './routes';
import FileListAndUpload from '../components/file/FileListAndUpload';
import PodcastCreateOrEdit from '../components/podcasts/PodcastCreateOrEdit';
import PodcastList from '../components/podcasts/PodcastList';

/**
 * @interface RouterProps
 * @description Router component props
 */
interface RouterProps extends RoutingProps {
  auth?: any;
}

/**
 * @function Router
 * @description Component that handles routing/navigation through the app.
 * @param RouterProps props The properties for this component.
 */
const Router: React.FunctionComponent<RouterProps> = (props) => {
  // Overall state of the component
  const { isLogged } = useContext(AuthContext);

  // Default routes
  let privateRoutes: any = null;
  let publicRoutes: any = (
    <Switch>
      <Route exact path={Path.ADMIN_HOME} component={Login} />
      <Route exact path={Path.ADMIN_PRE_REGISTER} component={PreRegister} />
      <Route exact path={Path.ADMIN_FORGOT_PASSWORD} component={ForgotPassword} />
      <Route exact path={Path.ADMIN_RESET_PASSWORD} component={ResetPassword} />
      <Route exact path={Path.ADMIN_AUTH} component={Auth} />
      <Route path="*" component={Error404} />
    </Switch>
  );

  // Change routes if the user is logged
  if (isLogged) {
    privateRoutes = (
      <Switch>
        <Route exact path={Path.ADMIN_HOME} component={Dashboard} />
        <Route exact path={Path.ADMIN_USER_MANAGEMENT} component={UserManagement} />
        <Route exact path={Path.ADMIN_PAGES} component={PageList} />
        <Route exact path={Path.ADMIN_PAGE_CREATE} component={PageCreateOrEdit} />
        <Route exact path={Path.ADMIN_PAGE_EDIT} component={PageCreateOrEdit} />
        <Route exact path={Path.ADMIN_PAGES_REORDER} component={PageReorder} />
        <Route exact path={Path.ADMIN_GALLERY} component={PictureList} />
        <Route exact path={Path.ADMIN_GALLERY_UPLOAD} component={UploadOrEditPicture} />
        <Route exact path={Path.ADMIN_GALLERY_EDIT} component={UploadOrEditPicture} />
        <Route exact path={Path.ADMIN_EVENTS} component={EventList} />
        <Route exact path={Path.ADMIN_EVENTS_ADD} component={EventsCreateOrEdit} />
        <Route exact path={Path.ADMIN_EVENTS_EDIT} component={EventsCreateOrEdit} />
        <Route exact path={Path.ADMIN_FILES} component={FileListAndUpload} />
        <Route exact path={Path.ADMIN_PODCASTS} component={PodcastList} />
        <Route exact path={Path.ADMIN_PODCASTS_ADD} component={PodcastCreateOrEdit} />
        <Route exact path={Path.ADMIN_PODCASTS_EDIT} component={PodcastCreateOrEdit} />
        <Route path="*" component={Error404} />
      </Switch>
    );
    publicRoutes = null;
  }

  // Ignore completely if not in the admin section
  if (!props.location.pathname.startsWith('/admin'))
    return null;

  // JSX
  // Wrap the rendered route in the admin layout
  return (
    <AdminLayout>
      {privateRoutes}
      {publicRoutes}
    </AdminLayout>
  );
};

/**
 * @description Exports the Router component bound to React-Router.
 * @exports
*/
export default withRouter(Router);