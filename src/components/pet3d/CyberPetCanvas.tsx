import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FiveDimensionScores } from '../../types';
import { sound } from '../../services/soundService';

interface CyberPetCanvasProps {
  scores: FiveDimensionScores;
  petName?: string;
  onPetClick?: () => void;
}

export const CyberPetCanvas: React.FC<CyberPetCanvasProps> = ({
  scores,
  petName = '赛博小幽 (CyberPet-01)',
  onPetClick,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [speech, setSpeech] = useState<string>('你好宿主！我的机体正与你的账单全息共鸣中...');
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 320;

    // 1. 场景与摄像机
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.2);
    camera.lookAt(0, 0.2, 0);

    // 2. 渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. 动态光照
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.5);
    scene.add(ambientLight);

    const primaryLight = new THREE.PointLight(0x00f2fe, 3, 10);
    primaryLight.position.set(2, 3, 2);
    scene.add(primaryLight);

    const secondaryLight = new THREE.PointLight(0xf72585, 2.5, 10);
    secondaryLight.position.set(-2, -1, -2);
    scene.add(secondaryLight);

    // 根据消费属性决定形态主色调
    let mainColor = 0x00f2fe; // 默认赛博青
    let visorColor = 0x00f2fe;
    if (scores.foodWarrior >= 60) {
      mainColor = 0xffb703; // 暴食琥珀橙
      visorColor = 0xff6b00;
    } else if (scores.nightOwl >= 60) {
      mainColor = 0xf72585; // 夜猫激光粉
      visorColor = 0x7209b7;
    } else if (scores.techGeek >= 55) {
      mainColor = 0x4facfe; // 极客深邃蓝
      visorColor = 0x00f2fe;
    } else if (scores.wealthKeeper >= 60) {
      mainColor = 0x10b981; // 守财翡翠绿
      visorColor = 0x34d399;
    }

    // 4. 组装 3D 赛博宠物 (纯原生几何体，零加载失败风险)
    const petGroup = new THREE.Group();
    scene.add(petGroup);

    // 身体外壳 (Rounded Mecha Torso)
    const bodyGeo = new THREE.SphereGeometry(0.7, 32, 32);
    bodyGeo.scale(1, 0.85, 0.9);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x111927,
      metalness: 0.85,
      roughness: 0.25,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    petGroup.add(bodyMesh);

    // 头部高能全息面罩 (Visor)
    const visorGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.22, 32, 1, false, Math.PI * 0.1, Math.PI * 0.8);
    const visorMat = new THREE.MeshStandardMaterial({
      color: visorColor,
      emissive: visorColor,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.9,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.rotation.y = Math.PI * 0.1;
    visorMesh.position.set(0, 0.08, 0.32);
    petGroup.add(visorMesh);

    // 双眼发光核心
    const eyeGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.2, 0.08, 0.62);
    petGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.2, 0.08, 0.62);
    petGroup.add(rightEye);

    // 赛博猫耳天线 (Antennas)
    const earGeo = new THREE.ConeGeometry(0.2, 0.45, 16);
    const earMat = new THREE.MeshStandardMaterial({
      color: mainColor,
      metalness: 0.8,
      roughness: 0.3,
      emissive: mainColor,
      emissiveIntensity: 0.3,
    });

    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-0.45, 0.65, 0);
    leftEar.rotation.z = Math.PI * 0.15;
    petGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.set(0.45, 0.65, 0);
    rightEar.rotation.z = -Math.PI * 0.15;
    petGroup.add(rightEar);

    // 胸口微型能量反应炉
    const reactorGeo = new THREE.OctahedronGeometry(0.18, 0);
    const reactorMat = new THREE.MeshBasicMaterial({ color: mainColor, wireframe: false });
    const reactorMesh = new THREE.Mesh(reactorGeo, reactorMat);
    reactorMesh.position.set(0, -0.22, 0.55);
    petGroup.add(reactorMesh);

    // 动态量子光环 1 (Quantum Ring 1)
    const ringGeo1 = new THREE.TorusGeometry(1.05, 0.02, 16, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: mainColor, transparent: true, opacity: 0.8 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI * 0.35;
    petGroup.add(ring1);

    // 动态量子光环 2 (Quantum Ring 2)
    const ringGeo2 = new THREE.TorusGeometry(1.2, 0.015, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xf72585, transparent: true, opacity: 0.6 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI * 0.4;
    petGroup.add(ring2);

    // 底部全息雷达光盘 (Holographic Floor)
    const floorGeo = new THREE.RingGeometry(0.4, 1.4, 32);
    const floorMat = new THREE.MeshBasicMaterial({
      color: mainColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI * 0.5;
    floorMesh.position.y = -0.9;
    scene.add(floorMesh);

    // 粒子星尘
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArr[i] = (Math.random() - 0.5) * 4;
      posArr[i + 1] = (Math.random() - 0.5) * 3;
      posArr[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.035, color: mainColor, transparent: true, opacity: 0.7 });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 触摸/鼠标 3D 旋转交互处理
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.005;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // 5. 循环动画
    let reqId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // 自适应悬浮漂移动画
      petGroup.position.y = Math.sin(elapsed * 2.2) * 0.08;

      // 平滑惯性旋转
      petGroup.rotation.y += (targetRotationY - petGroup.rotation.y) * 0.08 + 0.004;
      petGroup.rotation.x += (targetRotationX - petGroup.rotation.x) * 0.08;
      targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX));

      // 光环旋转
      ring1.rotation.z += 0.02;
      ring2.rotation.x += 0.015;
      floorMesh.rotation.z += 0.005;
      reactorMesh.rotation.y += 0.04;

      // 眼睛微眨动
      const blink = Math.sin(elapsed * 4);
      if (blink > 0.96) {
        leftEye.scale.y = 0.1;
        rightEye.scale.y = 0.1;
      } else {
        leftEye.scale.y = 1;
        rightEye.scale.y = 1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 窗口尺寸自适应
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [scores]);

  // 点击宠物互动反应
  const handleInteract = () => {
    sound.playMuyu();
    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), 800);

    const dialogues = [
      '哔哔！机甲感知到你刚刚查看了账单，本宠物能量正在同步！',
      '检测到你的恩格尔食神能量！今天吃炸鸡还是拼好饭？',
      '摸头杀！宿主请注意，今晚23:00后务必锁定电商软件！',
      '量子核心超频中...为你吸收一笔潜在的冲动消费！',
      '我的护盾值已充满！下月结余请继续交给我守护！',
    ];
    setSpeech(dialogues[Math.floor(Math.random() * dialogues.length)]);
    if (onPetClick) onPetClick();
  };

  // 根据属性评估形态称号
  let petFormTitle = '【均衡机甲形态】';
  let badgeColor = 'bg-cyan-950 text-cyan-300 border-cyan-700/60';
  if (scores.foodWarrior >= 60) {
    petFormTitle = '【高碳水暴食进化态】';
    badgeColor = 'bg-amber-950 text-amber-300 border-amber-700/60';
  } else if (scores.nightOwl >= 60) {
    petFormTitle = '【暗夜侦测超频态】';
    badgeColor = 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-700/60';
  } else if (scores.techGeek >= 55) {
    petFormTitle = '【极客算力矩阵态】';
    badgeColor = 'bg-blue-950 text-blue-300 border-blue-700/60';
  } else if (scores.wealthKeeper >= 60) {
    petFormTitle = '【金钟罩防御态】';
    badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
  }

  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a1124] to-[#060a14] border border-cyan-500/25 shadow-2xl flex flex-col justify-between p-3 select-none">
      {/* 顶部状态条 */}
      <div className="flex items-center justify-between z-10 font-mono text-xs">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white text-[11px]">{petName}</span>
        </div>

        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${badgeColor}`}>
          {petFormTitle}
        </span>
      </div>

      {/* 3D 渲染画布挂载容器 */}
      <div
        ref={mountRef}
        onClick={handleInteract}
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
        title="手指滑动旋转3D分身，点击互动"
      />

      {/* 宠物悬浮对话气泡 */}
      <div
        onClick={handleInteract}
        className={`z-10 mx-auto max-w-[85%] p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-cyan-400/40 text-xs font-mono text-slate-200 text-center shadow-lg transition-transform cursor-pointer active:scale-95 ${
          isInteracting ? 'scale-105 border-fuchsia-400' : ''
        }`}
      >
        <div className="text-[10px] text-cyan-400 font-bold mb-0.5 flex items-center justify-center gap-1">
          <span>🐾 触摸互动</span>
          <span>•</span>
          <span className="text-slate-400">滑动旋转3D视角</span>
        </div>
        <p className="line-clamp-2 text-[11px] text-white">“{speech}”</p>
      </div>

      {/* 底部四角科技刻度 */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />
    </div>
  );
};
