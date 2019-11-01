import React, { FunctionComponent } from 'react';
import { FormGroup, Label } from 'reactstrap';
import RichTextEditor, { EditorValue } from 'react-rte';
import '../../styles/css/wysiwyg.css';
import { ContentBlock, EditorState, RichUtils } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignCenter } from '@fortawesome/free-solid-svg-icons';

type GetControlState = (key: string) => string | undefined;
type SetControlState = (key: string, value: string) => void;

/**
 * @const
 * @description The default configuration for all wysiwyg editors.
 */
const EditorConfigs: any = {
  display: [
    'INLINE_STYLE_BUTTONS',
    'BLOCK_TYPE_BUTTONS',
    'LINK_BUTTONS',
    'IMAGE_BUTTON',
    'BLOCK_TYPE_DROPDOWN',
    'HISTORY_BUTTONS'
  ],
  INLINE_STYLE_BUTTONS: [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'StrikeThrough', style: 'STRIKETHROUGH' }
  ],
  BLOCK_TYPE_DROPDOWN: [
    { label: 'Normal', style: 'unstyled' },
    { label: 'Heading Large', style: 'header-one' },
    { label: 'Heading Medium', style: 'header-two' },
    { label: 'Heading Small', style: 'header-three' }
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Blockquote', style: 'blockquote' }
  ]
};

export class RichEditor {
  static createEmpty() {
    return RichTextEditor.createEmptyValue();
  }

  static createFromHtmlString(htmlString: string): EditorValue {
    return RichTextEditor.createValueFromString(htmlString, 'html', {
      customBlockFn: (el: Element) => {
        if (el.classList.contains('text-center'))
          return { type: 'TEXTCENTER' };
        return { type: 'unstyled' };
      }
    });
  }

  static valueToHtml(value: EditorValue): string {
    return value.toString('html', {
      blockRenderers: {
        'TEXTCENTER': (block: ContentBlock) => {
          return '<div class="text-center">' + block.getText() + '</div>';
        }
      }
    });
  }
}

const WYSIWYGEnhancer = (props: any) => {
  const children = React.cloneElement(props.children, {
    blockRendererFn: (block: any): any => {
      const type = block.getType();
      if (type === 'TEXTCENTER') {
        return {
          component: (props: any) => {
            return <div className='text-center'>{block.getText()}</div>;
          }
        };
      }
    }
  });
  return <>{children}</>;
}

const blockStyleFn = (block: ContentBlock): string | undefined => {
  // const type = b.getType() as string;
  // if (type === 'custom') {
  //   return 'whatever';
  // }
  return '';
}

const btnApplyStyle = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  style: string,
  set: SetControlState,
  get: GetControlState,
  state: EditorState,
  onChange: (value: EditorValue) => any
): void => {
  const currCtrlState = get(style);
  let editorValue: EditorValue | null = null;

  if (currCtrlState === 'true') {
    e.currentTarget.classList.remove('active');
    set(style, 'false');
    editorValue = EditorValue.createFromState(RichUtils.toggleBlockType(state, 'unstyled'));
  }
  else {
    e.currentTarget.classList.add('active');
    set(style, 'true');
    editorValue = EditorValue.createFromState(RichUtils.toggleBlockType(state, style));
  }

  onChange(editorValue);
  e.stopPropagation();
  e.preventDefault();
};

const TEXTCENTER = (onChange: (value: EditorValue) => any) =>
  (set: SetControlState, get: GetControlState, state: EditorState) => {
    return <button
      className='custom-btn'
      key={0}
      onClick={e => btnApplyStyle(e, 'TEXTCENTER', set, get, state, onChange)}>
      <FontAwesomeIcon icon={faAlignCenter} />
    </button>;
  };

/**
 * @interface WYSIWYGProps
 * @description WYSIWYG component props
 */
interface WYSIWYGProps {
  value: EditorValue;
  onChange: (value: EditorValue) => any;
}

/**
 * @function WYSIWYG
 * @description Creates a WYSIWYG editor.
 */
const WYSIWYG: FunctionComponent<WYSIWYGProps> = props => (
  <FormGroup>
    <Label for='content'>Content</Label>
    <WYSIWYGEnhancer>
      <RichTextEditor
        customControls={[
          TEXTCENTER(props.onChange)
        ]}
        blockStyleFn={blockStyleFn}
        toolbarConfig={EditorConfigs}
        editorClassName='wysiwyg-editor'
        value={props.value}
        onChange={value => {
          console.log(value.toString('html'));
          console.log(RichEditor.valueToHtml(value));
          props.onChange(value);
        }}
      />
    </WYSIWYGEnhancer>
  </FormGroup>
);

export default WYSIWYG;