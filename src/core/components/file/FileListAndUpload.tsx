import React, { FunctionComponent, useState, useContext } from 'react';
import { Container, Row, Col, Button, Table, ButtonGroup, Input } from 'reactstrap';
import { RoutingProps } from '../../routing/interfaces';
import SweetAlert from 'sweetalert-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUpload, faCopy, faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import UnmanagedTooltip from '../shared/UnmanagedTooltip';
import FileFilters from './FileFilters';
import '../../styles/css/files.css';
import { GlobalContext } from '../../utils/globalState';
import { FileRef } from '../../models/CMS';
import { getExtension, copyToClipboard } from '../../utils/utils';
import { uploadFile, UploadEvent, UploadStatus, deleteFile } from '../../api/fileApi';

/**
 * @interface FileListAndUploadProps
 * @description FileListAndUpload component props
 */
interface FileListAndUploadProps extends RoutingProps {
}

/**
 * @function FileListAndUpload
 * @description The list of events that should be displayed to users.
 */
const FileListAndUpload: FunctionComponent<FileListAndUploadProps> = () => {
  // Overall state of the component
  const { cms, setCMS } = useContext(GlobalContext);
  const [files, setFiles] = useState(cms.files);
  const [flaggedToDelete, setFlaggedToDelete] = useState<string | undefined>(undefined);
  const [uploading, setUploading ] = useState(false);

  // Events
  const flagToDelete = (e: any, id: string | undefined) => {
    e.currentTarget.blur();
    setFlaggedToDelete(id);
  }

  const cancelDelete = () => setFlaggedToDelete(undefined);

  const confirmDelete = async () => {
    if (flaggedToDelete) {
      await deleteFile(flaggedToDelete);
      cms.files = cms.files.filter(m => m.path !== flaggedToDelete);
      setCMS(cms);
      //TODO!: Remove this workaround because the cms is not triggering an update.
      filter('', '');
    }
    setFlaggedToDelete(undefined);
  }

  const filter = (name: string, ext: string) => {
    setFiles(cms.files.filter(f =>
      (!name || f.name.toLowerCase().indexOf(name.toLowerCase()) !== -1) &&
      (!ext || f.extension === ext)
    ));
  };

  const onSelectFileToUpload = (e: any) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    uploadFile(file, file.name, '/files', (e: UploadEvent) => {
      if (e.status === UploadStatus.Complete) {
        const ext = getExtension(file.name);
        const downloadUrl = e.downloadUrl || '';
        setUploading(false);
        cms.files = ([{
          name: file.name,
          extension: ext,
          path: `/files/${file.name}`,
          downloadUrl: downloadUrl
        } as FileRef]).concat(cms.files);
        setCMS(cms);
        //TODO!: Remove this workaround because the cms is not triggering an update.
        filter('', '');
      }
    });
  };


  // Basic layout setup
  // Prepare the files table display
  let data: any = files
    .map((file: FileRef, i: number) => (
      <tr key={i}>
        <td>{file.name}</td>
        <td className='collapsing'>
          <ButtonGroup>
            <Button
              onClick={() => copyToClipboard(file.downloadUrl)}
              id={`cpy-${i}`}
              color='success'
              outline>
              <FontAwesomeIcon icon={faCopy} />
              <UnmanagedTooltip placement="top" target={`cpy-${i}`} hideArrow={true}>
                Copy Download URL
              </UnmanagedTooltip>
            </Button>
            <Button
              onClick={() => window.open(file.downloadUrl, '_blank')}
              id={`dwn-${i}`}
              color='secondary'
              outline>
              <FontAwesomeIcon icon={faDownload} />
              <UnmanagedTooltip placement="top" target={`dwn-${i}`} hideArrow={true}>
                Download File
              </UnmanagedTooltip>
            </Button>
            <Button
              onClick={(e: any) => flagToDelete(e, file.path)}
              id={`del-${i}`}
              color='danger'
              outline>
              <FontAwesomeIcon icon={faTrash} />
              <UnmanagedTooltip placement="top" target={`del-${i}`} hideArrow={true}>
                Delete
              </UnmanagedTooltip>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    ));
  
  if (files.length === 0)
    data = (
      <tr>
        <td colSpan={2} className='text-center'>
          No files uploaded so far or found with the filters.
        </td>
      </tr>
    );
  
  // Update the upload button text
  const uploadText = uploading ?
    <FontAwesomeIcon icon={faSpinner} spin /> :
    <><FontAwesomeIcon icon={faUpload} /> Upload File</>;

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
        confirmButtonText='YES, delete file'
        cancelButtonText='NO, cancel'
        text='Are you sure you want to delete this file?'
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        onEscapeKey={cancelDelete}
        onOutsideClick={cancelDelete}
      />
      <Container fluid className='flex-fill'>
        <Row>
          <Col>
            <h3 className='page-title'>Files Management</h3>
          </Col>
        </Row>
        <Row>
          <Col md={4} lg={3}>
            <div className='w-100 mb-3 file-upload'>
              <Button
                disabled={uploading}
                block
                color='primary'>
                {uploadText}
              </Button>
              <Input
                disabled={uploading}
                onChange={onSelectFileToUpload}
                id='cover'
                type='file' />
            </div>
            <FileFilters onApply={filter} />
          </Col>
          <Col>
            <Table striped className='mt-3 mt-md-0'>
              <thead>
                <tr>
                  <th>Filename</th>
                  <th className='text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

/**
* @description Exports the FileListAndUpload component.
* @exports
*/
export default FileListAndUpload;