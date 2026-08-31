import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ThemeMode } from '../types';
import { 
  Sparkles, 
  RotateCcw, 
  Play, 
  Pause, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Activity,
  Sliders,
  HelpCircle
} from 'lucide-react';

interface InteractiveFractalCanvasProps {
  theme: ThemeMode;
}

export const InteractiveFractalCanvas: React.FC<InteractiveFractalCanvasProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fractal State Parameters
  const [fractalType, setFractalType] = useState<'mandelbrot' | 'julia'>('mandelbrot');
  const [zoom, setZoom] = useState<number>(1.0);
  const [offsetX, setOffsetX] = useState<number>(-0.5);
  const [offsetY, setOffsetY] = useState<number>(0.0);
  const [maxIter, setMaxIter] = useState<number>(120);
  const [colorScheme, setColorScheme] = useState<'amber' | 'cyan' | 'emerald' | 'violet'>('amber');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  // Julia constant c = (cx, cy)
  const [juliaCx, setJuliaCx] = useState<number>(-0.7);
  const [juliaCy, setJuliaCy] = useState<number>(0.27015);

  const [fps, setFps] = useState<number>(60);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Render loop algorithm
  const renderFractal = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) return;

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const scale = 3.0 / (zoom * Math.min(width, height));
    const halfW = width / 2;
    const halfH = height / 2;

    for (let px = 0; px < width; px++) {
      for (let py = 0; py < height; py++) {
        let x0 = (px - halfW) * scale + offsetX;
        let y0 = (py - halfH) * scale + offsetY;

        let zx = x0;
        let zy = y0;
        let cx = fractalType === 'mandelbrot' ? x0 : juliaCx;
        let cy = fractalType === 'mandelbrot' ? y0 : juliaCy;

        let iter = 0;
        while (zx * zx + zy * zy <= 4.0 && iter < maxIter) {
          const xtemp = zx * zx - zy * zy + cx;
          zy = 2.0 * zx * zy + cy;
          zx = xtemp;
          iter++;
        }

        const idx = (py * width + px) * 4;

        if (iter === maxIter) {
          data[idx] = 10;     // R
          data[idx + 1] = 14; // G
          data[idx + 2] = 23; // B
          data[idx + 3] = 255;
        } else {
          // Continuous smooth color interpolation
          const t = iter / maxIter;
          let r = 0, g = 0, b = 0;

          if (colorScheme === 'amber') {
            r = Math.floor(255 * Math.sin(t * Math.PI * 2 + 0.5) ** 2);
            g = Math.floor(180 * Math.sin(t * Math.PI * 2) ** 2);
            b = Math.floor(60 * Math.sin(t * Math.PI * 2 + 1.0) ** 2);
          } else if (colorScheme === 'cyan') {
            r = Math.floor(40 * Math.sin(t * Math.PI * 2) ** 2);
            g = Math.floor(220 * Math.sin(t * Math.PI * 2 + 0.4) ** 2);
            b = Math.floor(255 * Math.sin(t * Math.PI * 2 + 0.8) ** 2);
          } else if (colorScheme === 'emerald') {
            r = Math.floor(30 * Math.sin(t * Math.PI * 2) ** 2);
            g = Math.floor(240 * Math.sin(t * Math.PI * 2 + 0.6) ** 2);
            b = Math.floor(160 * Math.sin(t * Math.PI * 2 + 0.2) ** 2);
          } else {
            r = Math.floor(180 * Math.sin(t * Math.PI * 2 + 0.7) ** 2);
            g = Math.floor(60 * Math.sin(t * Math.PI * 2) ** 2);
            b = Math.floor(255 * Math.sin(t * Math.PI * 2 + 0.3) ** 2);
          }

          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Calculate FPS
    const now = performance.now();
    const delta = now - lastTimeRef.current;
    if (delta > 0) {
      setFps(Math.round(1000 / delta));
    }
    lastTimeRef.current = now;
  }, [fractalType, zoom, offsetX, offsetY, maxIter, colorScheme, juliaCx, juliaCy]);

  // Handle canvas sizing and initial render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set resolution suitable for smooth interactive rendering
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.min(Math.floor(rect.width), 600);
    canvas.height = Math.min(Math.floor(rect.height || 360), 360);

    renderFractal();
  }, [renderFractal]);

  // Animation Loop for morphing Julia set
  useEffect(() => {
    if (!isAnimating) return;

    let angle = 0;
    const interval = setInterval(() => {
      angle += 0.03;
      setJuliaCx(-0.7 + Math.sin(angle) * 0.1);
      setJuliaCy(0.27015 + Math.cos(angle * 0.7) * 0.1);
    }, 30);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Mouse drag pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    const scale = 3.0 / (zoom * Math.min(canvas.width, canvas.height));
    setOffsetX((prev) => prev - dx * scale);
    setOffsetY((prev) => prev - dy * scale);
  };

  const handleMouseUp = () => setIsDragging(false);

  // Reset view to origin
  const handleReset = () => {
    setZoom(1.0);
    setOffsetX(fractalType === 'mandelbrot' ? -0.5 : 0.0);
    setOffsetY(0.0);
    setMaxIter(120);
    setIsAnimating(false);
  };

  return (
    <section id="demo-math" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Math Showcase</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-display font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Complex Dynamics & Fractal Canvas
            </h2>
            <p className={`mt-2 text-sm sm:text-base max-w-xl ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Live numeric orbit iteration solver rendering Mandelbrot & Julia sets in real-time directly inside your browser. Drag to pan, zoom, or adjust mathematical parameters below.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800/80 text-slate-300 border border-slate-700/60">
              FPS: <strong className="text-emerald-400">{fps}</strong>
            </span>
            <button
              id="math-reset-btn"
              onClick={handleReset}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset View</span>
            </button>
          </div>
        </div>

        {/* Main Canvas & Controls Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-2xl border ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-800 shadow-2xl'
            : 'bg-white border-slate-200 shadow-lg'
        }`}>

          {/* Canvas Render Screen */}
          <div className="lg:col-span-8 relative flex flex-col items-center justify-center bg-slate-950 rounded-xl overflow-hidden border border-slate-800 group">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full h-[360px] sm:h-[420px] cursor-grab active:cursor-grabbing object-cover"
            />

            {/* Canvas Overlay Info */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800/80 text-[11px] font-mono text-slate-300 flex items-center space-x-3 pointer-events-none">
              <span>Type: <strong className="text-amber-400 capitalize">{fractalType}</strong></span>
              <span>Zoom: <strong className="text-cyan-400">{zoom.toFixed(2)}x</strong></span>
              <span>Re(z): <strong className="text-slate-200">{offsetX.toFixed(4)}</strong></span>
            </div>

            {/* Quick Zoom Buttons Overlay */}
            <div className="absolute bottom-3 right-3 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
              <button
                id="math-zoom-in-btn"
                onClick={() => setZoom((z) => Math.min(z * 1.5, 500))}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                id="math-zoom-out-btn"
                onClick={() => setZoom((z) => Math.max(z / 1.5, 0.2))}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Parameters Panel */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-800/40">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className={`font-display font-semibold text-sm uppercase tracking-wider ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  Orbit Controls
                </h3>
              </div>

              {/* Set Selection */}
              <div className="space-y-3">
                <label className={`block text-xs font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Attractor Dynamics Set:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="math-set-mandelbrot"
                    onClick={() => {
                      setFractalType('mandelbrot');
                      setOffsetX(-0.5);
                      setOffsetY(0);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-medium font-mono border transition-all ${
                      fractalType === 'mandelbrot'
                        ? 'bg-amber-400/10 border-amber-400/40 text-amber-400 font-semibold'
                        : theme === 'dark'
                        ? 'border-slate-800 text-slate-400 hover:bg-slate-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Mandelbrot z²+c
                  </button>
                  <button
                    id="math-set-julia"
                    onClick={() => {
                      setFractalType('julia');
                      setOffsetX(0);
                      setOffsetY(0);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-medium font-mono border transition-all ${
                      fractalType === 'julia'
                        ? 'bg-amber-400/10 border-amber-400/40 text-amber-400 font-semibold'
                        : theme === 'dark'
                        ? 'border-slate-800 text-slate-400 hover:bg-slate-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Julia Morph Set
                  </button>
                </div>
              </div>

              {/* Color Scheme Picker */}
              <div className="mt-4 space-y-2">
                <label className={`block text-xs font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Color Map Palette:
                </label>
                <div className="flex space-x-2">
                  {[
                    { id: 'amber', label: 'Amber', color: 'bg-amber-400' },
                    { id: 'cyan', label: 'Cyan', color: 'bg-cyan-400' },
                    { id: 'emerald', label: 'Emerald', color: 'bg-emerald-400' },
                    { id: 'violet', label: 'Violet', color: 'bg-purple-400' },
                  ].map((map) => (
                    <button
                      key={map.id}
                      id={`math-palette-${map.id}`}
                      onClick={() => setColorScheme(map.id as any)}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-mono border flex items-center justify-center space-x-1.5 transition-all ${
                        colorScheme === map.id
                          ? 'border-amber-400 text-white font-semibold bg-slate-800'
                          : theme === 'dark'
                          ? 'border-slate-800 text-slate-400 hover:bg-slate-800/60'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${map.color}`} />
                      <span>{map.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Iteration Slider */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Precision Iterations:</span>
                  <span className="text-amber-400 font-semibold">{maxIter}</span>
                </div>
                <input
                  id="math-iter-slider"
                  type="range"
                  min="40"
                  max="300"
                  step="10"
                  value={maxIter}
                  onChange={(e) => setMaxIter(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Julia Parameter Animation Button */}
              {fractalType === 'julia' && (
                <div className="mt-4 pt-3 border-t border-slate-800/40">
                  <button
                    id="math-animate-julia-btn"
                    onClick={() => setIsAnimating(!isAnimating)}
                    className={`w-full py-2 px-4 rounded-xl text-xs font-mono font-medium flex items-center justify-center space-x-2 border transition-colors ${
                      isAnimating
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {isAnimating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{isAnimating ? 'Pause Phase Rotation' : 'Auto-Rotate Julia Phase'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Explanatory Callout */}
            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start space-x-2.5 ${
              theme === 'dark' ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                Iterating <code className="text-amber-400 font-mono">z = z² + c</code> in the complex plane ℂ. Points remaining bounded after {maxIter} iterations form the inner set.
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
