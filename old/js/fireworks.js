let scene, camera, renderer, orbitControls,
	planeMesh,
	canvasTexture,
	isAutoLaunch = true;

const gravity = new THREE.Vector3(0, -0.005, 0);
const friction = 0.998;
const noise = new SimplexNoise();
const textureSize = 128.0;
const fireworksInstances = [];

let outputDom;

const getOffsetXYZ = i => {
	const offset = 3;
	const index = i * offset;
	const x = index;
	const y = index + 1;
	const z = index + 2;
	return { x, y, z };
};

const getOffsetRGBA = i => {
	const offset = 4;
	const index = i * offset;
	const r = index;
	const g = index + 1;
	const b = index + 2;
	const a = index + 3;
	return { r, g, b, a };
};

/* datGUI
--------------------------------------*/
const gui = new dat.GUI();
const guiControls = new function () {
	this.ParticleSize = 300;
	this.AutoLaunch = true;
}();
gui.add(guiControls, 'ParticleSize', 100, 600);
gui.add(guiControls, 'AutoLaunch').onChange(e => {
	isAutoLaunch = e;
	outputDom.style.cursor = isAutoLaunch ? 'auto' : 'pointer';
});

const getRandomNum = (max = 0, min = 0) => Math.floor(Math.random() * (max + 1 - min)) + min;

const launchFireWorks = () => {
	if (fireworksInstances.length > 5) return;
	const fw = Math.random() > 8 ? new BasicFIreWorks() : new RichFIreWorks();
	fireworksInstances.push(fw);
	scene.add(fw.meshGroup);
};

const autoLaunch = () => {
	if (!isAutoLaunch) return;
	if (Math.random() > 0.7) launchFireWorks();
};

const drawRadialGradation = (ctx, canvasRadius, canvasW, canvasH) => {
	ctx.save();
	const gradient = ctx.createRadialGradient(canvasRadius, canvasRadius, 0, canvasRadius, canvasRadius, canvasRadius);
	gradient.addColorStop(0.0, 'rgba(255,255,255,1.0)');
	gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
	gradient.addColorStop(1.0, 'rgba(255,255,255,0)');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvasW, canvasH);
	ctx.restore();
};

const getTexture = () => {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	const diameter = textureSize;
	canvas.width = diameter;
	canvas.height = diameter;
	const canvasRadius = diameter / 2;

	/* gradation circle
	   ------------------------ */
	drawRadialGradation(ctx, canvasRadius, canvas.width, canvas.height);
	const texture = new THREE.Texture(canvas);
	texture.type = THREE.FloatType;
	texture.needsUpdate = true;
	return texture;
};

canvasTexture = getTexture();

const getPointMesh = (num, vels, type) => {
	// geometry
	const bufferGeometry = new THREE.BufferGeometry();
	const vertices = [];
	const velocities = [];
	const colors = [];
	const adjustSizes = [];
	const masses = [];
	const colorType = Math.random() > 0.3 ? 'single' : 'multiple';
	const singleColor = getRandomNum(100, 20) * 0.01;
	const multipleColor = () => getRandomNum(100, 1) * 0.01;
	let rgbType;
	const rgbTypeDice = Math.random();
	if (rgbTypeDice > 0.66) {
		rgbType = 'red';
	} else if (rgbTypeDice > 0.33) {
		rgbType = 'green';
	} else {
		rgbType = 'blue';
	}
	for (let i = 0; i < num; i++) {
		const pos = new THREE.Vector3(0, 0, 0);
		vertices.push(pos.x, pos.y, pos.z);
		velocities.push(vels[i].x, vels[i].y, vels[i].z);
		if (type === 'seed') {
			let size;
			if (type === 'trail') {
				size = Math.random() * 0.1 + 0.1;
			} else {
				size = Math.pow(vels[i].y, 2) * 0.04;
			}
			if (i === 0) size *= 1.1;
			adjustSizes.push(size);
			masses.push(size * 0.017);
			colors.push(1.0, 1.0, 1.0, 1.0);
		} else {
			const size = getRandomNum(guiControls.ParticleSize, 10) * 0.001;
			adjustSizes.push(size);
			masses.push(size * 0.017);
			if (colorType === 'multiple') {
				colors.push(multipleColor(), multipleColor(), multipleColor(), 1.0);
			} else {
				switch (rgbType) {
					case 'red':
						colors.push(singleColor, 0.1, 0.1, 1.0);
						break;
					case 'green':
						colors.push(0.1, singleColor, 0.1, 1.0);
						break;
					case 'blue':
						colors.push(0.1, 0.1, singleColor, 1.0);
						break;
					default:
						colors.push(singleColor, 0.1, 0.1, 1.0);
				}

			}
		}
	}
	bufferGeometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3).setDynamic(true));
	bufferGeometry.addAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3).setDynamic(true));
	bufferGeometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 4).setDynamic(true));
	bufferGeometry.addAttribute('adjustSize', new THREE.Float32BufferAttribute(adjustSizes, 1).setDynamic(true));
	bufferGeometry.addAttribute('mass', new THREE.Float32BufferAttribute(masses, 1).setDynamic(true));
	// material
	const shaderMaterial = new THREE.RawShaderMaterial({
		uniforms: {
			size: {
				type: 'f',
				value: textureSize
			},

			texture: {
				type: 't',
				value: canvasTexture
			}
		},


		transparent: true,
		// Display of "blending: THREE.AdditiveBlending" does not work properly if "depthWrite" property is set to true.
		// Therefore, it is necessary to make it false in the case of making the image transparent by blending.
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		vertexShader: document.getElementById('vs').textContent,
		fragmentShader: document.getElementById('fs').textContent
	});


	return new THREE.Points(bufferGeometry, shaderMaterial);
};

class ParticleMesh {
	constructor(num, vels, type) {
		this.particleNum = num;
		this.timerStartFading = 10;
		this.mesh = getPointMesh(num, vels, type);
	}
	update(gravity) {
		if (this.timerStartFading > 0) this.timerStartFading -= 0.3;
		const { position, velocity, color, mass } = this.mesh.geometry.attributes;
		const decrementRandom = () => Math.random() > 0.5 ? 0.98 : 0.96;
		const decrementByVel = v => Math.random() > 0.5 ? 0 : (1 - v) * 0.1;
		for (let i = 0; i < this.particleNum; i++) {
			const { x, y, z } = getOffsetXYZ(i);
			velocity.array[y] += gravity.y - mass.array[i];
			velocity.array[x] *= friction;
			velocity.array[z] *= friction;
			velocity.array[y] *= friction;
			position.array[x] += velocity.array[x];
			position.array[y] += velocity.array[y];
			position.array[z] += velocity.array[z];
			const { a } = getOffsetRGBA(i);
			if (this.timerStartFading <= 0) {
				color.array[a] *= decrementRandom() - decrementByVel(color.array[a]);
				if (color.array[a] < 0.001) color.array[a] = 0;
			}
		}
		position.needsUpdate = true;
		velocity.needsUpdate = true;
		color.needsUpdate = true;
	}
	disposeAll() {
		this.mesh.geometry.dispose();
		this.mesh.material.dispose();
	}
}


class ParticleSeedMesh extends ParticleMesh {
	constructor(num, vels) {
		super(num, vels, 'seed');
	}
	update(gravity) {
		const { position, velocity, color, mass } = this.mesh.geometry.attributes;
		const decrementRandom = () => Math.random() > 0.3 ? 0.99 : 0.96;
		const decrementByVel = v => Math.random() > 0.3 ? 0 : (1 - v) * 0.1;
		const shake = () => Math.random() > 0.5 ? 0.05 : -0.05;
		const dice = () => Math.random() > 0.1;
		const _f = friction * 0.98;
		for (let i = 0; i < this.particleNum; i++) {
			const { x, y, z } = getOffsetXYZ(i);
			velocity.array[y] += gravity.y - mass.array[i];
			velocity.array[x] *= _f;
			velocity.array[z] *= _f;
			velocity.array[y] *= _f;
			position.array[x] += velocity.array[x];
			position.array[y] += velocity.array[y];
			position.array[z] += velocity.array[z];
			if (dice()) position.array[x] += shake();
			if (dice()) position.array[z] += shake();
			const { a } = getOffsetRGBA(i);
			color.array[a] *= decrementRandom() - decrementByVel(color.array[a]);
			if (color.array[a] < 0.001) color.array[a] = 0;
		}
		position.needsUpdate = true;
		velocity.needsUpdate = true;
		color.needsUpdate = true;
	}
}


class ParticleTailMesh extends ParticleMesh {
	constructor(num, vels) {
		super(num, vels, 'trail');
	}
	update(gravity) {
		const { position, velocity, color, mass } = this.mesh.geometry.attributes;
		const decrementRandom = () => Math.random() > 0.3 ? 0.98 : 0.95;
		const shake = () => Math.random() > 0.5 ? 0.05 : -0.05;
		const dice = () => Math.random() > 0.2;
		for (let i = 0; i < this.particleNum; i++) {
			const { x, y, z } = getOffsetXYZ(i);
			velocity.array[y] += gravity.y - mass.array[i];
			velocity.array[x] *= friction;
			velocity.array[z] *= friction;
			velocity.array[y] *= friction;
			position.array[x] += velocity.array[x];
			position.array[y] += velocity.array[y];
			position.array[z] += velocity.array[z];
			if (dice()) position.array[x] += shake();
			if (dice()) position.array[z] += shake();
			const { a } = getOffsetRGBA(i);
			color.array[a] *= decrementRandom();
			if (color.array[a] < 0.001) color.array[a] = 0;
		}
		position.needsUpdate = true;
		velocity.needsUpdate = true;
		color.needsUpdate = true;
	}
}

class BasicFIreWorks {
	constructor() {
		this.meshGroup = new THREE.Group();
		this.isExplode = false;
		const max = 400;
		const min = 150;
		this.petalsNum = getRandomNum(max, min);
		this.life = 150;
		this.seed = this.getSeed();
		this.meshGroup.add(this.seed.mesh);
		this.flowerSizeRate = THREE.Math.mapLinear(this.petalsNum, min, max, 0.4, 0.7);
		this.flower;
	}
	getSeed() {
		const num = 40;
		const vels = [];
		for (let i = 0; i < num; i++) {
			const vx = 0;
			const vy = i === 0 ? Math.random() * 2.5 + 0.9 : Math.random() * 2.0 + 0.4;
			const vz = 0;
			vels.push(new THREE.Vector3(vx, vy, vz));
		}
		const pm = new ParticleSeedMesh(num, vels);
		const x = Math.random() * 80 - 40;
		const y = -50;
		const z = Math.random() * 80 - 40;
		pm.mesh.position.set(x, y, z);
		return pm;
	}
	explode(pos) {
		this.isExplode = true;
		this.flower = this.getFlower(pos);
		this.meshGroup.add(this.flower.mesh);
		this.meshGroup.remove(this.seed.mesh);
		this.seed.disposeAll();
	}
	getFlower(pos) {
		const num = this.petalsNum;
		const vels = [];
		let radius;
		const dice = Math.random();

		if (dice > 0.5) {
			for (let i = 0; i < num; i++) {
				radius = getRandomNum(120, 60) * 0.01;
				const theta = THREE.Math.degToRad(Math.random() * 180);
				const phi = THREE.Math.degToRad(Math.random() * 360);
				const vx = Math.sin(theta) * Math.cos(phi) * radius;
				const vy = Math.sin(theta) * Math.sin(phi) * radius;
				const vz = Math.cos(theta) * radius;
				const vel = new THREE.Vector3(vx, vy, vz);
				vel.multiplyScalar(this.flowerSizeRate);
				vels.push(vel);
			}
		} else {
			const zStep = 180 / num;
			const trad = 360 * (Math.random() * 20 + 1) / num;
			const xStep = trad;
			const yStep = trad;
			radius = getRandomNum(120, 60) * 0.01;
			for (let i = 0; i < num; i++) {
				const sphereRate = Math.sin(THREE.Math.degToRad(zStep * i));
				const vz = Math.cos(THREE.Math.degToRad(zStep * i)) * radius;
				const vx = Math.cos(THREE.Math.degToRad(xStep * i)) * sphereRate * radius;
				const vy = Math.sin(THREE.Math.degToRad(yStep * i)) * sphereRate * radius;
				const vel = new THREE.Vector3(vx, vy, vz);
				vel.multiplyScalar(this.flowerSizeRate);
				vels.push(vel);
			}
		}

		const particleMesh = new ParticleMesh(num, vels);
		particleMesh.mesh.position.set(pos.x, pos.y, pos.z);
		return particleMesh;
	}
	update(gravity) {
		if (!this.isExplode) {
			this.drawTail();
		} else {
			this.flower.update(gravity);
			if (this.life > 0) this.life -= 1;
		}
	}
	drawTail() {
		this.seed.update(gravity);
		const { position, velocity } = this.seed.mesh.geometry.attributes;
		let count = 0;
		let isComplete = true;
		// Check if the y-axis speed is down for all particles
		for (let i = 0, l = velocity.array.length; i < l; i++) {
			const v = velocity.array[i];
			const index = i % 3;
			if (index === 1 && v > 0) {
				count++;
			}
		}

		isComplete = count == 0;
		if (!isComplete) return;
		const { x, y, z } = this.seed.mesh.position;
		const flowerPos = new THREE.Vector3(x, y, z);
		let highestPos = 0;
		let offsetPos;
		for (let i = 0, l = position.array.length; i < l; i++) {
			const p = position.array[i];
			const index = i % 3;
			if (index === 1 && p > highestPos) {
				highestPos = p;
				offsetPos = new THREE.Vector3(position.array[i - 1], p, position.array[i + 2]);
			}
		}
		flowerPos.add(offsetPos);
		this.explode(flowerPos);
	}
}


class RichFIreWorks extends BasicFIreWorks {
	constructor() {
		super();
		const max = 150;
		const min = 100;
		this.petalsNum = getRandomNum(max, min);
		this.flowerSizeRate = THREE.Math.mapLinear(this.petalsNum, min, max, 0.4, 0.7);
		this.tailMeshGroup = new THREE.Group();
		this.tails = [];
	}
	explode(pos) {
		this.isExplode = true;
		this.flower = this.getFlower(pos);
		this.tails = this.getTail();
		this.meshGroup.add(this.flower.mesh);
		this.meshGroup.add(this.tailMeshGroup);
	}
	getTail() {
		const tails = [];
		const num = 20;
		const { color: petalColor } = this.flower.mesh.geometry.attributes;

		for (let i = 0; i < this.petalsNum; i++) {
			const vels = [];
			for (let j = 0; j < num; j++) {
				const vx = 0;
				const vy = 0;
				const vz = 0;
				vels.push(new THREE.Vector3(vx, vy, vz));
			}
			const tail = new ParticleTailMesh(num, vels);

			const { r, g, b, a } = getOffsetRGBA(i);

			const petalR = petalColor.array[r];
			const petalG = petalColor.array[g];
			const petalB = petalColor.array[b];
			const petalA = petalColor.array[a];

			const { position, color } = tail.mesh.geometry.attributes;

			for (let k = 0; k < position.count; k++) {
				const { r, g, b, a } = getOffsetRGBA(k);
				color.array[r] = petalR;
				color.array[g] = petalG;
				color.array[b] = petalB;
				color.array[a] = petalA;
			}

			const { x, y, z } = this.flower.mesh.position;
			tail.mesh.position.set(x, y, z);
			tails.push(tail);
			this.tailMeshGroup.add(tail.mesh);
		}
		return tails;
	}
	update(gravity) {
		if (!this.isExplode) {
			this.drawTail();
		} else {
			this.flower.update(gravity);

			const { position: flowerGeometory } = this.flower.mesh.geometry.attributes;

			for (let i = 0, l = this.tails.length; i < l; i++) {
				const tail = this.tails[i];
				tail.update(gravity);
				const { x, y, z } = getOffsetXYZ(i);
				const flowerPos = new THREE.Vector3(
					flowerGeometory.array[x],
					flowerGeometory.array[y],
					flowerGeometory.array[z]);

				const { position, velocity } = tail.mesh.geometry.attributes;
				for (let k = 0; k < position.count; k++) {
					const { x, y, z } = getOffsetXYZ(k);
					const desiredVelocity = new THREE.Vector3();
					const tailPos = new THREE.Vector3(position.array[x], position.array[y], position.array[z]);
					const tailVel = new THREE.Vector3(velocity.array[x], velocity.array[y], velocity.array[z]);
					desiredVelocity.subVectors(flowerPos, tailPos);
					const steer = desiredVelocity.sub(tailVel);
					steer.normalize();
					steer.multiplyScalar(Math.random() * 0.0003 * this.life);
					velocity.array[x] += steer.x;
					velocity.array[y] += steer.y;
					velocity.array[z] += steer.z;
				}
				velocity.needsUpdate = true;
			}

			if (this.life > 0) this.life -= 1.2;
		}
	}
}


const makeRoughGround = mesh => {
	const time = Date.now();
	const { geometry } = mesh;
	for (let i = 0, l = geometry.vertices.length; i < l; i++) {
		const vertex = geometry.vertices[i];
		const noise1 =
			noise.noise2D(vertex.x * 0.01 + time * 0.0002, vertex.y * 0.01 + time * 0.0002, vertex.z * 0.01 + time * 0.0002) *
			5;
		const noise2 =
			noise.noise2D(
				vertex.x * 0.02 + time * 0.00002,
				vertex.y * 0.02 + time * 0.00004,
				vertex.z * 0.02 + time * 0.00002) *
			2;
		const noise3 =
			noise.noise2D(
				vertex.x * 0.009 + time * 0.00001,
				vertex.y * 0.012 + time * 0.00003,
				vertex.z * 0.015 + time * 0.00003) *
			2;
		const distance = noise1 + noise2 + noise3;
		vertex.z = distance;
	}
	geometry.verticesNeedUpdate = true;
	geometry.normalsNeedUpdate = true;
	geometry.computeVertexNormals();
	geometry.computeFaceNormals();
};

const render = () => {
	orbitControls.update();

	makeRoughGround(planeMesh);

	const exploadedIndexList = [];

	for (let i = fireworksInstances.length - 1; i >= 0; i--) {
		const instance = fireworksInstances[i];
		instance.update(gravity);
		if (instance.isExplode) exploadedIndexList.push(i);
	}

	for (let i = 0, l = exploadedIndexList.length; i < l; i++) {
		const index = exploadedIndexList[i];
		const instance = fireworksInstances[index];
		if (!instance) return;

		/*
			Be careful because js heap size will continue to increase unless you do the following:
			- Remove unuse mesh from scene 
			- Execute dispose method of Geometres and Materials in the Mesh
		*/
		instance.meshGroup.remove(instance.seed.mesh);
		instance.seed.disposeAll();
		if (instance.life <= 0) {
			scene.remove(instance.meshGroup);
			if (instance.tailMeshGroup) {
				instance.tails.forEach(v => {
					v.disposeAll();
				});
			}
			instance.flower.disposeAll();
			fireworksInstances.splice(index, 1);
		}
	}

	renderer.render(scene, camera);

	requestAnimationFrame(render);
};

const onResize = () => {
	const width = window.innerWidth;
	const height = window.innerHeight;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
};

const onClickWindow = () => {
	if (isAutoLaunch) return;
	launchFireWorks();
};

const init = () => {
	outputDom = document.querySelector('#WebGL-output');

	/* scene
	   -------------------------------------------------------------*/
	scene = new THREE.Scene();
	//scene.fog = new THREE.Fog(0x000d20, 0, 1000 * 3);

	/* camera
	   -------------------------------------------------------------*/
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
	camera.position.set(0, -40, 170);
	//camera.position.set(0, 250, 0);
	//camera.position.set(0, -250, 0);
	camera.lookAt(scene.position);

	/* renderer
	   -------------------------------------------------------------*/
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});

	renderer.setPixelRatio(window.devicePixelRatio);
	// renderer.setClearColor(new THREE.Color(0x000000));
	renderer.setClearColor(new THREE.Color(0x000000), 0);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.setClearAlpha(0);

	/* OrbitControls
	   -------------------------------------------------------------*/
	orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
	orbitControls.autoRotate = false;
	orbitControls.enableDamping = true;
	orbitControls.dampingFactor = 0.2;

	/* AmbientLight
	   -------------------------------------------------------------*/
	const ambientLight = new THREE.AmbientLight(0x666666);
	scene.add(ambientLight);

	/* SpotLight
	   -------------------------------------------------------------*/
	const spotLight = new THREE.SpotLight(0xffffff);
	spotLight.distance = 2000;
	spotLight.position.set(-500, 1000, 0);
	spotLight.castShadow = true;
	scene.add(spotLight);

	/* Plane
	   --------------------------------------*/
	const planeGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
	const planeMaterial = new THREE.MeshLambertMaterial({
		//color: 0xffffff,
		side: THREE.DoubleSide,
		wireframe: true
	});

	planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
	planeMesh.receiveShadow = true;
	planeMesh.rotation.x = -0.5 * Math.PI;
	planeMesh.position.x = 0;
	planeMesh.position.y = -50;
	planeMesh.position.z = 0;
	scene.add(planeMesh);

	/* resize
	   -------------------------------------------------------------*/
	window.addEventListener('resize', onResize);

	/* rendering start
	   -------------------------------------------------------------*/
	document.getElementById('WebGL-output').appendChild(renderer.domElement);
	requestAnimationFrame(render);

	window.addEventListener('click', onClickWindow);

	setInterval(autoLaunch, 100);
};

document.addEventListener('DOMContentLoaded', () => {
	init();
});