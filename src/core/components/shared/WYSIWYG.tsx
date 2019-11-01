import React, { FunctionComponent } from 'react';
import { FormGroup, Label } from 'reactstrap';
import RichTextEditor, { EditorValue } from 'react-rte';
import '../../styles/css/wysiwyg.css';
import { ContentBlock, EditorState, RichUtils, ContentState } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignCenter, faAlignRight, faAlignLeft, faAlignJustify, faParagraph } from '@fortawesome/free-solid-svg-icons';

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

const EditorBasicConfigs: any = {
  display: [
    'INLINE_STYLE_BUTTONS',
    'LINK_BUTTONS',
    'HISTORY_BUTTONS'
  ],
  INLINE_STYLE_BUTTONS: [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'StrikeThrough', style: 'STRIKETHROUGH' }
  ]
};

const textCenterRef = React.createRef() as any;
const textRightRef = React.createRef() as any;
const textLeftRef = React.createRef() as any;

export class RichEditor {
  static createEmpty() {
    return RichTextEditor.createEmptyValue();
  }

  static createFromHtmlString(htmlString: string): EditorValue {
    return RichTextEditor.createValueFromString(htmlString, 'html', {
      customBlockFn: (el: Element): any => {
        switch ((el as HTMLElement).style.textAlign) {
          case 'left': return { data: { textAlign: 'left' } };
          case 'center': return { data: { textAlign: 'center' } };
          case 'right': return { data: { textAlign: 'right' } };
          case 'justify': return { data: { textAlign: 'justify' } };
        }
      }
    });
  }

  static valueToHtml(value: EditorValue): string {
    return value.toString('html', {
      // blockRenderers: {
      //   'TEXTCENTER': (block: ContentBlock) => {
      //     return '<div class="text-center">' + block.getText() + '</div>';
      //   }
      // },
      blockStyleFn: (block: ContentBlock): any => {
        const align = block.getData().get('textAlign');
        switch (align) {
          case 'left': return { style: { textAlign: 'left' } };
          case 'center': return { style: { textAlign: 'center' } };
          case 'right': return { style: { textAlign: 'right' } };
          case 'justify': return { style: { textAlign: 'justify' } };
        }
      }
    });
  }
}

const WYSIWYGEnhancer = (props: any) => {
  const children = React.cloneElement(props.children, {
    // blockRendererFn: (block: any): any => {
    //   const type = block.getType();
    //   if (type === 'TEXTCENTER') {
    //     return {
    //       component: (props: any) => {
    //         return <div className='text-center'>{block.getText()}</div>;
    //       }
    //     };
    //   }
    // }
  });
  return <>{children}</>;
}

const blockStyleFn = (block: ContentBlock): string | undefined => {
  const align = block.getData().get('textAlign');
  switch (align) {
    case 'left': return 'text-left';
    case 'center': return 'text-center';
    case 'right': return 'text-right';
    case 'justify': return 'text-justify';
  }
  return '';
}

const toggleBtnStates = (align: string | undefined) => {

  if (textCenterRef.current) {
    if (align === 'center') textCenterRef.current.classList.add('active');
    else textCenterRef.current.classList.remove('active');
  }

  if (textRightRef.current) {
    if (align === 'right') textRightRef.current.classList.add('active');
    else textRightRef.current.classList.remove('active');
  }

  if (textLeftRef.current) {
    if (align === 'left' || !align) textLeftRef.current.classList.add('active');
    else textLeftRef.current.classList.remove('active');
  }
};

const btnApplyStyle = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  align: string,
  state: EditorState,
  onChange: (value: EditorValue) => any
): void => {
  const content = state.getCurrentContent();
  const blockKey = state.getSelection().getStartKey();
  const block = content.getBlockForKey(blockKey);
  const blockData = block.getData();

  let newBlockData;

  if (blockData.get('textAlign') === align) newBlockData = blockData.remove('textAlign');
  else newBlockData = blockData.set('textAlign', align);

  const newBlock = block.set('data', newBlockData) as ContentBlock;
  const newContent = content.merge({ blockMap: content.getBlockMap().set(blockKey, newBlock) }) as ContentState;
  const newState = EditorState.push(state, newContent, 'change-block-data');

  toggleBtnStates(align);

  onChange(EditorValue.createFromState(newState));
  e.stopPropagation();
  e.preventDefault();
};

const BREAKPOINT = (set: SetControlState, get: GetControlState, state: EditorState) => (
  <div key={4}></div>
);
const TEXTCENTER = (onChange: (value: EditorValue) => any) =>
  (set: SetControlState, get: GetControlState, state: EditorState) => {
    return <button
      ref={textCenterRef}
      className='custom-btn text-align-btn'
      key={0}
      onClick={e => btnApplyStyle(e, 'center', state, onChange)}>
      <FontAwesomeIcon icon={faAlignCenter} />
    </button>;
  };
const TEXTRIGHT = (onChange: (value: EditorValue) => any) =>
  (set: SetControlState, get: GetControlState, state: EditorState) => {
    return <button
      ref={textRightRef}
      className='custom-btn text-align-btn text-align-btn-last'
      key={1}
      onClick={e => btnApplyStyle(e, 'right', state, onChange)}>
      <FontAwesomeIcon icon={faAlignRight} />
    </button>;
  };
const TEXTLEFT = (onChange: (value: EditorValue) => any) =>
  (set: SetControlState, get: GetControlState, state: EditorState) => {
    return <button
      ref={textLeftRef}
      className='custom-btn text-align-btn text-align-btn-first'
      key={2}
      onClick={e => btnApplyStyle(e, 'left', state, onChange)}>
      <FontAwesomeIcon icon={faAlignLeft} />
    </button>;
  };
const TEXTJUSTIFY = (onChange: (value: EditorValue) => any) =>
  (set: SetControlState, get: GetControlState, state: EditorState) => {
    return <button
      className='custom-btn text-align-btn text-align-btn-last'
      key={3}
      onClick={e => btnApplyStyle(e, 'justify', state, onChange)}>
      <FontAwesomeIcon icon={faAlignJustify} />
    </button>;
  };
const BREAKLINE = (onChange: (value: EditorValue) => any) =>
  (set: SetControlState, get: GetControlState, state: EditorState) => {
    return <button
      className='custom-btn'
      key={5}
      onClick={e => {
        onChange(EditorValue.createFromState(RichUtils.insertSoftNewline(state)));
        e.stopPropagation();
        e.preventDefault();
      }}>
      <FontAwesomeIcon icon={faParagraph} />
    </button>;
  };

/**
 * @interface WYSIWYGProps
 * @description WYSIWYG component props
 */
interface WYSIWYGProps {
  value: EditorValue;
  onChange: (value: EditorValue) => any;
  basicControls?: boolean;
  title: string;
  required?: boolean;
}

/**
 * @function WYSIWYG
 * @description Creates a WYSIWYG editor.
 */
const WYSIWYG: FunctionComponent<WYSIWYGProps> = props => (
  <FormGroup className='flex-fill'>
    <Label for='content' className={props.required ? 'required' : ''}>{props.title}</Label>
    <WYSIWYGEnhancer>
      <RichTextEditor
        customControls={
          props.basicControls ? [] :
            [
              BREAKPOINT,
              TEXTLEFT(props.onChange),
              TEXTCENTER(props.onChange),
              TEXTRIGHT(props.onChange),
              // TEXTJUSTIFY(props.onChange)
              BREAKLINE(props.onChange)
            ]}
        blockStyleFn={blockStyleFn}
        toolbarConfig={props.basicControls ? EditorBasicConfigs : EditorConfigs}
        editorClassName='wysiwyg-editor'
        value={props.value}
        onChange={value => {
          const state = value.getEditorState();
          const block = state.getCurrentContent().getBlockForKey(state.getSelection().getStartKey());
          const textAlign = block.getData().get('textAlign');
          toggleBtnStates(textAlign);
          // console.log(value.toString('html'));
          // console.log(RichEditor.valueToHtml(value));
          props.onChange(value);
        }}
      />
    </WYSIWYGEnhancer>
  </FormGroup>
);

export default WYSIWYG;