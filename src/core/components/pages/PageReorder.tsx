import React, { useState, useContext } from 'react';
import { Container, Row, Col } from 'reactstrap';
import {
  SortableContainer, SortableElement,
  arrayMove, SortableHandle,
} from 'react-sortable-hoc';
import '../../styles/css/menu-sort.css';
import { GlobalContext } from '../../utils/globalState';
import { MenuItem, MenuPosition } from '../../models/CMS';
import { PageRepo } from '../../models/Page';

/**
 * @function DragHandle
 * @description Render the sortable item drag handler.
 */
const DragHandle = SortableHandle(() => <span>::</span>);

/**
 * @function SortableItem
 * @description Render a single item of the sortable list.
 */
const SortableItem = SortableElement(({ value }: any) => {
  return (
    <li className='sortable-item'>
      {value}
      <DragHandle />
    </li>
  );
});

/**
 * @function SortableList
 * @description Renders the sortable list.
 */
const SortableList = SortableContainer(({ items }: any) => (
  <div>
    {
      items.map((menu: any, i: number) => (
        <ul className='menu-sortable' key={menu.id}>
          <li className='menu-sortable-title'>{menu.title}</li>
          {menu.items.map((submenu: any, j: number) => (
            <SortableItem
              key={`item-${submenu.id}`}
              index={j}
              value={submenu.label}
              collection={i} />
          ))}
        </ul>
      ))
    }
  </div>
));

/**
 * @function mapMenuItems
 * @description Map the menu items to an array understandable by the sort component.
 * @param items {MenuItem[]} - The menu items to the be converted.
 * @return `{any}` - Return an array that the sort component understands.
 * @example
 * [
 *     {
 *       id: '1',
 *       title: 'Menu 1',
 *       items: [
 *         { id: '1', label: 'Text 1' },
 *         { id: '2', label: 'Text 2' },
 *         { id: '3', label: 'Text 3' },
 *       ]
 *     }
 *   ]
 */
const mapMenuItems = (items: MenuItem[]): any[] => {
  const map: any = {};

  items
    .sort((a: any, b: any) => a.sort > b.sort ? 1 : -1)
    .forEach(i => {
    const id = i.parentId || '__top_level__';
    if (!map[id])
      map[id] = { id, title: i.parentTitle, items: new Array() };
    map[id].items.push({ id: i.pageId, label: i.title });
  });

  return Object.getOwnPropertyNames(map)
    .sort((a, b) => a > b ? -1 : 1)
    .map(prop => ({
    id: prop,
    title: prop === '__top_level__' ? 'Top Menu' : `${map[prop].title} (Sub-menu)`,
    items: map[prop].items
  }));
};

/**
 * @function PageReorder
 * @description Lists all the pages and allow the user to reorder them.
 */
const PageReorder = () => {
  // Overall state of the component
  const { cms, setCMS } = useContext(GlobalContext);
  const [items, setItems] = useState<any[]>(mapMenuItems(cms.menuItems.filter(i => i.position !== MenuPosition.None)));

  // Events
  const onSortEnd = ({ oldIndex, newIndex, collection }: any) => {
    const newItems = [...items];
    newItems[collection].items = arrayMove(newItems[collection].items, oldIndex, newIndex);
    setItems(newItems);

    cms.menuItems.forEach(mi => {
      let sort = newItems[collection].items.findIndex((i: any) => i.id === mi.pageId);
      if (sort === -1) sort = mi.sort;
      else PageRepo.Instance.UnsafeUpdate({ id: mi.pageId, menuDetails: { sort } });
      mi.sort = sort;
    });
    setCMS(cms);
  };

  // Page basic layout configs
  let content: any = <p className='text-center'>Please, create some pages before trying to sort them.</p>;

  if (items.length > 0)
    content = <SortableList
      helperClass='selected-sortable-item'
      items={items}
      onSortEnd={onSortEnd}
      useDragHandle
      lockAxis='y' />;
  
  // JSX
  return (
    <Container className='flex-fill'>
      <Row>
        <Col>
          <h3 className='page-title mb-0 pb-0'>Menu Sorting/Ordering</h3>
          <p className='page-desc'>Drag and drop to sort the items at your will.</p>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col lg={5}>
          {content}
        </Col>
      </Row>
    </Container>
  );
}

/**
* @description Exports the PageReorder component.
* @exports
*/
export default PageReorder;