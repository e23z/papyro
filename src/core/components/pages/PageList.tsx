import React, { useState, FunctionComponent, useContext } from 'react';
import { Container, Row, Col, Table, Button } from 'reactstrap';
import Toggle from 'react-toggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faLink, faPen, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import UnmanagedTooltip from '../shared/UnmanagedTooltip';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import PageFilters from './PageFilters';
import SweetAlert from 'sweetalert-react';
import { RoutingProps } from '../../routing/interfaces';
import { ADMIN_PAGE_CREATE, ADMIN_PAGE_EDIT } from '../../routing/routes';
import { GlobalContext } from '../../utils/globalState';
import { MenuItem, MenuPosition } from '../../models/CMS';
import { PageRepo } from '../../models/Page';

/**
 * @interface PageListProps
 * @description PageList component props
 */
interface PageListProps extends RoutingProps {
}

/**
 * @function PageList
 * @description The list of pages that this website has.
 */
const PageList: FunctionComponent<PageListProps> = props => {
  // Overall state of the component
  const [flaggedToDelete, setFlaggedToDelete] = useState<string | undefined>(undefined);
  const { cms, setCMS } = useContext(GlobalContext);
  const [pages, setPages] = useState(cms.menuItems);

  // Events
  const flagToDelete = (e: any, id: string | undefined) => {
    e.currentTarget.blur();
    setFlaggedToDelete(id);
  }

  const cancelDelete = () => setFlaggedToDelete(undefined);

  const confirmDelete = async () => {
    if (flaggedToDelete) {
      await PageRepo.Instance.Delete(flaggedToDelete);
      cms.menuItems = cms.menuItems.filter(m => m.pageId !== flaggedToDelete);
      setCMS(cms);
      //TODO!: Remove this workaround because the cms is not triggering an update.
      filter('');
    }
    setFlaggedToDelete(undefined);
  }

  const togglePageDisplay = async (id: string | undefined, visible: boolean) => {
    if (!id) return;

    const menuItems = new Array();
    let menuItem: any = null;

    cms.menuItems.forEach(m => {
      if (m.pageId === id) menuItem = { ...m };
      else menuItems.push({ ...m });
    });
    menuItem.position = visible ? MenuPosition.Top : MenuPosition.None;

    const page = { id: menuItem.pageId, menuDetails: { position: menuItem.position } };

    await PageRepo.Instance.UnsafeUpdate(page);
    cms.menuItems = [menuItem].concat([...menuItems]);
    setCMS(cms);
  };

  const filter = (title: string) => {
    setPages(cms.menuItems.filter(m =>
      !title ||
      m.pageTitle.toLowerCase().indexOf(title.toLowerCase()) !== -1 ||
      m.title.toLowerCase().indexOf(title.toLowerCase()) !== -1
    ));
  };

  // Prepare the page table display
  let data: any = pages
    .sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1)
    .map((item: MenuItem) => (
      <tr key={item.pageId}>
        <td>{item.pageTitle}</td>
        <td className='d-none d-md-table-cell collapsing'>{item.title}</td>
        <td className='d-none d-md-table-cell toggle-cell'>
          <Toggle
            defaultChecked={item.position !== MenuPosition.None}
            onChange={(e) => togglePageDisplay(item.pageId, e.target.checked)}
          />
        </td>
        <td className='collapsing'>
          <ButtonGroup>
            <Button
              onClick={() => props.history.push(`/${item.permalink}`)}
              id={`lnk-${item.pageId}`}
              color='success'
              outline>
              <FontAwesomeIcon icon={faLink} />
              <UnmanagedTooltip placement="top" target={`lnk-${item.pageId}`} hideArrow={true}>
                Go to Page
              </UnmanagedTooltip>
            </Button>
            <Button
              onClick={() => props.history.push(ADMIN_PAGE_EDIT.replace(':id', item.pageId || ''))}
              id={`edt-${item.pageId}`}
              color='primary'
              outline>
              <FontAwesomeIcon icon={faPen} />
              <UnmanagedTooltip placement="top" target={`edt-${item.pageId}`} hideArrow={true}>
                Edit
              </UnmanagedTooltip>
            </Button>
            <Button
              onClick={(e: any) => flagToDelete(e, item.pageId)}
              id={`del-${item.pageId}`}
              color='danger'
              outline>
              <FontAwesomeIcon icon={faTrash} />
              <UnmanagedTooltip placement="top" target={`del-${item.pageId}`} hideArrow={true}>
                Delete
              </UnmanagedTooltip>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    ));
  
  if (pages.length === 0)
    data = (
      <tr>
        <td colSpan={4} className='text-center'>
          No pages registered so far or found with the filters.
        </td>
      </tr>
    );

  // JSX
  return (
    <>
      <SweetAlert
        animation='slide-from-bottom'
        confirmButtonColor='#dc3545'
        show={!!flaggedToDelete}
        title="Careful!"
        type='warning'
        showCancelButton
        confirmButtonText='YES, delete page'
        cancelButtonText='NO, cancel'
        text='Are you sure you want to delete this page?'
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        onEscapeKey={cancelDelete}
        onOutsideClick={cancelDelete}
      />
      <Container fluid className='flex-fill'>
        <Row>
          <Col>
            <h3 className='page-title'>Page Management</h3>
          </Col>
        </Row>
        <Row>
          <Col md={4} lg={3}>
            <div className='w-100 mb-3'>
              <Button
                block
                onClick={() => props.history.push(ADMIN_PAGE_CREATE)}
                color='primary'>
                <FontAwesomeIcon icon={faPlusCircle} /> New Page
              </Button>
            </div>
            <PageFilters onApply={filter} />
          </Col>
          <Col>
            <Table striped className='mt-3 mt-md-0'>
              <thead>
                <tr>
                  <th>Title</th>
                  <th className='d-none d-md-table-cell text-center'>Menu</th>
                  <th className='d-none d-md-table-cell collapsing'>Visible</th>
                  <th className='text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data}
              </tbody>
            </Table>
            {/* <div className='text-center'>
            <Button color='success'>
              <FontAwesomeIcon icon={faSpinner} /> Load More
            </Button>
          </div> */}
          </Col>
        </Row>
      </Container>
    </>
  );
}

/**
* @description Exports the PageList component.
* @exports
*/
export default PageList;