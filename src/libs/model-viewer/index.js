import Event from './event'
import util from './util'
import Stats from "stats.js"
import * as THREE from "three";
import light from './light'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import CONSTANTS from './constant'

class ModelViewer extends Event {
  constructor(options) {
    super();
    this.options = Object.assign({}, CONSTANTS.options, options);
    let { container, type, url } = options;
    if (typeof container === "string") {
      this._container = document.getElementById(container);
    } else if (util.isDOM(container)) {
      this._container = container;
    }
    if (!this._container) {
      throw new Error(`Can't get the contaniner of threejs`);
    }
    let { width, height } = this._container.getBoundingClientRect();
    this.width = width;
    this.height = height;
    if (this.options.stats.show) {
      this._createStats();
    }
    this.loaded = false;
    this._init();
    if (url) {
      this.loadModels(type, url);
    }
    window.addEventListener("resize", () => {
      this._onWindowResize();
    });
  }

  _init() {
    this.scene = new THREE.Scene();

    this.camera = util.createCamera(this.width, this.height);
    this.renderer = util.createRenderer(this.width, this.height);
    this._container.appendChild(this.renderer.domElement);
    this.addLight({
      id: CONSTANTS.ambientLightId,
      type: "environment",
      color: "#ffffff",
      intensity: 1
    });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);

    util.createSky(this.scene);
    this._render();
    if (this.options.axisHelper) {
      this.addAxisHelper();
    }
    this.objectGroup = new THREE.Group();
    this.objectGroup.fid = CONSTANTS.objectGroupId;
    this.scene.add(this.objectGroup);
  }

  _render() {
    this.stats && this.stats.begin();
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    this.stats && this.stats.end();
    this.timer = requestAnimationFrame(() => {
      this._render();
    });
  }

  _createStats() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    this._container.appendChild(this.stats.dom);
    let position = this.options.stats.position;
    if (position.indexOf("top") !== -1) {
      this.stats.dom.style.top = "0px";
      this.stats.dom.style.bottom = "initial";
    }
    if (position.indexOf("bottom") !== -1) {
      this.stats.dom.style.bottom = "0px";
      this.stats.dom.style.top = "initial";
    }
    if (position.indexOf("left") !== -1) {
      this.stats.dom.style.left = "0px";
      this.stats.dom.style.right = "initial";
    }
    if (position.indexOf("right") !== -1) {
      this.stats.dom.style.right = "0px";
      this.stats.dom.style.left = "initial";
    }
  }

  _onWindowResize() {
    let { width, height } = this._container.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  loadModels(type, url) {
    this._loadIndex = 0; // 用于记录加载了几个模型
    if (type === "modelset") {
      fetch(url)
        .then(res => res.json())
        .then(modelset => {
          this._totalModels = modelset.models.length;
          if (modelset.bbox) {
            this.boundingBox = modelset.bbox;
            this._needBoundingBox = false;
            this.fitBounds();
          } else {
            this._needBoundingBox = true;
          }
          let baseUrl = util.parseUrl(url).baseUrl;
          modelset.models.forEach(option => {
            let { format, name, model } = option;
            this.addModel(format, `${baseUrl}/${model}`);
          });
        });
    } else {
      this._totalModels = 1; // 需要加载的模型总数
      this._needBoundingBox = true;
      this.addModel(type, url);
    }
  }

  addModel(type, url) {
    let cb = this._modelLoaded.bind(this);
    if (type === "gltf") {
      util.loadGlb(url, cb);
    } else if (type === "obj") {
      util.loadObj(url, cb);
    } else {
      util.loadDrc(url, cb);
    }
  }

  _modelLoaded(object) {
    object.traverse(e => {
      if (e.isMesh) {
        e.castShadow = true;
        e.receiveShadow = true;
      }
    });
    if (this._needBoundingBox) {
      let box3 = new THREE.Box3();
      box3.expandByObject(object);
      this.boundingBox = util.mergeBoundingBox(this.boundingBox, box3);
    }
    this.objectGroup.add(object);
    this._loadIndex++;
    if (this._loadIndex >= this._totalModels) {
      this.loaded = true;
      this.fire("loaded");
      if (this._needBoundingBox) {
        this.fitBounds();
      }
    }
  }

  addLight(options) {
    this.scene.add(light.create(options));
  }

  updateLight(options) {
    let object = this.scene.getObjectByProperty("fid", options.id);
    if (!object) {
      return;
    }
    util.setLightProperty(object, options);
  }

  removeLight(id) {
    this.removeObject(id)
  }

  removeObject(id) {
    let object = this.scene.getObjectByProperty("fid", id);
    if (!object) {
      return;
    }
    object.removeFromParent();
  }

  addAxisHelper() {
    let axisHelper = new THREE.AxesHelper(250);
    axisHelper.fid = CONSTANTS.axisHelperId;
    this.scene.add(axisHelper);
  }

  removeAxisHelper() {
    this.removeObject(CONSTANTS.axisHelperId);
  }

  isLoaded() {
    return this.loaded;
  }

  setCameraPosition(x, y, z) {
    this.camera.position.set(x, y, z);
  }

  setCameraLookAt(x, y, z) {
    this.controls.target.set(x, y, z);
  }

  fitBounds() {
    if (!this.boundingBox) {
      return;
    }
    let center = [
      (this.boundingBox.min.x + this.boundingBox.max.x) / 2,
      (this.boundingBox.min.y + this.boundingBox.max.y) / 2,
      (this.boundingBox.min.z + this.boundingBox.max.z) / 2
    ];
    this.controls.target.set(...center);
    // 水平对角线
    let diagonalLength1 = Math.sqrt(
      Math.pow(this.boundingBox.max.x - this.boundingBox.min.x, 2) +
        Math.pow(this.boundingBox.max.y - this.boundingBox.min.y, 2)
    );
    // 垂直对角线
    let diagonalLength2 = Math.sqrt(
      Math.pow(this.boundingBox.max.x - this.boundingBox.min.x, 2) +
        Math.pow(this.boundingBox.max.y - this.boundingBox.min.y, 2) +
        Math.pow(this.boundingBox.max.z - this.boundingBox.min.z, 2)
    );
    let diagonalLength = Math.max(diagonalLength1, diagonalLength2);
    this.camera.position.set(
      Math.sqrt(3 / 8) * diagonalLength + center[0],
      -Math.sqrt(3 / 8) * diagonalLength + center[1],
      this.boundingBox.max.z + diagonalLength1 / 2
    );
  }

  getBoundingBox() {
    return this.boundingBox;
  }

  removeAll() {
    this.scene.remove(this.objectGroup);
    this.objectGroup = new THREE.Group();
    this.scene.add(this.objectGroup);
    this.boundingBox = null;
  }
}

export default ModelViewer