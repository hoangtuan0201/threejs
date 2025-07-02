export const sequenceChapters = [
  {
    id: "start",
    range: [0, 0.3],
    position: [27.97, 5, -23],
    title: "Welcome to AirSmart",
    description: "Explore the most advanced smart air conditioning system.",
  },
  {
    id: "Geom3D_393",
    range: [0.3, 1],
    position: [27.5, 4.7, -21.08],
    title: "Thermostat",
    description: "Automatically adjusts temperature and airflow to optimize comfort.",
    // Hotspot data for when geometry is clicked
    hotspot: {
      position: [27.78, 4.43, -22.5],
      title: "Smart Thermostat",
      description: "Intelligent temperature control with AI that automatically learns your usage habits. The system automatically adjusts temperature based on usage patterns and weather.",
      link: "/brochures/thermostat_specs.pdf",
      videoId: "mC1Ket54DW8"
    },  
    // Video screen for this chapter
    videoScreen: {
      position: [27.78, 4.43, -22.0],
      videoId: "mC1Ket54DW8",
      title: "Smart Thermostat Demo",
      size: { width: 320, height: 180 }
    }
  },
  {
    id: "indoor",
    range: [1, 2],
    position: [22, 5, -21],
    title: "Linear Grille",
    description: "Elegant design that blends with any interior space, helping to distribute air evenly throughout the room.",
    // Hotspot data for when geometry is clicked
    hotspot: {
      position: [31.4, 6.35, -20.7],
      title: "Linear Grille",
      description: "Premium linear grille with adjustable airflow direction. The sleek design integrates seamlessly with modern interiors while providing optimal air distribution.",
      link: "/brochures/linear_grille_specs.pdf",
      videoId: "Ks-_Mh1QhMc"
    },
    // Video screen for this chapter
    videoScreen: {
      position: [20.5, 8.5, -19.8],
      videoId: "Ks-_Mh1QhMc",
      title: "Linear Grille Demo",
      size: { width: 320, height: 180 }
    }
  },
  {
    id: "end",
    range: [2, 3],
    position: [22, 5, -21],
    title: "Tour Complete",
    description: "Thank you for exploring the AirSmart air conditioning system!",
  },
];
