export default {
  formats: ['glb', 'gltf', 'obj', 'drc', 'json'],
  lights: {
    direction: {
      color: '#ffffff',
      intensity: 1,
      position: [0, 1, 0],
      target: [0, 0, 0]
    },
    point: {
      color: '#ffffff',
      intensity: 1,
      distance: 100,
      decay: 1
    },
    spot: {
      color: '#ffffff',
      intensity: 1,
      distance: 100,
      angle: Math.PI / 2,
      penumbra: 0,
      decay: 1
    }
  }
}