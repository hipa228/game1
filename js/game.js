// Основная игровая логика

console.log('✅ game.js загружен');

// Глобальные переменные (используем var для совместимости с inline скриптом)
var scene, camera, renderer, composer, fpsComposer;
var fpsScene; // Отдельная сцена для FPS рук и оружия
var player, ground, currentWeapon, fpsHands;
var obstacles = [];
var bullets = [];
var score = 0;
var highScore = parseInt(localStorage.getItem('cubeGameHighScore')) || 0;
var wave = 1;
var level = 1; // Уровень игры (используется для системы вознаграждений)
var zombiesPerWave = 5;
var zombiesInCurrentWave = 0;
var waveActive = false;
var lives = 3;
var playerHP = 100; // Здоровье игрока
var maxPlayerHP = 100;
var ammo = 80;
var maxAmmo = 80;
var coins = 5000; // Начинаем с 5000 монет
var wood = 0; // Собранная древесина для постройки дома

// Система голода и жажды
var hunger = 100; // Голод (0-100)
var maxHunger = 100;
var thirst = 100; // Жажда (0-100)
var maxThirst = 100;
var foodItem = null; // Объект еды в доме
var sodaItem = null; // Объект газировки в доме

// Система усталости и сна
var fatigue = 100; // Усталость (0-100)
var maxFatigue = 100;
var fatigueRate = 1; // Скорость увеличения усталости

// Ресурсы для крафта
var cloth = 0;     // Ткань (можно собирать с зомби или находить)
var herbs = 0;     // Травы (можно собирать в мире)
var nails = 0;     // Гвозди (можно найти в зданиях)
var string = 0;    // Веревка (можно создать из ткани)
var playerHouse = null; // Построенный дом игрока
var playerBed = null; // Кровать в доме
var hasBed = false; // Есть ли кровать
var playerSecondFloor = null; // Второй этаж дома
var hasSecondFloor = false; // Построен ли второй этаж
var houseInterior = null; // Интерьер дома
var isInsideHouse = false; // Находится ли игрок внутри дома
var savedOutdoorPosition = null; // Сохраненная позиция на улице

// Система финального босса
var zombiesKilled = 0; // Количество убитых зомби
var finalBossSpawned = false; // Был ли вызван финальный босс
var finalBossConditionsMet = false; // Выполнены ли условия для финального босса

// Система тренировочного полигона
var isOnTrainingMap = false; // Находится ли игрок на тренировочном полигоне
var savedGameState = null; // Сохраненное состояние игры перед телепортацией
var trainingMovementLocked = false; // Блокировка движения в тренировке (как в Standoff)
var trainingTargetsDestroyed = 0; // Счетчик уничтоженных целей
var spawnRandomTarget = null; // Функция спавна случайной цели

var petPats = 0; // Количество поглаживаний питомца
var hasCompanion = false; // Есть ли напарник
var companion = null; // Объект напарника
var gameActive = true;
var gameMode = 'normal'; // 'normal' или 'training'
var playerVelocityY = 0;
var isJumping = false;
var keys = {};
var selectedSkin = null;
var selectedWeapon = 'pistol';
var unlockedWeapons = JSON.parse(localStorage.getItem('cubeGameUnlockedWeapons')) || ['pistol', 'rifle', 'laser', 'gravity', 'awp'];
var maxWaveReached = parseInt(localStorage.getItem('cubeGameMaxWave')) || 1;
var animationId = null;
var decorations = [];
var canShoot = true;
var shootCooldown = 300;
var isBurstFiring = false;
var burstCount = 0;
var burstMax = 3;
var cameraMode = 'firstPerson';
var lastPlayerDirection = -Math.PI / 2; // Последнее направление персонажа (по умолчанию вперед)
var handsSway = { x: 0, y: 0 }; // Покачивание рук от движения мыши (эффект инерции)
var obstacleSpeed = 0.015;
var spawnRate = 0.03;
var gravity = -0.015;
var playerSpeed = 0.1;
var bulletSpeed = 0.5;
var jumpPower = 0.3;
var cameraLookTarget;
var ownedSkins = ['dog', 'cat', 'fox', 'panda', 'rabbit', 'robot', 'cube', 'oval'];
var ownedWeapons = JSON.parse(localStorage.getItem('cubeGameOwnedWeapons')) || ['pistol', 'rifle', 'ak47', 'awp'];
var turrets = [];
// Управление камерой через тач
var cameraYaw = 0; // Горизонтальный поворот камеры (влево-вправо)
// Прицеливание
var isAiming = false; // Прицеливание включено или нет
var normalFov = 75; // Обычный FOV
var aimFov = 40; // FOV при прицеливании (больше зум)
var cameraPitch = 0; // Вертикальный поворот камеры (вверх-вниз)
var touchStartX = 0;
var touchStartY = 0;
var isTouching = false;
var manualCameraControl = false; // Ручное управление камерой (отключает автоприцеливание)
var hasTurret = false;
var hasFireTurret = false;
var hasLaserTurret = false;
var hasRocketTurret = false;
var hasFreezeTurret = false;
var hasElectricTurret = false;
var hasPoisonTurret = false;
var hasExplosiveTurret = false;
var hasSonicTurret = false;
var hasPlasmaTurret = false;
var hasTeslaTurret = false;
var hasGravityTurret = false;
var hasRailgunTurret = false;
var hasMinigunTurret = false;
var hasFlamethrowerTurret = false;
var hasSniperTurret = false;
var hasShotgunTurret = false;
var hasCannonTurret = false;
var hasNuclearTurret = false;
var hasRainbowTurret = false;
var hasHealingTurret = false;
var hasShieldTurret = false;
var hasQuantumTurret = false;
var hasBlackholeTurret = false;
var hasTimeTurret = false;
var hasEnergyTurret = false;
var hasMeteorTurret = false;
var hasStormTurret = false;
var hasAntimatterTurret = false;
var pets = [];
var ownedPets = JSON.parse(localStorage.getItem('cubeGameOwnedPets')) || [];
var petNames = JSON.parse(localStorage.getItem('cubeGamePetNames')) || {};

function updateScoreDisplay() {
    const heartsDisplay = '❤️'.repeat(lives);

    // Если финальный босс ещё не вызван, показываем прогресс
    if (!finalBossSpawned) {
        const zombiesProgress = zombiesKilled + '/1000';
        const houseIcon = playerHouse ? '✅' : '❌';
        const bedIcon = hasBed ? '✅' : '❌';
        const floorIcon = hasSecondFloor ? '✅' : '❌';

        document.getElementById('score').textContent = 'Счёт: ' + score + ' | Убито зомби: ' + zombiesProgress + ' | Дом: ' + houseIcon + ' | Кровать: ' + bedIcon + ' | 2 этаж: ' + floorIcon + ' | Жизни: ' + heartsDisplay;
    } else {
        // После вызова финального босса показываем просто счет
        document.getElementById('score').textContent = 'Счёт: ' + score + ' | Рекорд: ' + highScore + ' | ФИНАЛЬНАЯ БИТВА! | Жизни: ' + heartsDisplay;
    }
}

function updateAmmoDisplay() {
    document.getElementById('ammoDisplay').textContent = 'Патроны: ' + ammo + ' / ' + maxAmmo;
}

function updateCoinsDisplay() {
    document.getElementById('coinsDisplay').textContent = '💰 Монеты: ' + coins;
}

function updatePlayerHPDisplay() {
    const hpBar = document.getElementById('playerHPBar');
    const hpText = document.getElementById('playerHPText');

    if (hpBar && hpText) {
        const hpPercent = (playerHP / maxPlayerHP) * 100;
        hpBar.style.width = hpPercent + '%';

        // Меняем цвет в зависимости от HP
        if (hpPercent > 60) {
            hpBar.style.backgroundColor = '#4CAF50'; // Зеленый
        } else if (hpPercent > 30) {
            hpBar.style.backgroundColor = '#FFA500'; // Оранжевый
        } else {
            hpBar.style.backgroundColor = '#FF0000'; // Красный
        }

        hpText.textContent = playerHP + ' / ' + maxPlayerHP;
    }
}

function petDog() {
    // Собака всегда с игроком с самого начала
    if (hasCompanion) {
        alert('💚 Ваш напарник уже с вами!');
        return;
    }

    petPats++;
    document.getElementById('petPatsCount').textContent = petPats;

    // АНИМАЦИЯ СОБАКИ - прыжок и виляние хвостом
    const dog = pets.find(pet => pet.userData.type === 'dog');
    if (dog) {
        // Сохраняем оригинальную позицию
        const originalY = dog.position.y;

        // Анимация прыжка (3 прыжка подряд)
        let jumpCount = 0;
        const jumpAnimation = () => {
            if (jumpCount >= 3) return;

            const jumpDuration = 400;
            const jumpHeight = 0.5;
            const startTime = Date.now();

            const animateJump = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / jumpDuration;

                if (progress < 1) {
                    // Парабола для прыжка
                    const jumpProgress = Math.sin(progress * Math.PI);
                    dog.position.y = originalY + jumpProgress * jumpHeight;
                    requestAnimationFrame(animateJump);
                } else {
                    dog.position.y = originalY;
                    jumpCount++;
                    if (jumpCount < 3) {
                        setTimeout(jumpAnimation, 100);
                    }
                }
            };
            animateJump();
        };
        jumpAnimation();

        // Виляние хвостом (если есть хвост в модели)
        if (dog.userData.tail) {
            const tail = dog.userData.tail;
            const originalRotZ = tail.rotation.z;
            let wagCount = 0;
            const wagSpeed = 100;

            const wagTail = () => {
                if (wagCount >= 10) {
                    tail.rotation.z = originalRotZ;
                    return;
                }

                tail.rotation.z = originalRotZ + Math.sin(Date.now() * 0.03) * 0.5;
                wagCount++;
                setTimeout(wagTail, wagSpeed);
            };
            wagTail();
        }

        // Вращение собаки (радостное кружение)
        const originalRotY = dog.rotation.y;
        const spinDuration = 600;
        const startTime = Date.now();

        const animateSpin = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);

            if (progress < 1) {
                dog.rotation.y = originalRotY + progress * Math.PI * 2;
                requestAnimationFrame(animateSpin);
            } else {
                dog.rotation.y = originalRotY;
            }
        };
        animateSpin();

        // Сердечки над собакой (particle effect)
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const heartGeometry = new THREE.PlaneGeometry(0.3, 0.3);
                const heartCanvas = document.createElement('canvas');
                heartCanvas.width = 64;
                heartCanvas.height = 64;
                const ctx = heartCanvas.getContext('2d');
                ctx.font = '48px Arial';
                ctx.fillText('💕', 8, 48);

                const heartTexture = new THREE.CanvasTexture(heartCanvas);
                const heartMaterial = new THREE.MeshBasicMaterial({
                    map: heartTexture,
                    transparent: true,
                    opacity: 1
                });
                const heart = new THREE.Mesh(heartGeometry, heartMaterial);

                // Позиция над собакой
                heart.position.copy(dog.position);
                heart.position.y += 1.5;
                heart.position.x += (Math.random() - 0.5) * 0.5;
                heart.position.z += (Math.random() - 0.5) * 0.5;

                // Скорость подъёма
                heart.userData.velocity = {
                    y: 0.02 + Math.random() * 0.01,
                    rotation: (Math.random() - 0.5) * 0.1
                };
                heart.userData.lifetime = 60; // 1 секунда

                scene.add(heart);

                // Анимация подъёма и исчезновения
                const animateHeart = () => {
                    if (!heart.parent || heart.userData.lifetime <= 0) {
                        scene.remove(heart);
                        return;
                    }

                    heart.position.y += heart.userData.velocity.y;
                    heart.rotation.z += heart.userData.velocity.rotation;
                    heart.material.opacity = heart.userData.lifetime / 60;
                    heart.userData.lifetime--;

                    // Всегда смотрит на камеру (billboard)
                    heart.quaternion.copy(camera.quaternion);

                    requestAnimationFrame(animateHeart);
                };
                animateHeart();
            }, i * 200);
        }
    }

    // Уведомление о поглаживании
    const notification = document.createElement('div');
    notification.style.cssText = 'position: fixed; top: 40%; left: 50%; transform: translate(-50%, -50%); background: rgba(255, 182, 193, 0.95); color: #fff; padding: 20px 40px; border-radius: 15px; font-size: 24px; font-weight: bold; z-index: 999; border: 3px solid #FFB6C1; box-shadow: 0 0 20px rgba(255, 182, 193, 0.8);';
    notification.innerHTML = '🐶💕 Собака довольна! (' + petPats + '/5)';
    document.body.appendChild(notification);
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 1500);

    // После 5 поглаживаний появляется напарник
    if (petPats >= 5) {
        hasCompanion = true;
        spawnCompanion();

        // Драматичное уведомление
        const companionNotif = document.createElement('div');
        companionNotif.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 60px; border-radius: 20px; font-size: 36px; font-weight: bold; z-index: 1000; text-align: center; border: 5px solid gold; box-shadow: 0 0 50px rgba(102, 126, 234, 0.8);';
        companionNotif.innerHTML = '🤝 НАПАРНИК ПРИБЫЛ! 🤝<br><br><span style="font-size: 24px;">Он будет помогать вам в бою!</span>';
        document.body.appendChild(companionNotif);
        setTimeout(() => {
            if (document.body.contains(companionNotif)) {
                document.body.removeChild(companionNotif);
            }
        }, 4000);

        // Индикатор поглаживания автоматически скроется когда напарник появился
    }
}

function showDogNamingDialog() {
    const dialog = document.getElementById('petNameDialog');
    const input = document.getElementById('petNameInput');
    const icon = document.getElementById('petDialogIcon');
    const title = document.getElementById('petDialogTitle');
    const desc = document.getElementById('petDialogDesc');

    // Настраиваем диалог
    icon.textContent = '🐕';
    title.textContent = 'Дайте имя вашей собаке!';
    desc.textContent = 'Ваш верный друг будет с вами с самого начала приключения';
    input.value = '';

    // Показываем диалог
    dialog.style.display = 'flex';
    setTimeout(() => input.focus(), 100);

    // Обработчик подтверждения
    const confirmHandler = () => {
        const dogName = input.value.trim();
        if (!dogName || dogName === '') {
            alert('Пожалуйста, введите имя для собаки!');
            input.focus();
            return;
        }

        // Сохраняем имя собаки
        if (!petNames) window.petNames = {};
        petNames['dog'] = dogName;
        localStorage.setItem('cubeGamePetNames', JSON.stringify(petNames));

        // Создаем собаку
        createPet('dog', dogName);
        console.log('🐾 Собака создана с именем:', dogName);

        // Показываем уведомление
        const notif = document.createElement('div');
        notif.style.cssText = 'position: fixed; top: 40%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, rgba(139, 69, 19, 0.98), rgba(101, 67, 33, 0.98)); color: white; padding: 40px 60px; border-radius: 20px; font-size: 32px; font-weight: bold; z-index: 999; border: 5px solid #8B4513; box-shadow: 0 0 40px rgba(139, 69, 19, 0.9); text-align: center;';
        notif.innerHTML = '🐕 ' + dogName + ' присоединился к вам!<br><br><span style="font-size: 20px; color: #FFD700;">Ваша собака будет сражаться рядом с вами!<br>Вы играете за Dani Rojas 🤠</span>';
        document.body.appendChild(notif);
        setTimeout(() => {
            if (document.body.contains(notif)) {
                document.body.removeChild(notif);
            }
        }, 4000);

        // Скрываем диалог
        dialog.style.display = 'none';
        cleanup();
    };

    // Обработчик отмены
    const cancelHandler = () => {
        // Нельзя отменить - собака обязательна
        alert('Вы должны дать имя собаке, чтобы начать игру!');
    };

    // Обработчик Enter
    const enterHandler = (e) => {
        if (e.key === 'Enter') {
            confirmHandler();
        }
    };

    // Функция очистки обработчиков
    const cleanup = () => {
        document.getElementById('petNameConfirm').removeEventListener('click', confirmHandler);
        document.getElementById('petNameCancel').removeEventListener('click', cancelHandler);
        input.removeEventListener('keypress', enterHandler);
    };

    // Добавляем обработчики
    document.getElementById('petNameConfirm').addEventListener('click', confirmHandler);
    document.getElementById('petNameCancel').addEventListener('click', cancelHandler);
    input.addEventListener('keypress', enterHandler);
}

function spawnCompanion() {
    // Создаем напарника (человек как персонаж игрока)
    companion = createHuman();
    companion.position.set(player.position.x + 3, 0, player.position.z - 2);
    companion.userData.shootCooldown = 0;
    scene.add(companion);

    // Добавляем бирку над напарником
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;

    // Фон
    context.fillStyle = 'rgba(102, 126, 234, 0.9)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Текст
    context.font = 'bold 32px Arial';
    context.fillStyle = '#FFFFFF';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('🤝 Напарник', canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 0.5, 1);
    sprite.position.set(0, 2.5, 0);

    companion.add(sprite);
    companion.userData.nameTag = sprite;
}

function updateWoodDisplay() {
    document.getElementById('woodDisplay').textContent = '🪵 Древесина: ' + wood;
}

function updateHungerDisplay() {
    const hungerPercent = Math.floor((hunger / maxHunger) * 100);
    const hungerEl = document.getElementById('hungerDisplay');
    if (hungerEl) {
        hungerEl.textContent = '🍖 Голод: ' + hungerPercent + '%';

        // Меняем цвет в зависимости от уровня голода
        if (hungerPercent < 20) {
            hungerEl.style.background = 'linear-gradient(135deg, rgba(139, 0, 0, 0.95), rgba(139, 0, 0, 0.85))';
        } else if (hungerPercent < 50) {
            hungerEl.style.background = 'linear-gradient(135deg, rgba(255, 69, 0, 0.85), rgba(178, 34, 34, 0.75))';
        } else {
            hungerEl.style.background = 'linear-gradient(135deg, rgba(255, 140, 0, 0.85), rgba(255, 99, 71, 0.75))';
        }
    }
}

function updateThirstDisplay() {
    const thirstPercent = Math.floor((thirst / maxThirst) * 100);
    const thirstEl = document.getElementById('thirstDisplay');
    if (thirstEl) {
        thirstEl.textContent = '💧 Жажда: ' + thirstPercent + '%';

        // Меняем цвет в зависимости от уровня жажды
        if (thirstPercent < 20) {
            thirstEl.style.background = 'linear-gradient(135deg, rgba(0, 0, 139, 0.95), rgba(0, 0, 139, 0.85))';
        } else if (thirstPercent < 50) {
            thirstEl.style.background = 'linear-gradient(135deg, rgba(30, 144, 255, 0.85), rgba(65, 105, 225, 0.75))';
        } else {
            thirstEl.style.background = 'linear-gradient(135deg, rgba(135, 206, 250, 0.85), rgba(100, 149, 237, 0.75))';
        }
    }
}

function updateFatigueDisplay() {
    const fatiguePercent = Math.floor((fatigue / maxFatigue) * 100);
    const fatigueEl = document.getElementById('fatigueDisplay');
    if (fatigueEl) {
        fatigueEl.textContent = '😴 Усталость: ' + fatiguePercent + '%';

        // Меняем цвет в зависимости от уровня усталости
        if (fatiguePercent < 20) {
            fatigueEl.style.background = 'linear-gradient(135deg, rgba(75, 0, 130, 0.95), rgba(75, 0, 130, 0.85))';
        } else if (fatiguePercent < 50) {
            fatigueEl.style.background = 'linear-gradient(135deg, rgba(128, 0, 128, 0.85), rgba(75, 0, 130, 0.75))';
        } else {
            fatigueEl.style.background = 'linear-gradient(135deg, rgba(147, 112, 219, 0.85), rgba(138, 43, 226, 0.75))';
        }
    }
}

function buyAndEatFood() {
    const cost = 50;
    if (coins >= cost) {
        if (hunger >= maxHunger) {
            showNotification('🍖 Вы не голодны!', 'info');
            return;
        }
        coins -= cost;
        hunger = Math.min(hunger + 50, maxHunger);
        updateCoinsDisplay();
        updateHungerDisplay();
        showNotification('🍖 Вы съели еду! Голод восстановлен на 50%', 'success');
    } else {
        showNotification('❌ Недостаточно денег! Нужно: ' + cost + ' монет', 'error');
    }
}

function buyAndDrinkSoda() {
    const cost = 50;
    if (coins >= cost) {
        if (thirst >= maxThirst) {
            showNotification('💧 Вы не испытываете жажду!', 'info');
            return;
        }
        coins -= cost;
        thirst = Math.min(thirst + 50, maxThirst);
        updateCoinsDisplay();
        updateThirstDisplay();
        showNotification('💧 Вы выпили газировку! Жажда утолена на 50%', 'success');
    } else {
        showNotification('❌ Недостаточно денег! Нужно: ' + cost + ' монет', 'error');
    }
}

function buildHouse() {
    const woodRequired = 50; // Нужно 50 дерева для постройки дома

    if (wood >= woodRequired) {
        if (playerHouse) {
            // Уже построен дом
            showNotification('🏠 У вас уже есть дом!', 'info');
            return;
        }

        wood -= woodRequired;
        updateWoodDisplay();

        // Создаем дом на позиции игрока
        playerHouse = createHouse();
        playerHouse.position.set(player.position.x, 0, player.position.z);
        playerHouse.userData.isHouse = true; // Помечаем как дом игрока
        playerHouse.userData.canEnter = true; // Можно войти
        scene.add(playerHouse);

        // Показываем уведомление
        showNotification('🏠 Дом построен! Зайдите внутрь (подойдите близко) для сохранения прогресса!', 'success');

        // Даем бонус за постройку дома
        coins += 500;
        updateCoinsDisplay();
        lives = Math.min(lives + 1, 5); // Добавляем жизнь (максимум 5)
        updateScoreDisplay();

        // Проверяем условия финального босса
        checkFinalBossConditions();

    } else {
        showNotification('❌ Недостаточно древесины! Нужно: ' + woodRequired + ', есть: ' + wood, 'error');
    }
}

function buildBed() {
    const woodRequired = 20; // Нужно 20 дерева для постройки кровати

    if (!playerHouse) {
        showNotification('❌ Сначала постройте дом!', 'error');
        return;
    }

    if (hasBed) {
        showNotification('🛏️ У вас уже есть кровать!', 'info');
        return;
    }

    if (wood >= woodRequired) {
        wood -= woodRequired;
        updateWoodDisplay();
        hasBed = true;

        // Создаем кровать
        playerBed = createBed();
        playerBed.rotation.y = Math.PI / 2; // Поворачиваем вдоль стены

        // Если игрок внутри дома, добавляем кровать в интерьер
        if (isInsideHouse && houseInterior) {
            playerBed.position.set(-1.2, 0.3, -0.5); // Позиция внутри интерьера
            playerBed.visible = true;
            houseInterior.add(playerBed);
        } else {
            // Если снаружи, добавляем в сцену но скрываем
            playerBed.position.set(
                playerHouse.position.x - 1.2,
                playerHouse.position.y + 0.3,
                playerHouse.position.z - 0.5
            );
            playerBed.visible = false; // Не видна снаружи
            scene.add(playerBed);
        }

        // Сохраняем в localStorage
        localStorage.setItem('cubeGameHasBed', 'true');

        // Показываем уведомление
        showNotification('🛏️ Кровать построена! Теперь можно спать и восстанавливать здоровье!', 'success');

        // Даем бонус за постройку кровати
        coins += 200;
        updateCoinsDisplay();

        // Обновляем кнопку
        const bedBtn = document.getElementById('buildBedBtn');
        if (bedBtn) {
            bedBtn.style.display = 'none';
        }

        // Проверяем условия финального босса
        checkFinalBossConditions();

    } else {
        showNotification('❌ Недостаточно древесины! Нужно: ' + woodRequired + ', есть: ' + wood, 'error');
    }
}

function buildSecondFloor() {
    const woodRequired = 100; // Нужно 100 дерева для постройки второго этажа

    if (!playerHouse) {
        showNotification('❌ Сначала постройте дом!', 'error');
        return;
    }

    if (hasSecondFloor) {
        showNotification('🏠 У вас уже есть второй этаж!', 'info');
        return;
    }

    if (wood >= woodRequired) {
        wood -= woodRequired;
        updateWoodDisplay();
        hasSecondFloor = true;

        // Создаем второй этаж (копия первого, но выше)
        const secondFloorMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });

        // Стены второго этажа
        const wallGeometry = new THREE.BoxGeometry(5, 3, 0.3);

        // Передняя стена
        const frontWall = new THREE.Mesh(wallGeometry, secondFloorMaterial);
        frontWall.position.set(playerHouse.position.x, playerHouse.position.y + 4.5, playerHouse.position.z + 2.25);
        scene.add(frontWall);

        // Задняя стена
        const backWall = new THREE.Mesh(wallGeometry, secondFloorMaterial);
        backWall.position.set(playerHouse.position.x, playerHouse.position.y + 4.5, playerHouse.position.z - 2.25);
        scene.add(backWall);

        // Боковые стены
        const sideWallGeometry = new THREE.BoxGeometry(0.3, 3, 4.5);
        const leftWall = new THREE.Mesh(sideWallGeometry, secondFloorMaterial);
        leftWall.position.set(playerHouse.position.x - 2.5, playerHouse.position.y + 4.5, playerHouse.position.z);
        scene.add(leftWall);

        const rightWall = new THREE.Mesh(sideWallGeometry, secondFloorMaterial);
        rightWall.position.set(playerHouse.position.x + 2.5, playerHouse.position.y + 4.5, playerHouse.position.z);
        scene.add(rightWall);

        // Крыша второго этажа
        const roofGeometry = new THREE.ConeGeometry(4, 2, 4);
        const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(playerHouse.position.x, playerHouse.position.y + 7, playerHouse.position.z);
        roof.rotation.y = Math.PI / 4;
        scene.add(roof);

        // Сохраняем ссылки
        playerSecondFloor = new THREE.Group();
        playerSecondFloor.add(frontWall, backWall, leftWall, rightWall, roof);

        // Сохраняем в localStorage
        localStorage.setItem('cubeGameHasSecondFloor', 'true');

        // Показываем уведомление
        showNotification('🏠 Второй этаж построен! Ваш дом теперь двухэтажный!', 'success');

        // Даем бонус за постройку второго этажа
        coins += 500;
        updateCoinsDisplay();

        // Обновляем кнопку
        const secondFloorBtn = document.getElementById('buildSecondFloorBtn');
        if (secondFloorBtn) {
            secondFloorBtn.style.display = 'none';
        }

        // Проверяем условия финального босса
        checkFinalBossConditions();

    } else {
        showNotification('❌ Недостаточно древесины! Нужно: ' + woodRequired + ', есть: ' + wood, 'error');
    }
}

// Проверка условий для вызова финального босса
function checkFinalBossConditions() {
    // Если финальный босс уже был вызван, не проверяем
    if (finalBossSpawned) return;

    // Проверяем все условия
    const hasKilled1000Zombies = zombiesKilled >= 1000;
    const hasHouse = playerHouse !== null;
    const hasBedBuilt = hasBed;
    const hasSecondFloorBuilt = hasSecondFloor;

    // Выводим текущий прогресс в консоль
    console.log('🎯 Прогресс финального босса:');
    console.log('  Убито зомби: ' + zombiesKilled + '/1000 ' + (hasKilled1000Zombies ? '✅' : '❌'));
    console.log('  Дом построен: ' + (hasHouse ? '✅' : '❌'));
    console.log('  Кровать построена: ' + (hasBedBuilt ? '✅' : '❌'));
    console.log('  Второй этаж построен: ' + (hasSecondFloorBuilt ? '✅' : '❌'));

    // Если все условия выполнены
    if (hasKilled1000Zombies && hasHouse && hasBedBuilt && hasSecondFloorBuilt) {
        finalBossConditionsMet = true;
        spawnFinalBoss();
    }
}

// Вызов финального босса
function spawnFinalBoss() {
    if (finalBossSpawned) return;

    finalBossSpawned = true;
    waveActive = false; // Останавливаем спавн обычных зомби

    console.log('🎮 ВСЕ УСЛОВИЯ ВЫПОЛНЕНЫ! ФИНАЛЬНЫЙ БОСС ПРИБЛИЖАЕТСЯ!');

    // Удаляем всех обычных зомби
    obstacles.forEach(obs => {
        if (!obs.userData.isBoss) {
            scene.remove(obs);
        }
    });
    obstacles = obstacles.filter(obs => obs.userData.isBoss);

    // Драматичное уведомление
    const notification = document.createElement('div');
    notification.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #000000 0%, #8B0000 50%, #FF0000 100%); color: white; padding: 50px 80px; border-radius: 25px; font-size: 56px; font-weight: bold; z-index: 1000; text-align: center; border: 8px solid gold; box-shadow: 0 0 100px rgba(255, 0, 0, 1); animation: pulse 0.8s infinite;';
    notification.innerHTML = '⚠️ ФИНАЛЬНЫЙ БОСС ⚠️<br><br><span style="font-size: 32px; color: #FFD700;">Повелитель Зомби</span><br><br><span style="font-size: 24px; color: #FF6347;">Вы выполнили все условия!<br>Финальная битва начинается!</span>';
    document.body.appendChild(notification);

    // Спавним финального босса через 3 секунды
    setTimeout(() => {
        document.body.removeChild(notification);

        if (gameActive) {
            console.log('🧟 Создание финального босса...');
            window.finalBoss = createFinalBoss();
            console.log('✅ Финальный босс создан:', window.finalBoss);

            // Показываем HP бар игрока для боя с боссом
            document.getElementById('playerHPContainer').style.display = 'block';
            playerHP = maxPlayerHP;
            updatePlayerHPDisplay();

            // Интенсивная тряска экрана
            let shakeIntensity = 40;
            let shakeCount = 0;
            const shakeInterval = setInterval(() => {
                if (camera) {
                    camera.position.x += (Math.random() - 0.5) * shakeIntensity * 0.015;
                    camera.position.y += (Math.random() - 0.5) * shakeIntensity * 0.015;
                }
                shakeCount++;
                if (shakeCount > 40) {
                    clearInterval(shakeInterval);
                }
            }, 40);

            // Темнота и красная вспышка
            scene.background = new THREE.Color(0x000000);
            setTimeout(() => {
                scene.background = new THREE.Color(0xFF0000);
                setTimeout(() => {
                    scene.background = new THREE.Color(0x87CEEB); // Обратно к небу
                }, 200);
            }, 500);
        }
    }, 3000);
}

// Функция проверки коллизий внутри дома
function checkCollisionInHouse(newX, newZ) {
    if (!isInsideHouse || !houseInterior) return false;

    // Проверка границ дома (простые границы стен)
    // Стены находятся на позициях: -2.5, 2.5 по X и -2.25, 2.25 по Z
    const wallThickness = 0.15; // Половина толщины стены
    const playerRadius = 0.25;

    // Проверяем столкновение со стенами
    if (newX < -2.5 + wallThickness + playerRadius) return true; // Левая стена
    if (newX > 2.5 - wallThickness - playerRadius) return true;  // Правая стена
    if (newZ < -2.25 + wallThickness + playerRadius) return true; // Задняя стена
    if (newZ > 2.25 - wallThickness - playerRadius) return true;  // Передняя стена (кроме двери)

    // Проверка дверного проема - если игрок в зоне двери (X от -0.55 до 0.55, Z > 2.0), пропускаем
    const inDoorway = (Math.abs(newX) < 0.55 && newZ > 2.0);
    if (inDoorway) {
        // В дверном проеме нет коллизий с передней стеной
        return false;
    }

    // Проверяем коллизии с мебелью
    let hasCollision = false;

    houseInterior.children.forEach(child => {
        // Проверяем только мебель (не стены)
        if (!child.userData.isFurniture) return;

        // Получаем bounding box объекта
        const box = new THREE.Box3().setFromObject(child);

        // Пропускаем объекты которые слишком высоко или низко
        if (box.min.y > 1.5 || box.max.y < 0.2) return;

        // Размеры объекта
        const sizeX = box.max.x - box.min.x;
        const sizeZ = box.max.z - box.min.z;

        // Центр объекта
        const centerX = (box.min.x + box.max.x) / 2;
        const centerZ = (box.min.z + box.max.z) / 2;

        // Проверяем пересечение
        const distX = Math.abs(newX - centerX);
        const distZ = Math.abs(newZ - centerZ);

        if (distX < sizeX / 2 + playerRadius && distZ < sizeZ / 2 + playerRadius) {
            hasCollision = true;
        }
    });

    return hasCollision;
}

function enterHouseInterior() {
    if (isInsideHouse) return;

    isInsideHouse = true;
    waveActive = false; // Останавливаем волны зомби

    // Сохраняем позицию игрока на улице
    savedOutdoorPosition = {
        x: player.position.x,
        y: player.position.y,
        z: player.position.z
    };

    // Скрываем внешние объекты
    ground.visible = false;
    decorations.forEach(dec => dec.visible = false);
    obstacles.forEach(obs => obs.visible = false);
    bullets.forEach(bullet => bullet.visible = false);
    turrets.forEach(turret => turret.visible = false);
    if (playerHouse) playerHouse.visible = false;

    // Создаем интерьер если его еще нет
    if (!houseInterior) {
        houseInterior = createHouseInterior();
        scene.add(houseInterior);
    }
    houseInterior.visible = true;

    // Показываем кровать внутри (относительно внутреннего пространства)
    if (playerBed && hasBed) {
        playerBed.visible = true;
        playerBed.position.set(1.5, 0.3, 1); // Позиция в правом углу интерьера
        playerBed.rotation.y = 0;
        playerBed.userData.isFurniture = true; // Добавляем метку для коллизий
        // Добавляем кровать в интерьер если её там нет
        if (playerBed.parent !== houseInterior) {
            scene.remove(playerBed);
            houseInterior.add(playerBed);
        }
    }

    // Перемещаем игрока внутрь дома (ближе к двери)
    player.position.set(0, 0.5, 1.8);
    player.rotation.y = -Math.PI; // Смотрит внутрь дома
    console.log('🏠 Игрок вошел в дом на позиции:', player.position);

    // Меняем фон на более темный
    scene.background = new THREE.Color(0x4a3f35);
    scene.fog = new THREE.Fog(0x4a3f35, 5, 15);

    // Восстанавливаем HP и патроны
    lives = Math.min(lives + 1, 5);
    ammo = maxAmmo;
    updateScoreDisplay();
    updateAmmoDisplay();

    showNotification('🏠 Вы вошли в дом! Нажмите E чтобы выйти | Cmd для сохранения в кровати', 'success');
}

// Функция сохранения игры (отключена - игра всегда начинается с нуля)
function saveGame() {
    // Сохранение отключено - игра не сохраняет прогресс между сессиями
    // При перезагрузке страницы все начнется заново

    console.log('💾 Сохранение отключено - игра начнется заново при перезагрузке');
    showNotification('💾 Сохранение отключено в этой версии', 'info');
}

// Проверка близости к кровати
function checkBedProximity() {
    if (!isInsideHouse || !playerBed || !hasBed) return false;

    // Получаем мировую позицию кровати
    const bedPos = new THREE.Vector3();
    playerBed.getWorldPosition(bedPos);

    // Проверяем расстояние до кровати
    const distance = player.position.distanceTo(bedPos);

    return distance < 1.5; // Близко к кровати
}

function exitHouseInterior() {
    if (!isInsideHouse) return;

    isInsideHouse = false;

    // Скрываем интерьер
    if (houseInterior) {
        houseInterior.visible = false;
    }

    // Показываем внешние объекты
    ground.visible = true;
    decorations.forEach(dec => dec.visible = true);
    obstacles.forEach(obs => obs.visible = true);
    bullets.forEach(bullet => bullet.visible = true);
    turrets.forEach(turret => turret.visible = true);
    if (playerHouse) playerHouse.visible = true;

    // Возвращаем кровать на внешнюю позицию (снаружи дома не видна)
    if (playerBed && hasBed) {
        // Убираем из интерьера и возвращаем в основную сцену
        if (playerBed.parent === houseInterior) {
            houseInterior.remove(playerBed);
            scene.add(playerBed);
        }
        playerBed.visible = false; // Кровать не видна снаружи
        playerBed.position.set(
            playerHouse.position.x - 1.2,
            playerHouse.position.y + 0.3,
            playerHouse.position.z - 0.5
        );
        playerBed.rotation.y = Math.PI / 2;
    }

    // Возвращаем игрока на улицу (рядом с дверью)
    if (savedOutdoorPosition) {
        player.position.set(
            savedOutdoorPosition.x,
            savedOutdoorPosition.y,
            savedOutdoorPosition.z
        );
    } else if (playerHouse) {
        player.position.set(
            playerHouse.position.x,
            0.5,
            playerHouse.position.z + 3
        );
    }
    player.rotation.y = -Math.PI / 2; // Смотрит вперед

    // Возвращаем небо
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 10, 60);

    // Возобновляем волны зомби
    waveActive = true;

    showNotification('🏠 Вы вышли из дома!', 'info');
}

function eatInHouse() {
    const foodCost = 50;

    if (coins >= foodCost) {
        coins -= foodCost;
        updateCoinsDisplay();
        // localStorage.setItem('cubeGameCoins', coins); // Сохранение отключено

        // Добавляем жизнь (максимум 10)
        lives = Math.min(lives + 1, 10);
        updateScoreDisplay();

        showNotification('🍖 Вы поели! +1 HP. Осталось монет: ' + coins, 'success');
    } else {
        showNotification('❌ Недостаточно монет для еды! Нужно: 50, есть: ' + coins, 'error');
    }
}

function checkHouseProximity() {
    if (!playerHouse || !player) return;

    // Если игрок внутри дома
    if (isInsideHouse) {
        // Показываем подсказку выхода
        let prompt = document.getElementById('housePrompt');
        if (!prompt) {
            prompt = document.createElement('div');
            prompt.id = 'housePrompt';
            prompt.style.cssText = `
                position: fixed;
                bottom: 150px;
                left: 50%;
                transform: translateX(-50%);
                padding: 20px 40px;
                border-radius: 15px;
                font-size: 20px;
                font-weight: bold;
                z-index: 500;
                text-align: center;
                background: linear-gradient(135deg, #FF6347 0%, #FF4500 100%);
                color: white;
                border: 3px solid gold;
            `;
            document.body.appendChild(prompt);
        }
        prompt.innerHTML = '🚪 E - Выйти из дома | F - Поесть (50💰, +1❤️)';

        // Проверяем нажатие E (выход)
        if (keys['KeyE']) {
            exitHouseInterior();
            keys['KeyE'] = false;
            const p = document.getElementById('housePrompt');
            if (p) document.body.removeChild(p);
        }

        // Проверяем нажатие F (еда)
        if (keys['KeyF']) {
            eatInHouse();
            keys['KeyF'] = false;
        }
        return;
    }

    // Если игрок на улице - проверяем расстояние до дома
    const distance = player.position.distanceTo(playerHouse.position);

    // Если игрок близко к дому (в радиусе 3 единиц)
    if (distance < 3) {
        if (!playerHouse.userData.showingPrompt) {
            playerHouse.userData.showingPrompt = true;

            // Показываем подсказку
            const prompt = document.createElement('div');
            prompt.id = 'housePrompt';
            prompt.style.cssText = `
                position: fixed;
                bottom: 150px;
                left: 50%;
                transform: translateX(-50%);
                padding: 20px 40px;
                border-radius: 15px;
                font-size: 20px;
                font-weight: bold;
                z-index: 500;
                text-align: center;
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: white;
                border: 3px solid gold;
            `;
            prompt.innerHTML = '🏠 E - Войти в дом';
            document.body.appendChild(prompt);
        }

        // Проверяем нажатие E (вход в дом)
        if (keys['KeyE']) {
            enterHouseInterior();
            keys['KeyE'] = false; // Сбрасываем чтобы не вызывалось много раз
        }

        // Проверяем нажатие F (еда)
        if (keys['KeyF']) {
            eatInHouse();
            keys['KeyF'] = false; // Сбрасываем чтобы не вызывалось много раз
        }
    } else {
        // Убираем подсказку если игрок ушёл
        if (playerHouse.userData.showingPrompt) {
            const prompt = document.getElementById('housePrompt');
            if (prompt) document.body.removeChild(prompt);
            playerHouse.userData.showingPrompt = false;
        }
    }
}

function chopTree(tree) {
    if (tree.userData.canChop) {
        // Удаляем дерево из сцены
        scene.remove(tree);

        // Удаляем из массива декораций
        const index = decorations.indexOf(tree);
        if (index > -1) {
            decorations.splice(index, 1);
        }

        // Добавляем древесину
        wood += 1;
        updateWoodDisplay();

        // Визуальный эффект
        createWoodParticles(tree.position);

        // Звуковой эффект через визуальное уведомление
        showQuickNotification('+1 🪵', tree.position);
    }
}

function createWoodParticles(position) {
    // Создаем частицы дерева для эффекта рубки
    for (let i = 0; i < 10; i++) {
        const particleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const particleMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);

        particle.position.copy(position);
        particle.position.y += 1;

        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            Math.random() * 0.3,
            (Math.random() - 0.5) * 0.2
        );

        particle.userData.velocity = velocity;
        particle.userData.lifetime = 60; // Кадры жизни частицы

        scene.add(particle);
        bullets.push(particle); // Используем массив bullets для временного хранения
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 30px 50px;
        border-radius: 15px;
        font-size: 28px;
        font-weight: bold;
        z-index: 500;
        text-align: center;
        border: 3px solid white;
        color: white;
    `;

    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 2000);
}

function showQuickNotification(text, position) {
    // Быстрое уведомление над срубленным деревом (через DOM, так как это проще)
    // В реальной игре это были бы 3D спрайты
}

function loseLife() {
    lives--;
    updateScoreDisplay();
    
    scene.background = new THREE.Color(0xFF0000);
    setTimeout(() => {
        scene.background = new THREE.Color(0x87ceeb);
    }, 200);
    
    if (lives <= 0) {
        gameOver();
    }
}

function startNewWave() {
    // Инициализация level если не определена (фикс для старого кеша)
    if (typeof level === 'undefined') {
        window.level = Math.floor(wave / 1);
    }

    wave++;

    // Увеличиваем количество зомби с каждой волной (меньше зомби для комфортной игры)
    zombiesPerWave = 3 + (wave - 1) * 2; // 3, 5, 7, 9, 11, 13...

    // ВАЖНО: Для волны 20 (финальный босс) НЕ спавним обычных зомби
    if (wave === 20) {
        zombiesInCurrentWave = 0; // Только босс, без обычных зомби
    } else {
        zombiesInCurrentWave = zombiesPerWave;
    }

    // Увеличиваем скорость зомби с каждой волной (более агрессивная прогрессия)
    obstacleSpeed = 0.02 + (wave - 1) * 0.008;

    // Обычные зомби получают HP на высоких волнах
    window.zombieBaseHP = Math.floor(wave / 10) + 1; // 1 HP на волнах 1-9, 2 HP на 10-19, и т.д.

    waveActive = true;
    updateScoreDisplay();

    // Визуальный эффект начала волны
    scene.background = new THREE.Color(Math.random() * 0x666666 + 0x6699bb);
    setTimeout(() => {
        scene.background = new THREE.Color(0x87ceeb);
    }, 300);

    // Награды каждые 5 волн
    if (wave % 5 === 0) {
        ammo = maxAmmo;
        updateAmmoDisplay();
        coins += 200;
        updateCoinsDisplay();
    }

    // Магазин каждые 40 волн
    if (wave % 40 === 0 && wave !== 30) {
        coins += 500;
        updateCoinsDisplay();
        gameActive = false;
        setTimeout(() => {
            openShop(true);
        }, 500);
    }

    // Разблокировка лазера на 10 волне
    if (wave === 10 && !unlockedWeapons.includes('laser')) {
        unlockedWeapons.push('laser');
        localStorage.setItem('cubeGameUnlockedWeapons', JSON.stringify(unlockedWeapons));

        gameActive = false;
        const notification = document.createElement('div');
        notification.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 60px; border-radius: 20px; font-size: 32px; font-weight: bold; z-index: 500; text-align: center; border: 5px solid gold; box-shadow: 0 0 50px rgba(102, 126, 234, 0.8);';
        notification.innerHTML = '🎉 ПОЗДРАВЛЯЕМ! 🎉<br><br>🔫⚡ РАЗБЛОКИРОВАНА ЛАЗЕРНАЯ ПУШКА! ⚡🔫<br><br>Нажмите 3 для выбора<br><br><span style="font-size: 20px; color: #FFD700;">Бесконечные патроны • Быстрая стрельба</span>';
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
            gameActive = true;
        }, 5000);
    }

    // Катсцена победы на 180 уровне
    if (level === 180) {
            gameActive = false;

            // Очищаем всех зомби с экрана
            obstacles.forEach(obstacle => scene.remove(obstacle));
            obstacles = [];

            // Создаем катсцену победы
            const victoryScreen = document.createElement('div');
            victoryScreen.id = 'victoryScreen';
            victoryScreen.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); z-index: 1000; display: flex; flex-direction: column; align-items: center; justify-content: center; animation: fadeIn 1s ease-in;';

            victoryScreen.innerHTML = `
                <style>
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-30px); }
                    }
                    @keyframes sparkle {
                        0%, 100% { opacity: 0; transform: scale(0); }
                        50% { opacity: 1; transform: scale(1); }
                    }
                    .victory-title {
                        font-size: 72px;
                        font-weight: bold;
                        color: gold;
                        text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.6);
                        margin-bottom: 30px;
                        animation: bounce 2s ease-in-out infinite;
                    }
                    .victory-content {
                        background: rgba(0, 0, 0, 0.7);
                        padding: 50px;
                        border-radius: 30px;
                        border: 5px solid gold;
                        box-shadow: 0 0 50px rgba(255, 215, 0, 0.5);
                        text-align: center;
                        max-width: 800px;
                    }
                    .victory-text {
                        font-size: 28px;
                        color: white;
                        margin: 20px 0;
                        line-height: 1.6;
                    }
                    .victory-stats {
                        font-size: 32px;
                        color: #FFD700;
                        font-weight: bold;
                        margin: 30px 0;
                    }
                    .victory-button {
                        padding: 20px 50px;
                        font-size: 28px;
                        font-weight: bold;
                        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                        border: none;
                        border-radius: 15px;
                        color: white;
                        cursor: pointer;
                        margin: 10px;
                        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                        transition: transform 0.2s;
                    }
                    .victory-button:hover {
                        transform: scale(1.05);
                    }
                    .sparkle {
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        background: gold;
                        border-radius: 50%;
                        animation: sparkle 1.5s ease-in-out infinite;
                    }
                </style>
                <div class="victory-title">🎉 ПОБЕДА! 🎉</div>
                <div class="victory-content">
                    <div class="victory-text">
                        🏆 ПОЗДРАВЛЯЕМ! 🏆<br><br>
                        ВЫ ДОСТИГЛИ 180 УРОВНЯ И СПАСЛИ МИР!<br><br>
                        🧟 Все зомби повержены! Вы настоящий герой! 🌍<br><br>
                        💪 Невероятное достижение! 💪
                    </div>
                    <div class="victory-stats">
                        📊 Ваш счёт: ${score}<br>
                        🏅 Уровень: ${level}<br>
                        💰 Награда: +10000 монет!
                    </div>
                    <div>
                        <button class="victory-button" onclick="continueAfterVictory()">Продолжить приключение</button>
                        <button class="victory-button" onclick="returnToMenuAfterVictory()">Вернуться в меню</button>
                    </div>
                </div>
            `;

            // Добавляем сверкающие звезды
            for (let i = 0; i < 50; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.left = Math.random() * 100 + '%';
                sparkle.style.top = Math.random() * 100 + '%';
                sparkle.style.animationDelay = Math.random() * 1.5 + 's';
                victoryScreen.appendChild(sparkle);
            }

            document.body.appendChild(victoryScreen);

            // Даем награду
            coins += 10000;
            updateCoinsDisplay();
            // localStorage.setItem('cubeGameCoins', coins); // Сохранение отключено

            // Глобальные функции для кнопок
            window.continueAfterVictory = function() {
                const victoryScreen = document.getElementById('victoryScreen');
                if (victoryScreen) {
                    document.body.removeChild(victoryScreen);
                }
                gameActive = true;
            };

            window.returnToMenuAfterVictory = function() {
                const victoryScreen = document.getElementById('victoryScreen');
                if (victoryScreen) {
                    document.body.removeChild(victoryScreen);
                }
                returnToSkinMenu();
            };
    }

    if (wave > maxWaveReached) {
        maxWaveReached = wave;
        // localStorage.setItem('cubeGameMaxWave', maxWaveReached); // Сохранение отключено
    }

    // Спавним всех зомби волны
    spawnWaveZombies();
}

function spawnWaveZombies() {
    // ФИНАЛЬНЫЙ БОСС на 20 волне
    if (wave === 20) {
        console.log('🎮 Запуск 20 волны - ФИНАЛЬНЫЙ БОСС!');

        // Драматичное уведомление
        const notification = document.createElement('div');
        notification.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #000000 0%, #8B0000 50%, #FF0000 100%); color: white; padding: 50px 80px; border-radius: 25px; font-size: 56px; font-weight: bold; z-index: 1000; text-align: center; border: 8px solid gold; box-shadow: 0 0 100px rgba(255, 0, 0, 1); animation: pulse 0.8s infinite;';
        notification.innerHTML = '⚠️ ФИНАЛЬНЫЙ БОСС ⚠️<br><br><span style="font-size: 32px; color: #FFD700;">Повелитель Зомби</span><br><br><span style="font-size: 24px; color: #FF6347;">Это последняя битва!</span>';
        document.body.appendChild(notification);

        // Спавним финального босса через 1 секунду
        setTimeout(() => {
            if (gameActive && waveActive) {
                console.log('🧟 Создание финального босса...');
                window.finalBoss = createFinalBoss();
                console.log('✅ Финальный босс создан:', window.finalBoss);

                // Показываем HP бар игрока для боя с боссом
                document.getElementById('playerHPContainer').style.display = 'block';
                playerHP = maxPlayerHP;
                updatePlayerHPDisplay();

                // Интенсивная тряска экрана
                let shakeIntensity = 40;
                let shakeCount = 0;
                const shakeInterval = setInterval(() => {
                    if (camera) {
                        camera.position.x += (Math.random() - 0.5) * shakeIntensity * 0.015;
                        camera.position.y += (Math.random() - 0.5) * shakeIntensity * 0.015;
                    }
                    shakeCount++;
                    if (shakeCount > 40) {
                        clearInterval(shakeInterval);
                    }
                }, 40);

                // Темнота и красная вспышка
                scene.background = new THREE.Color(0x000000);
                setTimeout(() => {
                    scene.background = new THREE.Color(0xFF0000);
                    setTimeout(() => {
                        scene.background = new THREE.Color(0x87ceeb);
                    }, 200);
                }, 300);

                // Убираем уведомление через 5 секунд
                setTimeout(() => {
                    if (notification && document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 5000);
            } else {
                console.log('❌ Не удалось создать босса - gameActive:', gameActive, 'waveActive:', waveActive);
            }
        }, 1000);
        return;
    }

    // Проверяем, нужен ли босс на этой волне (каждые 5 волн начиная с 5-й)
    const isBossWave = wave >= 5 && wave % 5 === 0;

    if (isBossWave) {
        // На волне с боссом спавним босса в конце
        for (let i = 0; i < zombiesPerWave - 1; i++) {
            setTimeout(() => {
                if (gameActive && waveActive) {
                    createObstacle();
                }
            }, i * 300);
        }

        // Спавним босса последним с задержкой
        setTimeout(() => {
            if (gameActive && waveActive) {
                createBoss();

                // Уведомление о появлении босса
                const notification = document.createElement('div');
                notification.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #8b0000 0%, #ff0000 100%); color: white; padding: 30px 50px; border-radius: 15px; font-size: 36px; font-weight: bold; z-index: 500; text-align: center; border: 5px solid gold; box-shadow: 0 0 50px rgba(255, 0, 0, 0.8); animation: pulse 0.5s infinite;';
                notification.innerHTML = '👑 БОСС ПОЯВИЛСЯ! 👑<br><br><span style="font-size: 24px;">Будь осторожен!</span>';
                document.body.appendChild(notification);

                // Эффект тряски экрана
                let shakeIntensity = 20;
                let shakeCount = 0;
                const shakeInterval = setInterval(() => {
                    if (camera) {
                        camera.position.x += (Math.random() - 0.5) * shakeIntensity * 0.01;
                        camera.position.y += (Math.random() - 0.5) * shakeIntensity * 0.01;
                    }
                    shakeCount++;
                    if (shakeCount > 20) {
                        clearInterval(shakeInterval);
                    }
                }, 50);

                // Красная вспышка
                scene.background = new THREE.Color(0xff0000);
                setTimeout(() => {
                    scene.background = new THREE.Color(0x87ceeb);
                }, 200);

                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 3000);
            }
        }, (zombiesPerWave - 1) * 300 + 600);
    } else {
        // Обычная волна - только обычные зомби
        for (let i = 0; i < zombiesPerWave; i++) {
            setTimeout(() => {
                if (gameActive && waveActive) {
                    createObstacle();
                }
            }, i * 300);
        }
    }
}

function checkWaveComplete() {
    if (waveActive && zombiesInCurrentWave <= 0 && obstacles.length === 0) {
        waveActive = false;

        // На 20 волне победа наступает только после укуса финального босса
        // (функция bossBitePlayer() сама запустит victoryScene())
        if (wave >= 20) {
            console.log('⚠️ 20 волна завершена, но катсцена будет после укуса босса');
            return;
        }

        // Показываем уведомление о завершении волны
        const waveCompleteNotification = document.createElement('div');
        waveCompleteNotification.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px 50px; border-radius: 15px; font-size: 36px; font-weight: bold; z-index: 500; text-align: center; border: 3px solid white;';
        waveCompleteNotification.innerHTML = `🎉 Волна ${wave} завершена! 🎉<br><br><span style="font-size: 24px;">Следующая волна через 1.5 секунды...</span>`;
        document.body.appendChild(waveCompleteNotification);

        setTimeout(() => {
            document.body.removeChild(waveCompleteNotification);
            startNewWave();
        }, 1500);
    }
}

// Функция воспроизведения победной музыки "Only You" через YouTube
function playVictoryMusic() {
    try {
        console.log('🎵 Загрузка "Only You" с YouTube...');

        // Создаем контейнер для YouTube плеера (скрытый)
        const playerContainer = document.createElement('div');
        playerContainer.id = 'youtube-audio-player';
        playerContainer.style.cssText = 'position: fixed; top: -200px; left: -200px; width: 1px; height: 1px; opacity: 0; pointer-events: none;';
        document.body.appendChild(playerContainer);

        // YouTube Video ID для "Only You" by The Platters
        // Это официальное видео из Far Cry 5
        const videoId = 'Rb-VRmdEVFA'; // The Platters - Only You (And You Alone)

        // Загружаем YouTube IFrame API если еще не загружен
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            // Ждем загрузки API
            window.onYouTubeIframeAPIReady = function() {
                createYouTubePlayer(videoId, playerContainer);
            };
        } else {
            // API уже загружен
            createYouTubePlayer(videoId, playerContainer);
        }

        // Показываем уведомление о музыке
        const musicNotification = document.createElement('div');
        musicNotification.id = 'music-notification';
        musicNotification.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(50, 50, 50, 0.9) 100%); color: white; padding: 20px 30px; border-radius: 15px; font-size: 18px; z-index: 1001; border: 3px solid gold; box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); font-weight: bold;';
        musicNotification.innerHTML = '🎵 The Platters - Only You<br><span style="font-size: 14px; opacity: 0.8;">From Far Cry 5</span>';
        document.body.appendChild(musicNotification);

        setTimeout(() => {
            if (document.body.contains(musicNotification)) {
                musicNotification.style.transition = 'opacity 1s';
                musicNotification.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(musicNotification)) {
                        document.body.removeChild(musicNotification);
                    }
                }, 1000);
            }
        }, 8000);

    } catch (e) {
        console.error('Ошибка воспроизведения музыки:', e);
        console.log('💡 Проверьте подключение к интернету для воспроизведения музыки с YouTube');
    }
}

// Создание YouTube плеера
function createYouTubePlayer(videoId, container) {
    try {
        window.victoryPlayer = new YT.Player(container, {
            height: '1',
            width: '1',
            videoId: videoId,
            playerVars: {
                autoplay: 1,        // Автозапуск
                controls: 0,        // Без контролов
                disablekb: 1,       // Без клавиатуры
                fs: 0,              // Без полного экрана
                modestbranding: 1,  // Без логотипа YouTube
                playsinline: 1,     // Воспроизведение inline
                rel: 0,             // Без похожих видео
                showinfo: 0,        // Без информации
                iv_load_policy: 3,  // Без аннотаций
                start: 0            // Начало с 0 секунды
            },
            events: {
                'onReady': function(event) {
                    event.target.setVolume(40); // Громкость 40%
                    event.target.playVideo();
                    console.log('🎵 "Only You" воспроизводится!');
                },
                'onStateChange': function(event) {
                    if (event.data === YT.PlayerState.ENDED) {
                        console.log('🎵 Музыка закончилась');
                    }
                },
                'onError': function(event) {
                    console.error('Ошибка YouTube плеера:', event.data);
                    // Показываем уведомление об ошибке
                    const errorNotification = document.createElement('div');
                    errorNotification.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: rgba(255, 50, 50, 0.9); color: white; padding: 15px 25px; border-radius: 10px; font-size: 16px; z-index: 1002; border: 2px solid white;';
                    errorNotification.innerHTML = '⚠️ Не удалось загрузить музыку<br><span style="font-size: 14px;">Проверьте подключение к интернету</span>';
                    document.body.appendChild(errorNotification);
                    setTimeout(() => {
                        if (document.body.contains(errorNotification)) {
                            document.body.removeChild(errorNotification);
                        }
                    }, 5000);
                }
            }
        });
    } catch (e) {
        console.error('Ошибка создания YouTube плеера:', e);
    }
}

// Катсцена победы на 20-й волне
function victoryScene() {
    gameActive = false;
    waveActive = false;

    console.log('🎉 ПОБЕДА! Запуск катсцены...');

    // Запускаем победную музыку
    playVictoryMusic();

    // Переключаем камеру в режим третьего лица чтобы видеть персонажа
    const wasFirstPerson = cameraMode === 'firstPerson';
    if (wasFirstPerson) {
        cameraMode = 'thirdPerson';
        player.visible = true;

        // Убираем оружие из FPS рук и добавляем к персонажу
        if (currentWeapon && fpsHands) {
            fpsHands.remove(currentWeapon);
            if (fpsScene) fpsScene.remove(fpsHands);
            fpsHands = null;
            currentWeapon.position.set(0.15, 0.2, -0.4);
            currentWeapon.rotation.y = 0;
            currentWeapon.rotation.x = 0;
            currentWeapon.rotation.z = -Math.PI / 6;
            currentWeapon.scale.set(1, 1, 1);
            player.add(currentWeapon);
        }
    }

    // Камера отдаляется для лучшего обзора
    camera.position.set(player.position.x + 5, player.position.y + 3, player.position.z + 8);
    camera.lookAt(player.position);

    // Через 1 секунду персонаж поднимает оружие к голове
    setTimeout(() => {
        if (currentWeapon) {
            currentWeapon.position.set(-0.2, 0.6, 0.1); // К голове
            currentWeapon.rotation.set(0, Math.PI / 2, Math.PI / 2); // Развернуто к голове
        }

        // Ещё через секунду - выстрел
        setTimeout(() => {
            // Эффект выстрела - белая вспышка
            scene.background = new THREE.Color(0xFFFFFF);
            setTimeout(() => {
                scene.background = new THREE.Color(0x87ceeb);
            }, 100);

            // Создаём эффект дыма от выстрела
            for (let i = 0; i < 10; i++) {
                const smoke = new THREE.Mesh(
                    new THREE.SphereGeometry(0.1, 8, 8),
                    new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.5 })
                );
                smoke.position.set(player.position.x - 0.2, player.position.y + 0.6, player.position.z);
                scene.add(smoke);

                setTimeout(() => {
                    scene.remove(smoke);
                }, 1000);
            }

            // Персонаж начинает падать
            let fallSpeed = 0;
            const fallInterval = setInterval(() => {
                fallSpeed += 0.02;
                player.position.y -= fallSpeed;
                player.rotation.x += 0.05; // Падает вперёд
                player.rotation.z += 0.02; // Немного вбок

                if (player.position.y <= 0.2) {
                    player.position.y = 0.2;
                    clearInterval(fallInterval);

                    // Персонаж лежит на земле
                    player.rotation.x = Math.PI / 2;
                    player.rotation.z = Math.PI / 4;
                }
            }, 16);

            // Сразу после выстрела начинается салют!
            setTimeout(() => {
                startVictoryFireworks();
            }, 500);

            // Показываем экран победы с чёрным юмором
            setTimeout(() => {
                const victoryScreen = document.createElement('div');
                victoryScreen.id = 'victoryScreen';
                victoryScreen.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.85); padding: 50px; border-radius: 20px; z-index: 1000; text-align: center; color: white; border: 5px solid gold; box-shadow: 0 0 40px rgba(255, 215, 0, 0.5);';

                victoryScreen.innerHTML = `
                    <h1 style="font-size: 64px; margin: 20px; text-shadow: 0 0 20px #8B0000; color: #FFD700;">You Win... But at What Cost?</h1>
                    <p style="font-size: 32px; margin: 10px; color: #FF6347;">Финальный счёт: ${score}</p>
                    <hr style="border: 2px solid #8B0000; margin: 30px 0;">
                    <p style="font-size: 26px; margin: 15px; color: #FF6347; font-style: italic;">Угроза Повелителя Зомби уничтожена...</p>
                    <p style="font-size: 24px; margin: 15px; color: #FFA07A;">Но цена победы оказалась невыносимой 🩸</p>
                    <p style="font-size: 22px; margin: 15px; opacity: 0.9;">Укус в последний момент... Проклятье зомби...</p>
                    <p style="font-size: 20px; margin: 15px; opacity: 0.85; color: #DC143C;">Превращение неизбежно...</p>
                    <hr style="border: 2px solid #444; margin: 30px 0;">
                    <p style="font-size: 24px; margin: 20px; opacity: 0.9; font-style: italic; color: #FFD700;">В последнем акте человечности...</p>
                    <p style="font-size: 22px; margin: 15px; opacity: 0.8; color: #FFF;">Герой сделал выбор</p>
                    <p style="font-size: 28px; margin: 20px; opacity: 0.95; font-weight: bold; text-shadow: 2px 2px 8px #000;">💀</p>
                    <p style="font-size: 18px; margin: 15px; opacity: 0.7; font-style: italic; color: #AAA;">"Лучше умереть свободным, чем жить монстром"</p>
                    <hr style="border: 2px solid #8B0000; margin: 30px 0;">
                    <p style="font-size: 20px; margin: 10px; opacity: 0.8;">🎆 Салют в память о павшем герое 🎆</p>
                `;
                document.body.appendChild(victoryScreen);

                // Показываем кнопки через 8 секунд (после салюта)
                setTimeout(() => {
                    victoryScreen.innerHTML += `
                        <button onclick="showCredits(); document.getElementById('victoryScreen').remove();"
                                style="margin: 20px; padding: 20px 40px; font-size: 24px; background: linear-gradient(135deg, #8B0000, #DC143C); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; transition: transform 0.2s; border: 2px solid gold;"
                                onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                            🎬 Титры
                        </button>
                        <br>
                        <button onclick="restartGame(); document.getElementById('victoryScreen').remove();"
                                style="margin: 20px; padding: 20px 40px; font-size: 24px; background: #4CAF50; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; transition: transform 0.2s;"
                                onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                            🔄 Воскресить и играть снова
                        </button>
                        <button onclick="returnToSkinMenu(); document.getElementById('victoryScreen').remove();"
                                style="margin: 20px; padding: 20px 40px; font-size: 24px; background: #f44336; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; transition: transform 0.2s;"
                                onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                            🏠 В главное меню
                        </button>
                    `;
                }, 8000);
            }, 1000);

        }, 1000);
    }, 1000);
}

// Показ титров в конце игры
function showCredits() {
    // Останавливаем салют
    gameActive = false;

    // Создаём контейнер для титров
    const creditsContainer = document.createElement('div');
    creditsContainer.id = 'creditsContainer';
    creditsContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, #000000 0%, #1a0000 50%, #000000 100%);
        z-index: 2000;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: flex-end;
    `;

    // Создаём прокручивающийся текст титров
    const creditsText = document.createElement('div');
    creditsText.style.cssText = `
        position: absolute;
        bottom: -100%;
        width: 80%;
        text-align: center;
        color: white;
        font-family: Arial, sans-serif;
        animation: scrollCredits 60s linear forwards;
        text-shadow: 2px 2px 8px rgba(0,0,0,0.8);
    `;

    creditsText.innerHTML = `
        <div style="height: 100vh;"></div>

        <h1 style="font-size: 72px; margin: 60px 0; color: #FFD700; text-shadow: 0 0 30px #8B0000;">
            PERSY HOUSE
        </h1>

        <p style="font-size: 32px; margin: 40px 0; font-style: italic; color: #DC143C;">
            "Некоторые победы приходят слишком дорого..."
        </p>

        <div style="height: 80px;"></div>

        <h2 style="font-size: 48px; margin: 50px 0; color: #FFD700;">ГЛАВНЫЕ РОЛИ</h2>

        <p style="font-size: 32px; margin: 30px 0; line-height: 1.8;">
            <span style="color: #FFA500;">Dani Rojas</span><br>
            <span style="font-size: 24px; color: #AAA;">Герой</span>
        </p>

        <p style="font-size: 32px; margin: 30px 0; line-height: 1.8;">
            <span style="color: #8B0000;">Повелитель Зомби</span><br>
            <span style="font-size: 24px; color: #AAA;">Финальный Босс</span>
        </p>

        <p style="font-size: 32px; margin: 30px 0; line-height: 1.8;">
            <span style="color: #4169E1;">${petNames['dog'] || 'Верный друг'}</span><br>
            <span style="font-size: 24px; color: #AAA;">Собака-компаньон</span>
        </p>

        <div style="height: 120px;"></div>

        <h2 style="font-size: 48px; margin: 50px 0; color: #FFD700;">РАЗРАБОТКА</h2>

        <p style="font-size: 28px; margin: 25px 0; line-height: 2;">
            <span style="color: #FFA500;">Game Design & Programming</span><br>
            <span style="color: #FFF;">Claude Code AI</span>
        </p>

        <p style="font-size: 28px; margin: 25px 0; line-height: 2;">
            <span style="color: #FFA500;">Creative Director</span><br>
            <span style="color: #FFF;">Nikolay Igotti</span>
        </p>

        <p style="font-size: 28px; margin: 25px 0; line-height: 2;">
            <span style="color: #FFA500;">3D Graphics Engine</span><br>
            <span style="color: #FFF;">Three.js r128</span>
        </p>

        <p style="font-size: 28px; margin: 25px 0; line-height: 2;">
            <span style="color: #FFA500;">Visual Effects</span><br>
            <span style="color: #FFF;">Procedural Generation</span>
        </p>

        <div style="height: 120px;"></div>

        <h2 style="font-size: 48px; margin: 50px 0; color: #FFD700;">ОСОБАЯ БЛАГОДАРНОСТЬ</h2>

        <p style="font-size: 28px; margin: 25px 0; color: #FFF;">
            Всем игрокам, которые дошли до конца
        </p>

        <p style="font-size: 28px; margin: 25px 0; color: #FFF;">
            Тем, кто спас мир ценой своей жизни
        </p>

        <p style="font-size: 28px; margin: 25px 0; color: #FFF;">
            И тем, кто понял, что настоящая победа<br>
            иногда означает самопожертвование
        </p>

        <div style="height: 150px;"></div>

        <h2 style="font-size: 64px; margin: 80px 0; color: #DC143C; text-shadow: 0 0 40px #FF0000;">
            REST IN PEACE
        </h2>

        <p style="font-size: 36px; margin: 40px 0; font-style: italic; color: #FFD700;">
            Dani Rojas<br>
            <span style="font-size: 24px; color: #AAA;">Hero • Friend • Human</span>
        </p>

        <p style="font-size: 28px; margin: 60px 0; color: #CCC; font-style: italic;">
            "Лучше умереть свободным,<br>чем жить монстром"
        </p>

        <div style="height: 120px;"></div>

        <p style="font-size: 32px; margin: 40px 0; color: #888;">
            Финальный счёт: ${score}
        </p>

        <p style="font-size: 28px; margin: 30px 0; color: #888;">
            Волна: ${wave}
        </p>

        <div style="height: 150px;"></div>

        <h1 style="font-size: 56px; margin: 80px 0; color: #FFD700;">
            THE END
        </h1>

        <p style="font-size: 24px; margin: 40px 0; color: #666;">
            © 2026 Persy House
        </p>

        <div style="height: 200px;"></div>

        <button onclick="document.getElementById('creditsContainer').remove(); restartGame();"
                style="margin: 40px; padding: 25px 50px; font-size: 28px; background: #4CAF50; color: white; border: none; border-radius: 15px; cursor: pointer; font-weight: bold; box-shadow: 0 0 20px rgba(76, 175, 80, 0.6);">
            🔄 Играть снова
        </button>

        <button onclick="document.getElementById('creditsContainer').remove(); returnToSkinMenu();"
                style="margin: 40px; padding: 25px 50px; font-size: 28px; background: #f44336; color: white; border: none; border-radius: 15px; cursor: pointer; font-weight: bold; box-shadow: 0 0 20px rgba(244, 67, 54, 0.6);">
            🏠 В меню
        </button>

        <div style="height: 100vh;"></div>
    `;

    creditsContainer.appendChild(creditsText);
    document.body.appendChild(creditsContainer);

    // Добавляем CSS анимацию для прокрутки
    const style = document.createElement('style');
    style.textContent = `
        @keyframes scrollCredits {
            from {
                bottom: -100%;
            }
            to {
                bottom: 100%;
            }
        }
    `;
    document.head.appendChild(style);
}

// Запуск салюта для катсцены
function startVictoryFireworks() {
    let shotCount = 0;
    const maxShots = 15; // Больше фейерверков!

    const shootInterval = setInterval(() => {
        if (shotCount >= maxShots) {
            clearInterval(shootInterval);
            return;
        }

        // Создаём фейерверк
        createFirework();
        shotCount++;
    }, 400); // Чаще запускаем
}

// Функция создания фейерверка
function createFirework() {
    const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF, 0xFFD700, 0xFF69B4];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Стартовая позиция - от персонажа вверх
    const startX = player.position.x + (Math.random() - 0.5) * 5;
    const startZ = player.position.z - 5 + (Math.random() - 0.5) * 5;

    // Ракета летит вверх
    const rocketGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const rocketMaterial = new THREE.MeshBasicMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 1
    });
    const rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
    rocket.position.set(startX, 0.5, startZ);
    scene.add(rocket);

    // Свет от ракеты
    const rocketLight = new THREE.PointLight(color, 2, 10);
    rocketLight.position.copy(rocket.position);
    scene.add(rocketLight);

    let rocketSpeed = 0.3;
    const targetHeight = 8 + Math.random() * 3;

    const rocketInterval = setInterval(() => {
        rocket.position.y += rocketSpeed;
        rocketLight.position.copy(rocket.position);

        // Когда ракета достигла высоты - взрыв
        if (rocket.position.y >= targetHeight) {
            clearInterval(rocketInterval);
            scene.remove(rocket);
            scene.remove(rocketLight);

            // Создаём частицы взрыва
            explodeFirework(rocket.position.clone(), color);
        }
    }, 16);
}

// Функция взрыва фейерверка
function explodeFirework(position, color) {
    const particleCount = 50;
    const particles = [];

    // Звук взрыва (визуальный эффект - вспышка)
    scene.background = new THREE.Color(color);
    setTimeout(() => {
        scene.background = new THREE.Color(0x87ceeb);
    }, 50);

    for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.1, 4, 4);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(position);
        scene.add(particle);

        // Случайное направление
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3
        );

        particle.userData = {
            velocity: velocity,
            life: 100
        };

        particles.push(particle);
    }

    // Свет от взрыва
    const explosionLight = new THREE.PointLight(color, 5, 20);
    explosionLight.position.copy(position);
    scene.add(explosionLight);

    setTimeout(() => {
        scene.remove(explosionLight);
    }, 200);

    // Анимация частиц
    const particleInterval = setInterval(() => {
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];

            // Двигаем частицу
            particle.position.add(particle.userData.velocity);

            // Гравитация
            particle.userData.velocity.y -= 0.01;

            // Уменьшаем время жизни
            particle.userData.life--;
            particle.material.opacity = particle.userData.life / 100;

            // Удаляем мёртвые частицы
            if (particle.userData.life <= 0) {
                scene.remove(particle);
                particles.splice(i, 1);
            }
        }

        // Если все частицы умерли - останавливаем интервал
        if (particles.length === 0) {
            clearInterval(particleInterval);
        }
    }, 16);
}

// Укус финального босса - запускает трагичную катсцену
function bossBitePlayer() {
    console.log('oH');

    // Останавливаем игру
    gameActive = false;
    waveActive = false;

    // Сохраняем ссылку на босса для финальной схватки
    const boss = window.finalBoss;

    // Убираем лейбл босса
    const bossLabel = document.getElementById('finalBossLabel');
    if (bossLabel) {
        document.body.removeChild(bossLabel);
    }

    // Экран становится черно-красным (эффект укуса)
    scene.background = new THREE.Color(0x000000);
    setTimeout(() => {
        scene.background = new THREE.Color(0x8B0000);
        setTimeout(() => {
            scene.background = new THREE.Color(0xFF0000);
            setTimeout(() => {
                scene.background = new THREE.Color(0x87ceeb);
            }, 200);
        }, 200);
    }, 200);

    // Тряска экрана (боль от укуса)
    let shakeCount = 0;
    const shakeInterval = setInterval(() => {
        if (camera) {
            camera.position.x += (Math.random() - 0.5) * 0.3;
            camera.position.y += (Math.random() - 0.5) * 0.3;
        }
        shakeCount++;
        if (shakeCount > 30) {
            clearInterval(shakeInterval);
        }
    }, 30);

    // Уведомление об укусе
    const biteNotification = document.createElement('div');
    biteNotification.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #000000 0%, #8B0000 100%); color: white; padding: 50px 70px; border-radius: 25px; font-size: 42px; font-weight: bold; z-index: 1001; text-align: center; border: 6px solid darkred; box-shadow: 0 0 60px rgba(139, 0, 0, 1);';
    biteNotification.innerHTML = '🩸 УКУШЕН! 🩸<br><br><span style="font-size: 28px; color: #FF6347;">Но битва ещё не окончена...</span>';
    document.body.appendChild(biteNotification);

    // Герой из последних сил добивает босса
    setTimeout(() => {
        document.body.removeChild(biteNotification);

        // Герой разворачивается и стреляет в голову босса
        if (boss && player && currentWeapon) {
            // Анимация поворота к боссу
            const dx = boss.position.x - player.position.x;
            const dz = boss.position.z - player.position.z;
            player.rotation.y = Math.atan2(dx, dz);

            // Текст "Прощальный выстрел..."
            const headshotText = document.createElement('div');
            headshotText.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 36px; font-weight: bold; z-index: 1001; text-align: center; text-shadow: 3px 3px 10px rgba(0,0,0,0.9); opacity: 0; transition: opacity 1s;';
            headshotText.innerHTML = '💀 Прощальный выстрел... 💀';
            document.body.appendChild(headshotText);
            setTimeout(() => {
                headshotText.style.opacity = '1';
            }, 100);

            // Через секунду - выстрел в голову
            setTimeout(() => {
                headshotText.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(headshotText)) {
                        document.body.removeChild(headshotText);
                    }
                }, 1000);

                // Вспышка выстрела в замедленном времени
                scene.background = new THREE.Color(0xFFFFFF);
                setTimeout(() => {
                    scene.background = new THREE.Color(0x87ceeb);
                }, 150);

                // Босс получает хэдшот - создаём эффект крови
                setTimeout(() => {
                    if (boss) {
                        // Позиция головы босса
                        const headY = boss.position.y + 4.5;
                        const headX = boss.position.x;
                        const headZ = boss.position.z;

                        // Создаём фонтан крови (50 частиц)
                        for (let i = 0; i < 50; i++) {
                            const bloodGeometry = new THREE.SphereGeometry(0.15, 8, 8);
                            const bloodMaterial = new THREE.MeshBasicMaterial({
                                color: 0x8B0000,
                                transparent: true,
                                opacity: 0.9
                            });
                            const bloodDrop = new THREE.Mesh(bloodGeometry, bloodMaterial);

                            // Стартовая позиция - голова босса
                            bloodDrop.position.set(headX, headY, headZ);

                            // Случайное направление (фонтан крови)
                            const velocity = new THREE.Vector3(
                                (Math.random() - 0.5) * 0.4,
                                Math.random() * 0.3 + 0.2, // Вверх и в стороны
                                (Math.random() - 0.5) * 0.4
                            );

                            bloodDrop.userData.velocity = velocity;
                            bloodDrop.userData.life = 100;

                            scene.add(bloodDrop);

                            // Анимация капель крови
                            const bloodInterval = setInterval(() => {
                                if (bloodDrop.userData.life <= 0) {
                                    scene.remove(bloodDrop);
                                    clearInterval(bloodInterval);
                                    return;
                                }

                                // Движение с гравитацией
                                bloodDrop.position.add(bloodDrop.userData.velocity);
                                bloodDrop.userData.velocity.y -= 0.02; // Гравитация

                                // Затухание
                                bloodDrop.userData.life -= 2;
                                bloodDrop.material.opacity = bloodDrop.userData.life / 100;
                            }, 16);
                        }

                        // Красная вспышка смерти босса
                        scene.background = new THREE.Color(0xFF0000);
                        setTimeout(() => {
                            scene.background = new THREE.Color(0x87ceeb);
                        }, 300);

                        // Текст "HEADSHOT"
                        const headshotNotif = document.createElement('div');
                        headshotNotif.style.cssText = 'position: fixed; top: 200px; left: 50%; transform: translateX(-50%); color: #FF0000; font-size: 64px; font-weight: bold; z-index: 1001; text-align: center; text-shadow: 0 0 30px rgba(255, 0, 0, 1); opacity: 0; transition: opacity 0.5s;';
                        headshotNotif.innerHTML = '💀 HEADSHOT 💀';
                        document.body.appendChild(headshotNotif);
                        setTimeout(() => {
                            headshotNotif.style.opacity = '1';
                        }, 100);

                        setTimeout(() => {
                            headshotNotif.style.opacity = '0';
                            setTimeout(() => {
                                if (document.body.contains(headshotNotif)) {
                                    document.body.removeChild(headshotNotif);
                                }
                            }, 500);
                        }, 2000);

                        // Босс падает драматично
                        let fallSpeed = 0;
                        const fallInterval = setInterval(() => {
                            fallSpeed += 0.015;
                            boss.position.y -= fallSpeed;
                            boss.rotation.x += 0.08;
                            boss.rotation.z += 0.03;

                            if (boss.position.y <= -2) {
                                clearInterval(fallInterval);
                                scene.remove(boss);
                                const index = obstacles.indexOf(boss);
                                if (index > -1) {
                                    obstacles.splice(index, 1);
                                }
                            }
                        }, 16);
                    }
                }, 200);
            }, 1500);

                // Уведомление о победе (через 2.5 секунды после выстрела)
                setTimeout(() => {
                    const victoryNotification = document.createElement('div');
                    victoryNotification.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: black; padding: 50px 80px; border-radius: 25px; font-size: 48px; font-weight: bold; z-index: 1001; text-align: center; border: 6px solid gold; box-shadow: 0 0 60px rgba(255, 215, 0, 1);';
                    victoryNotification.innerHTML = '⚔️ БОСС ПОВЕРЖЕН! ⚔️';
                    document.body.appendChild(victoryNotification);

                    setTimeout(() => {
                        document.body.removeChild(victoryNotification);

                        // Но цена победы велика...
                        const priceNotification = document.createElement('div');
                        priceNotification.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.95); color: #FF6347; padding: 50px 70px; border-radius: 25px; font-size: 32px; font-weight: bold; z-index: 1001; text-align: center; border: 5px solid #8B0000;';
                        priceNotification.innerHTML = 'Но цена победы слишком велика...<br><br><span style="font-size: 24px; color: white;">Вирус зомби уже в крови...</span>';
                        document.body.appendChild(priceNotification);

                        setTimeout(() => {
                            document.body.removeChild(priceNotification);

                            // Запускаем трагичную финальную сцену с дождём
                            tragicFinalScene();
                        }, 3000);
                    }, 2500);
                }, 2500);
        }
    }, 2500);
}

// Трагичная финальная сцена с дождём и музыкой
function tragicFinalScene() {
    console.log('☔ Трагичная финальная сцена...');

    // Запускаем музыку "Only You"
    playVictoryMusic();

    // Меняем небо на тёмное дождливое
    scene.background = new THREE.Color(0x4a4a4a);
    scene.fog = new THREE.Fog(0x4a4a4a, 5, 30);

    // Создаём систему дождя
    const rainGeo = new THREE.BufferGeometry();
    const rainCount = 2000;
    const positions = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100; // X
        positions[i + 1] = Math.random() * 50; // Y
        positions[i + 2] = (Math.random() - 0.5) * 100; // Z
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });

    const rain = new THREE.Points(rainGeo, rainMaterial);
    scene.add(rain);

    // Анимация дождя
    const rainAnimation = setInterval(() => {
        const positions = rain.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 0.5; // Падение дождя
            if (positions[i] < 0) {
                positions[i] = 50; // Возвращаем каплю наверх
            }
        }
        rain.geometry.attributes.position.needsUpdate = true;
    }, 16);

    window.rainAnimation = rainAnimation;
    window.rainObject = rain;

    // Переключаем в третье лицо для драматичности
    cameraMode = 'thirdPerson';
    player.visible = true;

    // Убираем оружие из FPS рук и добавляем к персонажу
    if (currentWeapon && fpsHands) {
        fpsHands.remove(currentWeapon);
        if (fpsScene) fpsScene.remove(fpsHands);
        fpsHands = null;
        currentWeapon.position.set(0.15, 0.2, -0.4);
        currentWeapon.rotation.y = 0;
        currentWeapon.rotation.x = 0;
        currentWeapon.rotation.z = -Math.PI / 6;
        currentWeapon.scale.set(1, 1, 1);
        player.add(currentWeapon);
    }

    // Камера отдаляется для кинематографичного вида
    camera.position.set(player.position.x + 8, player.position.y + 4, player.position.z + 10);
    camera.lookAt(player.position);

    // Затемнение экрана для драматичности
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%);
        z-index: 500;
        pointer-events: none;
    `;
    document.body.appendChild(overlay);
    window.sceneOverlay = overlay;

    // Текст "Герой смотрит на небо..."
    const narrativeText = document.createElement('div');
    narrativeText.style.cssText = 'position: fixed; top: 150px; left: 50%; transform: translateX(-50%); color: white; font-size: 28px; font-weight: bold; z-index: 501; text-align: center; text-shadow: 2px 2px 8px rgba(0,0,0,0.8); opacity: 0; transition: opacity 2s;';
    narrativeText.innerHTML = '☔ Дождь смывает кровь с рук героя...<br><span style="font-size: 22px; opacity: 0.8;">Победа одержана, но какой ценой?</span>';
    document.body.appendChild(narrativeText);
    setTimeout(() => {
        narrativeText.style.opacity = '1';
    }, 500);

    // Через 5 секунд герой медленно поднимает оружие к голове
    setTimeout(() => {
        narrativeText.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(narrativeText)) {
                document.body.removeChild(narrativeText);
            }
        }, 2000);

        // Новый текст
        const finalText = document.createElement('div');
        finalText.style.cssText = 'position: fixed; top: 150px; left: 50%; transform: translateX(-50%); color: white; font-size: 32px; font-weight: bold; z-index: 501; text-align: center; text-shadow: 2px 2px 8px rgba(0,0,0,0.8); opacity: 0; transition: opacity 2s;';
        finalText.innerHTML = '"Лучше умереть человеком..."';
        document.body.appendChild(finalText);
        setTimeout(() => {
            finalText.style.opacity = '1';
        }, 500);

        if (currentWeapon) {
            // Плавное поднятие оружия к голове (2 секунды)
            let progress = 0;
            const raiseWeapon = setInterval(() => {
                progress += 0.02;
                if (currentWeapon) {
                    currentWeapon.position.set(
                        0.15 - progress * 0.35, // К центру
                        0.2 + progress * 0.4,  // Вверх к голове
                        -0.4 + progress * 0.5  // Ближе к голове
                    );
                    currentWeapon.rotation.set(
                        0,
                        progress * Math.PI / 2,
                        -Math.PI / 6 + progress * (Math.PI / 3)
                    );
                }
                if (progress >= 1) {
                    clearInterval(raiseWeapon);
                }
            }, 30);
        }

        // Через 4 секунды - выстрел
        setTimeout(() => {
            finalText.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(finalText)) {
                    document.body.removeChild(finalText);
                }
            }, 1000);

            // Белая вспышка выстрела
            scene.background = new THREE.Color(0xFFFFFF);
            setTimeout(() => {
                scene.background = new THREE.Color(0x4a4a4a);
            }, 150);

            // Дым от выстрела
            for (let i = 0; i < 15; i++) {
                const smoke = new THREE.Mesh(
                    new THREE.SphereGeometry(0.15, 8, 8),
                    new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.5 })
                );
                smoke.position.set(player.position.x - 0.2, player.position.y + 0.6, player.position.z);
                scene.add(smoke);
                setTimeout(() => scene.remove(smoke), 2000);
            }

            // Герой падает под дождём
            let fallSpeed = 0;
            const fallInterval = setInterval(() => {
                fallSpeed += 0.015;
                player.position.y -= fallSpeed;
                player.rotation.x += 0.03;
                player.rotation.z += 0.01;

                if (player.position.y <= 0.1) {
                    player.position.y = 0.1;
                    clearInterval(fallInterval);
                    player.rotation.x = Math.PI / 2;
                    player.rotation.z = Math.PI / 6;

                    // Камера медленно отъезжает
                    let cameraDistance = 8;
                    const cameraZoom = setInterval(() => {
                        cameraDistance += 0.05;
                        camera.position.set(
                            player.position.x + cameraDistance,
                            player.position.y + cameraDistance * 0.5,
                            player.position.z + cameraDistance * 1.2
                        );
                        camera.lookAt(player.position);

                        if (cameraDistance > 15) {
                            clearInterval(cameraZoom);
                        }
                    }, 50);

                    // Через 3 секунды показываем титры
                    setTimeout(() => {
                        showCredits();
                    }, 3000);
                }
            }, 16);
        }, 4000);
    }, 5000);
}

// Показ титров с рандомными именами
function showCredits() {
    console.log('🎬 Показ титров...');

    // Массивы имён для генерации
    const firstNames = [
        'Алексей', 'Дмитрий', 'Сергей', 'Андрей', 'Максим', 'Иван', 'Артём', 'Владимир',
        'Михаил', 'Николай', 'Павел', 'Егор', 'Денис', 'Антон', 'Роман', 'Олег',
        'Виктор', 'Александр', 'Евгений', 'Игорь', 'Константин', 'Валерий'
    ];
    const lastNames = [
        'Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Соколов',
        'Михайлов', 'Новиков', 'Фёдоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семёнов',
        'Егоров', 'Павлов', 'Козлов', 'Степанов', 'Николаев', 'Орлов'
    ];

    const getRandomName = () => {
        const first = firstNames[Math.floor(Math.random() * firstNames.length)];
        const last = lastNames[Math.floor(Math.random() * lastNames.length)];
        return `${first} ${last}`;
    };

    // Создаём контейнер титров
    const creditsContainer = document.createElement('div');
    creditsContainer.id = 'credits';
    creditsContainer.style.cssText = `
        position: fixed;
        top: 100%;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.98) 100%);
        color: white;
        font-family: 'Arial', sans-serif;
        z-index: 2000;
        overflow: hidden;
        animation: creditsScroll 45s linear forwards;
    `;

    // CSS анимация скролла
    const style = document.createElement('style');
    style.textContent = `
        @keyframes creditsScroll {
            from { top: 100%; }
            to { top: -200%; }
        }
    `;
    document.head.appendChild(style);

    creditsContainer.innerHTML = `
        <div style="padding: 100px 50px; text-align: center;">
            <h1 style="font-size: 64px; margin: 80px 0; text-shadow: 0 0 20px rgba(255,255,255,0.5);">
                ⚔️ ЗОМБИ ВЫЖИВАНИЕ ⚔️
            </h1>

            <div style="margin: 120px 0;">
                <h2 style="font-size: 32px; color: #FFD700; margin-bottom: 30px;">РЕЖИССЁР</h2>
                <p style="font-size: 28px;">${getRandomName()}</p>
            </div>

            <div style="margin: 120px 0;">
                <h2 style="font-size: 32px; color: #FFD700; margin-bottom: 30px;">ПРОДЮСЕР</h2>
                <p style="font-size: 28px;">${getRandomName()}</p>
            </div>

            <div style="margin: 120px 0;">
                <h2 style="font-size: 32px; color: #FFD700; margin-bottom: 30px;">СЦЕНАРИЙ</h2>
                <p style="font-size: 28px;">${getRandomName()}</p>
                <p style="font-size: 28px;">${getRandomName()}</p>
            </div>

            <div style="margin: 120px 0;">
                <h2 style="font-size: 32px; color: #FFD700; margin-bottom: 30px;">ГЛАВНЫЕ РОЛИ</h2>
                <p style="font-size: 26px; margin: 15px 0;">Герой - ${getRandomName()}</p>
                <p style="font-size: 26px; margin: 15px 0;">Повелитель Зомби - ${getRandomName()}</p>
                <p style="font-size: 26px; margin: 15px 0;">Голос за кадром - ${getRandomName()}</p>
            </div>

            <div style="margin: 120px 0;">
                <h2 style="font-size: 32px; color: #FFD700; margin-bottom: 30px;">ОПЕРАТОРЫ</h2>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
            </div>

            <div style="margin: 120px 0;">
                <h2 style="font-size: 32px; color: #FFD700; margin-bottom: 30px;">КОМПОЗИТОР</h2>
                <p style="font-size: 28px;">${getRandomName()}</p>
            </div>

            <div style="margin: 120px 0;">
                <h2 style="font-size: 32px; color: #FFD700; margin-bottom: 30px;">ХУДОЖНИКИ</h2>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
            </div>

            <div style="margin: 120px 0;">
                <h2 style="font-size: 32px; color: #FFD700; margin-bottom: 30px;">ЗВУКОРЕЖИССЁРЫ</h2>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
            </div>

            <div style="margin: 120px 0;">
                <h2 style="font-size: 32px; color: #FFD700; margin-bottom: 30px;">КАСКАДЁРЫ</h2>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
            </div>

            <div style="margin: 120px 0;">
                <h2 style="font-size: 32px; color: #FFD700; margin-bottom: 30px;">СПЕЦИАЛЬНЫЕ ЭФФЕКТЫ</h2>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
            </div>

            <div style="margin: 120px 0;">
                <h2 style="font-size: 32px; color: #FFD700; margin-bottom: 30px;">МОНТАЖ</h2>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
            </div>

            <div style="margin: 150px 0;">
                <h2 style="font-size: 32px; color: #FFD700; margin-bottom: 40px;">ОСОБАЯ БЛАГОДАРНОСТЬ</h2>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
                <p style="font-size: 24px;">${getRandomName()}</p>
            </div>

            <div style="margin: 200px 0;">
                <p style="font-size: 28px; font-style: italic; opacity: 0.8;">
                    🎵 Музыка: "Only You" - The Platters 🎵
                </p>
            </div>

            <div style="margin: 200px 0 300px 0;">
                <h1 style="font-size: 56px; color: #FFD700; text-shadow: 0 0 30px rgba(255,215,0,0.8);">
                    СПАСИБО ЗА ИГРУ
                </h1>
                <p style="font-size: 32px; margin-top: 50px; opacity: 0.9;">
                    Ваш счёт: ${score}
                </p>
                <p style="font-size: 28px; margin-top: 30px; opacity: 0.8;">
                    Волн пройдено: 20
                </p>
            </div>
        </div>
    `;

    document.body.appendChild(creditsContainer);

    // Через 45 секунд показываем кнопки
    setTimeout(() => {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.cssText = 'position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); z-index: 2001; text-align: center;';
        buttonsDiv.innerHTML = `
            <button onclick="restartAfterCredits()"
                    style="margin: 20px; padding: 20px 50px; font-size: 28px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; border: none; border-radius: 15px; cursor: pointer; font-weight: bold; box-shadow: 0 5px 20px rgba(0,0,0,0.5); transition: transform 0.2s;"
                    onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                🔄 Начать заново
            </button>
            <button onclick="returnToMenuAfterCredits()"
                    style="margin: 20px; padding: 20px 50px; font-size: 28px; background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color: white; border: none; border-radius: 15px; cursor: pointer; font-weight: bold; box-shadow: 0 5px 20px rgba(0,0,0,0.5); transition: transform 0.2s;"
                    onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                🏠 Главное меню
            </button>
        `;
        document.body.appendChild(buttonsDiv);
        window.creditsButtons = buttonsDiv;
    }, 45000);
}

// Функции для кнопок после титров
window.restartAfterCredits = function() {
    // Очистка
    const credits = document.getElementById('credits');
    if (credits) document.body.removeChild(credits);
    if (window.creditsButtons) document.body.removeChild(window.creditsButtons);
    if (window.sceneOverlay) document.body.removeChild(window.sceneOverlay);
    if (window.rainAnimation) clearInterval(window.rainAnimation);
    if (window.rainObject) scene.remove(window.rainObject);
    if (window.victoryAudio) window.victoryAudio.pause();

    // Перезапуск игры
    restartGame();
};

window.returnToMenuAfterCredits = function() {
    // Очистка
    const credits = document.getElementById('credits');
    if (credits) document.body.removeChild(credits);
    if (window.creditsButtons) document.body.removeChild(window.creditsButtons);
    if (window.sceneOverlay) document.body.removeChild(window.sceneOverlay);
    if (window.rainAnimation) clearInterval(window.rainAnimation);
    if (window.rainObject) scene.remove(window.rainObject);
    if (window.victoryAudio) window.victoryAudio.pause();

    // Возврат в меню
    returnToSkinMenu();
};

function gameOver() {
    gameActive = false;
    waveActive = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('cubeGameHighScore', highScore);
    }
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLevel').textContent = 'Волна ' + wave;
    document.getElementById('finalHighScore').textContent = highScore;
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('crosshair').style.display = 'none';
    document.getElementById('cameraMode').style.display = 'none';
}

// Функция запуска обычной игры
function initGame() {
    console.log('🎮 Запуск обычной игры...');
    selectSkin('human');
}

// Функция запуска режима тренировки
function initTrainingMode() {
    console.log('🎯 Запуск режима тренировки...');

    // Скрываем вступительную книгу "Дневник выжившего"
    const introScene = document.getElementById('introScene');
    if (introScene) {
        introScene.style.display = 'none';
    }

    selectSkin('human');

    // Создаём полигон с мишенями после инициализации
    setTimeout(() => {
        createStandoffTrainingRange();
    }, 100);
}

// Глобальные переменные для статистики тренировки
let trainingStats = {
    shots: 0,
    hits: 0,
    headshots: 0,
    accuracy: 0
};

// Создание тренировочного тира в стиле Standoff 2
function createStandoffTrainingRange() {
    console.log('🎯 Создание тренировочного полигона Standoff 2...');

    // Очищаем сцену от старых объектов
    obstacles.forEach(obj => scene.remove(obj));
    obstacles = [];

    // ========== ОКРУЖЕНИЕ ==========
    // Светлое небо как в CS:GO
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 50, 150);

    // Удаляем старый пол
    if (ground) {
        scene.remove(ground);
    }

    // БЕТОННЫЙ ПОЛ
    const floorSize = 100;
    const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.9,
        metalness: 0.1
    });
    ground = new THREE.Mesh(floorGeometry, floorMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Сетка на полу для визуализации расстояний
    const gridHelper = new THREE.GridHelper(floorSize, 50, 0x555555, 0x444444);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // ========== ОСВЕЩЕНИЕ ==========
    // Убираем старое освещение
    while(scene.children.find(child => child.isDirectionalLight || child.isAmbientLight || child.isHemisphereLight)) {
        const light = scene.children.find(child => child.isDirectionalLight || child.isAmbientLight || child.isHemisphereLight);
        scene.remove(light);
    }

    // Яркое освещение как на улице
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(10, 20, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // ========== СТЕНЫ ТИРА ==========
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b7355,
        roughness: 0.8,
        metalness: 0.1
    });

    // Задняя стена
    const backWallGeometry = new THREE.BoxGeometry(40, 10, 1);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 5, -50);
    backWall.receiveShadow = true;
    backWall.castShadow = true;
    scene.add(backWall);

    // Боковые стены
    const sideWallGeometry = new THREE.BoxGeometry(1, 10, 100);

    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.set(-20, 5, 0);
    leftWall.receiveShadow = true;
    leftWall.castShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.set(20, 5, 0);
    rightWall.receiveShadow = true;
    rightWall.castShadow = true;
    scene.add(rightWall);

    // ========== МАРКЕРЫ ДИСТАНЦИЙ ==========
    const distances = [10, 20, 30, 40];
    distances.forEach(dist => {
        // Текст на полу
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffff00';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.font = 'bold 64px Arial';
        ctx.textAlign = 'center';
        ctx.strokeText(dist + 'M', 128, 80);
        ctx.fillText(dist + 'M', 128, 80);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(3, 1.5, 1);
        sprite.position.set(-15, 0.1, -dist);
        scene.add(sprite);
    });

    // ========== СТАТИЧНЫЕ БОТЫ ==========
    // 4 ряда ботов на разных дистанциях
    distances.forEach((dist, rowIndex) => {
        for (let i = -2; i <= 2; i++) {
            const bot = createStandoffBot(false); // статичный
            bot.position.set(i * 4, 0, -dist);
            bot.userData.type = 'trainingBot';
            bot.userData.hp = 100;
            bot.userData.maxHp = 100;
            bot.userData.distance = dist;
            bot.userData.isMoving = false;
            scene.add(bot);
            obstacles.push(bot);
        }
    });

    // ========== ДВИЖУЩИЕСЯ БОТЫ ==========
    // 2 бота на 15м и 25м, которые двигаются влево-вправо
    [15, 25].forEach(dist => {
        const movingBot = createStandoffBot(true); // движущийся
        movingBot.position.set(0, 0, -dist);
        movingBot.userData.type = 'trainingBot';
        movingBot.userData.hp = 100;
        movingBot.userData.maxHp = 100;
        movingBot.userData.distance = dist;
        movingBot.userData.isMoving = true;
        movingBot.userData.moveDirection = 1;
        movingBot.userData.moveSpeed = 0.05;
        movingBot.userData.moveRange = 8;
        movingBot.userData.startX = 0;
        scene.add(movingBot);
        obstacles.push(movingBot);
    });

    // ========== UI СТАТИСТИКИ ==========
    createTrainingStatsUI();

    // ========== АНИМАЦИЯ ДВИЖУЩИХСЯ БОТОВ ==========
    const animateMovingBots = () => {
        if (gameMode !== 'training') return;

        obstacles.forEach(bot => {
            if (bot.userData.isMoving && bot.userData.type === 'trainingBot') {
                // Движение влево-вправо
                bot.position.x += bot.userData.moveSpeed * bot.userData.moveDirection;

                // Разворот при достижении края
                if (Math.abs(bot.position.x - bot.userData.startX) > bot.userData.moveRange) {
                    bot.userData.moveDirection *= -1;
                    bot.rotation.y = bot.userData.moveDirection > 0 ? Math.PI / 2 : -Math.PI / 2;
                }
            }
        });

        requestAnimationFrame(animateMovingBots);
    };
    animateMovingBots();

    // Перемещаем игрока на стартовую позицию
    player.position.set(0, 0, 0);

    // Безлимитные патроны в тренировке
    ammo = 999;
    updateAmmoDisplay();

    console.log('✅ Тренировочный полигон создан с', obstacles.length, 'ботами');
}

// Создание КИБЕРПРОСТРАНСТВЕННОГО тренировочного полигона
function createCyberTrainingSpace() {
    console.log('💠 Создание киберпространства для тренировки...');

    // ========== ОКРУЖЕНИЕ ==========
    // Меняем фон на космический черный
    scene.background = new THREE.Color(0x000510);

    // Добавляем космический туман
    scene.fog = new THREE.Fog(0x000510, 1, 100);

    // Удаляем старый ground если есть
    if (ground) {
        scene.remove(ground);
    }

    // НЕОНОВЫЙ ПОЛ - электронная сетка
    const gridSize = 100;
    const gridDivisions = 50;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x00ffff, 0x0088ff);
    gridHelper.material.opacity = 0.8;
    gridHelper.material.transparent = true;
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Светящийся пол под сеткой
    const floorGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x001133,
        emissive: 0x002255,
        emissiveIntensity: 0.5,
        roughness: 0.8,
        metalness: 0.2,
        transparent: true,
        opacity: 0.9
    });
    const cyberFloor = new THREE.Mesh(floorGeometry, floorMaterial);
    cyberFloor.rotation.x = -Math.PI / 2;
    cyberFloor.position.y = -0.05;
    cyberFloor.receiveShadow = true;
    scene.add(cyberFloor);

    // ========== ОСВЕЩЕНИЕ ==========
    // Убираем старое освещение и добавляем неоновое
    while(scene.children.find(child => child.isDirectionalLight || child.isAmbientLight || child.isHemisphereLight)) {
        const light = scene.children.find(child => child.isDirectionalLight || child.isAmbientLight || child.isHemisphereLight);
        scene.remove(light);
    }

    // Ambient light - темное киберпространство
    const ambientLight = new THREE.AmbientLight(0x4444ff, 0.3);
    scene.add(ambientLight);

    // Неоновые точечные источники света (синие и фиолетовые)
    const neonLights = [
        { pos: [-20, 8, -20], color: 0x00ffff, intensity: 2 },
        { pos: [20, 8, -20], color: 0xff00ff, intensity: 2 },
        { pos: [-20, 8, 20], color: 0xff00ff, intensity: 2 },
        { pos: [20, 8, 20], color: 0x00ffff, intensity: 2 },
        { pos: [0, 10, -30], color: 0x00ff88, intensity: 3 }
    ];

    neonLights.forEach(lightData => {
        const light = new THREE.PointLight(lightData.color, lightData.intensity, 50);
        light.position.set(...lightData.pos);
        scene.add(light);

        // Добавляем визуальный источник света (светящаяся сфера)
        const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: lightData.color,
            transparent: true,
            opacity: 0.8
        });
        const lightSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        lightSphere.position.set(...lightData.pos);
        scene.add(lightSphere);

        // Добавляем свечение (большая полупрозрачная сфера)
        const glowGeometry = new THREE.SphereGeometry(1.5, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: lightData.color,
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(...lightData.pos);
        scene.add(glow);
    });

    // Показываем специальное сообщение
    const trainingNotif = document.createElement('div');
    trainingNotif.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2)); padding: 40px 70px; border-radius: 25px; font-size: 36px; font-weight: bold; z-index: 1000; border: 4px solid #00ffff; color: #00ffff; text-align: center; box-shadow: 0 0 50px rgba(0, 255, 255, 0.8), inset 0 0 30px rgba(0, 255, 255, 0.2); backdrop-filter: blur(10px); text-shadow: 0 0 20px #00ffff;';
    trainingNotif.innerHTML = '💠 КИБЕРПРОСТРАНСТВО<br><span style="font-size: 24px; color: #ff00ff;">Добро пожаловать в виртуальный полигон</span>';
    document.body.appendChild(trainingNotif);

    setTimeout(() => {
        if (trainingNotif.parentNode) {
            document.body.removeChild(trainingNotif);
        }
    }, 3000);

    // ========== НЕОНОВЫЕ СТЕНЫ ==========
    // Материал для светящихся стен
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.4,
        metalness: 0.8,
        roughness: 0.2
    });

    // Задняя стена с неоновой рамкой
    const backWallGeometry = new THREE.BoxGeometry(40, 8, 0.5);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 4, -50);
    scene.add(backWall);

    // Неоновая рамка задней стены
    const frameGeometry = new THREE.EdgesGeometry(backWallGeometry);
    const frameMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3 });
    const backWallFrame = new THREE.LineSegments(frameGeometry, frameMaterial);
    backWallFrame.position.copy(backWall.position);
    scene.add(backWallFrame);

    // Боковые стены
    const sideWallGeometry = new THREE.BoxGeometry(0.5, 8, 70);
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.set(-20, 4, -15);
    scene.add(leftWall);

    const leftWallFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(sideWallGeometry),
        frameMaterial
    );
    leftWallFrame.position.copy(leftWall.position);
    scene.add(leftWallFrame);

    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.set(20, 4, -15);
    scene.add(rightWall);

    const rightWallFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(sideWallGeometry),
        frameMaterial
    );
    rightWallFrame.position.copy(rightWall.position);
    scene.add(rightWallFrame);

    // Добавляем вертикальные неоновые столбы
    const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.3, 8, 8);
    const pillarMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.6
    });

    const pillarPositions = [
        [-20, 4, -50], [20, 4, -50],
        [-20, 4, 20], [20, 4, 20]
    ];

    pillarPositions.forEach(pos => {
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar.position.set(...pos);
        scene.add(pillar);
    });

    // ========== СИСТЕМА ТРЕНИРОВКИ КАК В STANDOFF ==========
    // Игрок стоит на месте, цели появляются по одной в случайных местах

    // Блокируем движение игрока в тренировке
    trainingMovementLocked = true;

    // Функция спавна случайной цели
    spawnRandomTarget = function() {
        if (gameMode !== 'training') return;

        const hologram = createHologramTarget();

        // Случайная позиция в пределах полигона
        const randomX = (Math.random() - 0.5) * 30; // От -15 до 15
        const randomZ = -15 - Math.random() * 30; // От -15 до -45

        hologram.position.set(randomX, 0, randomZ);
        hologram.userData.type = 'trainingDummy';
        hologram.userData.hp = 1; // Убивается с одного попадания
        hologram.userData.maxHp = 1;

        scene.add(hologram);
        obstacles.push(hologram);

        console.log('🎯 Цель появилась:', randomX.toFixed(1), randomZ.toFixed(1));
    };

    // Сбрасываем счетчик уничтоженных целей
    trainingTargetsDestroyed = 0;

    // Спавним первую цель
    spawnRandomTarget();

    // Анимация голограмм (пульсация)
    const animateHolograms = () => {
        if (gameMode !== 'training') return;

        obstacles.forEach(obj => {
            if (obj.userData.type === 'trainingDummy' && obj.userData.hologramMaterial) {
                const time = Date.now() * 0.001;
                obj.userData.hologramMaterial.emissiveIntensity = 0.6 + Math.sin(time * 2 + obj.userData.row + obj.userData.col) * 0.3;
                obj.rotation.y = Math.sin(time * 0.5) * 0.1;
            }
        });

        requestAnimationFrame(animateHolograms);
    };
    animateHolograms();

    console.log('✅ Киберпространство создано с', obstacles.length, 'голограммными мишенями');
}

// Создание голограммной мишени для киберпространства
function createHologramTarget() {
    const hologramGroup = new THREE.Group();

    // Голограммный материал (светящийся, полупрозрачный)
    const hologramMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.5,
        metalness: 0.9,
        roughness: 0.1,
        wireframe: false
    });

    // Сохраняем материал для анимации
    hologramGroup.userData.hologramMaterial = hologramMaterial;

    // Тело голограммы
    const bodyGeometry = new THREE.BoxGeometry(0.6, 1.0, 0.3);
    const body = new THREE.Mesh(bodyGeometry, hologramMaterial);
    body.position.y = 0.7;
    hologramGroup.add(body);

    // Wireframe контур тела
    const bodyWireframe = new THREE.EdgesGeometry(bodyGeometry);
    const bodyWireframeMesh = new THREE.LineSegments(
        bodyWireframe,
        new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 })
    );
    bodyWireframeMesh.position.copy(body.position);
    hologramGroup.add(bodyWireframeMesh);

    // Голова голограммы
    const headGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const head = new THREE.Mesh(headGeometry, hologramMaterial);
    head.position.y = 1.45;
    hologramGroup.add(head);

    // Wireframe контур головы
    const headWireframe = new THREE.EdgesGeometry(headGeometry);
    const headWireframeMesh = new THREE.LineSegments(
        headWireframe,
        new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 })
    );
    headWireframeMesh.position.copy(head.position);
    hologramGroup.add(headWireframeMesh);

    // Светящееся "ядро" в центре
    const coreGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.9
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.y = 1.0;
    hologramGroup.add(core);

    // Светящееся кольцо вокруг
    const ringGeometry = new THREE.TorusGeometry(0.4, 0.05, 8, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.7
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.y = 1.0;
    ring.rotation.x = Math.PI / 2;
    hologramGroup.add(ring);

    // Цифровой ID над головой
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TARGET', 64, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1, 0.5, 1);
    sprite.position.y = 2.2;
    hologramGroup.add(sprite);

    // Создание неподвижной мишени-зомби (старая функция, оставляем для совместимости)
    return hologramGroup;
}

// Создание бота для тренировки в стиле Standoff 2
function createStandoffBot(isMoving) {
    const botGroup = new THREE.Group();

    // Цвет бота - оранжевый для статичных, красный для движущихся
    const botColor = isMoving ? 0xff3333 : 0xff8800;
    const headColor = isMoving ? 0xff6666 : 0xffaa44;

    // ТЕЛО
    const bodyGeometry = new THREE.BoxGeometry(0.6, 0.9, 0.3);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: botColor,
        roughness: 0.7,
        metalness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    body.receiveShadow = true;
    body.userData.isPart = 'body';
    botGroup.add(body);

    // ГОЛОВА (важна для хедшотов)
    const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: headColor,
        roughness: 0.6,
        metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    head.castShadow = true;
    head.receiveShadow = true;
    head.userData.isPart = 'head';
    botGroup.add(head);

    // РУКИ
    const armGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const armMaterial = new THREE.MeshStandardMaterial({
        color: botColor,
        roughness: 0.7,
        metalness: 0.2
    });

    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.4, 0.7, 0);
    leftArm.castShadow = true;
    botGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.4, 0.7, 0);
    rightArm.castShadow = true;
    botGroup.add(rightArm);

    // НОГИ
    const legGeometry = new THREE.BoxGeometry(0.2, 0.7, 0.2);
    const legMaterial = new THREE.MeshStandardMaterial({
        color: botColor,
        roughness: 0.8,
        metalness: 0.1
    });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.15, 0.15, 0);
    leftLeg.castShadow = true;
    botGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.15, 0.15, 0);
    rightLeg.castShadow = true;
    botGroup.add(rightLeg);

    // ГЛАЗА
    const eyeGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 1.55, 0.15);
    botGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 1.55, 0.15);
    botGroup.add(rightEye);

    // Метка над головой
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = isMoving ? '#ff3333' : '#ff8800';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(isMoving ? 'MOVING' : 'STATIC', 128, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 0.5, 1);
    sprite.position.y = 2.2;
    botGroup.add(sprite);

    return botGroup;
}

// Создание UI панели статистики для тренировки
function createTrainingStatsUI() {
    // Удаляем старую панель если есть
    const oldPanel = document.getElementById('trainingStatsPanel');
    if (oldPanel) {
        oldPanel.remove();
    }

    // Создаем панель
    const panel = document.createElement('div');
    panel.id = 'trainingStatsPanel';
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(50, 50, 50, 0.9));
        padding: 20px;
        border-radius: 15px;
        border: 2px solid rgba(255, 215, 0, 0.6);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
        z-index: 100;
        font-family: Arial, sans-serif;
        min-width: 250px;
        backdrop-filter: blur(5px);
    `;

    panel.innerHTML = `
        <div style="color: #ffd700; font-size: 24px; font-weight: bold; margin-bottom: 15px; text-align: center; text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);">
            📊 СТАТИСТИКА
        </div>
        <div style="color: #ffffff; font-size: 16px; line-height: 1.8;">
            <div style="margin-bottom: 8px;">
                <span style="color: #aaaaaa;">Выстрелов:</span>
                <span id="trainingShotsCount" style="color: #00ff00; font-weight: bold; float: right;">0</span>
            </div>
            <div style="margin-bottom: 8px;">
                <span style="color: #aaaaaa;">Попаданий:</span>
                <span id="trainingHitsCount" style="color: #00ffff; font-weight: bold; float: right;">0</span>
            </div>
            <div style="margin-bottom: 8px;">
                <span style="color: #aaaaaa;">Хедшотов:</span>
                <span id="trainingHeadshotsCount" style="color: #ff00ff; font-weight: bold; float: right;">0</span>
            </div>
            <div style="margin-bottom: 8px;">
                <span style="color: #aaaaaa;">Точность:</span>
                <span id="trainingAccuracy" style="color: #ffff00; font-weight: bold; float: right;">0%</span>
            </div>
        </div>
        <div style="margin-top: 15px; text-align: center;">
            <button id="resetStatsBtn" style="
                background: linear-gradient(135deg, #ff4444, #cc0000);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                font-size: 14px;
                box-shadow: 0 3px 10px rgba(255, 0, 0, 0.3);
            ">🔄 Сбросить</button>
        </div>
    `;

    document.body.appendChild(panel);

    // Кнопка сброса статистики
    document.getElementById('resetStatsBtn').addEventListener('click', () => {
        trainingStats.shots = 0;
        trainingStats.hits = 0;
        trainingStats.headshots = 0;
        trainingStats.accuracy = 0;
        updateTrainingStatsUI();
    });

    updateTrainingStatsUI();
}

// Обновление UI статистики
function updateTrainingStatsUI() {
    const shotsEl = document.getElementById('trainingShotsCount');
    const hitsEl = document.getElementById('trainingHitsCount');
    const headshotsEl = document.getElementById('trainingHeadshotsCount');
    const accuracyEl = document.getElementById('trainingAccuracy');

    if (shotsEl) shotsEl.textContent = trainingStats.shots;
    if (hitsEl) hitsEl.textContent = trainingStats.hits;
    if (headshotsEl) headshotsEl.textContent = trainingStats.headshots;
    if (accuracyEl) {
        const acc = trainingStats.shots > 0
            ? Math.round((trainingStats.hits / trainingStats.shots) * 100)
            : 0;
        accuracyEl.textContent = acc + '%';

        // Цветовое кодирование точности
        if (acc >= 75) accuracyEl.style.color = '#00ff00';
        else if (acc >= 50) accuracyEl.style.color = '#ffff00';
        else if (acc >= 25) accuracyEl.style.color = '#ff8800';
        else accuracyEl.style.color = '#ff0000';
    }
}

function createTrainingDummy() {
    const dummyGroup = new THREE.Group();

    // Используем стандартного зомби, но делаем его ярче для видимости
    const bodyGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.3);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x00aa00,  // Зелёный цвет
        shininess: 30
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    body.castShadow = true;
    body.receiveShadow = true;
    dummyGroup.add(body);

    // Голова
    const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const headMaterial = new THREE.MeshPhongMaterial({
        color: 0x22dd22,  // Светло-зелёный
        shininess: 30
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.2;
    head.castShadow = true;
    head.receiveShadow = true;
    dummyGroup.add(head);

    // Глаза (красные, чтобы было видно что это мишень)
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0xff0000 });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 1.25, 0.2);
    dummyGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 1.25, 0.2);
    dummyGroup.add(rightEye);

    // Руки
    const armGeometry = new THREE.BoxGeometry(0.15, 0.6, 0.15);
    const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
    leftArm.position.set(-0.35, 0.6, 0);
    leftArm.castShadow = true;
    dummyGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
    rightArm.position.set(0.35, 0.6, 0);
    rightArm.castShadow = true;
    dummyGroup.add(rightArm);

    // Ноги
    const legGeometry = new THREE.BoxGeometry(0.15, 0.5, 0.15);
    const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    leftLeg.position.set(-0.15, 0.25, 0);
    leftLeg.castShadow = true;
    dummyGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    rightLeg.position.set(0.15, 0.25, 0);
    rightLeg.castShadow = true;
    dummyGroup.add(rightLeg);

    // Индикатор HP над головой
    const hpBarBg = new THREE.Mesh(
        new THREE.PlaneGeometry(0.6, 0.1),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    hpBarBg.position.set(0, 1.6, 0);
    hpBarBg.lookAt(camera.position);
    dummyGroup.add(hpBarBg);

    const hpBar = new THREE.Mesh(
        new THREE.PlaneGeometry(0.56, 0.08),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    hpBar.position.set(0, 1.6, 0.01);
    hpBar.lookAt(camera.position);
    dummyGroup.add(hpBar);
    dummyGroup.userData.hpBar = hpBar;

    return dummyGroup;
}

function restartGame() {
    obstacles.forEach(obstacle => scene.remove(obstacle));
    obstacles = [];
    bullets.forEach(bullet => scene.remove(bullet));
    bullets = [];
    score = 0;
    wave = 0;
    zombiesPerWave = 5;
    zombiesInCurrentWave = 0;
    waveActive = false;
    lives = 3;
    ammo = maxAmmo;
    obstacleSpeed = 0.02;
    canShoot = true;
    isBurstFiring = false;
    burstCount = 0;
    cameraMode = 'firstPerson';
    updateScoreDisplay();
    updateAmmoDisplay();
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('crosshair').style.display = 'block';
    document.getElementById('cameraMode').style.display = 'block';
    document.getElementById('cameraMode').textContent = 'Вид: От первого лица';
    player.position.set(0, 0.5, 0);
    player.rotation.set(0, -Math.PI / 2, 0);
    playerVelocityY = 0;
    isJumping = false;
    gameActive = false;

    // Возвращаемся в главное меню
    document.getElementById('mainMenu').style.display = 'flex';
}

function returnToSkinMenu() {
    gameActive = false;
    waveActive = false;

    score = 0;
    wave = 0;
    zombiesPerWave = 5;
    zombiesInCurrentWave = 0;
    lives = 3;
    ammo = maxAmmo;
    obstacleSpeed = 0.02;
    playerVelocityY = 0;
    isJumping = false;
    wood = 0; // Сбрасываем древесину

    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    if (scene) {
        obstacles.forEach(obstacle => scene.remove(obstacle));
        bullets.forEach(bullet => scene.remove(bullet));
        decorations.forEach(decoration => scene.remove(decoration));
        if (playerHouse) {
            scene.remove(playerHouse);
            playerHouse = null;
        }
        if (playerBed) {
            scene.remove(playerBed);
            playerBed = null;
        }
    }

    hasBed = false;

    obstacles = [];
    bullets = [];
    decorations = [];

    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('score').style.display = 'none';
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('weaponDisplay').style.display = 'none';
    document.getElementById('ammoDisplay').style.display = 'none';
    document.getElementById('cameraMode').style.display = 'none';
    document.getElementById('crosshair').style.display = 'none';
    document.getElementById('coinsDisplay').style.display = 'none';
    document.getElementById('openShopBtn').style.display = 'none';
    document.getElementById('woodDisplay').style.display = 'none';
    document.getElementById('buildHouseBtn').style.display = 'none';
    document.getElementById('buildBedBtn').style.display = 'none';

    // Показываем вступительную сцену с книгой
    const introScene = document.getElementById('introScene');
    if (introScene) {
        introScene.style.display = 'flex';
        introScene.style.opacity = '0';
        setTimeout(() => {
            introScene.style.transition = 'opacity 1s';
            introScene.style.opacity = '1';
        }, 100);
    }

    selectedSkin = null;
}

// ========== СИСТЕМА ТЕЛЕПОРТАЦИИ НА ТРЕНИРОВОЧНЫЙ ПОЛИГОН ==========

// Телепортация на тренировочный полигон
function teleportToTraining() {
    if (isOnTrainingMap) {
        console.log('❌ Уже на тренировочном полигоне');
        return;
    }

    console.log('🌀 Телепортация на тренировочный полигон...');

    // Сохраняем текущее состояние игры
    savedGameState = {
        playerPosition: player.position.clone(),
        gameMode: gameMode,
        waveActive: waveActive,
        background: scene.background ? scene.background.clone() : null,
        fog: scene.fog ? { color: scene.fog.color.clone(), near: scene.fog.near, far: scene.fog.far } : null,
        obstacles: [...obstacles],
        lives: lives,
        score: score
    };

    // Показываем эффект телепортации
    showTeleportEffect();

    setTimeout(() => {
        // Очищаем текущую сцену
        clearCurrentScene();

        // Устанавливаем режим тренировки
        isOnTrainingMap = true;
        gameMode = 'training';
        waveActive = false; // Останавливаем зомби

        // Создаем киберпространство
        createCyberTrainingSpace();

        // Перемещаем игрока в центр
        player.position.set(0, 0, 0);

        // Показываем кнопку возврата
        const returnBtn = document.getElementById('returnFromTrainingBtn');
        if (returnBtn) {
            returnBtn.style.display = 'block';
        }

        // Скрываем кнопку телепортации
        const teleportBtn = document.getElementById('teleportToTrainingBtn');
        if (teleportBtn) {
            teleportBtn.style.display = 'none';
        }

        showNotification('💠 Добро пожаловать в Киберпространство!', 'success');
    }, 1000);
}

// Возврат с тренировочного полигона
function returnFromTraining() {
    if (!isOnTrainingMap) {
        console.log('❌ Не на тренировочном полигоне');
        return;
    }

    console.log('🌀 Возврат с тренировочного полигона...');

    // Показываем эффект телепортации
    showTeleportEffect();

    setTimeout(() => {
        // Очищаем киберпространство
        clearCurrentScene();

        // Восстанавливаем состояние игры
        if (savedGameState) {
            player.position.copy(savedGameState.playerPosition);
            gameMode = savedGameState.gameMode;
            waveActive = savedGameState.waveActive;

            // Восстанавливаем фон
            if (savedGameState.background) {
                scene.background = savedGameState.background;
            } else {
                scene.background = new THREE.Color(0x87CEEB);
            }

            // Восстанавливаем туман
            if (savedGameState.fog) {
                scene.fog = new THREE.Fog(
                    savedGameState.fog.color,
                    savedGameState.fog.near,
                    savedGameState.fog.far
                );
            }

            // Восстанавливаем препятствия
            obstacles = [...savedGameState.obstacles];
            obstacles.forEach(obs => {
                if (!scene.children.includes(obs)) {
                    scene.add(obs);
                }
            });

            lives = savedGameState.lives;
            score = savedGameState.score;
        }

        // Восстанавливаем обычное окружение
        initGame(); // Переинициализируем игру

        isOnTrainingMap = false;
        savedGameState = null;

        // Разблокируем движение
        trainingMovementLocked = false;
        spawnRandomTarget = null;
        trainingTargetsDestroyed = 0;

        // Показываем кнопку телепортации обратно
        const teleportBtn = document.getElementById('teleportToTrainingBtn');
        if (teleportBtn) {
            teleportBtn.style.display = 'block';
        }

        // Скрываем кнопку возврата
        const returnBtn = document.getElementById('returnFromTrainingBtn');
        if (returnBtn) {
            returnBtn.style.display = 'none';
        }

        showNotification('🏠 Возвращение в основной мир!', 'success');
    }, 1000);
}

// Очистка текущей сцены
function clearCurrentScene() {
    // Удаляем все препятствия
    obstacles.forEach(obs => scene.remove(obs));
    obstacles = [];

    // Удаляем пули
    bullets.forEach(bullet => scene.remove(bullet));
    bullets = [];

    // Удаляем декорации (деревья, камни, облака)
    const toRemove = [];
    scene.children.forEach(child => {
        if (child.userData && (
            child.userData.isTree ||
            child.userData.isRock ||
            child.userData.isCloud ||
            child.userData.isBuilding ||
            child.name === 'GridHelper' ||
            child.type === 'GridHelper'
        )) {
            toRemove.push(child);
        }
    });
    toRemove.forEach(obj => scene.remove(obj));
}

// Эффект телепортации
function showTeleportEffect() {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(0, 255, 255, 0.8) 0%, rgba(255, 0, 255, 0.8) 50%, rgba(0, 0, 0, 1) 100%);
        z-index: 9999;
        animation: teleportPulse 1s ease-out;
        pointer-events: none;
    `;
    document.body.appendChild(effect);

    // Добавляем анимацию
    const style = document.createElement('style');
    style.textContent = `
        @keyframes teleportPulse {
            0% { opacity: 0; transform: scale(2); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.5); }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        if (effect.parentNode) {
            document.body.removeChild(effect);
        }
    }, 1000);
}
