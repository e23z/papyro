import React, { FunctionComponent } from "react";

/**
 * @interface VerticalFormSeparatorProps
 * @description VerticalFormSeparator component props
 */
interface VerticalFormSeparatorProps {
  className?: string;
}

/**
 * @function VerticalFormSeparator
 * @description Component that draws a vertical separation line
 * between content with an 'or' text.
 * @param VerticalFormSeparatorProps props The properties for this component.
 */
const VerticalFormSeparator: FunctionComponent<VerticalFormSeparatorProps> = (props) =>
  <div className={"vertical-form-separator " + (props.className ? props.className : '')} />;

/**
* @description Exports the VerticalFormSeparator component.
* @exports
*/
export default VerticalFormSeparator;