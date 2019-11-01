import React, { FunctionComponent, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import UnmanagedTooltip from '../shared/UnmanagedTooltip';
import { UserRepo, User, ApprovalStatus } from '../../models/User';
import Loading from '../shared/Loading';
import UserFilters from './UserFilters';
import SweetAlert from 'sweetalert-react';

/**
 * @function UserManagement
 * @description Lists all users and allow general management actions.
 */
const UserManagement: FunctionComponent = () => {
  // Overall state of the component
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [users, setUsers] = useState(new Array<User>());
  const [unfilteredUsers, setUnfilteredUsers] = useState(new Array<User>());
  const [flaggedToDelete, setFlaggedToDelete] = useState<string | undefined>(undefined);

  // Load users and wait for modifications
  useEffect(() => {
    const unsubscribe = UserRepo.Instance.Subscribe(docs => {
      setUsersLoaded(true);
      setUsers(docs);
      setUnfilteredUsers(docs);
    });
    return () => unsubscribe();
  }, []);

  // Events
  const updateUserApproval = (id: string | undefined, approved: boolean) => {
    if (!id) return;
    UserRepo.Instance.SetApprovalStatus(id, approved);
  };

  const filter = (name: string, email: string, approved: ApprovalStatus) => {
    setUsers(unfilteredUsers.filter(user => {
      return (!name || user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1) &&
        (!email || user.email.toLowerCase().indexOf(email.toLowerCase()) !== -1) &&
        (
          approved === ApprovalStatus.All ||
          (user.approved && approved === ApprovalStatus.Approved) ||
          (!user.approved && approved === ApprovalStatus.NotApproved)
        );
    }));
  };

  const remove = (id: string | undefined) => {
    if (!id) return;
    UserRepo.Instance.Delete(id);
  };

  const flagToDelete = (e: any, id: string | undefined) => {
    e.currentTarget.blur();
    setFlaggedToDelete(id);
  }

  const cancelDelete = () => setFlaggedToDelete(undefined);

  const confirmDelete = () => {
    remove(flaggedToDelete);
    setFlaggedToDelete(undefined);
  }

  // Prepare the user table display
  // Default to loading
  let data: any = (
    <tr>
      <td colSpan={4} className='text-center'>
        <Loading />
      </td>
    </tr>
  );

  // If the user list was loaded
  if (usersLoaded) {
    // If the user list is not empty
    if (users.length > 0) {
      data = users.map((user: User, i: number) => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td className='d-none d-md-table-cell'>{user.email}</td>
          <td className='toggle-cell'>
            <Toggle
              checked={user.approved}
              onChange={(e) => updateUserApproval(user.id, e.target.checked)} />
          </td>
          <td>
            <Button
              onClick={(e: any) => flagToDelete(e, user.id)}
              id={`del-${i}`}
              color='danger'
              outline>
              <FontAwesomeIcon icon={faTrash} />
              <UnmanagedTooltip placement="top" target={`del-${i}`} hideArrow={true}>
                Delete
              </UnmanagedTooltip>
            </Button>
          </td>
        </tr>
      ));
    }
    // Show empty list text
    else {
      data = (
        <tr>
          <td colSpan={4} className='text-center'>
            No users registered so far or found with the filters.
          </td>
        </tr>
      );
    }
  }

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
        confirmButtonText='YES, delete user'
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
            <h3 className='page-title'>User Management</h3>
          </Col>
        </Row>
        <Row>
          <Col md={4} lg={3}>
            <UserFilters onApply={filter} />
          </Col>
          <Col>
            <Table striped className='mt-3 mt-md-0'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th className='d-none d-md-table-cell'>Email</th>
                  <th className='collapsing'>Approved</th>
                  <th className='collapsing'>Actions</th>
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
  )
};

/**
* @description Exports the UserManagement component.
* @exports
*/
export default UserManagement;