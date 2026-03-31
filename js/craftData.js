// Рецепты крафта для игры

const craftRecipes = {
    consumables: [
        {
            id: 'bandage',
            name: 'Бинт',
            icon: '🩹',
            description: 'Восстанавливает 20 HP',
            materials: [
                {type: 'cloth', amount: 2},
                {type: 'herbs', amount: 1}
            ],
            craft: () => {
                playerHP = Math.min(playerHP + 20, maxPlayerHP);
                updatePlayerHPDisplay();
                showNotification('🩹 Бинт использован! +20 HP', 'success');
            }
        },
        {
            id: 'energyDrink',
            name: 'Энергетик',
            icon: '🥤',
            description: 'Восстанавливает 30 усталости',
            materials: [
                {type: 'bottle', amount: 1},
                {type: 'herbs', amount: 2}
            ],
            craft: () => {
                fatigue = Math.max(fatigue - 30, 0);
                updateFatigueDisplay();
                showNotification('🥤 Энергетик выпит! -30 усталости', 'success');
            }
        },
        {
            id: 'foodRation',
            name: 'Порция еды',
            icon: '🍖',
            description: 'Восстанавливает 30 голода',
            materials: [
                {type: 'cloth', amount: 1},
                {type: 'herbs', amount: 1}
            ],
            craft: () => {
                hunger = Math.min(hunger + 30, maxHunger);
                updateHungerDisplay();
                showNotification('🍖 Порция еды съедена! +30 голода', 'success');
            }
        },
        {
            id: 'waterBottle',
            name: 'Бутылка воды',
            icon: '💧',
            description: 'Восстанавливает 30 жажды',
            materials: [
                {type: 'bottle', amount: 1},
                {type: 'herbs', amount: 1}
            ],
            craft: () => {
                thirst = Math.min(thirst + 30, maxThirst);
                updateThirstDisplay();
                showNotification('💧 Бутылка воды выпита! +30 жажды', 'success');
            }
        }
    ],
    weapons: [
        {
            id: 'improvisedBow',
            name: 'Самодельный лук',
            icon: '🏹',
            description: 'Оружие дальнего боя',
            materials: [
                {type: 'wood', amount: 15},
                {type: 'string', amount: 3}
            ],
            craft: () => {
                if (!unlockedWeapons.includes('improvisedBow')) {
                    unlockedWeapons.push('improvisedBow');
                    localStorage.setItem('cubeGameUnlockedWeapons', JSON.stringify(unlockedWeapons));
                    showNotification('🏹 Самодельный лук создан!', 'success');
                } else {
                    showNotification('🏹 У вас уже есть этот лук', 'info');
                }
            }
        },
        {
            id: 'woodenSpear',
            name: 'Деревянное копье',
            icon: '🔱',
            description: 'Простое оружие ближнего боя',
            materials: [
                {type: 'wood', amount: 10},
                {type: 'nails', amount: 3}
            ],
            craft: () => {
                if (!unlockedWeapons.includes('woodenSpear')) {
                    unlockedWeapons.push('woodenSpear');
                    localStorage.setItem('cubeGameUnlockedWeapons', JSON.stringify(unlockedWeapons));
                    showNotification('🔱 Деревянное копье создано!', 'success');
                } else {
                    showNotification('🔱 У вас уже есть это копье', 'info');
                }
            }
        }
    ],
    tools: [
        {
            id: 'woodenShield',
            name: 'Деревянный щит',
            icon: '🛡️',
            description: '+10% защиты на 5 минут',
            materials: [
                {type: 'wood', amount: 20},
                {type: 'nails', amount: 5}
            ],
            craft: () => {
                // Активируем бафф щита
                if (!window.shieldBuffActive) {
                    window.shieldBuffActive = true;
                    window.shieldBuffEndTime = Date.now() + 300000; // 5 минут
                    showNotification('🛡️ Деревянный щит активирован! +10% защиты на 5 минут', 'success');

                    // Сбрасываем бафф через 5 минут
                    setTimeout(() => {
                        window.shieldBuffActive = false;
                        showNotification('🛡️ Деревянный щит сломался!', 'info');
                    }, 300000);
                } else {
                    showNotification('🛡️ У вас уже активен щит', 'info');
                }
            }
        },
        {
            id: 'repairKit',
            name: 'Ремонтный набор',
            icon: '🔧',
            description: 'Восстанавливает 50 HP дома',
            materials: [
                {type: 'wood', amount: 10},
                {type: 'nails', amount: 8}
            ],
            craft: () => {
                if (playerHouse) {
                    // Восстанавливаем дом (если есть система HP дома)
                    showNotification('🔧 Ремонтный набор создан! Используйте его на доме', 'success');
                    // Здесь можно добавить логику восстановления дома
                } else {
                    showNotification('🔧 У вас нет дома для ремонта', 'info');
                }
            }
        },
        {
            id: 'ropeLadder',
            name: 'Веревочная лестница',
            icon: '🪜',
            description: 'Позволяет строить второй этаж',
            materials: [
                {type: 'wood', amount: 15},
                {type: 'string', amount: 10}
            ],
            craft: () => {
                if (!hasSecondFloor && playerHouse) {
                    showNotification('🪜 Веревочная лестница создана! Теперь можно построить второй этаж', 'success');
                    // Разблокируем возможность постройки второго этажа
                    window.hasRopeLadder = true;
                } else if (hasSecondFloor) {
                    showNotification('🪜 У вас уже есть второй этаж', 'info');
                } else {
                    showNotification('🪜 Сначала постройте дом', 'info');
                }
            }
        }
    ],
    materials: [
        {
            id: 'stringFromCloth',
            name: 'Веревка из ткани',
            icon: '🧵',
            description: 'Создает веревку из ткани',
            materials: [
                {type: 'cloth', amount: 3}
            ],
            craft: () => {
                string += 1;
                showNotification('🧵 Веревка создана из ткани!', 'success');
            }
        },
        {
            id: 'nailsFromWood',
            name: 'Гвозди из древесины',
            icon: '📌',
            description: 'Создает гвозди из древесины',
            materials: [
                {type: 'wood', amount: 5}
            ],
            craft: () => {
                nails += 3;
                showNotification('📌 Гвозди созданы из древесины!', 'success');
            }
        }
    ]
};

// Вспомогательные ресурсы (бутылки можно найти в мире)
var bottle = 0; // Бутылки для создания энергетиков и воды