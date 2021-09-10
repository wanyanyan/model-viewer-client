import Event from './event'
import util from './util'
import Stats from "stats.js"
import * as THREE from "three"
import light from './light'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import CONSTANTS from './constant'

class ModelViewer extends Event {
  constructor(options) {
    super()
    window.THREE = THREE
    this.options = Object.assign({}, CONSTANTS.options, options)
    let { container, type, url } = options
    if (typeof container === "string") {
      this._container = document.getElementById(container)
    } else if (util.isDOM(container)) {
      this._container = container
    }
    if (!this._container) {
      throw new Error(`Can't get the contaniner of threejs`)
    }
    let { width, height } = this._container.getBoundingClientRect()
    this.width = width
    this.height = height
    if (this.options.stats.show) {
      this._createStats()
    }
    this.loaded = false
    this._init()
    if (url) {
      this.loadModels(type, url)
    }
    window.addEventListener("resize", () => {
      this._onWindowResize()
    })
    this._bindEvent()
  }

  _init() {
    this.scene = new THREE.Scene()

    this.camera = util.createCamera(this.width, this.height)
    this.renderer = util.createRenderer(this.width, this.height)
    this._container.appendChild(this.renderer.domElement)
    CONSTANTS.defaultLights.forEach(l => {
      this.addLight(l)
    })
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0, 0)

    util.createSky(this.scene)
    this._render()
    if (this.options.axisHelper) {
      this.addAxisHelper()
    }
    this.objectGroup = new THREE.Group()
    this.objectGroup.fid = CONSTANTS.objectGroupId
    this.scene.add(this.objectGroup)
  }

  _render() {
    this.stats && this.stats.begin()
    this.renderer.render(this.scene, this.camera)
    this.controls.update()
    this.stats && this.stats.end()
    this.timer = requestAnimationFrame(() => {
      this._render()
    })
    /* if (myObject) {
      myObject.rotation.y += 0.01
    } */
  }

  _createStats() {
    this.stats = new Stats()
    this.stats.showPanel(0)
    this._container.appendChild(this.stats.dom)
    let position = this.options.stats.position
    if (position.indexOf("top") !== -1) {
      this.stats.dom.style.top = "0px"
      this.stats.dom.style.bottom = "initial"
    }
    if (position.indexOf("bottom") !== -1) {
      this.stats.dom.style.bottom = "0px"
      this.stats.dom.style.top = "initial"
    }
    if (position.indexOf("left") !== -1) {
      this.stats.dom.style.left = "0px"
      this.stats.dom.style.right = "initial"
    }
    if (position.indexOf("right") !== -1) {
      this.stats.dom.style.right = "0px"
      this.stats.dom.style.left = "initial"
    }
  }

  _onWindowResize() {
    let { width, height } = this._container.getBoundingClientRect()
    this.width = width
    this.height = height
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
  }

  loadModels(type, url) {
    this._loadIndex = 0 // 用于记录加载了几个模型
    this.startTime = new Date().getTime()
    this._totalModels = 0
    this._virtualModelList = []
    if (type === "modelset") {
      fetch(url)
        .then(res => res.json())
        .then(modelset => {
          if (modelset.bbox) {
            this.boundingBox = util.mergeBoundingBox(this.boundingBox, modelset.bbox)
            this._needBoundingBox = false
            this.fitBounds()
          } else {
            this._needBoundingBox = true
          }
          this.baseUrl = util.parseUrl(url).baseUrl
          this._addModels(modelset.models)
        })
    } else {
      this._needBoundingBox = true
      this._addModel({
        format: type,
        url
      })
    }
  }

  _addModels(list, parent) {
    list.forEach(option => {
      let { id, type, format, name, model, properties, models, ref, location, rotation } = option
      if (type === 'model') { // 实体模型
        this._addModel({
          id,
          format, 
          url: `${this.baseUrl}/${model}`,
          name,
          properties,
          parent
        })
      } else if (type === 'virtual_model') { // 虚拟模型
        this._virtualModelList.push({
          id,
          name,
          properties,
          ref,
          location,
          rotation,
          parent
        });
      } else if (type === 'group') {
        this._addGroup({
          id,
          name,
          properties,
          models,
          parent
        })
      }
    })
  }

  _addModel(options) { // 添加一个实体模型
    this._totalModels++ // 用于计数
    let {format, url} = options
    let cb = (object) => {
      this._modelLoaded(object, options)
    }
    if (format === "gltf") {
      util.loadGlb(url, cb)
    } else if (format === "obj") {
      util.loadObj(url, cb)
    } else {
      util.loadDrc(url, cb)
    }
  }

  _addGroup(options) {
    let group = new THREE.Group()
    util.assignObject(group, options)
    if (options.parent) {
      options.parent.add(group)
    } else {
      this.objectGroup.add(group)
    }
    this._addModels(options.models, group)
  }

  _addVirtualModel(options) {
    let {ref, location, rotation, parent} = options
    let sourceObject = this.scene.getObjectByProperty('fid', ref)
    if (!sourceObject) {
      return
    }
    let targetObject = sourceObject.clone()
    util.assignObject(targetObject, options)
    targetObject.traverse(e => {
      if (e.isMesh) {
        e.castShadow = true;
        e.receiveShadow = true;
      }
    });
    util.rotate(targetObject, rotation)
    util.translate(targetObject, location)
    if (this._needBoundingBox) {  // 计算包围盒
      let box3 = new THREE.Box3()
      box3.expandByObject(targetObject)
      this.boundingBox = util.mergeBoundingBox(this.boundingBox, box3)
    }
    if (parent) {
      parent.add(targetObject)
    } else {
      this.objectGroup.add(targetObject)
    }
  }

  _modelLoaded(object, options) {
    util.assignObject(object, options)
    object.traverse(e => { // 启用阴影
      if (e.isMesh) {
        e.castShadow = true
        e.receiveShadow = true
      }
    })
    if (this._needBoundingBox) {  // 计算包围盒
      let box3 = new THREE.Box3()
      box3.expandByObject(object)
      this.boundingBox = util.mergeBoundingBox(this.boundingBox, box3)
    }
    if (options.parent) {
      options.parent.add(object)
    } else {
      this.objectGroup.add(object)
    }
    this._loadIndex++
    if (this._loadIndex >= this._totalModels) { // 实体模型加载完成
      this._virtualModelList.forEach(vpt => {
        this._addVirtualModel(vpt)
      })
      this.loaded = true
      this.fire("loaded")
      this.endTime = new Date().getTime()
      if (this._needBoundingBox) {
        this.fitBounds()
      }
    }
  }

  addLight(options) {
    let lightObject = light.create(options)
    this.scene.add(lightObject)
    if (options.type === 'spot') {
      this.scene.add(lightObject.target)
    }
  }

  updateLight(options) {
    let object = this.scene.getObjectByProperty("fid", options.id)
    if (!object) {
      return
    }
    util.setLightProperty(object, options)
  }

  removeLight(id) {
    this.removeObject(id)
  }

  removeObject(id) {
    let object = this.scene.getObjectByProperty("fid", id)
    if (!object) {
      return
    }
    object.removeFromParent()
  }

  addAxisHelper() {
    let axisHelper = new THREE.AxesHelper(250)
    axisHelper.fid = CONSTANTS.axisHelperId
    this.scene.add(axisHelper)
  }

  removeAxisHelper() {
    this.removeObject(CONSTANTS.axisHelperId)
  }

  isLoaded() {
    return this.loaded
  }

  setCameraPosition(x, y, z) {
    this.camera.position.set(x, y, z)
  }

  setCameraLookAt(x, y, z) {
    this.controls.target.set(x, y, z)
  }

  fitBounds() {
    if (!this.boundingBox) {
      return
    }
    let center = util.getCenterFromBox3(this.boundingBox)
    this.controls.target.set(...center)
    // 水平对角线
    let diagonalLength1 = Math.sqrt(
      Math.pow(this.boundingBox.max.x - this.boundingBox.min.x, 2) +
        Math.pow(this.boundingBox.max.y - this.boundingBox.min.y, 2)
    )
    // 垂直对角线
    let diagonalLength2 = Math.sqrt(
      Math.pow(this.boundingBox.max.x - this.boundingBox.min.x, 2) +
        Math.pow(this.boundingBox.max.y - this.boundingBox.min.y, 2) +
        Math.pow(this.boundingBox.max.z - this.boundingBox.min.z, 2)
    )
    let diagonalLength = Math.max(diagonalLength1, diagonalLength2)
    this.camera.position.set(
      Math.sqrt(3 / 8) * diagonalLength + center[0],
      -Math.sqrt(3 / 8) * diagonalLength + center[1],
      this.boundingBox.max.z + diagonalLength1 / 2
    )
  }

  getBoundingBox() {
    return this.boundingBox
  }

  removeAll() {
    this.scene.remove(this.objectGroup)
    this.objectGroup = new THREE.Group()
    this.scene.add(this.objectGroup)
    this.boundingBox = null
  }

  getStatistics() {
    const info = { components: 0, index: 0 }
    this.scene.traverse(object => {
      util.getObjectInfo(object, info)
    })
    return {
      components: info.components,
      index: Math.round(info.index / 3),
      time: this.endTime - this.startTime
    }
  }

  _bindEvent() {
    let canvas = this.renderer.domElement
    canvas.onclick = (e) => {
      this.fire('click', e)
    }
    canvas.onmousemove = (e) => {
      this.fire('mousemove', e)
    }
  }
}

export default ModelViewer