import { Card, CardTitle, CardBody, Form, FormGroup, Label, Input, ButtonGroup, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, FunctionComponent, useContext } from "react";
import { faFilter, faCheck, faEraser } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import { GlobalContext } from "../../utils/globalState";

/**
 * @interface FileFiltersProps
 * @description FileFilters component props
 */
interface FileFiltersProps {
  onApply?: (name: string, ext: string) => void;
}

/**
 * @function FileFilters
 * @description Filters to refine the user list.
 */
const FileFilters: FunctionComponent<FileFiltersProps> = props => {
  // Overall state of the component
  const [name, setName] = useState('');
  const [ext, setExt] = useState<any>(null);
  const { cms } = useContext(GlobalContext);

  // Events
  const cleanForm = () => {
    setName('');
    setExt(null);
    props.onApply && props.onApply('', '');
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
              placeholder="What file you're looking for?" />
          </FormGroup>
          <FormGroup>
            <Label for="ext">Extension</Label>
            <Select
              placeholder="Which extension to filter?"
              onChange={value => setExt(value as any)}
              value={ext}
              options={cms.files.map(f => ({ value: f.extension || '', label: `.${f.extension}` }))} />
          </FormGroup>
          <ButtonGroup className='w-100'>
            <Button
              onClick={() => props.onApply && props.onApply(name, ext ? ext.value : '')}
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
* @description Exports the FileFilters component.
* @exports
*/
export default FileFilters;