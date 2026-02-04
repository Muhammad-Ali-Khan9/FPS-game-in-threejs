# Counter-Strike 1.6 - dima2 Map in Three.js


## 📸 Screenshots

![Gameplay Screenshot 1](Screenshot%202026-02-04%20233004.png)

![Gameplay Screenshot 2](Screenshot%202026-02-04%20233013.png)

## 🎮 Features

- **3D Map Recreation**: Faithfully recreated dima2 map with desert-themed environment
- **FPS Gameplay**: First-person shooter controls with mouse look and WASD movement
- **Weapon System**: Visible gun model with shooting mechanics
- **Bullet Pool System**: Efficient bullet management with visible projectiles
- **Target Practice**: Floating red sphere targets to shoot and destroy
- **Collision Detection**: Robust collision system preventing wall clipping
- **Pause Menu**: In-game pause menu with resume and reset options
- **Crosshair**: On-screen crosshair for aiming
- **Weapons on Map**: AK47, M4, MP5, and Sniper rifle models placed around the map

## 🎯 Controls

- **Mouse**: Look around
- **WASD**: Move (W=Forward, S=Backward, A=Left, D=Right)
- **Space**: Jump
- **Left Click**: Shoot
- **ESC**: Pause/Unpause
- **R**: Reset position

## 🚀 Getting Started

### Prerequisites

- A modern web browser with ES6 module support
- A local web server (recommended for best experience)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/counter-strike-dima2.git
cd counter-strike-dima2
```

2. Run a local server:

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js:**
```bash
npx http-server
```

**Using PHP:**
```bash
php -S localhost:8000
```

3. Open your browser and navigate to `http://localhost:8000`

Alternatively, you can open `index.html` directly in your browser, though a local server is recommended.

## 🛠️ Technologies

- **Three.js** (r160) - 3D graphics library
- **PointerLockControls** - FPS camera controls
- **Vanilla JavaScript** - No build process required
- **ES6 Modules** - Modern JavaScript module system

## 📝 Project Structure

```
counter-strike-dima2/
├── index.html      # Main HTML file with UI and controls
├── main.js         # Game logic, Three.js setup, and all game mechanics
└── README.md       # Project documentation
```

## 🎨 Features in Detail

### Map Layout
- Desert-themed environment with sandy terrain
- Light stone structures and walls
- Dark central archway/tunnel structure
- Perimeter walls enclosing the play area
- Multiple structures for cover and navigation

### Shooting System
- Bullet pool with 50 reusable bullets
- Visible yellow glowing projectiles
- Muzzle flash effects
- Gun recoil animation
- Target hit detection with destruction animations
- Bullets travel up to 400 units before disappearing

### Collision System
- Capsule-based collision detection
- Prevents walking through walls and structures
- Smooth wall sliding when moving diagonally
- Ground collision and gravity
- Player radius: 0.5 units, height: 1.6 units

### Target System
- 14 floating red sphere targets
- Targets positioned at various heights (2.5-4 units)
- Hit detection radius: 2.0 units
- Destruction animation with particle effects
- Targets don't block player movement

## 🎮 Gameplay

1. **Click anywhere** to lock your mouse and enter FPS mode
2. **Move around** using WASD keys
3. **Look around** by moving your mouse
4. **Shoot targets** by left-clicking
5. **Jump** with Space bar
6. **Pause** anytime with ESC key

## 📊 Technical Details

### Performance
- Efficient bullet pool system (50 bullets, reused)
- Cached collision detection for structures
- Optimized rendering with frustum culling disabled for gun
- Smooth 60 FPS gameplay

### Rendering
- Shadow mapping enabled
- Ambient and directional lighting
- Fog effects for atmosphere
- Double-sided materials for gun visibility

### Physics
- Gravity: -30 units/s²
- Jump velocity: 8 units/s
- Movement speed: 8 units/s
- Bullet speed: 80 units/s
- Bullet lifetime: 5 seconds

## 🎯 Map Features

- **Spawn Areas**: T and CT spawn areas clearly marked
- **Central Archway**: Dark tunnel structure in the middle
- **Perimeter Walls**: Enclosed play area
- **Cover Structures**: Multiple buildings and walls for tactical gameplay
- **Weapon Spawns**: AK47, M4, MP5, and Sniper rifles on both sides

## 📄 License

This project is for educational purposes. Counter-Strike is a trademark of Valve Corporation.

## 🙏 Acknowledgments

- Inspired by Counter-Strike 1.6
- Built with Three.js
- Map design based on the classic dima2 map

## 🔧 Development

The project uses pure JavaScript with ES6 modules. No build process or dependencies installation required. Simply serve the files through a local web server and open in a modern browser.

### Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any browser with ES6 module support

Enjoy exploring the classic dima2 map!
