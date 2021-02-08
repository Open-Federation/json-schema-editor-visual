import React, {PureComponent} from 'react';
import mockEditor from './mockEditor';
import PropTypes from 'prop-types';
import _ from 'lodash';

const ModeMap = {
  javascript: 'ace/mode/javascript',
  json: 'ace/mode/json',
  text: 'ace/mode/text',
  xml: 'ace/mode/xml',
  html: 'ace/mode/html'
};

function isNotMatch(a, b) {
  try {
    a = JSON.parse(a);
    b = JSON.parse(b);
    return !_.isEqual(a, b);
  } catch (e) {
    return true;
  }
}

function getMode(mode) {
  return ModeMap[mode] || ModeMap.text;
}

class AceEditor extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.editor = mockEditor({
      container: this.editorElement,
      data: this.props.data,
      onChange: this.props.onChange,
      readOnly: this.props.readOnly,
      fullScreen: this.props.fullScreen
    });

    let mode = this.props.mode || 'javascript';
    this.editor.editor.getSession().setMode(getMode(mode));
    if (typeof this.props.callback === 'function') {
      this.props.callback(this.editor.editor);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.editor) return;

    if (
      isNotMatch(nextProps.data, this.props.data) &&
      isNotMatch(this.editor.getValue(), nextProps.data)
    ) {
      this.editor.setValue(nextProps.data);

      let mode = nextProps.mode || 'javascript';
      this.editor.editor.getSession().setMode(getMode(mode));
      this.editor.editor.clearSelection();
    }
  }

  render() {
    return (
      <div
        className={this.props.className}
        style={
          this.props.className ? undefined : this.props.style || { width: '100%', height: '200px' }
        }
        ref={editor => {
          this.editorElement = editor;
        }}
      />
    );
  }
}

AceEditor.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  mode: PropTypes.string, //enum[json, text, javascript], default is javascript
  readOnly: PropTypes.bool,
  callback: PropTypes.func,
  style: PropTypes.object,
  fullScreen: PropTypes.bool,
  insertCode: PropTypes.func
};

export default AceEditor;
