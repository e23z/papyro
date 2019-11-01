import React, { useContext, FunctionComponent, useState } from 'react';
import {
  Container, Row, Col, NavbarToggler, Collapse, Nav, NavItem,
  DropdownToggle, DropdownMenu, Navbar,
  NavLink as NavLinkItem} from 'reactstrap';
import { GlobalContext } from '../../core/utils/globalState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitterSquare, faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import { NavLink, withRouter } from 'react-router-dom';
import { MenuItem, MenuPosition } from '../../core/models/CMS';
import { RoutingProps } from '../../core/routing/interfaces';
import DropdownWrapper from '../../core/components/shared/DropdownWrapper';

/**
 * @interface HeaderProps
 * @description Header component props
 */
interface HeaderProps extends RoutingProps {
  logoPath: string;
  title: string;
  facebook: string;
  twitter: string;
}

/**
 * @function Header
 * @description The Header
 * @param HeaderProps props The properties for this component.
 */
const Header: FunctionComponent<HeaderProps> = props => {
  // Overall state of the component
  const { cms } = useContext(GlobalContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currLocation, setCurrLocation] = useState(props.location.pathname);

  if (props.location.pathname !== currLocation) {
    setCurrLocation(props.location.pathname);
    setTimeout(() => setIsMenuOpen(false), 100);
  }

  // Setting up the menu items
  const menuItems = cms.menuItems
    .sort((a, b) => (a.parentId || '') > (b.parentId || '') ? 1 : -1)
    .reduce((acc: any, curr: MenuItem) => {
      const key = curr.pageId || '';

      if (!acc[key] && !curr.parentId) acc[key] = { item: curr, children: new Array() };
      else if (curr.parentId) acc[curr.parentId].children.push(curr);

      return acc;
    }, {});

  // JSX
  return (
    <Container className='header-container'>
      <Row>
        <Col sm={12} className='order-2 order-md-1'>
          {/* HEADER */}
          <div className='header px-0'>
            <img src={props.logoPath} />
            <div className='title'>
              <ul>
                {/* <li>
                  <a href={props.twitter} className='twitter'><FontAwesomeIcon icon={faTwitterSquare} /></a>
                </li> */}
                <li>
                  <a href={props.facebook} className='facebook'><FontAwesomeIcon icon={faFacebookSquare} /></a>
                </li>
              </ul>
              <h1>{props.title}</h1>
            </div>
          </div>
        </Col>
        {/* MENU */}
        <Col sm={12} className='order-1 order-md-2 nav-container'>
          <Navbar expand="md" className='px-0 navbar-light bg-light'>
            <NavbarToggler onClick={() => setIsMenuOpen(!isMenuOpen)} />
            <Collapse isOpen={isMenuOpen} navbar>
              <Nav navbar>
                <NavItem >
                  <NavLinkItem>
                    &nbsp;
                  </NavLinkItem>
                </NavItem>
                <NavItem>
                  <NavLink to='/' exact className='nav-link'>Home</NavLink>
                </NavItem>
                {
                  Object.getOwnPropertyNames(menuItems)
                    .map(k => menuItems[k])
                    .sort((a, b) => a.item.sort > b.item.sort ? 1 : -1)
                    .map(menuItem => {
                      if (menuItem.item.position === MenuPosition.None || menuItem.item.position === MenuPosition.Bottom)
                        return;
                      if (menuItem.children.length === 0)
                        return (
                          <NavItem key={menuItem.item.pageId}>
                            <NavLink to={`/${menuItem.item.permalink}`} exact className='nav-link'>
                              {menuItem.item.title}
                            </NavLink>
                          </NavItem>
                        );
                      return (
                        <DropdownWrapper
                          key={menuItem.item.pageId}
                          history={props.history}
                          location={props.location}
                          match={props.match}>
                          <DropdownToggle nav caret>
                            {menuItem.item.title}
                          </DropdownToggle>
                          <DropdownMenu>
                            {
                              menuItem.children
                                .sort((a: any, b: any) => a.sort > b.sort ? 1 : -1)
                                .map((subItem: MenuItem) => (
                                  <NavLink
                                    key={subItem.pageId}
                                    to={`/${subItem.permalink}`}
                                    exact
                                    className="dropdown-item">
                                    {subItem.title}
                                  </NavLink>
                                ))
                            }
                          </DropdownMenu>
                        </DropdownWrapper>
                      );
                    })
                }
                <NavItem >
                  <NavLinkItem>
                    &nbsp;
                  </NavLinkItem>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </Col>
      </Row>
    </Container>
  );
}

/**
* @description Exports the Header component.
* @exports
*/
export default withRouter(Header);