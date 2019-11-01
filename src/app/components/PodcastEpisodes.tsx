import React, { useContext, FunctionComponent } from 'react';
import { GlobalContext } from '../../core/utils/globalState';
import moment from 'moment';

/**
 * @interface PodcastEpisodesProps
 * @description PodcastEpisodes component props
 */
interface PodcastEpisodesProps {
  numberOfItems?: number;
  showTitles?: boolean;
}

/**
 * @function PodcastEpisodes
 * @description The PodcastEpisodes
 */
const PodcastEpisodes: FunctionComponent<PodcastEpisodesProps> = props => {
  // Overall state of the component
  const { cms } = useContext(GlobalContext);

  // JSX
  return (
    <>
      {
        cms.podcasts
          .sort((a, b) => a.publishedAt > b.publishedAt ? -1 : 1)
          .slice(0, props.numberOfItems).map(podcast => {
            let content: any = <iframe className='nepali-fm' src={podcast.embed + "&autoPlay=false"}></iframe>
          let title: any = null;

          if (podcast.embed.indexOf('iframe') !== -1)
            content = <div dangerouslySetInnerHTML={{ __html: podcast.embed }}></div>;
          
          if (props.showTitles)
            title = (
              <>
                <h6>{moment(podcast.publishedAt, 'X').format('DD/MM/YYYY HH:mm')}</h6>
                <h3>{podcast.title}</h3>
              </>
            );
          
          return (
            <div
              key={podcast.id}
              className={`podcast-item ${props.numberOfItems === 1 ? 'mb-0' : ''}`}>
              {title}
              {content}
            </div>
          );
        })
      }
    </>
  );
}

/**
 * @description Defaults for the podcast episodes properties
 */
PodcastEpisodes.defaultProps = {
  numberOfItems: Number.MAX_VALUE
}

/**
* @description Exports the PodcastEpisodes component.
* @exports
*/
export default PodcastEpisodes;