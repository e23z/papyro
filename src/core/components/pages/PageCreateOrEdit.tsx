import React, { FunctionComponent, FormEvent, useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, ButtonGroup } from 'reactstrap';
import { withRouter } from 'react-router';
import { RoutingProps } from '../../routing/interfaces';
import Image from '../shared/Image';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Loading from '../shared/Loading';
import { ADMIN_PAGES } from '../../routing/routes';
import { MenuPosition, getMenuPositionLabel } from '../../models/CMS';
import { Page, PageSchema, PageRepo } from '../../models/Page';
import { validate } from '../../utils/validation';
import { GlobalContext } from '../../utils/globalState';
import WYSIWYG, { RichEditor } from '../shared/WYSIWYG';

/**
 * @const
 * @description The options for the user to display the page.
 */
const MenuPositionOptions = [
  { value: MenuPosition.Top, label: getMenuPositionLabel(MenuPosition.Top) },
  { value: MenuPosition.Bottom, label: getMenuPositionLabel(MenuPosition.Bottom) },
  { value: MenuPosition.Both, label: getMenuPositionLabel(MenuPosition.Both) },
  { value: MenuPosition.None, label: getMenuPositionLabel(MenuPosition.None) }
];

/**
 * @interface PageCreateOrEditProps
 * @description PageCreateOrEdit component props
 */
interface PageCreateOrEditProps extends RoutingProps {
}

/**
 * @function PageCreateOrEdit
 * @description Creates or edit a new page.
 */
const PageCreateOrEdit: FunctionComponent<PageCreateOrEditProps> = props => {
  // Basic page information
  const id = props.match.params.id;

  // Overall state of the component
  const [_id, _setId] = useState<string | undefined>('');
  const [title, setTitle] = useState('');
  const [permalink, setPermalink] = useState('');
  const [content, setContent] = useState(RichEditor.createEmpty());
  const [cover, setCover] = useState('');
  const [menuTitle, setMenuTitle] = useState('');
  const [menuDisplay, setMenuDisplay] = useState<any>(null);
  const [menuOrder, setMenuOrder] = useState(0);
  const [menuParent, setMenuParent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { cms, setCMS } = useContext(GlobalContext);

  useEffect(() => {
    if (id && _id !== id) {
      _setId(id);
      setIsLoading(true);
      PageRepo.Instance.FindById(id).then((page: Page | null) => {
        if (!page) return;
        setTitle(page.title);
        setPermalink(page.permalink);
        setContent(RichEditor.createFromHtmlString(page.content || ''));
        setCover(page.coverImage || '');
        setMenuTitle(page.menuDetails.title);
        setMenuDisplay({ value: page.menuDetails.position, label: getMenuPositionLabel(page.menuDetails.position) });
        setMenuOrder(page.menuDetails.sort);
        setMenuParent({ value: page.menuDetails.parentId || '', label: page.menuDetails.parentTitle || 'No parent' });
        setIsLoading(false);
      })
    }
  });

  // Clear up everything if was editing and moved away
  if (!id && _id !== id) {
    _setId(undefined);
    setTitle('');
    setPermalink('');
    setContent(RichEditor.createEmpty());
    setCover('');
    setMenuTitle('');
    setMenuDisplay(null);
    setMenuOrder(0);
    setMenuParent(null);
  }

  // Validation state
  const page: Page = {
    id: id || '',
    title,
    permalink,
    coverImage: cover,
    content: RichEditor.valueToHtml(content),
    menuDetails: {
      title: menuTitle,
      position: menuDisplay ? menuDisplay.value : 0,
      sort: menuOrder,
      pageTitle: title,
      permalink
    }
  };
  if (menuParent) {
    page.menuDetails.parentId = menuParent.value;
    page.menuDetails.parentTitle = menuParent.label;
  }
  const validationResult = validate(page, PageSchema.fields);
  const isFormValid = validationResult && validationResult.isValid;

  // Page basic layout configs
  const pageTitle = id ? 'Page Edit' : 'Create new Page';
  const saveBtnTitle = id ? 'Update' : 'Save';
  const parentMenuOptions = [{ value: '', label: 'No parent' }].concat(
    cms.menuItems
      .filter(m => m.pageId !== id)
      .map(m => ({ value: m.pageId || '', label: m.title })));

  // Events
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Save the page
    const pageId = await PageRepo.Instance.Upsert(page);
    page.menuDetails.pageId = pageId || id || '';

    // Update the CMS structure
    const unchangedMenuItems = cms.menuItems.filter(m => m.pageId !== page.id);
    cms.menuItems = [...unchangedMenuItems].concat([page.menuDetails]);
    setCMS(cms);

    // Redirect to the pages list
    props.history.push(ADMIN_PAGES);
  }

  // JSX
  return (
    <Container className='flex-fill'>
      <Row>
        <Col>
          <h3 className='page-title mb-0 pb-0'>{pageTitle}</h3>
          <p className='page-desc'>The fields marked with an asterisk (<span style={{ color: '#ff3f3f' }}>*</span>) are required.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={submit} className={isLoading ? 'is-loading' : ''}>
            <Loading />
            <Row>
              <Col>
                <h5 className='text-uppercase font-weight-bold'>Page Details</h5>
                <Row>
                  <Col xs={12} sm={6}>
                    <FormGroup>
                      <Label for='title' className='required'>Title</Label>
                      <Input
                        value={title}
                        onChange={e => {
                          const value = e.target.value;
                          setTitle(value);
                          setPermalink(value
                            .replace(/[^a-z0-9 ]/gi, '')
                            .replace(/\s/gi, '-')
                            .replace(/-{2,}/gi, '-')
                            .replace(/^-+|-+$/gi, '')
                            .toLowerCase());
                        }}
                        id='title'
                        type='text' />
                    </FormGroup>
                    <FormGroup>
                      <Label for='permalink' className='required'>Permalink</Label>
                      <Input
                        value={permalink}
                        onChange={e => setPermalink(e.target.value)}
                        id='permalink'
                        type='text' />
                    </FormGroup>
                  </Col>
                  <Col xs={12} sm={6}>
                    <FormGroup className='d-flex flex-column h-100 pb-3'>
                      <Label for='cover'>Cover Image</Label>
                      <Image
                        src={cover}
                        onUpload={(id: string, downloadUrl: string) => setCover(downloadUrl)}
                        uploadPath='/pages'
                        autoUpload
                        showDeleteBtn
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <WYSIWYG
                  title='Content'
                  value={content}
                  onChange={value => setContent(value)} />
              </Col>
              <Col lg={4} className='d-flex flex-column'>
                <h5 className='text-uppercase font-weight-bold'>Menu Details</h5>
                <FormGroup>
                  <Label for='menuTitle' className='required'>Title</Label>
                  <Input
                    value={menuTitle}
                    onChange={e => setMenuTitle(e.target.value)}
                    id='menuTitle'
                    type='text' />
                </FormGroup>
                <FormGroup>
                  <Label for='menuDisplay' className='required'>Display At</Label>
                  <Select
                    options={MenuPositionOptions}
                    onChange={value => setMenuDisplay(value as any)}
                    value={menuDisplay} />
                </FormGroup>
                <FormGroup>
                  <Label for='menuOrder'>Order</Label>
                  <Input
                    value={menuOrder}
                    onChange={e => setMenuOrder(parseInt(e.target.value, 10))}
                    id='menuOrder'
                    type='number' />
                </FormGroup>
                <FormGroup>
                  <Label for='menuParent'>Parent</Label>
                  <Select
                    placeholder="Which page is the parent?"
                    onChange={value => setMenuParent(value as any)}
                    value={menuParent}
                    options={parentMenuOptions} />
                </FormGroup>
                <div className='flex-fill mb-3 d-flex flex-column justify-content-end'>
                  <ButtonGroup>
                    <Button
                      disabled={!isFormValid}
                      color='primary'
                      type='submit'>
                      <FontAwesomeIcon icon={faCheck} /> {saveBtnTitle}
                    </Button>
                    <Button
                      onClick={() => props.history.push(ADMIN_PAGES)}
                      color='secondary'
                      outline>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </Button>
                  </ButtonGroup>
                </div>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

/**
* @description Exports the PageCreateOrEdit component.
* @exports
*/
export default withRouter(PageCreateOrEdit);