import React, { FunctionComponent, useState } from 'react';
import { Dropdown } from 'reactstrap';
import { RoutingProps } from '../../routing/interfaces';

/**
 * @interface DropdownWrapperProps
 * @description DropdownWrapper component props
 */
interface DropdownWrapperProps extends RoutingProps {
}

/**
 * @function DropdownWrapper
 * @description The Header
 * @param HeaderProps props The properties for this component.
 */
const DropdownWrapper: FunctionComponent<DropdownWrapperProps> = props => {
  const [isOpen, setIsOpen] = useState(false);
  const [currLocationKey, setCurrLocationKey] = useState(props.location.key);

  if (props.location.key !== currLocationKey) {
    setCurrLocationKey(props.location.key);
    setTimeout(() => setIsOpen(false), 100);
  }

  return (
    <Dropdown nav inNavbar isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
      {props.children}
    </Dropdown>
  );
};

export default DropdownWrapper;