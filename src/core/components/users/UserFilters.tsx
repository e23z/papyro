import { Card, CardTitle, CardBody, Form, FormGroup, Label, Input, ButtonGroup, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UnmanagedTooltip from "../shared/UnmanagedTooltip";
import React, { useState, FunctionComponent } from "react";
import { ApprovalStatus } from "../../models/User";
import { faFilter, faUsers, faUserPlus, faUserTimes, faCheck, faEraser } from "@fortawesome/free-solid-svg-icons";

/**
 * @interface UserFiltersProps
 * @description UserFilters component props
 */
interface UserFiltersProps {
  onApply?: (name: string, email: string, approved: ApprovalStatus) => void;
}

/**
 * @function UserFilters
 * @description Filters to refine the user list.
 */
const UserFilters: FunctionComponent<UserFiltersProps> = props => {
  // Overall state of the component
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [approvalStatus, setApprovalStatus] = useState(ApprovalStatus.All);

  // Events
  const cleanForm = () => {
    setName('');
    setEmail('');
    setApprovalStatus(ApprovalStatus.All);
    props.onApply && props.onApply('', '', ApprovalStatus.All);
  };

  // JSX
  return (
    <Card className='filter-card'>
      <CardTitle>
        <FontAwesomeIcon icon={faFilter} /> Filters
      </CardTitle>
      <CardBody>
        <Form>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              type="text"
              placeholder="John Doe" />
          </FormGroup>
          <FormGroup>
            <Label for="name">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              type="email"
              placeholder="john@doe.com" />
          </FormGroup>
          <ButtonGroup className='w-100 mb-3 d-none d-md-flex'>
            <Button
              id='all_status'
              active={approvalStatus === ApprovalStatus.All}
              onClick={() => setApprovalStatus(ApprovalStatus.All)}
              color='secondary'>
              <FontAwesomeIcon icon={faUsers} />
              <UnmanagedTooltip placement="top" target='all_status' hideArrow={true}>
                All Users
              </UnmanagedTooltip>
            </Button>
            <Button
              id='only_approved'
              active={approvalStatus === ApprovalStatus.Approved}
              onClick={() => setApprovalStatus(ApprovalStatus.Approved)}
              color='secondary'>
              <FontAwesomeIcon icon={faUserPlus} />
              <UnmanagedTooltip placement="top" target='only_approved' hideArrow={true}>
                Only Approved
              </UnmanagedTooltip>
            </Button>
            <Button
              id='only_not_approved'
              active={approvalStatus === ApprovalStatus.NotApproved}
              onClick={() => setApprovalStatus(ApprovalStatus.NotApproved)}
              color='secondary'>
              <FontAwesomeIcon icon={faUserTimes} />
              <UnmanagedTooltip placement="top" target='only_not_approved' hideArrow={true}>
                Only not Approved
              </UnmanagedTooltip>
            </Button>
          </ButtonGroup>
          <ButtonGroup className='w-100 mb-3 d-flex d-md-none'>
            <Button
              active={approvalStatus === ApprovalStatus.All}
              onClick={() => setApprovalStatus(ApprovalStatus.All)}
              color='secondary'>
              All
            </Button>
            <Button
              active={approvalStatus === ApprovalStatus.Approved}
              onClick={() => setApprovalStatus(ApprovalStatus.Approved)}
              color='secondary'>
              Approved
            </Button>
            <Button
              active={approvalStatus === ApprovalStatus.NotApproved}
              onClick={() => setApprovalStatus(ApprovalStatus.NotApproved)}
              color='secondary'>
              Not Approved
            </Button>
          </ButtonGroup>
          <ButtonGroup className='w-100'>
            <Button
              onClick={() => props.onApply && props.onApply(name, email, approvalStatus)}
              outline
              color='primary'>
              <FontAwesomeIcon icon={faCheck} /> Apply
            </Button>
            <Button
              onClick={cleanForm}
              outline
              color='secondary'>
              <FontAwesomeIcon icon={faEraser} /> Clear
            </Button>
          </ButtonGroup>
        </Form>
      </CardBody>
    </Card>
  )
};

/**
* @description Exports the UserFilters component.
* @exports
*/
export default UserFilters;