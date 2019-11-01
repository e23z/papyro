import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { GlobalContext } from '../../core/utils/globalState';
import { PageRepo, Page } from '../../core/models/Page';
import PodcastEpisodes from './PodcastEpisodes';
import { Link } from 'react-router-dom';

/**
 * @function Home
 * @description The home page
 */
const Home = () => {
  // Overall state of the component
  const { cms } = useContext(GlobalContext);
  const [cover, setCover] = useState('');
  const [headline, setHeadline] = useState('');
  const [loadingHome, setLoadingHome] = useState(true);
  const [newsItems, setNewsItems] = useState<Page[]>([]);
  const [messageItems, setMessageItems] = useState<Page[]>([]);
  const newsItemsIds = cms.menuItems
    .filter(i => i.permalink.startsWith('news-'))
    .splice(0, 3)
    .map(i => i.pageId);
  const messageItemsIds = cms.menuItems
    .filter(i => i.permalink.startsWith('msg-'))
    .splice(0, 3)
    .map(i => i.pageId);

  useEffect(() => {
    PageRepo.Instance.FindByPermalink('home').then((p: Page | null) => {
      if (!p) return;
      setCover(p.coverImage || '');
      setHeadline(p.content || '');
      setLoadingHome(false);
    });
  }, []);

  useEffect(() => {
    Promise.all(
      newsItemsIds.map(id => PageRepo.Instance.FindById(id || ''))
    ).then((values: any[]) => setNewsItems(values));
  }, [cms]);
  
  useEffect(() => {
    Promise.all(
      messageItemsIds.map(id => PageRepo.Instance.FindById(id || ''))
    ).then((values: any[]) => setMessageItems(values));
  }, [cms]);

  // Basic layout configs
  let content: any = (
    <div>
      <div className='placeholder cover-img-placeholder'></div>
      <div className='placeholder title-placeholder'></div>
      <div className='placeholder desc-placeholder'></div>
      <div className='placeholder line-placeholder w-50'></div>
    </div>
  );
  let news: any = (
    <Row className='mt-5'>
      <Col>
        <h1 className='pb-0'>News</h1>
        <h3 className='pb-3'>Check out the latest news from NNZFSC</h3>
        <Row>
          <Col>
            <div className='placeholder news-pic-placeholder'></div>
            <div className='placeholder desc-placeholder mt-3'></div>
          </Col>
          <Col>
            <div className='placeholder news-pic-placeholder'></div>
            <div className='placeholder desc-placeholder mt-3'></div>
          </Col>
          <Col>
            <div className='placeholder news-pic-placeholder'></div>
            <div className='placeholder desc-placeholder mt-3'></div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
  let messages: any = (
    <Row className='mt-5'>
      <Col>
        <h1>Messages from the president</h1>
        <div className='placeholder title-placeholder'></div>
        <div className='placeholder desc-placeholder'></div>
        <div className='placeholder line-placeholder w-50'></div>
      </Col>
    </Row>
  );

  if (!loadingHome) {
    content = (
      <>
        <div className='cover-img' style={{ backgroundImage: `url(${cover})` }}></div>
        <div dangerouslySetInnerHTML={{ __html: headline }}></div>
      </>
    );
  }

  if (newsItems.length > 0) {
    news = (
      <Row className='mt-5'>
        <Col>
          <h1 className='pb-0'>News</h1>
          <h3 className='pb-3'>Check out the latest news from NNZFSC</h3>
          <Row>
            {
              newsItems.map((page, i) => (
                <Col key={i}>
                  <Link to={`/${page.permalink}`} className='news-item'>
                    <div style={{backgroundImage: `url(${page.coverImage}`}}></div>
                    <h3>{page.title}</h3>
                  </Link>
                </Col>
              ))
            }
          </Row>
        </Col>
      </Row>
    );
  }
  else if (newsItemsIds.length === 0) news = null;
  
  if (messageItems.length > 0) {
    messages = (
      <Row className='mt-5'>
        <Col>
          <h1>Messages from the president</h1>
          {
            messageItems.map((page, i) => (
              <div key={i} className='msg-item'>
                {/* <h3>{page.title}</h3> */}
                <div dangerouslySetInnerHTML={{ __html: page.content || '' }}></div>
              </div>
            ))
          }
        </Col>
      </Row>
    );
  }
  else if (messageItemsIds.length === 0) messages = null;

  // JSX
  return (
    <Container className='flex-fill'>
      <Row>
        <Col>
          {content}
        </Col>
      </Row>
      {messages}
      <Row className='mt-5'>
        <Col>
          <h1 className='text-left pb-0'>Nepali FM</h1>
          <h3 className='text-left pb-3'>Listen to the latest episode from our radio.</h3>
          <PodcastEpisodes numberOfItems={1} />
        </Col>
      </Row>
      {news}
    </Container>
  );
}

/**
* @description Exports the Home component.
* @exports
*/
export default Home;