import Control from './Control';
import Container from './Container';
import Div from './Div';
import Row from './Row';
import Panel from './Panel';
import Text from './Text';
import Input from './Input';
import TextArea from './TextArea';
import Select from './Select';
import Checkbox from './Checkbox';
import Color from './Color';
import Number from './Number';
import Integer from './Integer';
import Break from './Break';
import HorizontalRule from './HorizontalRule';
import Button from './Button';
import Modal from './Modal';
import Texture from './Texture';
import Outliner from './Outliner';
import Boolean from './Boolean';

/**
 * 所有UI控件封装
 */
const UI = {
    // ui.js
    Control: Control,
    Container: Container,
    Div: Div,
    Row: Row,
    Panel: Panel,
    Text: Text,
    Input: Input,
    TextArea: TextArea,
    Select: Select,
    Checkbox: Checkbox,
    Color: Color,
    Number: Number,
    Integer: Integer,
    Break: Break,
    HorizontalRule: HorizontalRule,
    Button: Button,
    Modal: Modal,

    // ui.three.js
    Texture: Texture,
    Outliner: Outliner,
    Boolean: Boolean
};

export default UI;