class TileCache {
    constructor() {
        this.data = {};
    }

    set(levelNumber, row, column, data) {
        var levelData = this.data[levelNumber];
        if (!levelData) {
            levelData = {};
            this.data[levelNumber] = levelData;
        }
        var rowData = levelData[row];
        if (!rowData) {
            rowData = {};
            levelData[row] = rowData;
        }
        rowData[column] = data;
    }

    get(levelNumber, row, column) {
        var levelData = this.data[levelNumber];
        if (!levelData) {
            return undefined;
        }
        var rowData = levelData[row];
        if (!rowData) {
            return undefined;
        }
        return rowData[column];
    }
}

export default TileCache;