// ref for lumens: http://www.power-sure.com/lumens.htm
var bulbLuminousPowers = {
    "110000 lm (1000W)": 110000,
    "3500 lm (300W)": 3500,
    "1700 lm (100W)": 1700,
    "800 lm (60W)": 800,
    "400 lm (40W)": 400,
    "180 lm (25W)": 180,
    "20 lm (4W)": 20,
    "Off": 0
};

// ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
var hemiLuminousIrradiances = {
    "0.0001 lx (无月之夜)": 0.0001,
    "0.002 lx (夜晚辉光)": 0.002,
    "0.5 lx (满月)": 0.5,
    "3.4 lx (城市暮光)": 3.4,
    "50 lx (客厅)": 50,
    "100 lx (很阴沉)": 100,
    "350 lx (办公室)": 350,
    "400 lx (日出日落)": 400,
    "1000 lx (阴沉)": 1000,
    "18000 lx (阳光)": 18000,
    "50000 lx (太阳直射)": 50000
};

var params = {
    shadows: true,
    exposure: 0.68,
    bulbPower: Object.keys(bulbLuminousPowers)[4],
    hemiIrradiance: Object.keys(hemiLuminousIrradiances)[0]
};

/**
 * 物理光源
 */
function PhysicalLight(color, intensity, distance, decay) {
    THREE.PointLight.call(this, color, intensity, distance, decay);

    var bulbGeometry = new THREE.SphereBufferGeometry(0.02, 16, 8);
    var bulbMat = new THREE.MeshStandardMaterial({
        emissive: 0xffffee,
        emissiveIntensity: 1,
        color: new THREE.Color(color)
    });
    this.add(new THREE.Mesh(bulbGeometry, bulbMat));
}

PhysicalLight.prototype = Object.create(THREE.PhysicalLight.prototype);
PhysicalLight.prototype.constructor = PhysicalLight;

export default PhysicalLight;