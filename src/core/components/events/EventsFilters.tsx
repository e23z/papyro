import { Card, CardTitle, CardBody, Form, FormGroup, Label, Input, ButtonGroup, Button, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, FunctionComponent, useContext } from "react";
import { faFilter, faCheck, faEraser, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import { GlobalContext } from "../../utils/globalState";

/**
 * @interface EventsFiltersProps
 * @description EventsFilters component props
 */
interface EventsFiltersProps {
  onApply?: (title: string, date: number) => void;
}

/**
 * @function EventsFilters
 * @description Filters to refine the user list.
 */
const EventsFilters: FunctionComponent<EventsFiltersProps> = props => {
  // Overall state of the component
  const { cms } = useContext(GlobalContext);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Events
  const cleanForm = () => {
    setTitle('');
    setDate(undefined);
    props.onApply && props.onApply('', 0);
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
            <Label>Date</Label>
            <InputGroup>
              <Flatpickr
                className='rounded-left'
                options={{
                  minDate: new Date(),
                  defaultDate: new Date(),
                  dateFormat: 'd/m/Y',
                  altInput: true,
                  altFormat: 'd/m/Y',
                  enable: cms.events.map(e => new Date(e.date))
                }}
                {...{ placeholder: 'Which date?' }}
                value={date}
                onChange={date => setDate(date[0])}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>
                  <FontAwesomeIcon icon={faCalendarAlt} className="m-0" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
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
              onClick={() => props.onApply && props.onApply(title, date ? date.getTime() : 0)}
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
* @description Exports the EventsFilters component.
* @exports
*/
export default EventsFilters;