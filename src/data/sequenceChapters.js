export const sequenceChapters = [
  {
    id: "start"
  },
  {
    id: "Geom3D_393",
    hotspot: {
      position: [27.78, 4.25, -22.3],
      rotation: [0, Math.PI / 1.8, 0],
      detailPosition: [27.78, 5, -22.7],
      detailRotation: [0, Math.PI / 2, 0],
      // Mobile-specific positionin
      mobileDetailPosition: [27.78, 3.8 , -21.5],
      mobileDetailRotation: [0, Math.PI / 2, 0],
      // Hotspot label positioning
      labelPosition: [27.78, 4.8, -21.7],
      labelRotation: [0, 0, 0],
      // Mobile-specific label positioning
      mobileLabelPosition: [27.78, 5, -21.5],
      mobileLabelRotation: [0, 0, 0],
      title: "Smart Thermostat",
      description: "The AirSmart Gen 4 Smart Thermostat features Wi‑Fi-enabled multi-zone control, sleek minimal design, and Venturi/Bernoulli-driven airflow that cuts airflow by ~40% for even, draft‑free comfort and up to 50% better efficiency—all in one elegant unit. ",
      link: "https://vimeo.com/912200130"
    },
    lighting: {
      mainSpotlight: {
        position: [28, 5.8, -22.5],
        intensity: 0.8,
        angle: Math.PI / 4,
        penumbra: 0.4,
        color: "#ffff00",
        distance: 12,
        decay: 2,
        castShadow: false
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
    hotspot: {
      position: [31.4, 6.35, -20.7],
      rotation: [0.1, Math.PI / 1, 0],
      detailPosition: [31.3 , 7, -20.3],
      detailRotation: [0, Math.PI / 1, 0],
     // Hotspot label positioning
       mobileLabelPosition: [31.4, 7, -20.5],
      // Hotspot label positioning
      labelPosition:  [31.5, 7, -20.8],
      // Mobile-specific positioning
      mobileDetailPosition: [31, 7.3, -21.3],
      mobileDetailRotation: [0, Math.PI / 1, 0],
      title: "Linear Grille",
      description: "The linear grille (linear slot diffuser) is a long, narrow vent cover—usually made of aluminum—installed flush in ceilings, walls, or floors to evenly distribute conditioned air with silent, draft‑free flow and a sleek, minimalist aesthetic. ",
      link: "https://vimeo.com/912201609"
    },
    lighting: {
      mainSpotlight: {
        position: [31.4, 8, -20.9],
        intensity: 1,
        angle: Math.PI / 4,
        penumbra: 0.4,
        color: "#ffff00",
        distance: 12,
        decay: 2,
        castShadow: false
      },

    },
    videoScreen: {
      position: [29.7, 7, -20.3],
      rotation: [-0.1, Math.PI / 1, 0],
      // Mobile-specific positioning
      mobilePosition: [29.7, 7.3, -21.3],
      mobileRotation: [-0.1, Math.PI / 1, 0],
      videoId: "https://vimeo.com/912201609",
      title: "Linear Grille Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 340, height: 200 }
    }
  },
  {
    id: "Air Purification",
    hotspot: {
      position: [16.8, 4.3, -32.3],
      rotation: [0, Math.PI / 1, 0],
      detailPosition: [15.3, 4.5, -32.3],
      detailRotation: [0, 0, 0],
      // Mobile-specific positioning
      mobileDetailPosition: [16.6, 4.2, -31.8],
      mobileDetailRotation: [0, 0, 0],
      title: "Air Purification System",
      description: "An Air Purification System uses HEPA (and optionally carbon/UV) filtration to remove allergens, pollutants, odors, and pathogens—improving air quality, reducing sickness, and boosting comfort and HVAC efficiency. ",
      link: "https://vimeo.com/912208263",
      labelPosition: [16.5, 4.8, -32.3],
      labelRotation: [0, 0, 0],
      // Mobile-specific label positioning
      mobileLabelPosition: [16.5, 4.8, -32.3],
      mobileLabelRotation: [0, 0, 0],
    },
    lighting: {
      mainSpotlight: {
        position: [16.3, 6, -32.3],
        intensity: 2,
        angle: Math.PI / 3,
        penumbra: 0.4,
        color: "#ffff00",
        distance: 12,
        decay: 2,
        castShadow: false
      }
    },
    videoScreen: {
      position: [17.8, 4.7, -32.3],
      rotation: [0, 0, 0],
      // Mobile-specific positioning
      mobilePosition: [17.3, 5, -31.8],
      mobileRotation: [0, 0, 0],
      videoId: "https://vimeo.com/912208263",
      title: "Air Purification Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 320, height: 180 }
    }
  },
  {
    id: "Outdoor",
    hotspot: {
      position: [22.58, 4.45, -17.8],
      rotation: [0, Math.PI / 1, 0],
      labelPosition: [22.5, 4.85, -17.8],
      detailPosition: [22.58, 4.9, -17.8],
      detailRotation: [0, 0, 0],
      // Mobile-specific positioning
      mobileDetailPosition: [22.7, 4.7, -17.7],
      mobileDetailRotation: [0, 0, 0],
      title: "Outdoor Unit",
      description: "The AirSmart Air Purification System delivers whole-home air filtration with HEPA-grade purity, removing pollutants and improving indoor air quality for healthier breathing.",
      link: "https://vimeo.com/912207265"
    },
    lighting: {
      mainSpotlight: {
        position: [22.58, 7.5, -17.6],
        intensity: 0.75,
        angle: Math.PI / 6,
        penumbra: 0.4,
        color: "#ffff00",
        distance: 10,
        decay: 2,
        castShadow: true
      }
    },
    videoScreen: {
      position: [21, 4.9, -17.8],
      rotation: [0, 0, 0],
      // Mobile-specific positioning
      mobilePosition: [21.2, 4.7, -17.7],
      mobileRotation: [0, 0, 0],
      videoId: "https://vimeo.com/912207265",
      title: "Outdoor Unit Demo",
      size: { width: 320, height: 180 },
      // Mobile-specific size
      mobileSize: { width: 340, height: 200 }
    }
  },

];
