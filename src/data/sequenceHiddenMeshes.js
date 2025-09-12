// Danh sách các mesh sẽ được ẩn cho từng sequence chapter hotspot

export const sequenceHiddenMeshes = {
  // Smart Thermostat - Không ẩn gì vì không có gì trong tường
  "Geom3D_393": {
    hiddenMeshes: [],
    hiddenMaterials: [],
    transitionDuration: 400, // ms
    fadeOpacity: 0.1
  },
  
  // Linear Grille - Ẩn trần để hiển thị hệ thống thông gió
  "indoor": {
    hiddenMeshes: [
      "3DGeom-10381",
      "3DGeom-9761",
      "3DGeom-9699",
      "3DGeom-9698",
      "3DGeom-9700",
      "3DGeom-9701",
      "3DGeom-9702",
      "3DGeom-9703",
      "3DGeom-9704",
      "3DGeom-9705",
      "3DGeom-9706",
      "3DGeom-9707",
      "3DGeom-9708",
      "3DGeom-9709",
      "3DGeom-9710",
      "3DGeom-9711",
      "3DGeom-9712",
      "3DGeom-9713",
      "3DGeom-9714",
      "3DGeom-9715",
      "3DGeom-9716",
      "3DGeom-9717",
      "3DGeom-9718",
      "3DGeom-9719",
      "3DGeom-9720",
      "3DGeom-9721",
      "3DGeom-9722",
      "3DGeom-9723",
      "3DGeom-9724",
      "3DGeom-9725",
      "3DGeom-9726",
      "3DGeom-9727",
      "3DGeom-9728",
      "3DGeom-9729",
      "3DGeom-9730",
      "3DGeom-9731",
      "3DGeom-9732",
      "3DGeom-9733",
      "3DGeom-9734",
      "3DGeom-9735",
      "3DGeom-9736",
      "3DGeom-9737",
      "3DGeom-9738",
      "3DGeom-9739",
      "3DGeom-9740",
      "3DGeom-9741",
      "3DGeom-9742",
      "3DGeom-9743",
      "3DGeom-9744",
      "3DGeom-9745",
      "3DGeom-9746",
      "3DGeom-9747",
      "3DGeom-9748",
      "3DGeom-9749",
      "3DGeom-9750",
      "3DGeom-9751",
      "3DGeom-9752",
      "3DGeom-9697",
      //DROP LIGHT
      "3DGeom-9897",
      "3DGeom-9898",
      '3DGeom-9883_3',
      '3DGeom-9883_1',
      '3DGeom-9883_4',
      '3DGeom-9899',
      '3DGeom-9883_5',
      '3DGeom-9883',
      '3DGeom-9883_2',
      '3DGeom-9889'
    ],
    hiddenMaterials: [
      "Timber joist"
      
    ],
    transitionDuration: 400,
    fadeOpacity: 0.1
  },
  //living room 2 linear grille
  "linear-grille-2":{
      hiddenMeshes: [
        '3DGeom-9761',
        '3DGeom-9614',
        '3DGeom-9616',
        '3DGeom-9615',
        '3DGeom-9617',
        '3DGeom-9618',
        '3DGeom-9619',
        '3DGeom-9620',
      ],
      hiddenMaterials: [
        "Timber joist"
      ],

  },
  //kitchen linear grille

  "linear-grille-3":{
      hiddenMeshes: [
        '3DGeom-9761',
        '3DGeom-9654',
        '3DGeom-9653',
        '3DGeom-9645',
        '3DGeom-9647',
        '3DGeom-9646',
        '3DGeom-9652'
      ],
      hiddenMaterials: [
        "Timber joist"
      ],

  },
  // Air Purification System - Ẩn tường và sàn để hiển thị hệ thống lọc khí
  "Air Purification": {
    hiddenMeshes: [
      "3DGeom-9290",//door 
      "3DGeom-9289",//door
      '3DGeom-9287',
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
     
    ],
    transitionDuration: 400,
    fadeOpacity: 0.1
  },
  
  // Outdoor Unit - Ẩn tường ngoài để hiển thị unit ngoài trời
  "Outdoor": {
    hiddenMeshes: [
    ],
    hiddenMaterials: [
    ],
    transitionDuration: 400,
    fadeOpacity: 0.1
  },
  
  // Linear Grille 4 study room
  "linear-grille-4": {
    hiddenMeshes: [
      "3DGeom-9761",
      '3DGeom-9436',
      
    ],
    hiddenMaterials: [
      "Timber joist"
    ],
    transitionDuration: 400,
    fadeOpacity: 0.1
  },
  
  // Smart Thermostat 2 - bed room - Không ẩn gì vì không có gì trong tường
  "thermostat-2": {
    hiddenMeshes: [],
    hiddenMaterials: [],
    transitionDuration: 400,
    fadeOpacity: 0.1
  },
  
  // Base Floor System - Ẩn sàn để hiển thị hệ thống dưới sàn
  "base-floor": {
    hiddenMeshes: [
      '3DGeom-78',
      '3DGeom-426',
      '3DGeom-425',
      '3DGeom-76'
    ],
    hiddenMaterials: [
    ],
    transitionDuration: 400,
    fadeOpacity: 0.1
  }
};

// Cấu hình chung cho hiệu ứng ẩn/hiện
export const hiddenMeshConfig = {
  defaultTransitionDuration: 400,
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