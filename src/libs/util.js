import * as THREE from "three"
export default {
  getObjectInfo(object) {
    let properties = Object.assign(
      {
        id: object.id,
        uuid: object.uuid,
        fid: object.fid,
        type: object.type,
        name: object.name,
        visible: object.visible
      },
      object.userData
    );
    if (!object.isMesh) {
      return {
        object: properties
      };
    }
    let geometry = object.geometry;
    let geometries = {
      type: geometry.type,
      uuid: geometry.uuid,
      position: {
        count: geometry.attributes.position.count,
        length: geometry.attributes.position.itemSize
      },
      normal: {
        count: geometry.attributes.normal.count,
        length: geometry.attributes.normal.itemSize
      },
      uv: {
        count: geometry.attributes.uv.count,
        length: geometry.attributes.uv.itemSize
      },
      bounds: new THREE.Box3().expandByObject(object)
    };
    let material = object.material;
    let materials = {
      type: material.type,
      uuid: material.uuid,
      name: material.name,
      color: material.color,
      emissive: material.emissive,
      roughness: material.roughness,
      metalness: material.metalness,
      vertexColors: material.vertexColors,
      map: material.map.uuid,
      side: material.side,
      flatShading: material.flatShading,
      blending: material.blending,
      opacity: material.opacity,
      transparent: material.transparent,
      depthTest: material.depthTest,
      depthWrite: material.depthWrite,
      wireframe: material.wireframe
    };
    return {
      object: properties,
      geometries,
      materials
    };
  },
  getObjectTree(object) {
    let treeList = {
      title: "场景",
      uuid: object.uuid,
      name: object.name,
      fid: object.fid,
      type: object.type,
      expand: true,
      children: []
    };
    object.children.forEach(item => {
      treeList.children.push(getTreeItem(item));
    });
    return [treeList];
    function getTreeItem(obj) {
      let t = {
        title: obj.name,
        uuid: obj.uuid,
        name: obj.name,
        fid: obj.fid,
        type: obj.type,
        expand: false
      };
      if (obj.children && obj.children.length) {
        t.children = [];
        obj.children.forEach(item => {
          t.children.push(getTreeItem(item));
        });
      }
      return t;
    }
  },
  getCameraInfo(camera) {
    return {
      type: camera.type,
      uuid: camera.uuid,
      position: camera.position,
      rotation: {
        x: this.radian2degree(camera.rotation.x),
        y: this.radian2degree(camera.rotation.y),
        z: this.radian2degree(camera.rotation.z)
      },
      scale: camera.scale,
      fov: camera.fov,
      near: camera.near,
      far: camera.far
    };
  },
  threeColor2hex(rgb) {
    return (
      "#" +
      (rgb.r * 255).toString(16) +
      (rgb.g * 255).toString(16) +
      (rgb.b * 255).toString(16)
    );
  },
  hex2ThreeColor(hex) {
    let colorString = hex.replace("#", "");
    let r = Number("0x" + colorString.substring(0, 2)) / 255;
    let g = Number("0x" + colorString.substring(2, 4)) / 255;
    let b = Number("0x" + colorString.substring(4, 6)) / 255;
    return { r, g, b };
  },
  degree2radian(degree) {
    return degree * (Math.PI / 180);
  },
  radian2degree(radian) {
    return radian * 180 / Math.PI
  }
};