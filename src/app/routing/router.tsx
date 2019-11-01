import React, { useContext } from 'react';
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Layout from '../components/Layout';
import { RoutingProps } from '../../core/routing/interfaces';
import Error404 from '../components/Error404';
import { GlobalContext } from '../../core/utils/globalState';
import Home from '../components/Home';
import Page from '../components/Page';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import BecomeMember from '../components/BecomeMember';
import Podcasts from '../components/Podcasts';

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
  const { cms } = useContext(GlobalContext);

  // Ignore completely if not in the admin section
  if (props.location.pathname.startsWith('/admin'))
    return null;

  // JSX
  // Wrap the rendered route in the layout
  return (
    <Layout>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/gallery' exact component={Gallery} />
        <Route path='/contact' exact component={Contact} />
        <Route path='/become-member' exact component={BecomeMember} />
        <Route path='/radio' exact component={Podcasts} />
        <Route path='/' exact component={Home} />
        {cms.menuItems.map((m, i) => <Route path={`/${m.permalink}`} key={i} exact render={() => <Page />} />)}
        <Route path="*" component={Error404} />
      </Switch>
    </Layout>
  );
};

/**
 * @description Exports the Router component bound to React-Router.
 * @exports
*/
export default withRouter(Router);