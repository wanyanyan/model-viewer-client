export default {
  formats: ["glb", "gltf", "obj", "drc", "json"],
  lights: {
    direction: {
      name: "平行光",
      color: "#ffffff",
      intensity: 1,
      position: [0, 1, 0]
    },
    point: {
      name: "点光源",
      color: "#ffffff",
      position: [0, 1, 0],
      intensity: 1,
      distance: 100,
      decay: 1
    },
    spot: {
      name: "聚光灯",
      color: "#ffffff",
      position: [0, 1, 0],
      intensity: 1
    }
  }
};