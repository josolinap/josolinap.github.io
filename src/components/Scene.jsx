import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box, Text } from '@react-three/drei'
import * as THREE from 'three'

function SpinningBox(props) {
    const mesh = useRef()
    useFrame((state, delta) => (mesh.current.rotation.x = mesh.current.rotation.y += delta))
    return (
        <Box {...props} ref={mesh}>
            <meshStandardMaterial color={'hotpink'} />
        </Box>
    )
}

function Keyword({ keyword, sentiment, ...props }) { // Accept sentiment prop
    const textRef = useRef();
    const initialPosition = useMemo(() => props.position, []);

    const sentimentColor = useMemo(() => {
        switch (sentiment) {
            case 'positive':
                return '#98c379'; // Greenish
            case 'negative':
                return '#e06c75'; // Reddish
            case 'neutral':
                return '#61afef'; // Bluish
            default:
                return 'white'; // Default color
        }
    }, [sentiment]);

    useFrame(({ clock }) => {
        // Floating animation
        textRef.current.position.y = initialPosition[1] + Math.sin(clock.getElapsedTime() * 0.5 + initialPosition[0]) * 0.5;

        // Fade in animation
        if (textRef.current.material.opacity < 1) {
            textRef.current.material.opacity = THREE.MathUtils.lerp(textRef.current.material.opacity, 1, 0.05);
        }
    });

    const handleClick = () => {
        try {
            // Check if the keyword is a valid URL
            new URL(keyword);
            window.open(keyword, '_blank', 'noopener,noreferrer');
        } catch (_) {
            // If not a URL, just log it. A popup could be implemented here.
            console.log(`Clicked keyword: ${keyword}`);
        }
    };

    return (
        <Text
            ref={textRef}
            {...props}
            fontSize={0.4}
            color={sentimentColor} // Apply sentiment-based color
            anchorX="center"
            anchorY="middle"
            material-transparent={true}
            material-opacity={0}
            onClick={handleClick}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
            {keyword}
        </Text>
    );
}


function Scene({ keywords, sentiment }) { // Accept sentiment prop
  const keywordPositions = useMemo(() => {
    if (!keywords) return [];
    return keywords.map((_, i) => {
        const angle = (i / keywords.length) * Math.PI * 2;
        const radius = 3 + Math.random() * 1;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 5;
        return [x, y, z];
    });
  }, [keywords]);

  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} camera={{ position: [0, 0, 7] }}>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} />
      <SpinningBox position={[0, 0, 0]} />
      {keywords && keywords.map((keyword, i) => (
          <Keyword key={`${keyword}-${i}`} keyword={keyword} position={keywordPositions[i]} sentiment={sentiment} />
      ))}
      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}

export default Scene
