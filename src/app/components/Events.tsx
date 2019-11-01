import React, { useContext, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import { GlobalContext } from '../../core/utils/globalState';
import moment from 'moment';
import { Event } from '../../core/models/CMS';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, EmailShareButton, EmailIcon } from 'react-share';
import { truncate } from '../../core/utils/utils';

/**
 * @function Events
 * @description A simple component to display and filter events.
 */
const Events = () => {
  // Overall state of the component
  const { cms } = useContext(GlobalContext);
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Basic layout configs
  const title = date ? `Events in ${moment(date).format('DD/MM/YYYY')}` : 'Next Events';
  const startAt = moment(date || new Date(), 'x').startOf('day').unix() * 1000;
  const endAt = moment(date || 32472144000000, 'x').endOf('day').unix() * 1000;
  const events = [...cms.events]
    .sort((a, b) => a.date > b.date ? 1 : -1)
    .filter(e => e.date >= startAt && e.date <= endAt)
    .slice(0, 5)
    .map((e: Event, i: number) => {
      const shareText = e.description.replace(/<\/?[a-z0-9]+>|&[a-z]+;/gmi, '');
      return (
        <li key={i}>
          {e.downloadUrl ? <img src={e.downloadUrl} className='img-fluid mb-3' /> : null}
          <p className='evt-date'>{moment(e.date, 'x').format('DD/MM/YYYY - HH:mm')}</p>
          <p className='evt-title'>{e.title}</p>
          <p className='evt-desc' dangerouslySetInnerHTML={{ __html: e.description }} />
          <div className='evt-sharing'>
            <FacebookShareButton
              {...{ className: 'evt-share-btn' }}
              url={e.downloadUrl}
              quote={shareText}>
              <FacebookIcon size={25} />
            </FacebookShareButton>
            <TwitterShareButton
              {...{ className: 'evt-share-btn' }}
              url={e.downloadUrl}
              title={truncate(shareText, 250, '...')}>
              <TwitterIcon size={25} />
            </TwitterShareButton>
            <EmailShareButton
              {...{ className: 'evt-share-btn' }}
              url={e.downloadUrl}
              subject={e.title}
              body={shareText}>
              <EmailIcon size={25} />
            </EmailShareButton>
          </div>
        </li>
      );
    });

  // JSX
  return (
    <div className='events'>
      <Flatpickr
        options={{
          inline: true,
          defaultDate: undefined,
          // minDate: new Date(),
          enable: cms.events.map(e => new Date(e.date))
        }}
        value={date}
        onChange={date => setDate(date[0])}
      />
      <p className='evts-title'>{title}</p>
      <ul>{events}</ul>
    </div>
  );
};

/**
* @description Exports the Events component.
* @exports
*/
export default Events;