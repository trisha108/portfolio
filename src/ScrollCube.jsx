import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ScrollCube({ scrollRef }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    const scroller = scrollRef.current;
    if (!container || !scroller) return;

    const scene = new THREE.Scene();
    const W = window.innerWidth;
    const H = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);

    const material = new THREE.MeshPhysicalMaterial({
      color: 0x88aadd,
      metalness: 0.0,
      roughness: 0.0,
      transmission: 0.95,
      thickness: 0.5,
      reflectivity: 1,
      iridescence: 1,
      iridescenceIOR: 2.2,
      iridescenceThicknessRange: [200, 1000],
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      envMapIntensity: 3,
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0.6,
    });
    cube.add(new THREE.LineSegments(edges, lineMat));

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const light1 = new THREE.PointLight(0x166534, 3, 10);
    light1.position.set(2, 2, 2);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x4ade80, 3, 10);
    light2.position.set(-2, -1, 1);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xbbf7d0, 2, 10);
    light3.position.set(0, 3, -2);
    scene.add(light3);

    const waypoints = [
      { x: 0, y: 0 },
      { x: 2.5, y: 0.8 },
      { x: -2.2, y: -0.6 },
      { x: 1.8, y: -1.2 },
      { x: -1.5, y: 1.0 },
      { x: 2.0, y: 0.3 },
      { x: -2.5, y: -0.8 },
      { x: 0.5, y: 1.5 },
      { x: -1.0, y: -1.5 },
      { x: 2.2, y: 0.6 },
    ];

    function getPositionAtScroll(fraction) {
      const total = waypoints.length - 1;
      const pos = fraction * total;
      const idx = Math.min(Math.floor(pos), total - 1);
      const t = pos - idx;
      const a = waypoints[idx];
      const b = waypoints[idx + 1];
      const st = t * t * (3 - 2 * t);
      return {
        x: a.x + (b.x - a.x) * st,
        y: a.y + (b.y - a.y) * st,
      };
    }

    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;

    const onScroll = () => {
      const maxScroll = scroller.scrollHeight - scroller.clientHeight;
      const fraction = maxScroll > 0 ? scroller.scrollTop / maxScroll : 0;
      const pos = getPositionAtScroll(fraction);
      targetX = pos.x;
      targetY = pos.y;
    };

    scroller.addEventListener("scroll", onScroll);

    let frame;
    const clock = new THREE.Clock();

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;
      cube.position.x = currentX;
      cube.position.y = currentY;

      cube.rotation.x = t * 0.3;
      cube.rotation.y = t * 0.5;
      cube.rotation.z = t * 0.15;

      light1.position.x = Math.sin(t * 0.7) * 2;
      light1.position.y = Math.cos(t * 0.5) * 2;
      light2.position.x = Math.cos(t * 0.6) * 2;
      light2.position.y = Math.sin(t * 0.8) * 2;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        zIndex: 250,
      }}
    />
  );
}