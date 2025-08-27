// Danh sách các mesh sẽ được ẩn cho từng sequence chapter hotspot

export const sequenceHiddenMeshes = {
  // Smart Thermostat - Ẩn tường xung quanh để hiển thị thermostat
  "Geom3D_393": {
    hiddenMeshes: [
      "3DGeom-9407",
      "3DGeom-9761"
    ],
    hiddenMaterials: [
      "Timber joist"
    ],
    transitionDuration: 800, // ms
    fadeOpacity: 0.1
  },
  
  // Linear Grille - Ẩn trần để hiển thị hệ thống thông gió
  "indoor": {
    hiddenMeshes: [
      "3DGeom-10381",
      "3DGeom-9761"
      
    ],
    hiddenMaterials: [
      'Furniture wood',
      "Timber joist"
      
    ],
    transitionDuration: 800,
    fadeOpacity: 0.1
  },
  
  // Air Purification System - Ẩn tường và sàn để hiển thị hệ thống lọc khí
  "Air Purification": {
    hiddenMeshes: [
      "3DGeom-9290",//door 
      "3DGeom-9289",//door
      "3DGeom-9288",
      "3DGeom-9286",//door
      "3DGeom-256_2",//doorlock
      "3DGeom-254_2",//doorlock
      "3DGeom-253_2",//doorlock
      "3DGeom-255_2",//doorlock
      "3DGeom-254_3",//doorlock
      "3DGeom-253_3",//doorlock
      "3DGeom-255_3",//doorlock
      "3DGeom-256_3",//doorlock
      "3DGeom-9761", //roof
      "3DGeom-9407", //wall
      "3DGeom-9774",
    ],
    hiddenMaterials: [
      "Brown Furniture",
     
    ],
    transitionDuration: 800,
    fadeOpacity: 0.1
  },
  
  // Outdoor Unit - Ẩn tường ngoài để hiển thị unit ngoài trời
  "Outdoor": {
    hiddenMeshes: [
      "3DGeom-76",
    ],
    hiddenMaterials: [
    
    ],
    transitionDuration: 800,
    fadeOpacity: 0.1
  }
};

// Cấu hình chung cho hiệu ứng ẩn/hiện
export const hiddenMeshConfig = {
  defaultTransitionDuration: 800,
  defaultFadeOpacity: 0.1,
  easingFunction: 'easeInOutCubic',
  
  // Các thuộc tính material khi ẩn
  hiddenMaterialProps: {
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
    alphaTest: 0.01
  },
  
  // Các thuộc tính material khi hiện
  visibleMaterialProps: {
    transparent: false,
    opacity: 1.0,
    depthWrite: true,
    alphaTest: 0
  }
};