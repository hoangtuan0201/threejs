export const sequenceChaptersXray = [
  {
    id: "start",
    position: 0.1
  },
  {
    id: "Geom3D_393",
    position: 1.5,
    hotspot: {
      position: [27.78, 4.25, -22.3],
      rotation: [0, Math.PI / 1.8, 0],
      detailPosition: [27.78, 5, -22.7],
      detailRotation: [0, Math.PI / 2, 0],
      // Mobile-specific positioning
      mobileDetailPosition: [27.78, 3.8 , -21.5],
      mobileDetailRotation: [0, Math.PI / 2, 0],
      // Hotspot label positioning
      labelPosition: [27.78, 4.6, -21.7],
      labelRotation: [0, 0, 0],
      // Mobile-specific label positioning
      mobileLabelPosition: [27.78, 4.8, -21.7],
      mobileLabelRotation: [0, 0, 0],
      title: "Smart Thermostat",
      description: "The AirSmart Gen 4 Smart Thermostat features Wi‑Fi-enabled multi-zone control, sleek minimal design, and Venturi/Bernoulli-driven airflow that cuts airflow by ~40% for even, draft‑free comfort and up to 50% better efficiency—all in one elegant unit. ",
      link: "https://vimeo.com/912200130"
    },
    lighting: {
      mainSpotlight: {
        position: [28, 5.8, -22.5],
        intensity: 1.5,
        angle: Math.PI / 4,
        penumbra: 0.4,
        color: "#ffff00",
        distance: 12,
        decay: 2,
        castShadow: true
      },

    },
    videoScreen: {
      position: [27.78, 4.7, -21],
      rotation: [0, Math.PI / 2, 0],
      
      // Mobile-specific positioning
      mobilePosition: [27.78, 4.7, -21.5],
      mobileRotation: [0, Math.PI / 2, 0],
      videoId: "https://vimeo.com/912200130",
      title: "Smart Thermostat Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 340, height: 200 }
    }
  },
  {
    id: "indoor",
    position: 2.5,
    hotspot: {
      // position: [31.4, 6.6, -20.7],
      // rotation: [0.1, Math.PI / 1, 0],
      detailPosition: [31.6 , 8.3, -20.6],
      detailRotation: [0, Math.PI / 1, 0],
     // Hotspot label positioning
      mobileLabelPosition: [31.4, 8, -20.5],
      // Hotspot label positioning
      labelPosition:  [31.5, 8, -20.8],
      // Mobile-specific positioning
      mobileDetailPosition: [31.35, 8.3, -20.3],
      mobileDetailRotation: [0, Math.PI / 1, 0],
      title: "Linear Grille",
      description: "The linear grille (linear slot diffuser) is a long, narrow vent cover—usually made of aluminum—installed flush in ceilings, walls, or floors to evenly distribute conditioned air with silent, draft‑free flow and a sleek, minimalist aesthetic. ",
      link: "https://vimeo.com/1118501005"
    },
    grilleConfig: {
      position: [30, 9, -20.5],
      rotation: [0.1, Math.PI / 1, 0],
      scale: [0.05, 0.05, 0.05],
      meshesToHide: [
        "3DGeom-856", "3DGeom-729", "3DGeom-518_1", "3DGeom-455_21", "3DGeom-438_25", "3DGeom-521","3DGeom-896_58", "3DGeom-896_59",
        "3DGeom-455_20", "3DGeom-438_24", "3DGeom-523", "3DGeom-896_74", "3DGeom-896_75",
        "3DGeom-455_11", "3DGeom-438_15", "3DGeom-522", "3DGeom-896_68", "3DGeom-896_69",
        "3DGeom-455_12", "3DGeom-438_16", "3DGeom-524", "3DGeom-896_76", "3DGeom-896_77",
        "3DGeom-455_10", "3DGeom-438_14", "3DGeom-525", "3DGeom-896_72", "3DGeom-896_73",
        "3DGeom-455_24", "3DGeom-438_28", "3DGeom-527", "3DGeom-896_70", "3DGeom-896_71",
        "3DGeom-455_8", "3DGeom-438_12", "3DGeom-526", "3DGeom-896_62", "3DGeom-896_63",
        "3DGeom-455_15", "3DGeom-438_19", "3DGeom-520", "3DGeom-896_66", "3DGeom-896_67",
        "3DGeom-896_2", "3DGeom-896_3", "3DGeom-896_4", "3DGeom-896_5",
        "3DGeom-896_6", "3DGeom-896_7", "3DGeom-896_8", "3DGeom-896_9",
        "3DGeom-896_10", "3DGeom-896_11", "3DGeom-896_12", "3DGeom-896_13",
        "3DGeom-896_14", "3DGeom-896_15", "3DGeom-896_16", "3DGeom-896_17",
        "3DGeom-896_18", "3DGeom-896_19", "3DGeom-896_20", "3DGeom-896_21"
      ],
      hasGrilleSelector: true,
      modelUrls: {
        normal: './lineartest.glb',
        round: './lineartest.glb',
        'linear-bulkhead': './lineartest.glb',
        'linear-fascia': './lineartest.glb',
        'linear-trowelled': './lineartest.glb'
      }
    },
 
    videoScreen: {
      position: [29.7, 8.3, -20.6],
      rotation: [-0.1, Math.PI / 1, 0],
      // Mobile-specific positioning
      mobilePosition: [29.7, 8.5, -20.6],
      mobileRotation: [-0.1, Math.PI / 1, 0],
      videoId: "https://vimeo.com/1118501005",
      title: "Linear Grille Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 340, height: 200 }
    }
  },
  //living room 2
  {
    id: "linear-grille-2",
    position: 4.5,
    hotspot: {
      detailPosition: [23.2, 5.3, -31.9],
      detailRotation: [0, 0, 0],
      // Hotspot label positioning
      mobileLabelPosition: [23, 5.3, -31.9],
      // Hotspot label positioning
      labelPosition: [22.5, 5.5, -31.9],
      // Mobile-specific positioning
      mobileDetailPosition: [23.2, 5.3, -31.9],
      mobileDetailRotation: [0, 0, 0],
      title: "Linear Grille",
      description: "The linear grille (linear slot diffuser) is a long, narrow vent cover—usually made of aluminum—installed flush in ceilings, walls, or floors to evenly distribute conditioned air with silent, draft‑free flow and a sleek, minimalist aesthetic. ",
      link: "https://vimeo.com/1118500811"
    },
    grilleConfig: {
      position: [23.2, 6, -32.4],
      rotation: [0, 0, 0],
      scale: [0.05, 0.02, 0.02],
      meshesToHide: [
        '3DGeom-852', '3DGeom-455_9', '3DGeom-438_13', '3DGeom-878',
        '3DGeom-455_26', '3DGeom-438_30', '3DGeom-879',
        '3DGeom-455_27', '3DGeom-438_31', '3DGeom-880',
        '3DGeom-455_28', '3DGeom-438_32', '3DGeom-881',
        '3DGeom-455_29', '3DGeom-438_33', '3DGeom-882',
        '3DGeom-455_30', '3DGeom-438_34', '3DGeom-883',
        '3DGeom-455_31', '3DGeom-438_35', '3DGeom-884',
        '3DGeom-455_32', '3DGeom-438_36', '3DGeom-885',
        '3DGeom-455_33', '3DGeom-438_37', '3DGeom-886',
        '3DGeom-455_34', '3DGeom-438_38', '3DGeom-887'
      ],
      hasGrilleSelector: true,
      modelUrls: {
        normal: './lineartest.glb',
        round: './lineartest.glb',
        'linear-bulkhead': './lineartest.glb',
        'linear-fascia': './lineartest.glb',
        'linear-trowelled': './lineartest.glb'
      }
    },
    videoScreen: {
      position: [21.4, 5.3, -31.9],
      rotation: [0, 0, 0],
      // Mobile-specific positioning
      mobilePosition: [21.4, 5.3, -31.9],
      mobileRotation: [0, 0, 0],
      videoId: "https://vimeo.com/1118500811",
      title: "Linear Grille Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 340, height: 200 }
    }
  },
  //kitchen room
  {
    id: "linear-grille-3",
    position: 6.0,
    hotspot: {
      detailPosition: [15.5, 5.3, -26.75],
      detailRotation: [0, Math.PI / 1, 0],
      // Hotspot label positioning
      mobileLabelPosition: [15.5, 5.3, -26.75],
      // Hotspot label positioning
      labelPosition: [15.5, 5.3, -26.75],
      // Mobile-specific positioning
      mobileDetailPosition: [15.5, 5.3, -26.75],
      mobileDetailRotation: [0, Math.PI / 1, 0],
      title: "Linear Grille",
      description: "The linear grille (linear slot diffuser) is a long, narrow vent cover—usually made of aluminum—installed flush in ceilings, walls, or floors to evenly distribute conditioned air with silent, draft‑free flow and a sleek, minimalist aesthetic. ",
      link: "https://vimeo.com/1118501437"
    },
    grilleConfig: {
      position: [15, 6, -26.5],
      rotation: [0, Math.PI / 1, 0],
      scale: [0.05, 0.02, 0.02],
      meshesToHide: [
        '3DGeom-853', '3DGeom-891', '3DGeom-455_38', '3DGeom-438_42',
        '3DGeom-892', '3DGeom-455_37', '3DGeom-438_41',
        '3DGeom-893', '3DGeom-455_36', '3DGeom-438_40',
        '3DGeom-894', '3DGeom-455_35', '3DGeom-438_39',
        '3DGeom-895', '3DGeom-455_34', '3DGeom-438_38'
      ],
      hasGrilleSelector: true,
      modelUrls: {
        normal: './lineartest.glb',
        round: './lineartest.glb',
        'linear-bulkhead': './lineartest.glb',
        'linear-fascia': './lineartest.glb',
        'linear-trowelled': './lineartest.glb'
      }
    },
    videoScreen: {
      position: [13.9, 5.3, -26.75],
      rotation: [-0.1, Math.PI / 1, 0],
      // Mobile-specific positioning
      mobilePosition: [13.9, 5.3, -26.75],
      mobileRotation: [-0.1, Math.PI / 1, 0],
      videoId: "https://vimeo.com/1118501437",
      title: "Linear Grille Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 340, height: 200 }
    }
  },
  
  {
    id: "Air Purification",
    position: 7.5,
    hotspot: {
      // position: [14.75, 4, -34],
      // rotation: [0, Math.PI / 2, 0],
      detailPosition: [14.8, 4.2, -34],
      detailRotation: [0, -1.6, 0],
      // Mobile-specific positioning
      mobileDetailPosition: [14.8, 4.2, -34.3],
      mobileDetailRotation: [0, -1.6, 0],
      title: "Air Purification System",
      description: "An Air Purification System uses HEPA (and optionally carbon/UV) filtration to remove allergens, pollutants, odors, and pathogens—improving air quality, reducing sickness, and boosting comfort and HVAC efficiency. ",
      link: "https://vimeo.com/1118501752",
      labelPosition: [14.75, 4.4, -34.3],
      labelRotation: [0, 0, 0],
      // Mobile-specific label positioning
      mobileLabelPosition: [14.75, 4.4, -34.3],
      mobileLabelRotation: [0, 0, 0],
    },
    videoScreen: {
      position: [17.8, 4.7, -32.3],
      rotation: [0, 0, 0],
      // Mobile-specific positioning
      mobilePosition: [17.3, 5.25, -32.3],
      mobileRotation: [0, 0, 0],
      videoId: "https://vimeo.com/1118501752",
      title: "Air Purification Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 320, height: 180 }
    }
  },
  {
    id: "Outdoor",
    position: 11.8,
    hotspot: {
      position: [22.58, 0, -18],
      rotation: [0, Math.PI / 1, 0],
      labelPosition: [22.5, 4.85, -18],
      detailPosition: [22.7, 4.9, -18],
      detailRotation: [0, 0, 0],
      // mobile label
      mobileLabelPosition: [21.8  , 5, -18],

      // Mobile-specific positioning
      mobileDetailPosition: [22, 4.1, -17.8],
      mobileDetailRotation: [0, 0, 0],
      title: "Outdoor Unit",
      description: "The AirSmart Air Purification System delivers whole-home air filtration with HEPA-grade purity, removing pollutants and improving indoor air quality for healthier breathing.",
      link: "https://vimeo.com/912207265"
    },
    videoScreen: {
      position: [21, 4.9, -18],
      rotation: [0, 0, 0],
      // Mobile-specific positioning
      mobilePosition: [22, 5, -17.7],
      mobileRotation: [0, 0, 0],
      videoId: "https://vimeo.com/912207265",
      title: "Outdoor Unit Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 340, height: 200 }
    }
  },
  // study room
  {
    id: "linear-grille-4",
    position: 8.5,
    hotspot: {
      position: [22.58, 0, -18],
      rotation: [0, Math.PI / 1, 0],
      detailPosition: [20.7, 5.5, -21.54],
      detailRotation: [0, Math.PI / 2, 0],
      // Hotspot label positioning
      mobileLabelPosition: [20.7, 5.5, -21.54],
      // Hotspot label positioning
      labelPosition: [20.7, 5.8, -21.54],
      // Mobile-specific positioning
      mobileDetailPosition: [20.7, 5.5, -21.54],
      mobileDetailRotation: [0, Math.PI / 2, 0],
      title: "Linear Grille",
      description: "The linear grille (linear slot diffuser) is a long, narrow vent cover—usually made of aluminum—installed flush in ceilings, walls, or floors to evenly distribute conditioned air with silent, draft‑free flow and a sleek, minimalist aesthetic. ",
      link: "https://vimeo.com/1118500723"
    },
    videoScreen: {
      position: [20.7, 5.5, -19.8],
      rotation: [0, Math.PI / 2, 0],
      // Mobile-specific positioning
      mobilePosition: [20.7, 5.5, -19.8],
      mobileRotation: [0, Math.PI / 2, 0],
      videoId: "https://vimeo.com/1118500723",
      title: "Linear Grille Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 340, height: 200 }
    }
  },
  {
    id: "thermostat-2",
    position: 9.5,
    hotspot: {
      position: [20.7, -2, -20],
      rotation: [0, Math.PI / 2, 0],
      detailPosition: [16.67, 5.5, -23.5],
      detailRotation: [0, -1.6, 0],
      // Mobile-specific positioning
      mobileDetailPosition: [16.67, 5.2, -23.5],
      mobileDetailRotation: [0, -1.6, 0],
      // Hotspot label positioning
      labelPosition: [16.67, 5.8, -23.5],
      labelRotation: [0, 0, 0],
      // Mobile-specific label positioning
      mobileLabelPosition: [16.67, 5.8, -23.5],
      mobileLabelRotation: [0, 0, 0],
      title: "Smart Thermostat",
      description: "The AirSmart Gen 4 Smart Thermostat features Wi‑Fi-enabled multi-zone control, sleek minimal design, and Venturi/Bernoulli-driven airflow that cuts airflow by ~40% for even, draft‑free comfort and up to 50% better efficiency—all in one elegant unit. ",
      link: "https://vimeo.com/1118502490"
    },
    
    videoScreen: {
      position: [16.67, 5.5, -22.5],
      rotation: [0, -1.6, 0],
      // Mobile-specific positioning
      mobilePosition: [16.67, 5.5, -22.5],
      mobileRotation: [0, -1.6, 0],
      videoId: "https://vimeo.com/1118502490",
      title: "Smart Thermostat Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 340, height: 200 }
    }
  },
  {
    id: "base-floor",
    position: 10.5,
    hotspot: {
      position: [22.7, -2, -24],
      rotation: [0, 0, 0],
      detailPosition: [23.2, 2, -24],
      detailRotation: [0, 0, 0],
      // Mobile-specific positioning
      mobileDetailPosition: [23.2, 2, -24],
      mobileDetailRotation: [0, 0, 0],
      // Hotspot label positioning
      labelPosition: [22.7, 2, -24],
      labelRotation: [0, 0, 0],
      // Mobile-specific label positioning
      mobileLabelPosition: [22.7, 2, -24],
      mobileLabelRotation: [0, 0, 0],
      title: "Base Floor System",
      description: "The base floor system houses the main HVAC infrastructure including ductwork, air handlers, and distribution components that deliver conditioned air throughout the building.",
      link: "https://vimeo.com/1118502852"
    },
    videoScreen: {
      position: [21.5, 2, -24],
      rotation: [0, 0, 0],
      // Mobile-specific positioning
      mobilePosition: [21.5, 2, -24],
      mobileRotation: [0, 0, 0],
      videoId: "https://vimeo.com/1118502852",
      title: "Base Floor System Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 340, height: 200 }
    }
  },
  {
    id: "air-duct",
    position: 13,
    hotspot: {
      position: [13, 1.7, -22.2],
      rotation: [0, Math.PI / 1, 0],
      detailPosition: [13, 1, -22.2],
      detailRotation: [0, Math.PI / 1, 0],
      // Mobile-specific positioning
      mobileDetailPosition: [13, 1, -22.2],
      mobileDetailRotation: [0, Math.PI / 1, 0],
      // Hotspot label positioning
      labelPosition: [13, 1.7, -22.2],
      labelRotation: [0, 0, 0],
      // Mobile-specific label positioning
      mobileLabelPosition: [13, 1.7, -22.2],
      mobileLabelRotation: [0, 0, 0],
      title: "Air Duct",
      description: "Air duct system for distributing conditioned air throughout the building with efficient airflow management.",
      link: "https://vimeo.com/1118503191"
    },
    videoScreen: {
      position: [13, 1.9, -22.2],
      rotation: [0, Math.PI / 1, 0],
      // Mobile-specific positioning
      mobilePosition: [13, 1.9, -22.2],
      mobileRotation: [0, Math.PI / 1, 0],
      videoId: "https://vimeo.com/1118503191",
      title: "Air Duct Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 340, height: 200 }
    }
  },

  
  {
    id: "linear-grille-new",
    position: 14,
    hotspot: {
      position: [10.4, 2, -29.7],
      rotation: [0, 0, 0],
      detailPosition: [9.9, 1.8, -29.7],
      detailRotation: [0, 0, 0],
      // Mobile-specific positioning
      mobileDetailPosition: [10.4, 1.8, -29.7],
      mobileDetailRotation: [0, 0, 0],
      title: "Linear Grille",
      description: "The linear grille (linear slot diffuser) is a long, narrow vent cover—usually made of aluminum—installed flush in ceilings, walls, or floors to evenly distribute conditioned air with silent, draft‑free flow and a sleek, minimalist aesthetic.",
      link: "https://vimeo.com/1118503216",
      labelPosition: [10, 2.4, -29.7],
      labelRotation: [0, 0, 0],
      mobileLabelPosition: [10.4, 2, -29.7],
      mobileLabelRotation: [0, 0, 0]
    },
    grilleConfig: {
      position: [9.9, 2.4, -29.7],
      rotation: [0, 0, 0],
      scale: [0.03, 0.01, 0.01],
      meshesToHide: ['3DGeom-431', '3DGeom-437', '3DGeom-438', '3DGeom-514', '3DGeom-437_1', '3DGeom-438_1', '3DGeom-515'],
      hasGrilleSelector: true,
      modelUrls: {
        normal: './lineartest.glb',
        round: './lineartest.glb',
        'linear-bulkhead': './lineartest.glb',
        'linear-fascia': './lineartest.glb',
        'linear-trowelled': './lineartest.glb'
      }
    },
    videoScreen: {
      position: [11.6, 1.8, -29.7],
      rotation: [0, 0, 0],
      mobilePosition: [11.6, 1.8, -29.7],
      mobileRotation: [0, 0, 0],
      videoId: "https://vimeo.com/1118503216",
      title: "Linear Grille Demo",
      size: { width: 320, height: 180 },
      mobileSize: { width: 340, height: 200 }
    }
  }
];
