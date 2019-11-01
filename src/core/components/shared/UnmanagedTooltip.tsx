import React, { useState, FunctionComponent } from 'react';
import { Tooltip } from 'reactstrap';

/**
 * @function UnmanagedTooltip
 * @description A tooltip that appears when the user hovers the item.
 * @param props {any} - Any params that you would pass to reactstrap tooltip element.
 */
const UnmanagedTooltip: FunctionComponent<any> = (props) => {
  // Overall state
  const [isOpen, setIsOpen] = useState(false);

  // JSX
  return (
    <Tooltip {...props} isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} delay={.2}>
      {props.children}
    </Tooltip>
  );
}

/**
* @description Exports the UnmanagedTooltip component.
* @exports
*/
export default UnmanagedTooltip;