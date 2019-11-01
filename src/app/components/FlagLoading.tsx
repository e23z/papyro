import React from 'react';
import '../styles/css/flagloading.css';

/**
 * @function FlagLoading
 * @description An animated loading component.
 * @copyright Credit: https://www.cssscript.com/111-css-country-flags
 */
const FlagLoading = () => (
  <div className='flags-wrapper'>
    <div className='anim-flags'>
      <div className='holder inverse left-flag'>
        <div className='flag nepal'></div>
      </div>
      <div className='holder right-flag'>
        <div className='flag new-zealand'>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
);

/**
* @description Exports the FlagLoading component.
* @exports
*/
export default FlagLoading;