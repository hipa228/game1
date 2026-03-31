// Логика крафта предметов

console.log('✅ craft.js загружен');

// Основные функции крафта
function openCraftMenu() {
    if (document.getElementById('craftMenu')) {
        document.getElementById('craftMenu').style.display = 'block';
        updateCraftResourcesDisplay();
        updateCraftDisplay('all');
        showNotification('🛠️ Меню крафта открыто', 'info');
    }
}

function closeCraftMenu() {
    if (document.getElementById('craftMenu')) {
        document.getElementById('craftMenu').style.display = 'none';
    }
}

function updateCraftResourcesDisplay() {
    const craftWood = document.getElementById('craftWood');
    const craftCoins = document.getElementById('craftCoins');
    const craftCloth = document.getElementById('craftCloth');
    const craftHerbs = document.getElementById('craftHerbs');
    const craftNails = document.getElementById('craftNails');
    const craftString = document.getElementById('craftString');
    const craftBottle = document.getElementById('craftBottle');

    if (craftWood) craftWood.textContent = wood;
    if (craftCoins) craftCoins.textContent = coins;
    if (craftCloth) craftCloth.textContent = cloth || 0;
    if (craftHerbs) craftHerbs.textContent = herbs || 0;
    if (craftNails) craftNails.textContent = nails || 0;
    if (craftString) craftString.textContent = string || 0;
    if (craftBottle) craftBottle.textContent = bottle || 0;
}

function updateCraftDisplay(category) {
    const craftContainer = document.getElementById('craftItems');
    if (!craftContainer) return;

    craftContainer.innerHTML = '';

    let recipes = [];
    if (category === 'all') {
        for (const cat in craftRecipes) {
            recipes = recipes.concat(craftRecipes[cat]);
        }
    } else {
        recipes = craftRecipes[category] || [];
    }

    recipes.forEach(recipe => {
        const canCraft = checkCraftMaterials(recipe);
        const itemDiv = document.createElement('div');
        itemDiv.className = 'craft-item' + (canCraft ? '' : ' disabled');
        itemDiv.style.cssText = `
            width: 280px; padding: 20px; border-radius: 15px;
            background: ${canCraft ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.9), rgba(101, 67, 33, 0.8))' : 'linear-gradient(135deg, rgba(50, 50, 50, 0.9), rgba(30, 30, 30, 0.8))'};
            border: 3px solid ${canCraft ? '#8B4513' : '#666'};
            color: white; text-align: center; cursor: ${canCraft ? 'pointer' : 'not-allowed'};
            transition: transform 0.2s; margin: 10px;
        `;

        let materialsHtml = '';
        recipe.materials.forEach(mat => {
            const hasEnough = getResourceAmount(mat.type) >= mat.amount;
            const resourceIcon = getResourceIcon(mat.type);
            materialsHtml += `
                <div style="margin: 5px 0; color: ${hasEnough ? '#90EE90' : '#FF6B6B'}">
                    ${resourceIcon} ${mat.type}: ${mat.amount} (есть: ${getResourceAmount(mat.type)})
                </div>
            `;
        });

        itemDiv.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 10px;">${recipe.icon}</div>
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">${recipe.name}</div>
            <div style="font-size: 18px; margin-bottom: 15px; color: #CCC;">${recipe.description}</div>
            <div style="font-size: 16px; margin-bottom: 15px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
                ${materialsHtml}
            </div>
            <div style="font-size: 14px; color: ${canCraft ? '#90EE90' : '#FF6B6B'};">
                ${canCraft ? '✅ Можно создать' : '❌ Недостаточно материалов'}
            </div>
        `;

        if (canCraft) {
            itemDiv.onclick = () => craftItem(recipe);
            itemDiv.onmouseenter = () => itemDiv.style.transform = 'scale(1.05)';
            itemDiv.onmouseleave = () => itemDiv.style.transform = 'scale(1)';
        }

        craftContainer.appendChild(itemDiv);
    });
}

function checkCraftMaterials(recipe) {
    for (const material of recipe.materials) {
        if (getResourceAmount(material.type) < material.amount) {
            return false;
        }
    }
    return true;
}

function craftItem(recipe) {
    if (!checkCraftMaterials(recipe)) {
        showNotification('❌ Недостаточно материалов!', 'error');
        return;
    }

    // Вычитаем материалы
    recipe.materials.forEach(mat => {
        subtractResource(mat.type, mat.amount);
    });

    // Выполняем действие крафта
    recipe.craft();

    // Обновляем отображение
    updateCraftResourcesDisplay();
    updateCraftDisplay('all'); // Или текущую категорию
}

// Вспомогательные функции для ресурсов
function getResourceAmount(type) {
    switch(type) {
        case 'wood': return wood;
        case 'coins': return coins;
        case 'cloth': return cloth || 0;
        case 'herbs': return herbs || 0;
        case 'nails': return nails || 0;
        case 'string': return string || 0;
        case 'bottle': return bottle || 0;
        default: return 0;
    }
}

function getResourceIcon(type) {
    switch(type) {
        case 'wood': return '🪵';
        case 'coins': return '💰';
        case 'cloth': return '🧵';
        case 'herbs': return '🌿';
        case 'nails': return '📌';
        case 'string': return '🧶';
        case 'bottle': return '🍾';
        default: return '📦';
    }
}

function subtractResource(type, amount) {
    switch(type) {
        case 'wood': wood -= amount; updateWoodDisplay(); break;
        case 'coins': coins -= amount; updateCoinsDisplay(); break;
        case 'cloth': cloth -= amount; break;
        case 'herbs': herbs -= amount; break;
        case 'nails': nails -= amount; break;
        case 'string': string -= amount; break;
        case 'bottle': bottle -= amount; break;
    }
}

// Инициализация обработчиков событий
function initCraftSystem() {
    console.log('🛠️ Инициализация системы крафта');

    // Обработчик клавиши C
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'c' && !isTyping) {
            openCraftMenu();
        }
    });

    // Обработчики для кнопок меню крафта
    const openCraftBtn = document.getElementById('openCraftBtn');
    const closeCraftBtn = document.getElementById('closeCraftBtn');

    if (openCraftBtn) {
        openCraftBtn.addEventListener('click', openCraftMenu);
    }

    if (closeCraftBtn) {
        closeCraftBtn.addEventListener('click', closeCraftMenu);
    }

    // Обработчики для вкладок
    document.querySelectorAll('.craftTab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.craftTab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateCraftDisplay(tab.dataset.category);
        });
    });

    console.log('✅ Система крафта инициализирована');
}

// Добавляем функцию в глобальную область видимости
window.openCraftMenu = openCraftMenu;
window.closeCraftMenu = closeCraftMenu;
window.updateCraftDisplay = updateCraftDisplay;