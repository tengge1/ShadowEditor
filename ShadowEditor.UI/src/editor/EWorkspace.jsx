import './css/EWorkspace.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import BorderLayout from '../layout/BorderLayout.jsx';
import Panel from '../panel/Panel.jsx';

import DataGrid from '../table/DataGrid.jsx';
import Column from '../common/Column.jsx';
import Columns from '../common/Columns.jsx';

/**
 * 工作区
 * @author tengge / https://github.com/tengge1
 */
class EWorkspace extends React.Component {
    render() {
        const { className, ...others } = this.props;

        const data = [
            ['Cupcake', 305, 3.7, 67, 4.3],
            ['Donut', 452, 25.0, 51, 4.9],
            ['Eclair', 262, 16.0, 24, 6.0],
            ['Frozen yoghurt', 159, 6.0, 24, 4.0],
            ['Gingerbread', 356, 16.0, 49, 3.9],
            ['Honeycomb', 408, 3.2, 87, 6.5],
            ['Ice cream sandwich', 237, 9.0, 37, 4.3],
            ['Jelly Bean', 375, 0.0, 94, 0.0],
            ['KitKat', 518, 26.0, 65, 7.0],
            ['Lollipop', 392, 0.2, 98, 0.0],
            ['Marshmallow', 318, 0, 81, 2.0],
            ['Nougat', 360, 19.0, 9, 37.0],
            ['Oreo', 437, 18.0, 63, 4.0],
        ];

        return <BorderLayout className={classNames('EWorkspace', className)} {...others}>
            <Panel title={'North'} region={'north'} split={true} style={{ height: '120px', border: 'none' }}></Panel>
            <Panel title={'South'} region={'south'} split={true} style={{ height: '120px', border: 'none' }}></Panel>
            <Panel title={'West'} region={'west'} split={true} style={{ width: '200px', border: 'none' }}></Panel>
            <Panel title={'East'} region={'east'} split={true} style={{ width: '200px', border: 'none' }}></Panel>
            <Panel title={'Center'}
                region={'center'}
                collapsible={true}
                maximizable={true}
                closable={true}
                style={{ border: 'none' }}>
                <DataGrid data={data}>
                    <Columns>
                        <Column field={'name'}>Dessert (100g serving)</Column>
                        <Column field={'calories'}>Calories</Column>
                        <Column field={'fat'}>Fat (g)</Column>
                        <Column field={'carbs'}>Carbs (g)</Column>
                        <Column field={'protein'}>Protein (g)</Column>
                    </Columns>
                </DataGrid>
            </Panel>
        </BorderLayout>;
    }
}

EWorkspace.propTypes = {
    className: PropTypes.string,
};

export default EWorkspace;