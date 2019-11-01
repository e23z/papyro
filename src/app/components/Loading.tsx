import React, { FunctionComponent } from 'react';

/**
 * @interface LoadingProps
 * @description Loading component props
 */
interface LoadingProps {
  showText?: boolean;
}

/**
 * @function Loading
 * @description An animated loading component.
 * @copyright Credit: https://dribbble.com/shots/5092176-Newton-Loader
 */
const Loading: FunctionComponent<LoadingProps> = props => (
  <div className='gooey-loading'>
    <div className="gooey">
      <span className="dot"></span>
      <div className="dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    {props.showText ? <p>loading</p> : null}
  </div>
);

/**
* @description Exports the Loading component.
* @exports
*/
export default Loading;