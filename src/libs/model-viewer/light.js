import shortid from 'shortid';
import * as THREE from 'three'

export default {
  create(options) {
    let { id, type, color, intensity } = options;
    let light = null;
    if (type === "environment") {
      light = this.createAmbientLight(color, intensity);
    } else if (type === "direction") {
      light = this.createDirectionLight(options);
    } else if (type === 'spot') {
      light = this.createSpotLight(options)
    }
    if (!id) {
      id = shortid.generate();
    }
    light.fid = id;
    return light;
  },

  createAmbientLight(color, intensity) {
    return new THREE.AmbientLight(color, intensity);
  },
  createDirectionLight(options) {
    let light = new THREE.DirectionalLight(options.color, options.intensity);
    light.castShadow = true;
    light.position.set(...options.position);
    //util.setLightProperty(light, options)
    return light;
  },
  createSpotLight(options) {
    let target = new THREE.Object3D();
    target.position.set(options.position[0], options.position[1], 1);

    //scene.add(mesh)
    let light = new THREE.SpotLight(options.color, options.intensity);
    light.castShadow = true;
    light.position.set(...options.position);
    light.angle = Math.PI / 1.7;
    light.distance = 15;
    light.penumbra = 0.4;
    light.shadow.near = 1;
    light.shadow.far = 10;
    light.shadow.camera.fov = 20;
    light.decay = 2;
    light.shadow.radius = 2;
    light.target = target;
    return light
  }
};

/* export const createLignt = (scene) => {
  let floorHeight = 5
  createSpotLight(scene, [4.5, 3, floorHeight]);
  createSpotLight(scene, [-2.5, 5, floorHeight]);
  createSpotLight(scene, [-3.5, -6, floorHeight]);
  createSpotLight(scene, [3.5, -4, floorHeight]);
  createSpotLight(scene, [-2, 0, floorHeight]);
}

function createSpotLight(scene, position, intensity) {
  let ball = new THREE.SphereGeometry(0.05)
  let material = new THREE.MeshLambertMaterial({
    color: 0xff0000
  });
  let mesh = new THREE.Mesh(ball, material)
  mesh.position.set(...position);
  let target = new THREE.Object3D()
  target.position.set(position[0], position[1], 1)
  
  //scene.add(mesh)
  let light = new THREE.SpotLight(0xffffff, intensity || 2);
  light.castShadow = true
  light.position.set(...position)
  light.angle = Math.PI / 1.7
  light.distance = 15
  light.penumbra = 0.4
  light.shadow.near = 1
  light.shadow.far = 10
  light.shadow.camera.fov = 20;
  light.decay = 2
  light.shadow.radius = 2
  light.target = target
  scene.add(light.target);
  scene.add(light)
} */
