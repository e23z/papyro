import React, { FunctionComponent } from 'react';

/**
 * @interface FooterProps
 * @description Footer component props
 */
interface FooterProps {
  title: string;
}

/**
 * @function Footer
 * @description A simple footer with copyrights.
 * @param FooterProps props The properties for this component.
 */
const Footer: FunctionComponent<FooterProps> = (props) => {
  const year = new Date().getFullYear();

  // JSX
  return (
    <div className="footer">
      &copy; Copyrights {year} - {props.title}. All rights reserved.
    </div>
  );
};

/**
* @description Exports the Footer component.
* @exports
*/
export default Footer;