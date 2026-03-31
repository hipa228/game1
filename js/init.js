/**
 * Инициализация игры - настройка сцены и выбор персонажа
 * Зависимости: THREE.js, все модули (загружается последним)
 */

console.log('✅ init.js загружен');

// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM полностью загружен');

    // Функция запуска игры из вступительной катсцены
    window.startGameFromIntro = function() {
        console.log('🎬 Запуск игры из вступительной катсцены...');
        console.log('Проверка элементов DOM:');
        console.log('- buildBedBtn:', document.getElementById('buildBedBtn'));
        console.log('- score:', document.getElementById('score'));

        // Скрываем вступительную сцену
        const introScene = document.getElementById('introScene');
        if (introScene) {
            introScene.style.transition = 'opacity 1.5s';
            introScene.style.opacity = '0';
            setTimeout(() => {
                introScene.style.display = 'none';
            }, 1500);
        }

        // Даём небольшую задержку для полной загрузки DOM перед запуском игры
        setTimeout(() => {
            selectSkin('human');
        }, 100);
    };

    console.log('✅ startGameFromIntro функция готова');
});

function selectSkin(skin) {
    console.log('=== selectSkin вызвана, скин:', skin);
    console.log('cameraMode:', cameraMode);
    selectedSkin = skin;

    // Всегда начинаем игру с дефолтных значений (сохранение отключено)
    score = 0;
    wave = 0; // Стартуем с 0 волны, чтобы при вызове startNewWave() стало 1
    lives = 3;
    ammo = maxAmmo;
    coins = 5000; // Начальные деньги
    wood = 0;

    // Сложность будет установлена в startNewWave(), которая вызывается в init()
    playerVelocityY = 0;
    isJumping = false;
    gameActive = true;
    cameraMode = 'firstPerson'; // Начинаем с вида от первого лица

    console.log('📂 Загружены данные: score=', score, 'wave=', wave, 'lives=', lives, 'coins=', coins, 'wood=', wood);
    // Показываем UI элементы (с проверкой на существование)
    const uiElements = [
        'score', 'instructions', 'crosshair', 'coinsDisplay',
        'openShopBtn', 'openItemsShopBtn', 'openWeaponsShopBtn',
        'woodDisplay', 'hungerDisplay', 'thirstDisplay', 'fatigueDisplay',
        'buildHouseBtn', 'buildBedBtn', 'buildSecondFloorBtn',
        'teleportToTrainingBtn'
    ];

    uiElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'block';
        } else {
            console.warn('⚠️ Элемент не найден:', id);
        }
    });

    // Вызываем init сначала чтобы инициализировать игру
    init();

    // Затем обновляем дисплеи (функции определены в game.js)
    if (typeof updateCoinsDisplay === 'function') updateCoinsDisplay();
    if (typeof updateWoodDisplay === 'function') updateWoodDisplay();
    if (typeof updateHungerDisplay === 'function') updateHungerDisplay();
    if (typeof updateThirstDisplay === 'function') updateThirstDisplay();
    if (typeof updateFatigueDisplay === 'function') updateFatigueDisplay();

    // Индикатор поглаживания показывается автоматически когда игрок подходит к собаке
}

// Делаем функцию selectSkin глобальной сразу после определения
window.selectSkin = selectSkin;

function init() {
    console.log('🎮 init() начинается...');

    // Останавливаем старую анимацию если есть
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    // Очищаем массивы
    obstacles = [];
    decorations = [];
    bullets = [];

    // Очищаем турели из старой сцены (если сцена существует)
    if (scene) {
        turrets.forEach(turret => scene.remove(turret));
    }
    turrets = [];

    // Очищаем питомцев из старой сцены (если сцена существует)
    if (scene) {
        pets.forEach(pet => scene.remove(pet));
    }
    pets = [];

    // Инициализируем цель взгляда камеры
    cameraLookTarget = new THREE.Vector3(0, 0.7, -10);

    console.log('🌍 Создаем новую сцену...');
    scene = new THREE.Scene();

    // Создаем отдельную сцену для FPS рук и оружия (viewmodel)
    fpsScene = new THREE.Scene();
    console.log('FPS сцена создана для viewmodel');

    // ОСВЕЩЕНИЕ FPS ОРУЖИЯ (ARC RAIDERS УРОВЕНЬ)
    const fpsAmbientLight = new THREE.AmbientLight(0xffffff, 1.5);
    fpsScene.add(fpsAmbientLight);

    // Основной свет спереди (подсвечивает оружие)
    const fpsMainLight = new THREE.DirectionalLight(0xffffff, 2.0);
    fpsMainLight.position.set(0, 0.5, 1);
    fpsScene.add(fpsMainLight);

    // Боковой свет для бликов на металле (ярче)
    const fpsSideLight = new THREE.DirectionalLight(0xaaccff, 1.2);
    fpsSideLight.position.set(1, 0.2, 0);
    fpsScene.add(fpsSideLight);

    // Задний свет для контура (rim light) - ярче
    const fpsRimLight = new THREE.DirectionalLight(0xffeecc, 0.9);
    fpsRimLight.position.set(-0.5, 0.5, -1);
    fpsScene.add(fpsRimLight);

    // Точечный свет для усиления деталей - ярче
    const fpsPointLight = new THREE.PointLight(0xffffff, 1.5, 3);
    fpsPointLight.position.set(0, 0, 0.5);
    fpsScene.add(fpsPointLight);

    // Дополнительный точечный свет снизу для отражений
    const fpsBottomLight = new THREE.PointLight(0xaaddff, 0.8, 2);
    fpsBottomLight.position.set(0, -0.3, 0);
    fpsScene.add(fpsBottomLight);

    console.log('💡 UE5 уровень освещения FPS оружия настроен');

    // Реалистичное градиентное небо (AAA качество)
    const vertexShader = `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
    const fragmentShader = `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
    `;
    const skyGeo = new THREE.SphereGeometry(500, 64, 64);
    const skyMat = new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: new THREE.Color(0x0055AA) },    // Глубокое синее небо
            bottomColor: { value: new THREE.Color(0xE8F4FF) }, // Светлый горизонт
            offset: { value: 33 },
            exponent: { value: 0.5 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);
    console.log('🌅 Реалистичное небо с градиентом создано');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
    // Вид от первого лица - камера на уровне глаз персонажа
    camera.position.set(0, 1.2, 0);
    camera.lookAt(0, 0, 0);

    // Создаём renderer только если его еще нет
    if (!renderer) {
        renderer = new THREE.WebGLRenderer({
            antialias: window.devicePixelRatio < 2, // Антиалиасинг только на низких DPI
            powerPreference: "high-performance",
            alpha: false,
            stencil: false,
            depth: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // ОПТИМИЗАЦИЯ: Ограничиваем pixel ratio для лучшего FPS
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        // ОПТИМИЗАЦИЯ: Упрощённые тени для производительности
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.BasicShadowMap; // Быстрее чем PCFSoftShadowMap
        renderer.shadowMap.autoUpdate = false; // Обновляем вручную только когда нужно

        // Базовый рендеринг для производительности
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        console.log('🎬 Renderer настроен на оптимизированный режим');

        document.body.appendChild(renderer.domElement);
        console.log('✅ Renderer создан с оптимизацией FPS');
    }

    // Постобработка ОТКЛЮЧЕНА (вызывает черный экран)
    composer = null;
    fpsComposer = null;
    console.log('⚡ Постобработка отключена - используется обычный рендеринг');

    // Атмосферный туман (дальний план)
    scene.fog = new THREE.FogExp2(0xb8d4f0, 0.015);

    // ОПТИМИЗИРОВАННОЕ ОСВЕЩЕНИЕ (меньше источников = больше FPS)

    // 1. Ambient Light - базовое освещение сцены
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // 2. Главное солнце (единственный directional light с тенями)
    const sunLight = new THREE.DirectionalLight(0xfff5e1, 1.5);
    sunLight.position.set(30, 40, 20);
    sunLight.castShadow = true;

    // ОПТИМИЗАЦИЯ: Уменьшенное разрешение теней для лучшего FPS
    sunLight.shadow.mapSize.width = 2048; // Вместо 4096
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 80;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    sunLight.shadow.bias = -0.0001;

    scene.add(sunLight);

    console.log('💡 Оптимизированное освещение настроено (2 источника вместо 7)');

    // ОПТИМИЗАЦИЯ: Упрощённая земля с меньшим количеством полигонов
    const groundGeometry = new THREE.PlaneGeometry(40, 300, 50, 50); // Было 200x200, стало 50x50

    // ОПТИМИЗАЦИЯ: Уменьшенное разрешение текстуры
    const grassCanvas = document.createElement('canvas');
    grassCanvas.width = 512; // Было 1024
    grassCanvas.height = 512;
    const ctx = grassCanvas.getContext('2d');

    // Базовый цвет травы (несколько оттенков зеленого)
    const grassColors = ['#3a7c3a', '#2d5a2d', '#4a8c4a', '#356b35', '#3d753d'];

    // Рисуем базовый слой
    ctx.fillStyle = grassColors[0];
    ctx.fillRect(0, 0, 1024, 1024);

    // ОПТИМИЗАЦИЯ: Меньше пятен
    for (let i = 0; i < 25; i++) { // Было 50
        const x = Math.random() * 512; // Было 1024
        const y = Math.random() * 512;
        const size = 50 + Math.random() * 100;
        const color = grassColors[Math.floor(Math.random() * grassColors.length)];

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
    }

    // ОПТИМИЗАЦИЯ: Меньше деталей
    for (let i = 0; i < 5000; i++) { // Было 30000
        const x = Math.random() * 512; // Было 1024
        const y = Math.random() * 512;
        const brightness = 0.7 + Math.random() * 0.6;
        ctx.fillStyle = `rgba(${40 * brightness}, ${100 * brightness}, ${40 * brightness}, ${0.3 + Math.random() * 0.3})`;
        ctx.fillRect(x, y, 1 + Math.random(), 1 + Math.random());
    }

    // ОПТИМИЗАЦИЯ: Меньше грязных пятен
    for (let i = 0; i < 15; i++) { // Было 30
        const x = Math.random() * 512; // Было 1024
        const y = Math.random() * 512;
        const size = 20 + Math.random() * 40;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, 'rgba(101, 67, 33, 0.3)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
    }

    const grassTexture = new THREE.CanvasTexture(grassCanvas);
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(10, 10);
    grassTexture.anisotropy = 4; // ОПТИМИЗАЦИЯ: Снижено с 16 до 4

    const groundMaterial = new THREE.MeshStandardMaterial({
        map: grassTexture,
        color: 0xffffff, // Белый чтобы текстура показывалась правильно
        roughness: 0.95,
        metalness: 0.0,
        side: THREE.DoubleSide
    });

    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    console.log('🌿 Ультра реалистичная земля с процедурной текстурой создана');

    // Добавляем деревья по краям
    decorations = [];
    createTrees();

    // Добавляем красивое солнце (как на Pinterest)
    const sun = createSun();
    scene.add(sun);
    decorations.push(sun);
    console.log('☀️ Солнце добавлено в сцену');

    // Добавляем пушистые облака (как на Pinterest)
    createClouds();
    console.log('☁️ Облака добавлены в сцену');

    // Создаём турели если были куплены
    if (hasTurret) {
        createTurret();
    }
    if (hasFireTurret) {
        createFireTurret();
    }
    if (hasLaserTurret) {
        createLaserTurret();
    }
    if (hasRocketTurret) {
        createRocketTurret();
    }
    if (hasFreezeTurret) {
        createFreezeTurret();
    }
    if (hasElectricTurret) {
        createElectricTurret();
    }
    if (hasPoisonTurret) {
        createPoisonTurret();
    }
    if (hasExplosiveTurret) {
        createExplosiveTurret();
    }
    if (hasSonicTurret) {
        createSonicTurret();
    }
    if (hasPlasmaTurret) {
        createPlasmaTurret();
    }
    if (hasTeslaTurret) {
        createTeslaTurret();
    }
    if (hasGravityTurret) {
        createGravityTurret();
    }
    if (hasRailgunTurret) {
        createRailgunTurret();
    }
    if (hasMinigunTurret) {
        createMinigunTurret();
    }
    if (hasFlamethrowerTurret) {
        createFlamethrowerTurret();
    }
    if (hasSniperTurret) {
        createSniperTurret();
    }
    if (hasShotgunTurret) {
        createShotgunTurret();
    }
    if (hasCannonTurret) {
        createCannonTurret();
    }
    if (hasNuclearTurret) {
        createNuclearTurret();
    }
    if (hasRainbowTurret) {
        createRainbowTurret();
    }
    if (hasHealingTurret) {
        createHealingTurret();
    }
    if (hasShieldTurret) {
        createShieldTurret();
    }
    if (hasQuantumTurret) {
        createQuantumTurret();
    }
    if (hasBlackholeTurret) {
        createBlackholeTurret();
    }
    if (hasTimeTurret) {
        createTimeTurret();
    }
    if (hasEnergyTurret) {
        createEnergyTurret();
    }
    if (hasMeteorTurret) {
        createMeteorTurret();
    }
    if (hasStormTurret) {
        createStormTurret();
    }
    if (hasAntimatterTurret) {
        createAntimatterTurret();
    }

    // Добавляем траву
    for (let i = 0; i < 50; i++) {
        const grass = createGrass();
        const side = Math.random() > 0.5 ? -3.5 : 3.5;
        grass.position.set(side + (Math.random() - 0.5) * 2, 0, -i * 2.5 - Math.random() * 3);
        scene.add(grass);
        decorations.push(grass);
    }

    // Добавляем заборы
    for (let i = 0; i < 15; i++) {
        const fence = createFence();
        const side = Math.random() > 0.5 ? -4.8 : 4.8;
        fence.position.set(side, 0, -i * 8 - 15);
        if (side > 0) {
            fence.rotation.y = Math.PI;
        }
        scene.add(fence);
        decorations.push(fence);
    }

    // Добавляем птиц в небе
    for (let i = 0; i < 12; i++) {
        const bird = createBird();
        bird.position.set(
            (Math.random() - 0.5) * 15,
            5 + Math.random() * 3,
            -i * 10 - Math.random() * 10
        );
        scene.add(bird);
        decorations.push(bird);
    }

    // Добавляем знаки
    for (let i = 0; i < 8; i++) {
        const sign = createSign();
        const side = Math.random() > 0.5 ? -5 : 5;
        sign.position.set(side, 0, -i * 15 - 20);
        if (side > 0) {
            sign.rotation.y = Math.PI;
        }
        scene.add(sign);
        decorations.push(sign);
    }

    // Добавляем дом с кошкой справа от игрока
    const house = createHouse();
    house.position.set(6, 0, 3);
    house.rotation.y = -Math.PI / 4; // Поворачиваем дом к игроку
    scene.add(house);
    decorations.push(house);

    // Добавляем кошку перед домом
    const houseCat = createHouseCat();
    houseCat.position.set(5, 0, 5);
    houseCat.rotation.y = Math.PI; // Кошка смотрит на игрока
    scene.add(houseCat);
    decorations.push(houseCat);

    // Создаём игрока - человека Dani Rojas
    player = createHuman();
    console.log('👤 Игрок создан (человек Dani Rojas):', player);

    player.position.set(0, 0.5, 0);
    player.rotation.y = -Math.PI / 2; // Смотрит вперед
    lastPlayerDirection = -Math.PI / 2; // Инициализируем направление
    player.castShadow = true;
    player.userData.isPlayer = true; // Маркер что это игрок
    scene.add(player);
    console.log('👤 Игрок добавлен в сцену на позиции:', player.position);

    // Создаем оружие
    currentWeapon = createWeapon(selectedWeapon);
    console.log('Оружие создано:', currentWeapon);

    // Позиционирование зависит от режима камеры
    console.log('Проверяем режим камеры. cameraMode =', cameraMode);
    if (cameraMode === 'firstPerson') {
        // Скрываем персонажа в режиме от первого лица (камера внутри головы)
        player.visible = false;
        console.log('Персонаж скрыт для FPS вида');

        // Создаем руки для FPS вида (как в CS:GO)
        console.log('Режим камеры - первое лицо! Создаем FPS руки...');
        console.log('Функция createFPSHands доступна?', typeof createFPSHands);
        fpsHands = createFPSHands();
        console.log('FPS руки созданы:', fpsHands);

        // Добавляем руки в FPS сцену (НЕ к камере!)
        fpsScene.add(fpsHands);
        console.log('FPS руки добавлены в fpsScene');

        // Вид от первого лица - оружие БЕЗ РУК, ближе к центру и выше
        currentWeapon.position.set(0.18, -0.12, -0.4); // Приближено к персонажу, выше, перед камерой
        // Поворачиваем оружие так чтобы ствол смотрел вперед (-Z)
        // Модель создается со стволом по X, нужно повернуть на -90° по Y
        currentWeapon.rotation.x = 0;
        currentWeapon.rotation.y = -Math.PI / 2 - Math.PI / 20; // -90° + небольшой доп. поворот
        currentWeapon.rotation.z = Math.PI / 20; // Небольшой наклон
        currentWeapon.scale.set(0.9, 0.9, 0.9); // Нормальный размер
        fpsHands.add(currentWeapon);
        console.log('Оружие позиционировано без рук, ближе к центру');
        console.log('Оружие добавлено к рукам. Руки имеют', fpsHands.children.length, 'детей');
        console.log('Позиция рук относительно камеры:', fpsHands.position);
        console.log('Позиция оружия относительно рук:', currentWeapon.position);
    } else {
        // Вид от третьего лица - оружие к игроку
        currentWeapon.position.set(0.15, 0.2, -0.4);
        currentWeapon.rotation.y = 0;
        currentWeapon.rotation.z = -Math.PI / 6;
        player.add(currentWeapon);
    }

    // Обновляем дисплей
    updateScoreDisplay();
    updateAmmoDisplay();
    document.getElementById('weaponDisplay').style.display = 'block';
    document.getElementById('weaponDisplay').textContent = '🔫 Пистолет';

    // Восстанавливаем дом если был построен
    const savedHousePos = localStorage.getItem('cubeGameHousePosition');
    if (savedHousePos) {
        try {
            const pos = JSON.parse(savedHousePos);
            playerHouse = createHouse();
            playerHouse.position.set(pos.x, pos.y, pos.z);
            playerHouse.userData.isHouse = true;
            playerHouse.userData.canEnter = true;
            scene.add(playerHouse);
            console.log('Дом восстановлен на позиции:', pos);
        } catch (e) {
            console.error('Ошибка восстановления дома:', e);
        }
    }

    // Восстанавливаем кровать если была построена
    const savedBed = localStorage.getItem('cubeGameHasBed');
    if (savedBed === 'true' && playerHouse) {
        hasBed = true;
        playerBed = createBed();
        playerBed.position.set(
            playerHouse.position.x - 1.2,
            playerHouse.position.y + 0.3,
            playerHouse.position.z - 0.5
        );
        playerBed.rotation.y = Math.PI / 2;
        scene.add(playerBed);
        console.log('Кровать восстановлена');

        // Скрываем кнопку постройки кровати
        document.getElementById('buildBedBtn').style.display = 'none';
    }

    // В начале игры создаем только собаку
    // Проверяем есть ли уже имя для собаки
    const dogName = petNames && petNames['dog'] ? petNames['dog'] : null;

    if (!dogName) {
        // Первый запуск - просим дать имя собаке
        setTimeout(() => {
            showDogNamingDialog();
        }, 500);
    } else {
        // Создаем собаку с сохраненным именем
        createPet('dog', dogName);
        console.log('🐾 Собака создана с именем:', dogName);
    }

    // Стартовый пакет убран - игрок начинает только с собакой и базовым оружием
    console.log('🎮 Игра начинается! Покупайте оружие, турели и питомцев в магазинах!');

    // Запускаем первую волну
    console.log('🌊 Запускаем первую волну...');
    // Запускаем первую волну только в обычном режиме
    if (gameMode === 'normal') {
        startNewWave();
    }

    // Запускаем игровой цикл
    console.log('🎬 Запускаем игровой цикл (animate)...');
    console.log('✅ init() завершен успешно!');
    console.log('Scene:', scene);
    console.log('Camera:', camera);
    console.log('Renderer:', renderer);
    console.log('Player:', player);
    animate();
}

// Функции создания персонажей перенесены в js/characters.js
// (createHouse, createHouseCat, createDog, createCat, createCube,
//  createOval, createFox, createPanda, createRabbit, createRobot)

