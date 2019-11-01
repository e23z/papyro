import React, { FunctionComponent, useState, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Input } from 'reactstrap';
import '../../styles/css/image.css';
import { uploadFile, UploadEvent, UploadStatus } from '../../api/fileApi';
import { getExtension } from '../../utils/utils';
import Button from 'reactstrap/lib/Button';
import UnmanagedTooltip from './UnmanagedTooltip';

/**
 * @interface LoadingProps
 * @description The properties of the uploading animation.
 */
interface LoadingProps {
  percentage: number;
}

/**
 * @func Loading
 * @description The file upload animation.
 */
const Loading: FunctionComponent<LoadingProps> = props => (
  <>
    <div className="loading-image">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <small>Uploading ({props.percentage}%)</small>
  </>
);

/**
 * @interface Image
 * @description Image component props
 */
interface ImageProps {
  src?: string | undefined;
  onChange?: (fileName: string, imageUrl: string) => void;
  onUpload?: (id: string, downloadUrl: string, filePath: string) => void;
  autoUpload?: boolean;
  uploadPath?: string;
  showDeleteBtn?: boolean;
}

/**
 * @function Image
 * @description A component to display images or image placeholders if no source is given.
 * @param props {ImageProps} - The props for this component.
 */
const Image: FunctionComponent<ImageProps> = props => {
  // Overall state of the component
  const [tmpId] = useState(Math.round(new Date().getTime() / 1000) * Math.round(Math.random() * 1000));
  const [file, setFile] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  // Events
  const onChange = (e: any) => {
    const filename = e.target.value;
    const file = e.target.files && e.target.files[0];

    if (!filename || !file)
      return;

    const imageUrl = URL.createObjectURL(file);

    setFile(filename);
    setImage(imageUrl);

    if (props.autoUpload) {
      setLoading(true);
      setPercentage(0);
      upload(file);
    }

    props.onChange && props.onChange(filename, imageUrl);
  };

  const upload = (file: any) => {
    const ext = getExtension(file.name);
    uploadFile(file, `${tmpId}.${ext}`, props.uploadPath, (e: UploadEvent) => {
      switch (e.status) {
        case UploadStatus.Uploading:
          setPercentage(e.progress || 0);
          break;
        case UploadStatus.Complete:
          setLoading(false);
          props.onUpload && props.onUpload(tmpId.toString(), e.downloadUrl || '', `${props.uploadPath}/${tmpId}.${ext}`);
          break;
        default:
          break;
      }
    });
  };

  // Simple content management
  let content: any = null;
  let deleteBtn: any = null;

  if (loading)
    content = (
      <div className="sample">
        <Loading percentage={percentage} />
      </div>
    );
  else if (image || props.src)
    content = (
      <div className="sample">
        <img src={props.src || image} />
      </div>
    );

  if (props.showDeleteBtn && (image || props.src))
    deleteBtn = (
      <Button
        size='sm'
        onClick={(e: FormEvent) => {
          e.preventDefault();
          setFile('');
          setImage(undefined);
          props.onUpload && props.onUpload(tmpId.toString(), '', '');
        }}
        id={`del-${tmpId}`}
        color='danger'>
        <FontAwesomeIcon icon={faTrash} />
        <UnmanagedTooltip placement="top" target={`del-${tmpId}`} hideArrow={true}>
          Delete
        </UnmanagedTooltip>
      </Button>
    );

  // JSX
  return (
    <div className='image'>
      <FontAwesomeIcon icon={faImages} />
      <small>Click to Upload</small>
      {content}
      {deleteBtn}
      <Input
        value={file}
        onChange={onChange}
        id='cover'
        type='file' />
    </div>
  );
}

/**
 * @description Defaults for the image properties
 */
Image.defaultProps = {
  autoUpload: false,
  uploadPath: '/tmp'
};

/**
* @description Exports the Image component.
* @exports
*/
export default Image;