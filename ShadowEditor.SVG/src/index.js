import { SvgControl, Manager } from './third_party';

const SVG = new Manager();

window.SVG = SVG;

// dom
import './Dom';

// shape
import './shape/Circle';
import './shape/Ellipse';
import './shape/Line';
import './shape/Polygon';
import './shape/Polyline';
import './shape/Rect';

import './Path';
import './Text';
import './TextPath';
import './Anchor';

import './defs/Defs';
import './defs/Use';
import './defs/linearGradient';
import './Group';

import './filter/Filter';
import './filter/feGaussianBlur';
import './filter/feOffset';
import './filter/feBlend';
import './filter/feColorMatrix';

export { SvgControl, SVG };