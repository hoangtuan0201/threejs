export const sequenceChapters = [
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
      detailPosition: [27.78, 4, -22.7],
      detailRotation: [0, Math.PI / 2, 0],
      targetPosition: [28.2, 5, -22.67],
      // Giới hạn góc quay ngang (azimuth) cho hotspot này
      azimuthLimits: {
        min: (40 * Math.PI) / 180,   // ~0.698 rad
        max: (120 * Math.PI) / 180   // ~2.199 rad
      },
      // Mobile-specific positioning
      mobileDetailPosition: [27.78, 3.8 , -22],
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
  
    videoScreen: {
      position: [27.78, 4, -21],
      rotation: [0, Math.PI / 2, 0],
      
      // Mobile-specific positioning
      mobilePosition: [27.78, 4.7, -21.6],
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
      targetPosition: [30.6, 7.933, -22.6],
      // Giới hạn góc quay ngang cho Linear Grille
      azimuthLimits: {
        min: Math.PI - Math.PI / 6, //  -30
        max: Math.PI + Math.PI / 6  // -30
        },

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
      targetPosition: [23.1, 5, -31.115],
      // Giới hạn góc quay ngang cho Linear Grille 2
      azimuthLimits: { 
        min: -Math.PI / 6, // -30°
        max:  Math.PI / 6  // +30°
      },

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
      targetPosition: [16.1, 5.2, -29],
      azimuthLimits: {
        min: Math.PI - Math.PI / 6, //  -30
        max: Math.PI + Math.PI / 20  // -30
        },
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
      position: [14.75, 4, -34],
      rotation: [0, Math.PI / 2, 0],
      detailPosition: [14.8, 3.6, -34],
      detailRotation: [0, -1.6, 0],
      targetPosition: [14, 5, -34],
      azimuthLimits: { 
        min: -110 * Math.PI / 180, // ~ -1.919 rad
        max: -70 * Math.PI / 180   // ~ -1.222 rad
      },

      // Mobile-specific positioning
      mobileDetailPosition: [14.8, 3.6, -34],
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
      position: [14.8, 4.58, -34],
      rotation: [0, -1.6, 0],
      // Mobile-specific positioning
      mobilePosition: [14.8, 4.5, -34],
      mobileRotation: [0, -1.6, 0],
      videoId: "https://vimeo.com/1118501752",
      title: "Air Purification Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 320, height: 180 }
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
      targetPosition: [22.2, 5.4, -20.7],
       azimuthLimits: {
        min: (40 * Math.PI) / 180,   // ~0.698 rad
        max: (120 * Math.PI) / 180   // ~2.199 rad
      },
      // Hotspot label positioning
      mobileLabelPosition: [20.7, 5.8, -21],
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
  //bedroom

  {
    id: "thermostat-2",
    position: 9.5,
    hotspot: {
      position: [20.7, -2, -20],
      rotation: [0, Math.PI / 2, 0],
      detailPosition: [16.67, 5.5, -22.8],
      detailRotation: [0, -1.6, 0],
      targetPosition: [16.1, 5, -23],
      azimuthLimits: {
        min: -100 * Math.PI / 180, // ~ -1.745 rad
        max: -75 * Math.PI / 180   // ~ -1.396 rad
      },
      // Mobile-specific positioning
      mobileDetailPosition: [16.67, 5.2, -22.8],
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
      position: [16.67, 5.5, -24.5],
      rotation: [0, -1.6, 0],
      // Mobile-specific positioning
      mobilePosition: [16.67, 5.5, -24.5],
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
      targetPosition: [21.82  , 1.83, -22.9],
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
    id: "Outdoor",
    position: 11.8,
    hotspot: {
      position: [22.58, 0, -18],
      rotation: [0, Math.PI / 1, 0],
      labelPosition: [22.5, 4.85, -18],
      detailPosition: [22.7, 4.9, -18],
      detailRotation: [0, 0, 0],
      targetPosition: [21.903, 5, -16.823],
      azimuthLimits: {
        min: -15 * Math.PI / 180, // ~ -0.262 rad
        max: 20 * Math.PI / 180   // ~ 0.349 rad
      },

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
  {
    id: "air-duct",
    position: 13,
    hotspot: {
      position: [13, 1.7, -22.2],
      rotation: [0, Math.PI / 1, 0],
      detailPosition: [13, 1, -22.2],
      detailRotation: [0, Math.PI / 1, 0],
      targetPosition: [13.3, 1.8, -23],
      azimuthLimits: {
        min: Math.PI - Math.PI / 6, //  -30
        max: Math.PI + Math.PI / 6  // -30
      },
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
      link: "https://vimeo.com/1118503191",
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
      targetPosition: [10.8, 1.9, -29.1],
      azimuthLimits: {
        min: -23 * Math.PI / 180, // ~ -0.262 rad
        max: 23 * Math.PI / 180   // ~ 0.349 rad
      },
      // Mobile-specific positioning
      mobileDetailPosition: [10.4, 1.8, -29.7],
      mobileDetailRotation: [0, 0, 0],
      // Hotspot label positioning
      labelPosition: [10, 2.4, -29.7],
      labelRotation: [0, 0, 0],
      // Mobile-specific label positioning
      mobileLabelPosition: [10.4, 2, -29.7],
      mobileLabelRotation: [0, 0, 0],
      title: "Linear Grille",
      description: "The linear grille (linear slot diffuser) is a long, narrow vent cover—usually made of aluminum—installed flush in ceilings, walls, or floors to evenly distribute conditioned air with silent, draft‑free flow and a sleek, minimalist aesthetic.",
      link: "https://vimeo.com/1118503216",
      hiddenMeshes: ["3DGeom-78"]
    },
    videoScreen: {
      position: [11.6, 1.8, -29.7],
      rotation: [0, 0, 0],
      // Mobile-specific positioning
      mobilePosition: [11.6, 1.8, -29.7],
      mobileRotation: [0, 0, 0],
      videoId: "https://vimeo.com/1118503216",
      title: "Linear Grille Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 340, height: 200 }
    }
  }

];
