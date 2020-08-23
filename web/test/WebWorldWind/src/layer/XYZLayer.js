import MercatorTiledImageLayer from './MercatorTiledImageLayer';
import Sector from '../geom/Sector';
import Location from '../geom/Location';

class URLBuilder {
    urlForTile(tile, imageFormat) {
        return `http://localhost:2020/api/Map/Tiles?x=${tile.column}&y=${tile.row}&z=${tile.level.levelNumber}`;
    }
}

class XYZLayer extends MercatorTiledImageLayer {
    constructor() {
        let imageSize = 256;
        let displayName = 'Bing';
        super(new Sector(-180, 180, -180, 180), new Location(360, 360), 18, "image/jpeg",
            displayName, imageSize, imageSize);

        this.imageSize = imageSize;
        this.displayName = displayName;
        this.urlBuilder = new URLBuilder();
    }

    createTopLevelTiles(dc) {
        this.topLevelTiles = [];

        let level = this.levels.levels[1];
        this.topLevelTiles.push(this.createTile(null, level, 0, 0));
        this.topLevelTiles.push(this.createTile(null, level, 0, 1));
        this.topLevelTiles.push(this.createTile(null, level, 1, 0));
        this.topLevelTiles.push(this.createTile(null, level, 1, 1));
    }
}

export default XYZLayer;