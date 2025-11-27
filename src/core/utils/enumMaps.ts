import {
    ServerControllersModelsEnumsEnumFlowers,
    ServerControllersModelsEnumsEnumFruit,
    ServerControllersModelsEnumsEnumReproduction,
    ServerControllersModelsEnumsEnumViability,
    ServerControllersModelsEnumsEnumLight,
    ServerControllersModelsEnumsEnumCondition
} from '../../api/generated/api';

export const flowerTypes: Record<ServerControllersModelsEnumsEnumFlowers, string> = {
    0: 'Обоеполый',
    1: 'Мужской',
    2: 'Женский',
    3: 'Актиноморфный',
    4: 'Зигоморфный',
    5: 'Цветок в соцветии-корзинке',
    6: 'Мотыльковый тип'
};

export const fruitTypes: Record<ServerControllersModelsEnumsEnumFruit, string> = {
    0: 'Ягода',
    1: 'Яблоко',
    2: 'Тыквина',
    3: 'Гесперидий',
    4: 'Костянка',
    5: 'Боб',
    6: 'Стручок',
    7: 'Коробочка',
    8: 'Орех',
    9: 'Зерновка',
    10: 'Семянка',
    11: 'Крылатка',
    12: 'Сборная костянка',
    13: 'Сборная семянка',
    14: 'Многокостянка',
    15: 'Ложная ягода',
    16: 'Разросшееся цветоложе',
    17: 'Соплодие',
    18: 'Стручковидный плод',
    19: 'Листовка'
};

export const reproductionTypes: Record<ServerControllersModelsEnumsEnumReproduction, string> = {
    0: 'Корневища',
    1: 'Клубни',
    2: 'Луковицы',
    3: 'Клубнелуковицы',
    4: 'Усы',
    5: 'Отводки',
    6: 'Листовые черенки',
    7: 'Придаточные почки на листьях',
    8: 'Черенкование',
    9: 'Деление куста',
    10: 'Прививка',
    11: 'Культура тканей'
};

export const viabilityTypes: Record<ServerControllersModelsEnumsEnumViability, string> = {
    0: 'Спящие',
    1: 'Поврежденные',
    2: 'Пересушенные',
    3: 'Плесневые/зараженные',
    4: 'Свежесобранные',
    5: 'Старые',
    6: 'Не определена'
};

export const lightRequirements: Record<ServerControllersModelsEnumsEnumLight, string> = {
    0: 'Полное отсутствие света',
    1: 'Очень слабое',
    2: 'Слабое',
    3: 'Умеренное',
    4: 'Яркое',
    5: 'Очень яркое',
    6: 'Прямой солнечный свет',
    7: 'Чередование света и темноты',
    8: 'Любое'
};

export const conditionTypes: Record<ServerControllersModelsEnumsEnumCondition, string> = {
    0: 'Здоровое',
    1: 'Грибковая инфекция',
    2: 'Бактериальное заболевание',
    3: 'Вирусная инфекция',
    4: 'Вредители',
    5: 'Дефицит питательных веществ',
    6: 'Физиологические нарушения',
    7: 'Повреждение морозом',
    8: 'Химическое повреждение',
    9: 'Стресс от засухи',
    10: 'Механические повреждения'
};

export const maturityOptions = [
    'Незрелое',
    'Полузрелое',
    'Зрелое',
    'Перезрелое',
    'Свежесобранное',
    'Высушенное',
    'Обработанное'
];

export const waterRequirementsOptions = [
    'Минимальный полив',
    'Умеренный полив',
    'Обильный полив',
    'Постоянная влажность',
    'Периодический полив',
    'Редкий полив',
    'Только при прорастании',
    'Без полива до прорастания'
];