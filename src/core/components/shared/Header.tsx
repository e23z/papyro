import React, { FunctionComponent, useState, useContext } from 'react';
import {
  Collapse, Navbar, NavbarToggler, Nav, NavItem,
  UncontrolledDropdown, DropdownToggle, DropdownMenu,
  DropdownItem, NavLink as Link
} from 'reactstrap';
import { NavLink, withRouter } from "react-router-dom";
import {
  ADMIN_HOME, ADMIN_USER_MANAGEMENT, ADMIN_PAGES,
  ADMIN_PAGES_REORDER, ADMIN_PAGE_CREATE, ADMIN_GALLERY,
  ADMIN_GALLERY_UPLOAD, ADMIN_EVENTS, ADMIN_EVENTS_ADD, ADMIN_FILES, ADMIN_PODCASTS_ADD
} from '../../routing/routes';
import { AuthContext } from '../../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSignOutAlt, faUsers, faCode, faListUl, faPlusCircle,
  faSort, faCameraRetro, faCalendar, faCalendarAlt, faCalendarPlus, faUpload, faImages, faFileAlt, faPodcast, faMicrophone, faBroadcastTower
} from '@fortawesome/free-solid-svg-icons';
import { signOut } from '../../api/authApi';
import { ADMIN_PODCASTS } from '../../routing/routes';
import { RoutingProps } from '../../routing/interfaces';
import DropdownWrapper from './DropdownWrapper';

/**
 * @interface HeaderProps
 * @description Header component props
 */
interface HeaderProps extends RoutingProps {
  logoPath: string;
  title: string;
}

/**
 * @function Header
 * @description The admin default header.
 * @param HeaderProps props The properties for this component.
 */
const Header: FunctionComponent<HeaderProps> = (props) => {
  // Overall state of the component
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLogged, currUser } = useContext(AuthContext);
  const [currLocation, setCurrLocation] = useState(props.location.pathname);

  if (props.location.pathname !== currLocation) {
    setCurrLocation(props.location.pathname);
    setTimeout(() => setIsMenuOpen(false), 200);
  }

  // Show or hide the menu according to the user auth state
  let menu = null;

  if (isLogged && currUser) {
    menu = (
      <>
        <NavbarToggler onClick={() => setIsMenuOpen(!isMenuOpen)} />
        <Collapse isOpen={isMenuOpen} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink to={ADMIN_USER_MANAGEMENT} exact className='nav-link'>
                <FontAwesomeIcon icon={faUsers} /> Users
              </NavLink>
            </NavItem>

            <DropdownWrapper
              history={props.history}
              location={props.location}
              match={props.match}>
              <DropdownToggle nav caret>
                <FontAwesomeIcon icon={faCode} /> Pages
              </DropdownToggle>
              <DropdownMenu right>
                <NavLink to={ADMIN_PAGES} exact className="dropdown-item">
                  <FontAwesomeIcon icon={faListUl} /> Page List
                </NavLink>
                <NavLink to={ADMIN_PAGE_CREATE} exact className="dropdown-item">
                  <FontAwesomeIcon icon={faPlusCircle} /> Add Page
                </NavLink>
                <DropdownItem divider />
                <NavLink to={ADMIN_PAGES_REORDER} exact className="dropdown-item">
                  <FontAwesomeIcon icon={faSort} /> Reorder Pages
                </NavLink>
              </DropdownMenu>
            </DropdownWrapper>
            
            <DropdownWrapper
              history={props.history}
              location={props.location}
              match={props.match}>
              <DropdownToggle nav caret>
                <FontAwesomeIcon icon={faCalendar} /> Events
              </DropdownToggle>
              <DropdownMenu right>
                <NavLink to={ADMIN_EVENTS} exact className="dropdown-item">
                  <FontAwesomeIcon icon={faCalendarAlt} /> List Events
                </NavLink>
                <NavLink to={ADMIN_EVENTS_ADD} exact className="dropdown-item">
                  <FontAwesomeIcon icon={faCalendarPlus} /> Create Event
                </NavLink>
              </DropdownMenu>
            </DropdownWrapper>
            
            <DropdownWrapper
              history={props.history}
              location={props.location}
              match={props.match}>
              <DropdownToggle nav caret>
                <FontAwesomeIcon icon={faCameraRetro} /> Gallery
              </DropdownToggle>
              <DropdownMenu right>
                <NavLink to={ADMIN_GALLERY} exact className="dropdown-item">
                  <FontAwesomeIcon icon={faImages} /> Pictures
                </NavLink>
                <NavLink to={ADMIN_GALLERY_UPLOAD} exact className="dropdown-item">
                  <FontAwesomeIcon icon={faUpload} /> Upload Picture
                </NavLink>
              </DropdownMenu>
            </DropdownWrapper>
            
            <NavItem>
              <NavLink to={ADMIN_FILES} exact className='nav-link'>
                <FontAwesomeIcon icon={faFileAlt} /> Files
              </NavLink>
            </NavItem>

            <DropdownWrapper
              history={props.history}
              location={props.location}
              match={props.match}>
              <DropdownToggle nav caret>
                <FontAwesomeIcon icon={faPodcast} /> Podcasts
              </DropdownToggle>
              <DropdownMenu right>
                <NavLink to={ADMIN_PODCASTS} exact className="dropdown-item">
                  <FontAwesomeIcon icon={faBroadcastTower} /> List Podcasts
                </NavLink>
                <NavLink to={ADMIN_PODCASTS_ADD} exact className="dropdown-item">
                  <FontAwesomeIcon icon={faMicrophone} /> Add Podcast
                </NavLink>
              </DropdownMenu>
            </DropdownWrapper>
          </Nav>

          <Nav navbar className='ml-auto'>
            <NavItem className='d-none d-md-flex navbar-item-user'>
              Welcome, <b>{currUser.name}</b>
            </NavItem>
            <NavItem>
              <Link
                href='#'
                onClick={() => {
                  props.history.push(ADMIN_HOME);
                  signOut();
                }}
                className='nav-link'>
                <div className='d-block d-md-none'>
                  Sign Out
                </div>
                <div className='d-none d-md-block'>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </div>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </>
    );
  }

  // JSX
  return (
    <Navbar color="light" light expand="md">
      <NavLink to={ADMIN_HOME} className="navbar-brand">
        <img src={props.logoPath} />
        {props.title}
      </NavLink>
      {menu}
    </Navbar>
  );
};

/**
* @description Exports the Header component.
* @exports
*/
export default withRouter(Header);