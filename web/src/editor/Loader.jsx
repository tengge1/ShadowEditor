/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/Loader.css';
import { LoadMask } from '../ui/index';

/**
 * 载入页面
 * @author tengge / https://github.com/tengge1
 */
class Loader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <LoadMask text={_t('Waiting...')} />;
    }
}

export default Loader;