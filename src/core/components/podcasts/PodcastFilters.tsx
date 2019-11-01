import { Card, CardTitle, CardBody, Form, FormGroup, Label, Input, ButtonGroup, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, FunctionComponent } from "react";
import { faFilter, faCheck, faEraser } from "@fortawesome/free-solid-svg-icons";
import 'flatpickr/dist/themes/airbnb.css';

/**
 * @interface PodcastsFiltersProps
 * @description PodcastsFilters component props
 */
interface PodcastsFiltersProps {
  onApply?: (title: string) => void;
}

/**
 * @function PodcastsFilters
 * @description Filters to refine the user list.
 */
const PodcastsFilters: FunctionComponent<PodcastsFiltersProps> = props => {
  // Overall state of the component
  const [title, setTitle] = useState('');

  // Events
  const cleanForm = () => {
    setTitle('');
    props.onApply && props.onApply('');
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
            <Label for="title">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              type="text"
              placeholder="What title you're looking for?" />
          </FormGroup>
          <ButtonGroup className='w-100'>
            <Button
              onClick={() => props.onApply && props.onApply(title)}
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
* @description Exports the PodcastsFilters component.
* @exports
*/
export default PodcastsFilters;