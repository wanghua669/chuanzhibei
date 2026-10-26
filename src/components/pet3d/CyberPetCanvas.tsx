import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { FiveDimensionScores } from '../../types';
import { sound } from '../../services/soundService';

export interface CyberPetCanvasProps {
  scores: FiveDimensionScores;
  petName?: string;
  onPetClick?: () => void;
  triggerAction?: string | number;
}

export const CyberPetCanvas: React.FC<CyberPetCanvasProps> = ({
  scores,
  petName = '赛博小幽 (CyberPet-01)',
  onPetClick,
  triggerAction,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [speech, setSpeech] = useState<string>('全息投影已连接。分身机体正基于你的真实消费流水自适应演化中...');
  const [isInteracting, setIsInteracting] = useState(false);

  // 引用动作机触发器，供组件内部及外部联动调用
  const triggerSpecialActionRef = useRef<(name?: string) => void>(() => {});
  const updateThemeColorRef = useRef<(colorHex: number) => void>(() => {});

  // 计算当前属性对应的主题色
  const getThemeColor = (s: FiveDimensionScores) => {
    if (s.foodWarrior >= 60) return 0xffb703; // 暴食琥珀橙
    if (s.nightOwl >= 60) return 0xf72585;    // 夜猫激光粉紫
    if (s.techGeek >= 55) return 0x38bdf8;    // 极客深邃量子青
    if (s.wealthKeeper >= 60) return 0x10b981;// 守财翡翠绿
    return 0x00f2fe;                          // 默认冰蓝
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. 场景与摄像机
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090e, 0.05);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.55, 3.8);
    camera.lookAt(0, 0.1, 0);

    // 2. 渲染器 (高动态范围 & 柔和阴影映射)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. 顶级专业摄影棚冷暖对比布光 (Key Light 冰蓝 + Rim Light 霓虹紫 + 地台反射光)
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.6);
    scene.add(ambientLight);

    // 主聚光灯 (Key Light - 冰蓝高光)
    const keyLight = new THREE.DirectionalLight(0x00f2fe, 3.6);
    keyLight.position.set(3.5, 4.5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // 轮廓背光 (Rim Light - 霓虹粉紫切割边缘光)
    const rimLight = new THREE.PointLight(0xf72585, 4.8, 12);
    rimLight.position.set(-3.5, 2.5, -2.5);
    scene.add(rimLight);

    // 底部地台反光 (反射冰蓝微晕)
    const groundBounceLight = new THREE.PointLight(0x00d2ff, 2.4, 6);
    groundBounceLight.position.set(0, -1.2, 0);
    scene.add(groundBounceLight);

    // 正面辅助微光
    const frontFillLight = new THREE.DirectionalLight(0xe2e8f0, 1.2);
    frontFillLight.position.set(0, 2, 4);
    scene.add(frontFillLight);

    let currentThemeColor = getThemeColor(scores);

    // 4. 底部全息雷达基座与旋转扫描光环
    const baseGroup = new THREE.Group();
    scene.add(baseGroup);

    // 悬浮全息底盘网格 (贴合于 y = -1.0)
    const floorGeo = new THREE.RingGeometry(0.3, 1.7, 48);
    const floorMat = new THREE.MeshBasicMaterial({
      color: currentThemeColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28,
      wireframe: true,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI * 0.5;
    floorMesh.position.y = -1.0;
    baseGroup.add(floorMesh);

    // 内层快速扫描光环
    const innerRingGeo = new THREE.RingGeometry(0.85, 0.92, 48);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRingMesh.rotation.x = Math.PI * 0.5;
    innerRingMesh.position.y = -0.99;
    baseGroup.add(innerRingMesh);

    // 底座外圈发光圆环
    const outerRingGeo = new THREE.TorusGeometry(1.7, 0.015, 16, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: currentThemeColor,
      transparent: true,
      opacity: 0.7,
    });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRingMesh.rotation.x = Math.PI * 0.5;
    outerRingMesh.position.y = -1.0;
    baseGroup.add(outerRingMesh);

    // 5. 浮空微光星尘粒子
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArr[i] = (Math.random() - 0.5) * 5.0;
      posArr[i + 1] = Math.random() * 3.5 - 1.0;
      posArr[i + 2] = (Math.random() - 0.5) * 5.0;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: currentThemeColor,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 动态换色函数暴露
    updateThemeColorRef.current = (colorHex: number) => {
      floorMat.color.setHex(colorHex);
      outerRingMat.color.setHex(colorHex);
      particleMat.color.setHex(colorHex);
    };

    // 6. GLTF 异步加载 RobotExpressive 机械分身模型
    let mixer: THREE.AnimationMixer | null = null;
    const actions: Record<string, THREE.AnimationAction> = {};
    let currentAction: THREE.AnimationAction | null = null;
    let modelRoot: THREE.Group | null = null;

    const loader = new GLTFLoader();
    const base = import.meta.env.BASE_URL || './';
    const modelUrl = base.endsWith('/') ? `${base}models/robot.glb` : `${base}/models/robot.glb`;

    setIsLoading(true);
    loader.load(
      modelUrl,
      (gltf: GLTF) => {
        const model = gltf.scene;
        modelRoot = model;

        // 缩放并贴合地台：robot.glb 原高 ~4.8，脚底在 y=0，缩放 0.46 并将 position.y 设为 -1.0
        const scale = 0.46;
        model.scale.set(scale, scale, scale);
        model.position.set(0, -1.0, 0);

        // 增强金属高光与投射阴影
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.min(mat.roughness, 0.35);
              mat.metalness = Math.max(mat.metalness, 0.65);
              mat.needsUpdate = true;
            }
          }
        });

        scene.add(model);

        // 初始化动画机 AnimationMixer
        mixer = new THREE.AnimationMixer(model);

        // 解析并注册所有内置动作
        gltf.animations.forEach((clip) => {
          actions[clip.name] = mixer!.clipAction(clip);
        });

        // 默认循环播放待机呼吸动作 (Idle)
        const idleAction = actions['Idle'] || actions['Standing'];
        if (idleAction) {
          idleAction.reset();
          idleAction.play();
          currentAction = idleAction;
        }

        // 监听动作完成事件：当特殊动作播放结束后平滑 CrossFade 回到 Idle
        const onFinished = (e: any) => {
          const defaultIdle = actions['Idle'] || actions['Standing'];
          if (defaultIdle && e.action !== defaultIdle) {
            defaultIdle.reset();
            defaultIdle.play();
            e.action.crossFadeTo(defaultIdle, 0.4, true);
            currentAction = defaultIdle;
          }
        };
        mixer.addEventListener('finished', onFinished);

        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.error('Failed to load robot.glb:', err);
        setLoadError('3D 模型载入中断，请检查网络');
        setIsLoading(false);
      }
    );

    // 特殊动作平滑 CrossFade 触发器
    const triggerSpecialAction = (actionName?: string) => {
      if (!mixer) return;

      const candidates = ['Dance', 'ThumbsUp', 'Wave', 'Jump', 'Yes'];
      const targetName =
        actionName && actions[actionName]
          ? actionName
          : candidates[Math.floor(Math.random() * candidates.length)];

      const nextAction = actions[targetName];
      if (!nextAction) return;

      nextAction.reset();
      nextAction.setLoop(THREE.LoopOnce, 1);
      nextAction.clampWhenFinished = true;

      if (currentAction && currentAction !== nextAction) {
        currentAction.crossFadeTo(nextAction, 0.28, true);
      }
      nextAction.play();
      currentAction = nextAction;
    };

    triggerSpecialActionRef.current = triggerSpecialAction;

    // 7. 3D 拖动旋转与惯性阻尼
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

    // 8. 帧循环动画渲染 (AnimationMixer Delta + 地台自转 + 粒子升腾)
    let reqId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // 更新骨骼动画
      if (mixer) {
        mixer.update(delta);
      }

      // 阻尼回弹自转
      if (modelRoot) {
        modelRoot.rotation.y += (targetRotationY - modelRoot.rotation.y) * 0.08;
        targetRotationX = Math.max(-0.25, Math.min(0.25, targetRotationX));
        modelRoot.rotation.x += (targetRotationX - modelRoot.rotation.x) * 0.08;
      }

      // 全息光环自转与呼吸缩放
      floorMesh.rotation.z += 0.004;
      innerRingMesh.rotation.z -= 0.015;
      outerRingMesh.rotation.z -= 0.006;
      const pulse = 1 + Math.sin(elapsed * 2.2) * 0.035;
      innerRingMesh.scale.set(pulse, pulse, 1);

      // 星尘粒子缓慢盘旋
      particleSystem.rotation.y = elapsed * 0.035;

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

    // 卸载与资源清理 (防止内存泄漏)
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);

      if (mixer) {
        mixer.stopAllAction();
        if (modelRoot) mixer.uncacheRoot(modelRoot);
      }

      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat: any) => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); // 仅在容器初次挂载时建立 WebGL 上下文与加载 GLB

  // 属性更新时动态切换地台主题色 (无需销毁重建场景)
  useEffect(() => {
    const colorHex = getThemeColor(scores);
    updateThemeColorRef.current(colorHex);
  }, [scores]);

  // 外部 triggerAction 属性变化响应 (例如投喂功德+1)
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (triggerAction !== undefined) {
      triggerSpecialActionRef.current();
    }
  }, [triggerAction]);

  // 监听全局 CustomEvent 联动触发
  useEffect(() => {
    const handleCustomEvent = (e: any) => {
      const action = e.detail?.action;
      triggerSpecialActionRef.current(action);
    };
    window.addEventListener('cyberpet:trigger-action', handleCustomEvent);
    return () => window.removeEventListener('cyberpet:trigger-action', handleCustomEvent);
  }, []);

  // 点击宠物互动反应
  const handleInteract = () => {
    sound.playSuccess();
    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), 800);

    // 触发动作机随机动作切换 (Dance, ThumbsUp, Wave, Jump, Yes)
    triggerSpecialActionRef.current();

    const dialogues = [
      '哔！量子神经核已同步：检测到你的实时流水状态，动作模组已超频响应！',
      '摸头杀触发成功！机械骨骼伺服电机运转正常，今日防破财护盾稳定度 96%！',
      '感知到宿主心率微动：今晚23:00后务必远离电商大促，保护现金流！',
      '分身正在执行实时舞步拓扑重构...为你击碎了一笔潜在冲动消费！',
      '全息钛金结界充能完毕！守护你的每一分结余，下月存钱目标稳步前进！',
    ];
    setSpeech(dialogues[Math.floor(Math.random() * dialogues.length)]);
    if (onPetClick) onPetClick();
  };

  // 根据属性评估形态称号与精致微光徽标
  let petFormTitle = '【均衡钛金机甲态】';
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
        title="3D 全息交互：拖动可 360° 旋转，点击触发特殊动作"
      />

      {/* 加载中全息光圈状态提示 */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#08090e]/85 backdrop-blur-md pointer-events-none">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
            <div className="w-8 h-8 rounded-full border-2 border-transparent border-b-fuchsia-400 animate-spin [animation-direction:reverse]" />
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f2fe]" />
          </div>
          <div className="mt-3 font-mono text-[11px] text-cyan-300 tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>HOLOGRAPHIC QUANTUM LINKING...</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            赛博机械骨骼动作序列加载中
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {loadError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#08090e]/90 text-rose-400 font-mono text-xs">
          {loadError}
        </div>
      )}

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
            3D HOLOGRAPHIC ROBOT // 点击触碰互动
          </span>
          <span className="text-slate-500 font-mono">拖动 360° | 触碰跳舞互动</span>
        </div>
        <p className="text-xs text-slate-100 font-medium leading-relaxed mt-0.5">
          “{speech}”
        </p>
      </div>
    </div>
  );
};
