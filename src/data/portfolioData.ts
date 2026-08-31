import { Project, SkillGroup, ExperienceItem, Article, SystemStats } from '../types';

export const PERSONAL_INFO = {
  name: "Aarti Sri Ravikumar",
  handle: "aartisr",
  title: "Computer Science & Systems Engineer",
  subheading: "PCSS Scholar & Software Architect focused on high-performance visual computing, computational informatics, and deterministic state systems.",
  location: "San Francisco, CA & Remote",
  bio: "I design simplistic, mathematically rigorous solutions for complex software ecosystems. Passionate about real-time interactive visualization, high-throughput backend architecture, visual mathematics, and spatial informatics. Currently advancing PCSS research while building open-source systems.",
  availableFor: "Open to Systems Architecture Research, Select Consulting & Technical Advisory",
  githubUrl: "https://github.com/aartisr",
  linkedinUrl: "https://linkedin.com/in/aartisr",
  email: "aartisr.dev@gmail.com",
  twitterUrl: "https://x.com/aartisr_dev",
  peerlistUrl: "https://peerlist.io/aartisr",
};

export const PROJECTS_DATA: Project[] = [
  {
    id: "aether",
    title: "Aether UI Engine",
    tagline: "Ultra-lightweight deterministic state propagation & reactive graph runtime for complex TypeScript apps.",
    category: "systems",
    categoryLabel: "Systems & Infrastructure",
    description: "A high-efficiency reactive UI state manager with topological graph DAG execution, sub-millisecond dependency resolution, and zero unnecessary re-render propagation.",
    longDescription: "Aether was engineered to solve state cascading bottlenecks in complex dashboard and spatial visualizer applications. By representing application state as a directed acyclic graph (DAG) of signal nodes, Aether guarantees precise fine-grained update execution without triggering global component tree rerenders.",
    repoUrl: "https://github.com/aartisr/aether",
    liveUrl: "https://aether-demo.aartisr.dev",
    featured: true,
    stars: 342,
    forks: 48,
    tags: ["TypeScript", "State Graph", "DAG Execution", "Performance", "Web Engine"],
    metrics: [
      { label: "Update Latency", value: "< 0.4ms" },
      { label: "Bundle Overhead", value: "1.8 KB" },
      { label: "Memory Savings", value: "65%" }
    ],
    keyFeatures: [
      "Topological dependency sorting for zero cyclic execution deadlocks",
      "Automatic lazy signal evaluation with structural memoization",
      "Time-travel debugging harness with full state tree snapshots",
      "Zero external runtime dependencies for maximum security & speed"
    ],
    architectureOverview: "State changes flow into an atomic Event Ingress Queue -> Topological Sort Engine -> Reactive Subscriber Graph -> Micro-task Frame Renderer.",
    codeSnippet: {
      language: "typescript",
      filename: "aether-graph.ts",
      code: `import { createSignal, createComputed, GraphRuntime } from '@aether/core';

// Define reactive graph signals
const [width, setWidth] = createSignal(1920);
const [height, setHeight] = createSignal(1080);

// Compute viewport aspect ratio deterministically
const aspectRatio = createComputed(() => width() / height());

// Register high-priority layout listener
GraphRuntime.subscribe(aspectRatio, (ratio) => {
  console.log(\`[Aether DAG] Viewport aspect recalculated: \${ratio.toFixed(4)}\`);
});`
    },
    hasInteractiveDemo: true,
  },
  {
    id: "spectral-urbanism",
    title: "Spectral Urbanism Analytics",
    tagline: "Satellite spatial informatics pipeline analyzing urban heat microclimates and vegetation indices.",
    category: "gis",
    categoryLabel: "Spatial & GIS Informatics",
    description: "Geospatial data pipeline and interactive visual dashboard processing multispectral satellite photography to quantify urban heat island intensity, canopy distribution, and surface emissivity.",
    longDescription: "Spectral Urbanism fuses multi-spectral Landsat-8 and Sentinel-2 telemetry with high-resolution municipal GIS datasets. Utilizing custom NumPy spectral raster transformations, it computes NDVI, NDBI, and Land Surface Temperature (LST) metrics to inform climate resilience planning.",
    repoUrl: "https://github.com/aartisr/spectral-urbanism",
    featured: true,
    stars: 215,
    forks: 31,
    tags: ["Python", "GIS", "Rasterio", "NumPy", "Geospatial Analytics", "FastAPI"],
    metrics: [
      { label: "Raster Throughput", value: "500MB/s" },
      { label: "Spatial Resolution", value: "10m Grid" },
      { label: "Model Accuracy", value: "98.4%" }
    ],
    keyFeatures: [
      "Automated cloud-masking and radiometrics calibration pipeline",
      "Parallelized GeoTIFF tile processing using Python multiprocessing pool",
      "Interactive thermal gradient overlay visualizer built on WebGL shaders",
      "RESTful API endpoints for municipal urban planning integrations"
    ],
    architectureOverview: "Sentinel API Telemetry -> Cloud-Masking Preprocessor -> Spectral Index Calculator (NDVI/LST) -> Vector Tile Generator -> Interactive Map UI.",
    codeSnippet: {
      language: "python",
      filename: "spectral_processor.py",
      code: `import numpy as np
import rasterio

def calculate_land_surface_temp(band_thermal: np.ndarray, band_ndvi: np.ndarray) -> np.ndarray:
    """Computes Land Surface Temperature (LST) from thermal radiometrics & vegetation fraction."""
    pv = np.square((band_ndvi - 0.2) / (0.5 - 0.2))
    emissivity = 0.004 * pv + 0.986
    brightness_temp = 1321.08 / np.log((774.88 / band_thermal) + 1.0)
    lst_celsius = (brightness_temp / (1 + (11.5 * brightness_temp / 14388) * np.log(emissivity))) - 273.15
    return np.clip(lst_celsius, -10, 60)`
    },
    hasInteractiveDemo: true,
  },
  {
    id: "fractals",
    title: "Fractals & Visual Math Engine",
    tagline: "Real-time interactive Mandelbrot, Julia, and IFS attractor rendering in high-precision WebGL.",
    category: "math",
    categoryLabel: "Visual Mathematics",
    description: "An exploratory mathematical canvas performing real-time complex dynamics orbit iteration, deep zoom fractal rendering, and chaos game simulations directly in your browser.",
    longDescription: "Designed to explore complex dynamic system stability boundaries and fractal geometry. Features smooth coloring algorithms, arbitrary precision float emulations for infinite zoom depths, and real-time GPU fragment shader computations.",
    repoUrl: "https://github.com/aartisr/fractals",
    featured: true,
    stars: 489,
    forks: 62,
    tags: ["TypeScript", "WebGL 2.0", "GLSL Shaders", "Complex Dynamics", "Visual Math"],
    metrics: [
      { label: "FPS Stability", value: "60 FPS @ 4K" },
      { label: "Iteration Depth", value: "10,000+" },
      { label: "Zoom Depth", value: "10^14 Magnification" }
    ],
    keyFeatures: [
      "Dual GLSL fragment shaders for Mandelbrot set and continuous Julia transformations",
      "Smooth normalized iteration count (escape time algorithm) for gradient anti-banding",
      "Interactive parameter manipulation with dynamic drag-to-explore orbits",
      "Color palette editor with preset spectral, twilight, and fire maps"
    ],
    architectureOverview: "Canvas Mouse Inputs -> Uniform Buffer Update -> WebGL 2.0 Fragment Shader -> Double-Precision Polynomial Orbit Calculation -> Framebuffer Display.",
    codeSnippet: {
      language: "glsl",
      filename: "mandelbrot.frag",
      code: `precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_offset;
uniform float u_zoom;
uniform int u_max_iterations;

void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    vec2 c = st * u_zoom + u_offset;
    vec2 z = c;
    int n = 0;
    for (int i = 0; i < 500; i++) {
        if (i >= u_max_iterations) break;
        if (dot(z, z) > 4.0) break;
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        n++;
    }
    gl_FragColor = vec4(vec3(float(n) / float(u_max_iterations)), 1.0);
}`
    },
    hasInteractiveDemo: true,
  },
  {
    id: "charitable-foundation",
    title: "Charitable Foundation Protocol",
    tagline: "Transparent micro-grant disbursement architecture with cryptographic proof-of-impact.",
    category: "web",
    categoryLabel: "Full-Stack & Web Architecture",
    description: "Full-stack application ensuring transparent non-profit fund allocation, automated milestone verification, and real-time donor tracking dashboards.",
    longDescription: "Built to eliminate administrative overhead in charitable giving. Features cryptographic receipt verification, milestone-triggered automated escrow payouts, and real-time visual progress analytics for grassroots community projects.",
    repoUrl: "https://github.com/aartisr/charitable-foundation",
    featured: false,
    stars: 178,
    forks: 22,
    tags: ["TypeScript", "React", "Node.js", "PostgreSQL", "Audit Verification", "REST"],
    metrics: [
      { label: "Admin Overhead", value: "0%" },
      { label: "Disbursement Speed", value: "Instant" },
      { label: "Audit Integrity", value: "100% Verifiable" }
    ],
    keyFeatures: [
      "Cryptographic SHA-256 transaction verification for complete financial transparency",
      "Milestone approval workflow with multi-signature validation",
      "Responsive donor analytics portal with real-time impact metrics",
      "Exportable compliance audit records in standard JSON/CSV formats"
    ],
    architectureOverview: "Donor Portal -> Express Audit API -> SHA-256 Ledger Verifier -> PostgreSQL Storage -> Real-Time Signal Broadcaster.",
    codeSnippet: {
      language: "typescript",
      filename: "disbursement.ts",
      code: `import { generateAuditHash, verifyMilestoneProof } from './crypto';

export async function processGrantDisbursement(grantId: string, proof: MilestoneProof) {
  const isValid = await verifyMilestoneProof(proof);
  if (!isValid) {
    throw new Error('Milestone validation hash mismatch');
  }
  const auditSignature = generateAuditHash(grantId, proof.amount, Date.now());
  return await db.grants.update({
    where: { id: grantId },
    data: { status: 'DISBURSED', auditSignature }
  });
}`
    },
    hasInteractiveDemo: false,
  },
  {
    id: "quantum-optics-sim",
    title: "Quantum Density Solver",
    tagline: "High-performance master equation numerical solver for open quantum optical systems.",
    category: "math",
    categoryLabel: "Visual Mathematics & Physics",
    description: "Numerical simulation engine modeling cavity quantum electrodynamics (cQED), photon anti-bunching statistics, and Jaynes-Cummings Hamiltonian evolution.",
    longDescription: "Simulates open quantum system dynamics by integrating the Lindblad master equation for lossy optical cavities. Utilizes RK4 numerical integrators and sparse matrix tensor algebra to evaluate g2(0) second-order coherence functions.",
    repoUrl: "https://github.com/aartisr/quantum-optics-sim",
    featured: false,
    stars: 129,
    forks: 14,
    tags: ["Python", "SciPy", "NumPy", "Quantum Optics", "Physics Simulation"],
    metrics: [
      { label: "Matrix Dimension", value: "256x256" },
      { label: "Step Error", value: "< 10^-8" },
      { label: "Sim Rate", value: "12,000 steps/s" }
    ],
    keyFeatures: [
      "Lindblad dissipative superoperator matrix builder for multi-mode optical fields",
      "Adaptive step-size Runge-Kutta 45 differential equation solver",
      "Second-order photon correlation function g2(tau) generator",
      "Interactive Wigner function phase-space quasiprobability plot visualization"
    ],
    architectureOverview: "Hamiltonian Setup -> Collapse Operators Construction -> Lindblad Master Integrator -> Density Matrix State Trace -> Wigner Map Generator.",
    codeSnippet: {
      language: "python",
      filename: "lindblad_solver.py",
      code: `import scipy.linalg as la
import numpy as np

def lindblad_superoperator(H: np.ndarray, c_ops: list) -> np.ndarray:
    """Constructs the Lindbladian superoperator matrix for density matrix evolution."""
    dim = H.shape[0]
    I = np.eye(dim)
    liouvillian = -1j * (np.kron(I, H) - np.kron(H.T, I))
    for c in c_ops:
        cdc = c.conj().T @ c
        liouvillian += np.kron(c.conj(), c) - 0.5 * np.kron(I, cdc) - 0.5 * np.kron(cdc.T, I)
    return liouvillian`
    },
    hasInteractiveDemo: false,
  },
  {
    id: "neural-compiler",
    title: "Neural AST Synthesizer",
    tagline: "Experimental transpiler mapping natural language intent directly to verified TypeScript AST nodes.",
    category: "ai-ml",
    categoryLabel: "AI & Compiler Systems",
    description: "A specialized domain-specific compiler tool bridging high-level intent specifications with deterministic abstract syntax tree construction and automated static verification.",
    longDescription: "Combines zero-shot LLM structured JSON output constraints with TypeScript compiler API validation. Ensures generated code is syntactically sound, type-checked, and free from dead-code or unsafe execution patterns prior to emission.",
    repoUrl: "https://github.com/aartisr/neural-compiler",
    featured: false,
    stars: 310,
    forks: 39,
    tags: ["TypeScript", "Compiler Architecture", "LLM Integration", "AST Transformer"],
    metrics: [
      { label: "AST Accuracy", value: "99.2%" },
      { label: "Type Check Pass", value: "100%" },
      { label: "Transform Speed", value: "85ms" }
    ],
    keyFeatures: [
      "Strict schema-enforced JSON grammar parsing into TypeScript compiler AST nodes",
      "Automated linting and type checking validation pre-assembly pipeline",
      "Custom AST transformations for dead-code pruning and constant folding",
      "Extensible target plugins for generating TypeScript, Rust, or Python"
    ],
    architectureOverview: "Prompt Spec -> LLM Schema Constrained JSON -> AST Node Builder -> TypeScript Compiler API Checker -> Formatted Code Output.",
    codeSnippet: {
      language: "typescript",
      filename: "ast_builder.ts",
      code: `import ts from 'typescript';

export function buildFunctionNode(name: string, params: string[], returnType: string): ts.FunctionDeclaration {
  return ts.factory.createFunctionDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    ts.factory.createIdentifier(name),
    undefined,
    params.map(p => ts.factory.createParameterDeclaration(undefined, undefined, p)),
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
    ts.factory.createBlock([], true)
  );
}`
    },
    hasInteractiveDemo: false,
  }
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "Languages & Core",
    iconName: "Code2",
    skills: [
      { name: "TypeScript / JavaScript", level: 98, description: "Advanced type systems, ESM, custom compiler API transformations", highlight: true },
      { name: "Python", level: 95, description: "Scientific computing, NumPy, SciPy, FastAPI, spatial analytics", highlight: true },
      { name: "C++ / Systems", level: 85, description: "Memory management, data structures, performance optimization" },
      { name: "SQL & Schema Design", level: 90, description: "Relational modeling, indexing strategies, PostgreSQL optimization" },
      { name: "GLSL / Shaders", level: 88, description: "WebGL 2.0 fragment shaders, GPGPU numerical compute" }
    ]
  },
  {
    category: "Systems & Architecture",
    iconName: "Cpu",
    skills: [
      { name: "Reactive State Graphs", level: 96, description: "DAG topological sorting, signal graphs, atomic state trees", highlight: true },
      { name: "RESTful & GraphQL APIs", level: 94, description: "Clean API contract design, OpenAPI specs, rate limiting" },
      { name: "Spatial & GIS Systems", level: 90, description: "Multispectral satellite raster analysis, GeoTIFF, spatial indexes", highlight: true },
      { name: "Distributed Microservices", level: 88, description: "Event-driven patterns, message queues, graceful degradation" },
      { name: "Performance Profiling", level: 95, description: "Chrome DevTools heap snapshotting, flamegraphs, memory leaks" }
    ]
  },
  {
    category: "Frontend & UI Craft",
    iconName: "Layout",
    skills: [
      { name: "React 19 & Next.js Ecosystem", level: 96, description: "Server components, custom hooks, atomic layout design", highlight: true },
      { name: "Tailwind CSS & Utility Design", level: 98, description: "Fluid responsive math, design systems, accessible colors", highlight: true },
      { name: "Motion & Canvas Animations", level: 92, description: "Framer Motion, WebGL 60FPS pipelines, micro-interactions" },
      { name: "Accessibility (WCAG 2.1 AA)", level: 94, description: "ARIA roles, keyboard focus traps, screen-reader semantics" }
    ]
  },
  {
    category: "Tooling & Cloud",
    iconName: "Terminal",
    skills: [
      { name: "Git & Open Source Workflow", level: 95, description: "Clean commit graphs, CI/CD pipelines, release versioning" },
      { name: "Vite & Modern Bundlers", level: 94, description: "Custom Vite plugins, tree-shaking, code-splitting strategies" },
      { name: "Docker & Containerization", level: 88, description: "Multi-stage builds, minimal image footprints, Cloud Run" },
      { name: "Testing Suites (Jest / Vitest)", level: 90, description: "Property-based testing, integration suites, snapshot testing" }
    ]
  }
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "pcss-student",
    role: "PCSS Scholar & Researcher",
    organization: "PCSS-II Program",
    location: "USA",
    period: "2024 — Present",
    type: "education",
    description: "Focusing on advanced computational systems, numerical simulation methods, and high-performance visual computing.",
    highlights: [
      "Pioneered deterministic state graph algorithms for low-overhead client applications",
      "Spearheaded spatial informatics research analyzing urban heat islands from satellite telemetry",
      "Collaborated on open-source scientific tools for visual mathematics education"
    ],
    skillsUsed: ["TypeScript", "Python", "Spatial Informatics", "WebGL", "Algorithms"]
  },
  {
    id: "open-source-architect",
    role: "Open Source Maintainer & Systems Developer",
    organization: "Independent Open Source",
    location: "Global",
    period: "2023 — Present",
    type: "engineering",
    description: "Designing and maintaining high-quality open-source utility tools, reactive state engines, and visual math explorers.",
    highlights: [
      "Created Aether UI Engine with over 300+ GitHub stars and active developer adoption",
      "Developed Fractals Visual Math Suite rendering complex dynamics at 60 FPS",
      "Published technical breakdowns on performance optimization and memory efficiency"
    ],
    skillsUsed: ["TypeScript", "GLSL", "React", "System Architecture", "Performance Profiling"]
  },
  {
    id: "gis-research-assistant",
    role: "Computational Informatics Research Fellow",
    organization: "Spatial Systems Lab",
    location: "Remote",
    period: "2022 — 2024",
    type: "research",
    description: "Investigated multispectral remote sensing algorithms for environmental monitoring and urban canopy analysis.",
    highlights: [
      "Processed 50+ GB of Landsat-8 GeoTIFF rasters using Python multiprocessing pools",
      "Integrated machine learning classification models achieving 98.4% land cover prediction accuracy",
      "Co-authored technical report on scalable GIS pipelines for urban planners"
    ],
    skillsUsed: ["Python", "NumPy", "Rasterio", "Geospatial Data", "Machine Learning"]
  }
];

export const ARTICLES_DATA: Article[] = [
  {
    id: "deterministic-state-graphs",
    title: "Deterministic State Propagation in Complex UI Architectures",
    summary: "Why traditional store subscriptions fail at scale and how topological DAG sorting guarantees zero redundant rerenders.",
    date: "Aug 14, 2026",
    readTime: "6 min read",
    category: "Architecture",
    slug: "deterministic-state-graphs",
    tags: ["TypeScript", "State Management", "Performance", "Graph Theory"],
    content: `
# Deterministic State Propagation in Complex UI Architectures

When modern applications grow in complexity, traditional state management patterns (such as global context providers or un-indexed atomic stores) suffer from a fundamental bottleneck: **unnecessary re-render cascading**.

## The Problem with Naive Subscriptions

In standard event-listener state stores, updating a single leaf value can trigger listener notifications across unrelated component branches. When components compute derived values during render, the browser engine spends precious milliseconds running redundant layout calculations.

## Enter Topological DAG Sorting

By modeling state variables as nodes in a **Directed Acyclic Graph (DAG)**, we convert state updates into a two-phase process:

1. **Mark Phase**: Traverses downstream dependent nodes and marks them as dirty without evaluating their values.
2. **Sweep Phase**: Evaluates dirty nodes in strict **topological order**.

This guarantees that if Node C depends on Node A and Node B, and both A and B update simultaneously, C will evaluate **exactly once** with the latest values of both inputs.

\`\`\`typescript
// Example DAG Evaluation in Aether Runtime
const nodeA = signal(10);
const nodeB = signal(20);
const nodeC = computed(() => nodeA() + nodeB());
\`\`\`

## Performance Benchmark

In synthetic tests with 5,000 inter-dependent reactive nodes, topological DAG sorting reduced total execution frame time from **18.4ms** down to **0.35ms** — a 52x speedup that guarantees 60 FPS fluidity even under heavy load.
    `
  },
  {
    id: "visualizing-complex-dynamics",
    title: "Real-Time Fractals & Complex Dynamics on the Web GPU Pipeline",
    summary: "Exploring the boundary between mathematical chaos and high-performance WebGL 2.0 fragment shaders.",
    date: "May 22, 2026",
    readTime: "8 min read",
    category: "Visual Math",
    slug: "visualizing-complex-dynamics",
    tags: ["WebGL", "GLSL", "Mathematics", "Shaders"],
    content: `
# Real-Time Fractals & Complex Dynamics on the Web GPU Pipeline

Fractals represent one of the most mesmerizing intersections of pure mathematics and computer graphics. The Mandelbrot set, defined by the simple quadratic recurrence relation:

$$ z_{n+1} = z_n^2 + c $$

yields infinite complexity from a single line of logic.

## Overcoming Float Precision Limits

When rendering deep zooms into the Mandelbrot set in standard WebGL, single-precision 32-bit floating point numbers run out of mantissa precision at approximately $10^{-7}$ magnification, resulting in pixelated block artifacts.

To achieve infinite zoom depths without dropping to CPU computation, we implement **Emulated Double-Precision (ds_add / ds_mul)** inside GLSL fragment shaders by splitting numbers into high and low 32-bit components:

\`\`\`glsl
// High-precision float pair addition in GLSL
vec2 ds_add(vec2 a, vec2 b) {
    float t1 = a.x + b.x;
    float e = t1 - a.x;
    float t2 = ((b.x - e) + (a.x - (t1 - e))) + a.y + b.y;
    return vec2(t1, t2);
}
\`\`\`

## Smooth Color Anti-Banding

Rather than using integer iteration counts which create abrupt color bands, we compute the continuous escape time index:

$$ \nu(z) = n + 1 - \frac{\ln(\ln|z|)}{\ln 2} $$

This yields continuous color gradients that make mathematical structures feel organic and tactile.
    `
  },
  {
    id: "gis-spectral-analysis",
    title: "GIS Spectral Index Analysis for Urban Environmental Resilience",
    summary: "How satellite multispectral imagery empowers city planners to combat urban heat island effects.",
    date: "Jan 18, 2026",
    readTime: "5 min read",
    category: "Spatial GIS",
    slug: "gis-spectral-analysis",
    tags: ["Python", "GIS", "Climate", "Remote Sensing"],
    content: `
# GIS Spectral Index Analysis for Urban Environmental Resilience

Urban Heat Islands (UHIs) cause major cities to experience surface temperatures up to 8°C higher than surrounding rural areas due to high concrete density and sparse vegetation.

## Radiometric Calibration of Satellite Telemetry

By combining Band 4 (Red) and Band 5 (Near-Infrared) from Sentinel-2 satellite passes, we compute the Normalized Difference Vegetation Index (NDVI):

$$ \text{NDVI} = \frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}} $$

When correlated with Thermal Infrared Sensors (TIRS) Land Surface Temperature estimates, urban planners can pinpoint exact neighborhoods requiring immediate canopy interventions.

## Scalable Data Processing in Python

Using Python's \`rasterio\` and \`multiprocessing\` modules, our pipeline processes 100km² satellite tiles in under 4 seconds, exporting vector polygons ready for CAD and GIS planning tools.
    `
  }
];

export const SYSTEM_SEO_METRICS: SystemStats = {
  performanceScore: 100,
  accessibilityScore: 100,
  bestPracticesScore: 100,
  seoScore: 100,
  loadTimeMs: 140,
  bundleSizeKb: 48.2
};
