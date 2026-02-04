import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Light blue sky - desert setting
scene.fog = new THREE.Fog(0x87CEEB, 0, 300);

// Camera
const camera = new THREE.PerspectiveCamera(
    70, // Slightly narrower FOV to see gun better
    window.innerWidth / window.innerHeight,
    0.01, // Closer near plane so gun is visible
    1000
);
camera.position.set(0, 2, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lighting - bright desert sun
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(50, 100, 50);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 300;
directionalLight.shadow.camera.left = -80;
directionalLight.shadow.camera.right = 80;
directionalLight.shadow.camera.top = 80;
directionalLight.shadow.camera.bottom = -80;
scene.add(directionalLight);

// Helper function to create materials
function createMaterial(color, roughness = 0.8, metalness = 0.1) {
    return new THREE.MeshStandardMaterial({
        color: color,
        roughness: roughness,
        metalness: metalness
    });
}

// Ground plane - sandy desert terrain
const groundGeometry = new THREE.PlaneGeometry(200, 150);
const groundMaterial = createMaterial(0xD2B48C); // Tan/sandy color
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Create perimeter walls
function createWall(width, height, x, z, rotation = 0) {
    const wall = createBuilding(width, height, 2, x, z, 0xD4C5A9);
    wall.rotation.y = rotation;
    return wall;
}

// Perimeter walls around the map
const walls = new THREE.Group();

// North wall (back)
walls.add(createWall(200, 8, 0, -75, 0));

// South wall (front)
walls.add(createWall(200, 8, 0, 75, 0));

// West wall (left)
walls.add(createWall(150, 8, -100, 0, Math.PI / 2));

// East wall (right)
walls.add(createWall(150, 8, 100, 0, Math.PI / 2));

// Corner walls
walls.add(createWall(8, 8, -100, -75, 0));
walls.add(createWall(8, 8, 100, -75, 0));
walls.add(createWall(8, 8, -100, 75, 0));
walls.add(createWall(8, 8, 100, 75, 0));

scene.add(walls);

// Create map structures
const structures = new THREE.Group();

// Main building structures - light stone color
function createBuilding(width, height, depth, x, z, color = 0xD4C5A9) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = createMaterial(color);
    const building = new THREE.Mesh(geometry, material);
    building.position.set(x, height / 2, z);
    building.castShadow = true;
    building.receiveShadow = true;
    return building;
}

// Create archway/tunnel structure
function createArchway(x, z, width, height, depth) {
    const archGroup = new THREE.Group();
    
    // Left pillar
    const leftPillar = createBuilding(2, height, 2, x - width/2 + 1, z, 0x1a1a1a);
    archGroup.add(leftPillar);
    
    // Right pillar
    const rightPillar = createBuilding(2, height, 2, x + width/2 - 1, z, 0x1a1a1a);
    archGroup.add(rightPillar);
    
    // Top arch
    const archTop = createBuilding(width, 2, depth, x, z, 0x1a1a1a);
    archTop.position.y = height - 1;
    archGroup.add(archTop);
    
    // Side walls
    const leftWall = createBuilding(2, height - 2, depth, x - width/2, z, 0x1a1a1a);
    leftWall.position.y = (height - 2) / 2 + 1;
    archGroup.add(leftWall);
    
    const rightWall = createBuilding(2, height - 2, depth, x + width/2, z, 0x1a1a1a);
    rightWall.position.y = (height - 2) / 2 + 1;
    archGroup.add(rightWall);
    
    return archGroup;
}

// Create crate/box
function createCrate(x, z, size = 1.5) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = createMaterial(0x8B4513);
    const crate = new THREE.Mesh(geometry, material);
    crate.position.set(x, size / 2, z);
    crate.castShadow = true;
    crate.receiveShadow = true;
    return crate;
}

// Create weapon models
function createAK47(x, z, rotation = 0) {
    const weapon = new THREE.Group();
    
    // Main body
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.15, 3),
        createMaterial(0x2a2a2a, 0.3, 0.7)
    );
    body.position.set(0, 0.075, 0);
    weapon.add(body);
    
    // Barrel
    const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 2, 8),
        createMaterial(0x1a1a1a, 0.2, 0.8)
    );
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0, 0.1, 1.2);
    weapon.add(barrel);
    
    // Stock
    const stock = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.2, 1.5),
        createMaterial(0x3a2a1a, 0.6, 0.2)
    );
    stock.position.set(0, 0.1, -1.2);
    weapon.add(stock);
    
    // Magazine
    const magazine = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.4, 1),
        createMaterial(0x2a2a2a, 0.3, 0.7)
    );
    magazine.position.set(0, -0.15, -0.5);
    weapon.add(magazine);
    
    weapon.position.set(x, 0.8, z);
    weapon.rotation.y = rotation;
    weapon.castShadow = true;
    return weapon;
}

function createM4(x, z, rotation = 0) {
    const weapon = new THREE.Group();
    
    // Main body (M4 is similar but slightly different)
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.12, 2.8),
        createMaterial(0x3a3a3a, 0.3, 0.7)
    );
    body.position.set(0, 0.06, 0);
    weapon.add(body);
    
    // Barrel
    const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8),
        createMaterial(0x1a1a1a, 0.2, 0.8)
    );
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0, 0.08, 1.1);
    weapon.add(barrel);
    
    // Stock
    const stock = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.18, 1.2),
        createMaterial(0x2a2a1a, 0.6, 0.2)
    );
    stock.position.set(0, 0.09, -1.1);
    weapon.add(stock);
    
    // Magazine
    const magazine = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.35, 0.9),
        createMaterial(0x2a2a2a, 0.3, 0.7)
    );
    magazine.position.set(0, -0.12, -0.4);
    weapon.add(magazine);
    
    // Carry handle
    const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.15, 0.8),
        createMaterial(0x3a3a3a, 0.3, 0.7)
    );
    handle.position.set(0, 0.2, 0.3);
    weapon.add(handle);
    
    weapon.position.set(x, 0.8, z);
    weapon.rotation.y = rotation;
    weapon.castShadow = true;
    return weapon;
}

function createMP5(x, z, rotation = 0) {
    const weapon = new THREE.Group();
    
    // Main body (smaller SMG)
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.1, 2),
        createMaterial(0x2a2a2a, 0.3, 0.7)
    );
    body.position.set(0, 0.05, 0);
    weapon.add(body);
    
    // Barrel
    const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8),
        createMaterial(0x1a1a1a, 0.2, 0.8)
    );
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0, 0.07, 0.8);
    weapon.add(barrel);
    
    // Stock
    const stock = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.15, 1),
        createMaterial(0x2a2a1a, 0.6, 0.2)
    );
    stock.position.set(0, 0.075, -0.8);
    weapon.add(stock);
    
    // Magazine
    const magazine = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.3, 0.7),
        createMaterial(0x2a2a2a, 0.3, 0.7)
    );
    magazine.position.set(0, -0.1, -0.3);
    weapon.add(magazine);
    
    weapon.position.set(x, 0.8, z);
    weapon.rotation.y = rotation;
    weapon.castShadow = true;
    return weapon;
}

function createSniper(x, z, rotation = 0) {
    const weapon = new THREE.Group();
    
    // Main body (long rifle)
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.12, 4),
        createMaterial(0x3a3a3a, 0.3, 0.7)
    );
    body.position.set(0, 0.06, 0);
    weapon.add(body);
    
    // Long barrel
    const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 2.5, 8),
        createMaterial(0x1a1a1a, 0.2, 0.8)
    );
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0, 0.08, 1.5);
    weapon.add(barrel);
    
    // Scope
    const scope = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16),
        createMaterial(0x2a2a2a, 0.2, 0.9)
    );
    scope.rotation.z = Math.PI / 2;
    scope.position.set(0, 0.25, 0.5);
    weapon.add(scope);
    
    // Stock
    const stock = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.2, 1.5),
        createMaterial(0x2a1a0a, 0.6, 0.2)
    );
    stock.position.set(0, 0.1, -1.5);
    weapon.add(stock);
    
    // Bipod
    const bipod1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.8, 0.05),
        createMaterial(0x1a1a1a, 0.2, 0.8)
    );
    bipod1.position.set(-0.2, -0.3, 1);
    weapon.add(bipod1);
    
    const bipod2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.8, 0.05),
        createMaterial(0x1a1a1a, 0.2, 0.8)
    );
    bipod2.position.set(0.2, -0.3, 1);
    weapon.add(bipod2);
    
    weapon.position.set(x, 0.8, z);
    weapon.rotation.y = rotation;
    weapon.castShadow = true;
    return weapon;
}

// dima2 map layout - desert style with light stone structures
// Central dark archway/tunnel (key feature)
const centerArchway = createArchway(0, 0, 12, 10, 8);
structures.add(centerArchway);

// Left side structures - light stone walls
const leftWall1 = createBuilding(15, 6, 3, -25, 10, 0xD4C5A9);
structures.add(leftWall1);

const leftWall2 = createBuilding(12, 5, 3, -20, -10, 0xD4C5A9);
structures.add(leftWall2);

// Right side structures - light stone walls
const rightWall1 = createBuilding(15, 6, 3, 25, 10, 0xD4C5A9);
structures.add(rightWall1);

const rightWall2 = createBuilding(12, 5, 3, 20, -10, 0xD4C5A9);
structures.add(rightWall2);

// Additional stone structures
const structure1 = createBuilding(10, 4, 8, -30, -15, 0xD4C5A9);
structures.add(structure1);

const structure2 = createBuilding(10, 4, 8, 30, -15, 0xD4C5A9);
structures.add(structure2);

// Stone barriers/walls
const barrier1 = createBuilding(3, 3, 20, -18, 20, 0xD4C5A9);
structures.add(barrier1);

const barrier2 = createBuilding(3, 3, 20, 18, 20, 0xD4C5A9);
structures.add(barrier2);

// Fragmented walls (like in the image)
const fragWall1 = createBuilding(6, 5, 2, -12, 15, 0xD4C5A9);
structures.add(fragWall1);

const fragWall2 = createBuilding(6, 5, 2, 12, 15, 0xD4C5A9);
structures.add(fragWall2);

const fragWall3 = createBuilding(4, 4, 2, -8, -15, 0xD4C5A9);
structures.add(fragWall3);

const fragWall4 = createBuilding(4, 4, 2, 8, -15, 0xD4C5A9);
structures.add(fragWall4);

// Add crates for cover (scattered around)
structures.add(createCrate(-25, 12, 1.5));
structures.add(createCrate(25, 12, 1.5));
structures.add(createCrate(-18, -8, 1.5));
structures.add(createCrate(18, -8, 1.5));
structures.add(createCrate(-10, 18, 1.5));
structures.add(createCrate(10, 18, 1.5));
structures.add(createCrate(-5, 0, 1.5));
structures.add(createCrate(5, 0, 1.5));
structures.add(createCrate(-8, -12, 1.5));
structures.add(createCrate(8, -12, 1.5));

// Create weapon groups for both sides
const weapons = new THREE.Group();

// Left side weapons (T side)
weapons.add(createAK47(-28, 18, Math.PI / 4));
weapons.add(createM4(-22, 20, Math.PI / 4));
weapons.add(createMP5(-18, 18, Math.PI / 4));
weapons.add(createSniper(-30, 15, Math.PI / 4));

// Right side weapons (CT side)
weapons.add(createAK47(28, 18, -Math.PI / 4));
weapons.add(createM4(22, 20, -Math.PI / 4));
weapons.add(createMP5(18, 18, -Math.PI / 4));
weapons.add(createSniper(30, 15, -Math.PI / 4));

// Additional weapons in middle area
weapons.add(createAK47(-12, 0, Math.PI / 2));
weapons.add(createM4(12, 0, -Math.PI / 2));
weapons.add(createMP5(0, 12, 0));
weapons.add(createSniper(0, -12, Math.PI));

scene.add(structures);
scene.add(weapons);

// Add labels
function createTextLabel(text, x, y, z) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.font = 'Bold 28px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, y, z);
    sprite.scale.set(8, 2, 1);
    return sprite;
}

const labelLeft = createTextLabel('T SPAWN', -28, 8, 18);
const labelRight = createTextLabel('CT SPAWN', 28, 8, 18);
scene.add(labelLeft);
scene.add(labelRight);

// FPS Controls - PointerLockControls
const controls = new PointerLockControls(camera, document.body);

// Pause menu state
let isPaused = false;
const pauseMenu = document.getElementById('pause-menu');
const resumeBtn = document.getElementById('resume-btn');
const resetBtn = document.getElementById('reset-btn');

// Pause menu functions
function showPauseMenu() {
    isPaused = true;
    controls.unlock();
    pauseMenu.classList.add('active');
}

function hidePauseMenu() {
    isPaused = false;
    pauseMenu.classList.remove('active');
    controls.lock();
}

// Click to lock pointer and start FPS mode
document.addEventListener('click', () => {
    if (!isPaused && !controls.isLocked) {
        controls.lock();
    }
});

// ESC key to pause/unpause
document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
        if (controls.isLocked) {
            showPauseMenu();
        } else if (isPaused) {
            hidePauseMenu();
        }
    }
});

// Pause menu buttons
resumeBtn.addEventListener('click', () => {
    hidePauseMenu();
});

resetBtn.addEventListener('click', () => {
    camera.position.set(0, 2, 0);
    velocity.set(0, 0, 0);
    hidePauseMenu();
});

// Create gun model that follows camera
const gunGroup = new THREE.Group();

function createGunModel() {
    const gun = new THREE.Group();
    
    // Use BRIGHT colors - almost white for maximum visibility
    const bodyColor = 0xDDDDDD; // Very light gray
    const barrelColor = 0xBBBBBB; // Light gray
    const stockColor = 0xAA7744; // Brown
    
    // Main body - LARGE and BRIGHT
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.6, 5),
        new THREE.MeshBasicMaterial({ color: bodyColor })
    );
    body.position.set(0, 0, 0);
    body.frustumCulled = false;
    body.renderOrder = 9999;
    body.visible = true;
    gun.add(body);
    
    // Barrel - very visible and bright
    const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 4, 16),
        new THREE.MeshBasicMaterial({ color: barrelColor })
    );
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0, 0.3, 3);
    barrel.frustumCulled = false;
    barrel.renderOrder = 9999;
    barrel.visible = true;
    gun.add(barrel);
    
    // Stock - large and visible
    const stock = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.6, 3),
        new THREE.MeshBasicMaterial({ color: stockColor })
    );
    stock.position.set(0, 0.3, -2.5);
    stock.frustumCulled = false;
    stock.renderOrder = 9999;
    stock.visible = true;
    gun.add(stock);
    
    // Magazine - bright
    const magazine = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.2, 2.5),
        new THREE.MeshBasicMaterial({ color: bodyColor })
    );
    magazine.position.set(0, -0.6, -1.2);
    magazine.frustumCulled = false;
    magazine.renderOrder = 9999;
    magazine.visible = true;
    gun.add(magazine);
    
    // Muzzle flash (hidden by default)
    const muzzleFlash = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.4, 8),
        new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 })
    );
    muzzleFlash.rotation.z = Math.PI / 2;
    muzzleFlash.position.set(0, 0.2, 4);
    muzzleFlash.frustumCulled = false;
    muzzleFlash.renderOrder = 1001;
    gun.add(muzzleFlash);
    gun.userData.muzzleFlash = muzzleFlash;
    gun.userData.muzzlePosition = new THREE.Vector3(0, 0.2, 4);
    
    // Position gun for FPS view - properly sized
    gun.position.set(0.5, -0.5, -0.6);
    gun.rotation.x = 0.35; // Point downward
    gun.rotation.y = 0.2; // Angle to the right
    gun.rotation.z = 0;
    gun.scale.set(0.2, 0.2, 0.2); // Smaller, more realistic FPS scale
    gun.visible = true;
    return gun;
}

const gun = createGunModel();
gunGroup.add(gun);

// Add gun to scene instead of camera - we'll update position manually
scene.add(gunGroup);

// Make gun extremely visible - ensure all settings are correct
gun.traverse((child) => {
    if (child instanceof THREE.Mesh) {
        child.frustumCulled = false;
        child.renderOrder = 9999;
        child.visible = true;
        
        // Force MeshBasicMaterial for all parts (except muzzle flash)
        if (child !== gun.userData.muzzleFlash) {
            const currentColor = child.material?.color?.getHex() || 0x888888;
            child.material = new THREE.MeshBasicMaterial({ 
                color: currentColor,
                side: THREE.DoubleSide
            });
        }
        
        // Ensure material is visible
        if (child.material) {
            child.material.visible = true;
            child.material.transparent = false;
            child.material.opacity = 1.0;
        }
    }
});

// Force update all matrices
gun.updateMatrixWorld(true);
gunGroup.updateMatrixWorld(true);
camera.updateMatrixWorld(true);

// Remove test cube - gun should work now

// Debug
console.log('Gun created with', gun.children.length, 'children');
console.log('Gun position:', gun.position);
console.log('Gun scale:', gun.scale);
console.log('Gun added to scene');

// Bullet Pool System
class BulletPool {
    constructor(size = 50) {
        this.pool = [];
        this.activeBullets = [];
        
        // Create bullet geometry and material
        const bulletGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const bulletMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00
        });
        
        // Pre-create bullets
        for (let i = 0; i < size; i++) {
            const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial.clone());
            bullet.visible = false;
            bullet.userData.active = false;
            bullet.userData.velocity = new THREE.Vector3();
            bullet.userData.lifetime = 0;
            this.pool.push(bullet);
            scene.add(bullet);
        }
    }
    
    getBullet() {
        for (let bullet of this.pool) {
            if (!bullet.userData.active) {
                bullet.userData.active = true;
                bullet.visible = true;
                bullet.userData.lifetime = 5.0; // 5 seconds lifetime (increased from 2)
                this.activeBullets.push(bullet);
                return bullet;
            }
        }
        // If pool is exhausted, reuse oldest bullet
        if (this.activeBullets.length > 0) {
            const bullet = this.activeBullets.shift();
            bullet.userData.lifetime = 5.0;
            this.activeBullets.push(bullet);
            return bullet;
        }
        return null;
    }
    
    update(delta) {
        for (let i = this.activeBullets.length - 1; i >= 0; i--) {
            const bullet = this.activeBullets[i];
            bullet.userData.lifetime -= delta;
            
            if (bullet.userData.lifetime <= 0) {
                this.releaseBullet(bullet);
                this.activeBullets.splice(i, 1);
            } else {
                // Move bullet
                bullet.position.add(bullet.userData.velocity.clone().multiplyScalar(delta));
            }
        }
    }
    
    releaseBullet(bullet) {
        bullet.userData.active = false;
        bullet.visible = false;
        bullet.userData.velocity.set(0, 0, 0);
    }
    
    checkCollisions(targets) {
        for (let i = this.activeBullets.length - 1; i >= 0; i--) {
            const bullet = this.activeBullets[i];
            
            for (let target of targets.children) {
                if (target.userData.isDestroyed || !target.userData.isTarget) continue;
                
                const targetCenter = new THREE.Vector3();
                target.getWorldPosition(targetCenter);
                
                const distance = bullet.position.distanceTo(targetCenter);
                if (distance < 2.0) { // Hit radius (larger than sphere radius for forgiving hits)
                    destroyTarget(target);
                    this.releaseBullet(bullet);
                    this.activeBullets.splice(i, 1);
                    break;
                }
            }
        }
    }
}

const bulletPool = new BulletPool(50);

// Shooting mechanics
const shootRaycaster = new THREE.Raycaster();
let isShooting = false;
let shootCooldown = 0;

// Create simple circular targets floating in air
function createTarget(x, y, z) {
    // Use sphere for visibility from all angles, or make circle face camera
    const targetMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.3,
        metalness: 0.1,
        emissive: 0xff0000,
        emissiveIntensity: 0.5 // More visible
    });
    
    // Use a sphere so it's visible from all angles
    const target = new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 16),
        targetMaterial
    );
    
    target.position.set(x, y, z);
    target.castShadow = true;
    target.receiveShadow = true;
    target.userData.isTarget = true;
    target.userData.isDestroyed = false;
    
    return target;
}

// Add targets around the map (floating in air, closer to spawn)
const targets = new THREE.Group();
// Near spawn area - easy to see
targets.add(createTarget(-10, 2.5, 5));
targets.add(createTarget(10, 2.5, 5));
targets.add(createTarget(-5, 2.5, 10));
targets.add(createTarget(5, 2.5, 10));
targets.add(createTarget(0, 2.5, 8));
// Middle area
targets.add(createTarget(-15, 3, 0));
targets.add(createTarget(15, 3, 0));
targets.add(createTarget(-10, 3, -5));
targets.add(createTarget(10, 3, -5));
targets.add(createTarget(0, 3, -8));
// Further out
targets.add(createTarget(-20, 3.5, 10));
targets.add(createTarget(20, 3.5, 10));
targets.add(createTarget(-25, 4, 0));
targets.add(createTarget(25, 4, 0));

scene.add(targets);

// FPS Movement state
const moveState = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

let canJump = false;
let velocity = new THREE.Vector3();

// Movement parameters
const moveSpeed = 8.0; // Slower, more realistic movement speed
const jumpVelocity = 8.0;
const gravity = -30.0;

// Set initial camera position
camera.position.set(0, 2, 0);

// Shooting function with bullet pool
function shoot() {
    if (isShooting || shootCooldown > 0) return;
    
    isShooting = true;
    shootCooldown = 0.2; // Cooldown in seconds
    
    // Get bullet from pool
    const bullet = bulletPool.getBullet();
    if (bullet) {
        // Get direction camera is facing
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        
        const muzzleOffset = new THREE.Vector3(0.4, -0.4, -1.2);
        muzzleOffset.applyQuaternion(camera.quaternion);
        bullet.position.copy(camera.position).add(muzzleOffset);
        
        // Set bullet velocity (direction camera is facing)
        const bulletSpeed = 80;
        bullet.userData.velocity.copy(direction).multiplyScalar(bulletSpeed);
    }
    
    // Muzzle flash animation
    const muzzleFlash = gun.userData.muzzleFlash;
    if (muzzleFlash) {
        muzzleFlash.material.opacity = 1.0;
        setTimeout(() => {
            if (muzzleFlash.material) {
                muzzleFlash.material.opacity = 0;
            }
        }, 50);
    }
    
    // Gun recoil animation
    const originalZ = gun.position.z;
    gun.position.z += 0.15;
    setTimeout(() => {
        gun.position.z = originalZ;
    }, 100);
    
    setTimeout(() => {
        isShooting = false;
    }, 100);
}

// Target destruction animation
function destroyTarget(target) {
    if (target.userData.isDestroyed) return;
    
    target.userData.isDestroyed = true;
    
    // Create explosion particles
    const particleCount = 20;
    const particles = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.1),
            createMaterial(0xff6600, 0.5, 0.5)
        );
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 0.5 + Math.random() * 0.5;
        
        particle.position.copy(target.position);
        particle.userData.velocity = new THREE.Vector3(
            Math.cos(angle) * speed,
            Math.random() * 0.5 + 0.2,
            Math.sin(angle) * speed
        );
        particle.userData.life = 1.0;
        
        particles.add(particle);
    }
    
    scene.add(particles);
    
    // Animate target destruction
    const startScale = target.scale.clone();
    const startRotation = target.rotation.clone();
    let time = 0;
    const duration = 0.5;
    
    function animateDestruction() {
        time += 0.016; // ~60fps
        
        if (time < duration) {
            const progress = time / duration;
            
            // Scale down and rotate
            target.scale.lerp(new THREE.Vector3(0, 0, 0), progress);
            target.rotation.y += 0.1;
            target.position.y -= 0.05;
            
            // Animate particles
            particles.children.forEach(particle => {
                particle.position.add(particle.userData.velocity);
                particle.userData.velocity.y -= 0.02; // Gravity
                particle.userData.life -= 0.02;
                particle.material.opacity = particle.userData.life;
                particle.scale.multiplyScalar(0.98);
            });
            
            requestAnimationFrame(animateDestruction);
        } else {
            // Remove target and particles
            scene.remove(target);
            scene.remove(particles);
        }
    }
    
    animateDestruction();
}

// Mouse click to shoot
document.addEventListener('mousedown', (event) => {
    if (controls.isLocked && !isPaused) {
        if (event.button === 0) { // Left mouse button
            shoot();
        }
    }
});

document.addEventListener('keydown', (event) => {
    switch(event.code) {
        case 'KeyW': moveState.forward = true; break;
        case 'KeyS': moveState.backward = true; break;
        case 'KeyA': moveState.left = true; break;
        case 'KeyD': moveState.right = true; break;
        case 'Space':
            if (canJump === true) {
                velocity.y += jumpVelocity;
            }
            canJump = false;
            break;
        case 'KeyR':
            camera.position.set(0, 2, 0);
            velocity.set(0, 0, 0);
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch(event.code) {
        case 'KeyW': moveState.forward = false; break;
        case 'KeyS': moveState.backward = false; break;
        case 'KeyA': moveState.left = false; break;
        case 'KeyD': moveState.right = false; break;
    }
});

// Raycaster for ground detection
const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

// Collision detection for structures - More robust system
const collisionRaycaster = new THREE.Raycaster();
const playerRadius = 0.5; // Player collision radius
const playerHeight = 1.6; // Player eye height
const playerCapsuleHeight = 1.8; // Full capsule height

// Cache for collidable objects and their bounding boxes
let collidableCache = null;
let cacheValid = false;

// Get all collidable objects (structures, walls, crates) with caching
function getCollidableObjects() {
    if (collidableCache && cacheValid) {
        return collidableCache;
    }
    
    const collidables = [];
    
    // Add structures
    structures.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
            collidables.push(child);
        }
    });
    
    // Add walls
    walls.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
            collidables.push(child);
        }
    });
    
    collidableCache = collidables;
    cacheValid = true;
    return collidables;
}

// Invalidate cache when structures change
function invalidateCollisionCache() {
    cacheValid = false;
}

// More robust collision check using capsule collision
function checkCollision(newPosition) {
    const collidables = getCollidableObjects();
    
    // Create a capsule (cylinder with spheres on top/bottom) for player
    const capsuleBottom = newPosition.y - playerHeight / 2;
    const capsuleTop = newPosition.y + playerHeight / 2;
    
    // Check multiple points in a capsule shape (more comprehensive)
    const checkPoints = [];
    const segments = 8; // More segments for better coverage
    
    // Bottom circle
    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        checkPoints.push(new THREE.Vector3(
            newPosition.x + Math.cos(angle) * playerRadius,
            capsuleBottom,
            newPosition.z + Math.sin(angle) * playerRadius
        ));
    }
    
    // Top circle
    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        checkPoints.push(new THREE.Vector3(
            newPosition.x + Math.cos(angle) * playerRadius,
            capsuleTop,
            newPosition.z + Math.sin(angle) * playerRadius
        ));
    }
    
    // Middle circle
    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        checkPoints.push(new THREE.Vector3(
            newPosition.x + Math.cos(angle) * playerRadius,
            newPosition.y,
            newPosition.z + Math.sin(angle) * playerRadius
        ));
    }
    
    // Center point
    checkPoints.push(new THREE.Vector3(newPosition.x, newPosition.y, newPosition.z));
    
    // Also check edges of capsule
    checkPoints.push(new THREE.Vector3(newPosition.x + playerRadius, newPosition.y, newPosition.z));
    checkPoints.push(new THREE.Vector3(newPosition.x - playerRadius, newPosition.y, newPosition.z));
    checkPoints.push(new THREE.Vector3(newPosition.x, newPosition.y, newPosition.z + playerRadius));
    checkPoints.push(new THREE.Vector3(newPosition.x, newPosition.y, newPosition.z - playerRadius));
    
    // Check each point against all collidable objects
    for (let point of checkPoints) {
        for (let obj of collidables) {
            // Get bounding box (cached if possible)
            const box = new THREE.Box3().setFromObject(obj);
            
            // Expand box by player radius for more accurate collision
            box.expandByScalar(playerRadius + 0.1); // Small buffer
            
            // Check if point is inside expanded box
            if (box.containsPoint(point)) {
                return true; // Collision detected
            }
        }
    }
    
    // Additional check: use raycasting for edge cases
    const directions = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0)
    ];
    
    for (let dir of directions) {
        collisionRaycaster.set(newPosition, dir);
        const intersects = collisionRaycaster.intersectObjects(collidables, false);
        if (intersects.length > 0 && intersects[0].distance < playerRadius + 0.1) {
            return true;
        }
    }
    
    return false; // No collision
}

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    
    // Update shoot cooldown
    if (shootCooldown > 0) {
        shootCooldown -= delta;
    }
    
    // Update bullet pool
    bulletPool.update(delta);
    bulletPool.checkCollisions(targets);
    
    // Update gun position to follow camera in world space
    if (gunGroup && camera) {
        // Get camera's world position and rotation
        const cameraWorldPos = new THREE.Vector3();
        camera.getWorldPosition(cameraWorldPos);
        
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        
        const cameraRight = new THREE.Vector3();
        cameraRight.crossVectors(cameraDirection, camera.up).normalize();
        
        // Position gun relative to camera in world space
        const gunOffset = new THREE.Vector3(0.5, -0.5, -0.6);
        gunOffset.applyQuaternion(camera.quaternion);
        
        gunGroup.position.copy(cameraWorldPos).add(gunOffset);
        gunGroup.quaternion.copy(camera.quaternion);
        gunGroup.rotateX(0.35);
        gunGroup.rotateY(0.2);
        
        // Ensure gun is visible
        gun.visible = true;
        gunGroup.visible = true;
    }
    
    if (controls.isLocked === true && !isPaused) {
        // Store previous position for collision detection
        const previousPosition = camera.position.clone();
        const previousY = camera.position.y;
        
        // Apply gravity
        velocity.y += gravity * delta;
        
        // Calculate movement direction
        const moveForward = moveState.forward ? 1 : (moveState.backward ? -1 : 0);
        const moveRight = moveState.right ? 1 : (moveState.left ? -1 : 0);
        
        // Move in the direction the camera is looking (fixed inverted controls)
        // Check horizontal movement first
        if (moveForward !== 0 || moveRight !== 0) {
            const testPosition = camera.position.clone();
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            const right = new THREE.Vector3();
            right.crossVectors(direction, camera.up).normalize();
            
            if (moveForward !== 0) {
                testPosition.addScaledVector(direction, moveForward * moveSpeed * delta);
            }
            if (moveRight !== 0) {
                testPosition.addScaledVector(right, moveRight * moveSpeed * delta);
            }
            
            // Check collision before moving
            if (!checkCollision(testPosition)) {
                // No collision, apply movement
                if (moveForward !== 0) {
                    controls.moveForward(moveForward * moveSpeed * delta);
                }
                if (moveRight !== 0) {
                    controls.moveRight(moveRight * moveSpeed * delta);
                }
            } else {
                // Try moving in X or Z direction separately
                const testX = camera.position.clone();
                testX.x = testPosition.x;
                if (!checkCollision(testX)) {
                    camera.position.x = testX.x;
                }
                
                const testZ = camera.position.clone();
                testZ.z = testPosition.z;
                if (!checkCollision(testZ)) {
                    camera.position.z = testZ.z;
                }
            }
        }
        
        // Update camera position from controls (vertical movement)
        const testY = camera.position.clone();
        testY.y = previousY + velocity.y * delta;
        
        if (!checkCollision(testY)) {
            camera.position.y = testY.y;
        } else {
            // Collision with ceiling or floor, stop vertical movement
            velocity.y = 0;
            if (testY.y < previousY) {
                // Hit ground
                camera.position.y = previousY;
            }
        }
        
        // Ground collision detection
        raycaster.ray.origin.copy(camera.position);
        raycaster.ray.origin.y += 10;
        
        const intersections = raycaster.intersectObject(ground);
        const onObject = intersections.length > 0;
        
        if (onObject === true) {
            const distance = intersections[0].distance;
            if (distance < 10) {
                camera.position.y = intersections[0].point.y + 1.6; // Eye height
                velocity.y = 0;
                canJump = true;
            }
        } else {
            // Keep minimum height
            if (camera.position.y < 1.6) {
                camera.position.y = 1.6;
                velocity.y = 0;
                canJump = true;
            }
        }
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();