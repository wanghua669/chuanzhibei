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
  const [speech, setSpeech] = useState<string>('全息投影已连接。分身机体正基于你的真实消费流水自适应演化中...');
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. 场景与摄像机
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090e, 0.08);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 4.4);
    camera.lookAt(0, 0.1, 0);

    // 2. 渲染器 (高动态范围 & 柔和阴影映射)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 3. 顶级专业摄影棚冷暖对比布光 (Key Light 冰蓝 + Rim Light 霓虹紫 + Fill Light 暗蓝)
    const ambientLight = new THREE.AmbientLight(0x0d1322, 2.8);
    scene.add(ambientLight);

    // 主聚光灯 (Key Light - 冰蓝高光)
    const keyLight = new THREE.DirectionalLight(0x00f2fe, 3.2);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    // 轮廓背光 (Rim Light - 霓虹粉紫切割边缘光)
    const rimLight = new THREE.PointLight(0xf72585, 4.5, 12);
    rimLight.position.set(-3, 2, -2.5);
    scene.add(rimLight);

    // 底部地台反光
    const groundBounceLight = new THREE.PointLight(0x4facfe, 2.0, 6);
    groundBounceLight.position.set(0, -1.2, 0);
    scene.add(groundBounceLight);

    // 根据消费属性决定形态主色调
    let mainColorHex = 0x00f2fe; // 默认冰蓝
    let visorColorHex = 0x00f2fe;
    if (scores.foodWarrior >= 60) {
      mainColorHex = 0xffb703; // 暴食琥珀橙
      visorColorHex = 0xff8800;
    } else if (scores.nightOwl >= 60) {
      mainColorHex = 0xf72585; // 夜猫激光粉紫
      visorColorHex = 0x9d4edd;
    } else if (scores.techGeek >= 55) {
      mainColorHex = 0x38bdf8; // 极客深邃量子青
      visorColorHex = 0x00f2fe;
    } else if (scores.wealthKeeper >= 60) {
      mainColorHex = 0x10b981; // 守财翡翠绿
      visorColorHex = 0x34d399;
    }

    // 4. 组装 3D 赛博机甲分身
    const petGroup = new THREE.Group();
    scene.add(petGroup);

    // 机体外壳 (深色钛合金金属质感)
    const bodyGeo = new THREE.SphereGeometry(0.72, 36, 36);
    bodyGeo.scale(1, 0.88, 0.92);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x121724,
      metalness: 0.92,
      roughness: 0.18,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    petGroup.add(bodyMesh);

    // 面部全息面罩 (曲面半透明激光镜片)
    const visorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.22, 36, 1, false, Math.PI * 0.12, Math.PI * 0.76);
    const visorMat = new THREE.MeshStandardMaterial({
      color: visorColorHex,
      emissive: visorColorHex,
      emissiveIntensity: 1.4,
      roughness: 0.08,
      metalness: 0.85,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.rotation.y = Math.PI * 0.12;
    visorMesh.position.set(0, 0.09, 0.34);
    petGroup.add(visorMesh);

    // 发光复眼
    const eyeGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.21, 0.09, 0.65);
    petGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.21, 0.09, 0.65);
    petGroup.add(rightEye);

    // 赛博猫耳机甲接收天线
    const earGeo = new THREE.ConeGeometry(0.19, 0.46, 24);
    const earMat = new THREE.MeshStandardMaterial({
      color: mainColorHex,
      metalness: 0.88,
      roughness: 0.25,
      emissive: mainColorHex,
      emissiveIntensity: 0.45,
    });

    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-0.46, 0.68, 0);
    leftEar.rotation.z = Math.PI * 0.16;
    petGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.set(0.46, 0.68, 0);
    rightEar.rotation.z = -Math.PI * 0.16;
    petGroup.add(rightEar);

    // 胸口微型能量反应炉晶体
    const reactorGeo = new THREE.OctahedronGeometry(0.18, 0);
    const reactorMat = new THREE.MeshStandardMaterial({
      color: mainColorHex,
      emissive: mainColorHex,
      emissiveIntensity: 1.8,
      roughness: 0.1,
      metalness: 0.9,
    });
    const reactorMesh = new THREE.Mesh(reactorGeo, reactorMat);
    reactorMesh.position.set(0, -0.22, 0.58);
    petGroup.add(reactorMesh);

    // 动态内层量子发光环
    const ringGeo1 = new THREE.TorusGeometry(1.08, 0.016, 16, 80);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: mainColorHex, transparent: true, opacity: 0.85 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI * 0.35;
    petGroup.add(ring1);

    // 动态外层逆向光环
    const ringGeo2 = new THREE.TorusGeometry(1.24, 0.012, 16, 80);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xf72585, transparent: true, opacity: 0.65 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI * 0.42;
    petGroup.add(ring2);

    // 5. 底部全息雷达基座与同心扫描圈
    const baseGroup = new THREE.Group();
    scene.add(baseGroup);

    // 悬浮全息底盘网格
    const floorGeo = new THREE.RingGeometry(0.35, 1.5, 36);
    const floorMat = new THREE.MeshBasicMaterial({
      color: mainColorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22,
      wireframe: true,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI * 0.5;
    floorMesh.position.y = -1.0;
    baseGroup.add(floorMesh);

    // 底座外圈发光圆环
    const outerRingGeo = new THREE.TorusGeometry(1.5, 0.015, 8, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({ color: mainColorHex, transparent: true, opacity: 0.5 });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRingMesh.rotation.x = Math.PI * 0.5;
    outerRingMesh.position.y = -1.0;
    baseGroup.add(outerRingMesh);

    // 6. 浮空微光星尘粒子
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArr[i] = (Math.random() - 0.5) * 4.5;
      posArr[i + 1] = (Math.random() - 0.5) * 3.5;
      posArr[i + 2] = (Math.random() - 0.5) * 4.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.038,
      color: mainColorHex,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. 3D 旋转与触摸惯性阻尼
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
      targetRotationY += deltaX * 0.009;
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

    // 8. 循环动画 (呼吸悬浮 + 惯性旋转 + 光环超频)
    let reqId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // 有生命力的空闲浮动动画 (Idle Breathing Wave)
      petGroup.position.y = Math.sin(elapsed * 1.8) * 0.1;
      petGroup.rotation.z = Math.sin(elapsed * 1.2) * 0.03;

      // 阻尼回弹旋转
      petGroup.rotation.y += (targetRotationY - petGroup.rotation.y) * 0.075 + 0.0035;
      petGroup.rotation.x += (targetRotationX - petGroup.rotation.x) * 0.075;
      targetRotationX = Math.max(-0.35, Math.min(0.35, targetRotationX));

      // 光环与反应炉自转
      ring1.rotation.z += 0.022;
      ring2.rotation.x += 0.016;
      floorMesh.rotation.z += 0.004;
      outerRingMesh.rotation.z -= 0.006;
      reactorMesh.rotation.y += 0.035;
      reactorMesh.rotation.x += 0.02;

      // 粒子缓慢升腾
      particleSystem.rotation.y = elapsed * 0.03;

      // 眨眼动画
      const blink = Math.sin(elapsed * 3.5);
      if (blink > 0.96) {
        leftEye.scale.y = 0.12;
        rightEye.scale.y = 0.12;
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
      const h = container.clientHeight || 420;
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
      '哔！量子神经核已同步：检测到你今天的消费重心，分身机体正超频响应！',
      '摸头杀生效！碳水饱腹能量已吸收，今日防破财护盾稳定度 94%！',
      '感知到宿主心率微动：今晚23:00后务必远离电商大促，保护生命值！',
      '机甲正在进行 3D 拓扑重构...正在为你净化一笔潜在的冲动消费欲望！',
      '钛合金结界充能完毕！守护你的每一分结余，下月存钱目标前进 +5%！',
    ];
    setSpeech(dialogues[Math.floor(Math.random() * dialogues.length)]);
    if (onPetClick) onPetClick();
  };

  // 根据属性评估形态称号与精致微光徽标
  let petFormTitle = '【均衡钛金形态】';
  let badgeColor = 'bg-cyan-950/70 text-cyan-300 border-cyan-500/30 glow-cyan-sm';
  if (scores.foodWarrior >= 60) {
    petFormTitle = '【高碳水暴食进化态】';
    badgeColor = 'bg-amber-950/70 text-amber-300 border-amber-500/30 glow-amber-sm';
  } else if (scores.nightOwl >= 60) {
    petFormTitle = '【暗夜超频侦测态】';
    badgeColor = 'bg-fuchsia-950/70 text-fuchsia-300 border-fuchsia-500/30 glow-pink-sm';
  } else if (scores.techGeek >= 55) {
    petFormTitle = '【极客量子矩阵态】';
    badgeColor = 'bg-sky-950/70 text-sky-300 border-sky-500/30 glow-cyan-sm';
  } else if (scores.wealthKeeper >= 60) {
    petFormTitle = '【高分子金钟罩防御态】';
    badgeColor = 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30';
  }

  return (
    <div className="relative w-full h-[400px] md:h-[480px] tech-card overflow-hidden flex flex-col justify-between p-4 select-none">
      <div className="tech-corner tech-corner-tl" />
      <div className="tech-corner tech-corner-tr" />
      <div className="tech-corner tech-corner-bl" />
      <div className="tech-corner tech-corner-br" />

      {/* 顶部遥测状态栏 */}
      <div className="flex items-center justify-between z-10 font-mono text-xs">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/10 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f2fe]" />
          <span className="font-semibold text-white tracking-wide text-xs">{petName}</span>
        </div>

        <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${badgeColor}`}>
          {petFormTitle}
        </span>
      </div>

      {/* 3D WebGL 舞台挂载容器 */}
      <div
        ref={mountRef}
        onClick={handleInteract}
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
        title="3D 全息交互：拖动可 360° 旋转，点击互动"
      />

      {/* 底部悬浮全息对话舱 */}
      <div
        onClick={handleInteract}
        className={`z-10 mx-auto w-full max-w-lg p-3 rounded-xl bg-slate-950/80 backdrop-blur-xl border border-white/10 text-xs font-mono text-slate-200 shadow-2xl transition-all cursor-pointer active:scale-98 hover:border-cyan-500/30 ${
          isInteracting ? 'scale-[1.02] border-cyan-400/60 shadow-[0_0_20px_rgba(0,242,254,0.2)]' : ''
        }`}
      >
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 border-b border-white/5 pb-1">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            3D HOLOGRAPHIC STAGE // 点击触碰互动
          </span>
          <span className="text-slate-500 font-mono">拖动旋转 360°</span>
        </div>
        <p className="text-xs text-slate-100 font-medium leading-relaxed mt-0.5">
          “{speech}”
        </p>
      </div>
    </div>
  );
};
