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
      description: "The AirSmart Gen 4 Smart Thermostat features Wi‑Fi-enabled multi-zone control, sleek minimal design, and Venturi/Bernoulli-driven airflow that cuts airflow by ~40% for even, draft‑free comfort and up to 50% better efficiency—all in one elegant unit. ",
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
      position: [31.4, 6.6, -20.7],
      rotation: [0.1, Math.PI / 1, 0],
      detailPosition: [31.6 , 7.3, -20.6],
      detailRotation: [0, Math.PI / 1, 0],
     // Hotspot label positioning
      mobileLabelPosition: [31.4, 7, -20.5],
      // Hotspot label positioning
      labelPosition:  [31.5, 7, -20.8],
      // Mobile-specific positioning
      mobileDetailPosition: [31.35, 7.3, -20.3],
      mobileDetailRotation: [0, Math.PI / 1, 0],
      title: "Linear Grille",
      description: "The linear grille (linear slot diffuser) is a long, narrow vent cover—usually made of aluminum—installed flush in ceilings, walls, or floors to evenly distribute conditioned air with silent, draft‑free flow and a sleek, minimalist aesthetic. ",
      link: "https://vimeo.com/912201609"
    },
    lighting: {
      mainSpotlight: {
        position: [31.4, 9.5, -20.9],
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
      position: [29.7, 7.3, -20.6],
      rotation: [-0.1, Math.PI / 1, 0],
      // Mobile-specific positioning
      mobilePosition: [29.7, 7.5, -20.6],
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
    position: 7.5,
    hotspot: {
      position: [14.75, 4, -34],
      rotation: [0, Math.PI / 2, 0],
      detailPosition: [14.8, 4.2, -34],
      detailRotation: [0, -1.6, 0],
      // Mobile-specific positioning
      mobileDetailPosition: [14.8, 4.2, -34.3],
      mobileDetailRotation: [0, -1.6, 0],
      title: "Air Purification System",
      description: "An Air Purification System uses HEPA (and optionally carbon/UV) filtration to remove allergens, pollutants, odors, and pathogens—improving air quality, reducing sickness, and boosting comfort and HVAC efficiency. ",
      link: "https://vimeo.com/912208263",
      labelPosition: [14.75, 4.4, -34.3],
      labelRotation: [0, 0, 0],
      // Mobile-specific label positioning
      mobileLabelPosition: [14.75, 4.4, -34.3],
      mobileLabelRotation: [0, 0, 0],
    },
    lighting: {
      mainSpotlight: {
        position: [15.7, 7, -33],
        intensity: 1.5,
        angle: Math.PI / 4,
        penumbra: 0.4,
        color: "#ffff00",
        distance: 12,
        decay: 2,
        castShadow: true
      }
    },
    videoScreen: {
      position: [17.8, 4.7, -32.3],
      rotation: [0, 0, 0],
      // Mobile-specific positioning
      mobilePosition: [17.3, 5.25, -32.3],
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
    position: 11.8,
    hotspot: {
      position: [22.58, 4.45, -18],
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
    lighting: {
      mainSpotlight: {
        position: [22.58, 7.5, -17.6],
        intensity: 1.5,
        angle: Math.PI / 6,
        penumbra: 0.4,
        color: "#ffff00",
        distance: 10,
        decay: 2,
        castShadow: true
      }
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

];
