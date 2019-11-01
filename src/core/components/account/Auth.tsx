import { withRouter } from "react-router";
import { FunctionComponent } from "react";
import { RoutingProps } from '../../routing/interfaces';
import queryString from 'query-string';
import { ADMIN_RESET_PASSWORD } from '../../routing/routes';

/**
 * @interface Auth
 * @description Auth component props
 */
interface AuthProps extends RoutingProps {
}

/**
 * @function Auth
 * @description Component that handles authentication requests
 * and redirects the user to the correspondent page.
 * @param AuthProps props The properties for this component.
 */
const Auth: FunctionComponent<AuthProps> = (props) => {
  const authQs = queryString.parse(props.location.search);
  const redirectQs = queryString.stringify({ code: authQs.oobCode });
  props.history.push({ pathname: ADMIN_RESET_PASSWORD, search: redirectQs });
  return null;
};

/**
 * @description Exports the Auth Component bound to React-Router.
 * @exports
*/
export default withRouter(Auth);