import React, { FunctionComponent } from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import UnmanagedTooltip from '../shared/UnmanagedTooltip';
import '../../styles/css/gallery.css';
import { Picture } from '../../models/CMS';

/**
 * @interface PictureListColumnProps
 * @description PictureListColumn component props
 */
interface PictureListColumnProps {
  items: Picture[];
  column: number;
  onEdit: (item: Picture) => void;
  onDelete: (item: Picture) => void;
}

/**
 * @function PictureListColumn
 * @description The list of items printed in each column of the gallery.
 */
const PictureListColumn: FunctionComponent<PictureListColumnProps> = props => (
  <>
    {
      props.items.map((pic: Picture) => {
        const id = `${pic.id}-${props.column}`;
        return (
          <div key={pic.id}>
            <img src={pic.downloadUrl} className='img-fluid' />
            <p>{pic.title}</p>
            <Button
              size='sm'
              onClick={() => { props.onDelete && props.onDelete(pic) }}
              id={`del-${pic.id}`}
              color='danger'>
              <FontAwesomeIcon icon={faTrash} />
              <UnmanagedTooltip placement="top" target={`del-${pic.id}`} hideArrow={true}>
                Delete
              </UnmanagedTooltip>
            </Button>
            <Button
              size='sm'
              onClick={() => { props.onEdit && props.onEdit(pic) }}
              id={`edt-${pic.id}`}
              color='primary'>
              <FontAwesomeIcon icon={faPen} />
              <UnmanagedTooltip placement="top" target={`edt-${pic.id}`} hideArrow={true}>
                Edit
              </UnmanagedTooltip>
            </Button>
          </div>
        );
      })
    }
  </>
);

/**
* @description Exports the PictureList component.
* @exports
*/
export default PictureListColumn;