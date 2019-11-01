import React, { useState, useEffect, FunctionComponent } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Page as PageModel, PageRepo } from '../../core/models/Page';
import { withRouter } from 'react-router-dom';
import { RoutingProps } from '../../core/routing/interfaces';

/**
 * @interface PageProps
 * @description Page component props
 */
interface PageProps extends RoutingProps {
}

/**
 * @function Page
 * @description The Page
 */
const Page: FunctionComponent<PageProps> = props => {
  // Basic vars
  const path = props.match.path.replace(/^\/*|\/*$/gi, '');

  // Overall state of the component
  const [page, setPage] = useState<PageModel | null>(null);

  useEffect(() => {
    PageRepo.Instance.FindByPermalink(path).then((p: PageModel | null) => {
      if (!p) return;
      setPage(p);
    });
  }, [path]);

  // Basic layout configs
  let content: any = (
    <Row>
      <Col>
        <div className='mb-3'>
          <div className='placeholder cover-img-placeholder'></div>
          <div className='placeholder title-placeholder'></div>
          <div className='placeholder desc-placeholder'></div>
          <div className='placeholder line-placeholder w-50'></div>
        </div>
      </Col>
    </Row>
  );

  if (page) {
    let cover: any = null;

    if (page.coverImage)
      cover = <div className='cover-img' style={{ backgroundImage: `url(${page.coverImage})` }}></div>;

    content = (
      <>
        <Row>
          <Col xs={12}>
            {cover}
          </Col>
          <Col xs={12}>
            <h3 className='page-title mb-3'>{page.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: page.content || '' }}></div>
          </Col>
        </Row>
      </>
    );
  }

  // JSX
  return (
    <Container className='flex-fill'>
      {content}
    </Container>
  );
}

/**
* @description Exports the Page component.
* @exports
*/
export default withRouter(Page);