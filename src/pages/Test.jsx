import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Box, Typography, Paper, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// Component để load và hiển thị model
function ModelViewer({ modelPath, onMeshClick }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();

  // Clone scene để tránh conflict
  const clonedScene = scene.clone();

  // Traverse qua tất cả mesh và thêm click handler
  React.useEffect(() => {
    if (clonedScene) {
      clonedScene.traverse((child) => {
        if (child.isMesh) {
          child.userData.originalName = child.name;
          // Thêm cursor pointer để biết có thể click
          child.userData.clickable = true;
        }
      });
    }
  }, [clonedScene, onMeshClick]);

  // Handler khi click vào object
  const handleClick = (event) => {
    event.stopPropagation();
    const clickedObject = event.object;
    
    if (clickedObject && clickedObject.isMesh) {
      onMeshClick(clickedObject);
    }
  };

  return (
    <primitive 
      ref={modelRef}
      object={clonedScene} 
      scale={[1, 1, 1]}
      position={[0, 0, 0]}
      onClick={handleClick}
    />
  );
}

// Component chính
function Test() {
  const [selectedModel, setSelectedModel] = useState('./lagmodel.glb');
  const [clickedMeshes, setClickedMeshes] = useState([]);

  // Danh sách các model có sẵn
  const availableModels = [
    { path: './lagmodel.glb', name: 'LAG Model' },
    { path: './lineartest.glb', name: 'Linear Test' },
    { path: './3dddd.glb', name: '3D Model' },
    { path: './tree.glb', name: 'Tree Model' },
    { path: './Monitor001.glb', name: 'Monitor 001' },
    { path: './Monitor002.glb', name: 'Monitor 002' }
  ];

  // Handler khi click vào mesh
  const handleMeshClick = (mesh) => {
    const meshInfo = {
      name: mesh.name || 'Unnamed',
      type: mesh.type,
      position: mesh.position.toArray(),
      rotation: mesh.rotation.toArray(),
      scale: mesh.scale.toArray(),
      material: mesh.material?.name || 'No material',
      geometry: mesh.geometry?.type || 'No geometry',
      uuid: mesh.uuid,
      timestamp: new Date().toLocaleTimeString()
    };

    console.log('🎯 Mesh Clicked:', meshInfo);
    console.log('📦 Full Mesh Object:', mesh);
    
    // Thêm vào danh sách đã click
    setClickedMeshes(prev => [meshInfo, ...prev.slice(0, 9)]); // Giữ 10 item gần nhất
  };

  // Handler khi click vào Canvas (để detect mesh)
  const handleCanvasClick = (event) => {
    // Three.js raycasting sẽ được xử lý bởi drei
    console.log('Canvas clicked at:', event.point);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          🔍 Mesh Debug Tool
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Click vào model để xem thông tin mesh trong console và danh sách bên dưới
        </Typography>
        
        {/* Model Selector */}
        <FormControl sx={{ minWidth: 200, mt: 2 }}>
          <InputLabel>Chọn Model</InputLabel>
          <Select
            value={selectedModel}
            label="Chọn Model"
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {availableModels.map((model) => (
              <MenuItem key={model.path} value={model.path}>
                {model.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button 
          sx={{ ml: 2, mt: 2 }}
          variant="outlined"
          onClick={() => setClickedMeshes([])}
        >
          Clear History
        </Button>
      </Paper>

      {/* 3D Scene */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        <Canvas
          camera={{ position: [5, 5, 5], fov: 50 }}
          style={{ background: '#f0f0f0' }}
          onClick={handleCanvasClick}
        >
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />

          {/* Model */}
          <ModelViewer 
            modelPath={selectedModel} 
            onMeshClick={handleMeshClick}
          />

          {/* Controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={50}
            minDistance={1}
            rotateSpeed={0.3}
            enableDamping={true}
            dampingFactor={0.1}
          />

          {/* Grid Helper */}
          <gridHelper args={[20, 20]} />
          
          {/* Axes Helper */}
          <axesHelper args={[5]} />
        </Canvas>

        {/* Overlay thông tin */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(255,255,255,0.9)',
            p: 1,
            borderRadius: 1,
            maxWidth: 300
          }}
        >
          <Typography variant="caption" display="block">
            🎮 Controls: Mouse để orbit, Wheel để zoom
          </Typography>
          <Typography variant="caption" display="block">
            🖱️ Click vào model để debug mesh
          </Typography>
          <Typography variant="caption" display="block">
            📊 Model: {availableModels.find(m => m.path === selectedModel)?.name}
          </Typography>
        </Box>
      </Box>

      {/* Mesh History */}
      {clickedMeshes.length > 0 && (
        <Paper sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            📋 Mesh History (Console có thông tin chi tiết)
          </Typography>
          {clickedMeshes.map((mesh, index) => (
            <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>{mesh.name}</strong> - {mesh.type} - {mesh.timestamp}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Position: [{mesh.position.map(p => p.toFixed(2)).join(', ')}]
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}

export default Test;