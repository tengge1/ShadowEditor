import MercatorTiledImageLayer from './MercatorTiledImageLayer';
import Sector from '../geom/Sector';
import Location from '../geom/Location';

class URLBuilder {
    urlForTile(tile, imageFormat) {
        return `http://localhost:2020/api/Map/Tiles?x=${tile.column}&y=${tile.row}&z=${tile.level.levelNumber + 1}`;
    }
}

class XYZLayer extends MercatorTiledImageLayer {
    constructor() {
        let imageSize = 256;
        let displayName = 'Bing';
        super(new Sector(-85.05, 85.05, -180, 180), new Location(85.05, 180), 23, "image/jpeg",
            displayName, imageSize, imageSize);

        this.imageSize = imageSize;
        this.displayName = displayName;
        this.urlBuilder = new URLBuilder();
    }

    createTopLevelTiles(dc) {
        this.topLevelTiles = [];

        this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 0));
        this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 1));
        this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 0));
        this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 1));
    }

    mapSizeForLevel(levelNumber) {
        return 256 << (levelNumber + 1);
    }
}

export default XYZLayer;