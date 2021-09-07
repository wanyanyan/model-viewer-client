export default {
  options: {
    container: "",
    type: "gltf",
    url: "",
    axisHelper: true,
    stats: {
      show: true,
      position: "top-left"
    }
  },
  ambientLightId: "light-environment",
  directionLightId: "light-direction",
  objectGroupId: "object-group",
  axisHelperId: "axis-helper",
  defaultLights: [
    {
      id: "light-environment",
      type: "environment",
      color: "#ffffff",
      intensity: 1
    },
    {
      id: "light-direction",
      type: "direction",
      color: "#ffffff",
      intensity: 1,
      position: [1000, 1000, 10000]
    }
  ]
};