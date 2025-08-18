import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from './components/pagination.js'; // импорт пагинации



// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    const rowsPerPage = parseInt(state.rowsPerPage);        // количество строк на страницу
    const page = parseInt(state.page ?? 1);                 // текущая страница

    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState();     // состояние полей из таблицы
    let result = [...data];         // копируем данные для последующей обработки
    result = applySearching(result, state, action); 
    result = applyFiltering(result, state, action);

    result = applySorting(result, state, action);
    
    // применение пагинации
    result = applyPagination(result, state, action);

    // рендер таблицы
    sampleTable.render(result);
}

// инициализация таблицы с пагинацией
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']   // подключаем шаблон пагинации
}, render);

import { initSearching } from './components/searching.js';
const applySearching = initSearching(
    sampleTable.search.elements.search, // элемент поиска (имя из шаблона search)
    'search' // имя поля в state (оно должно совпадать с атрибутом name у input)
);


import { initSorting } from './components/sorting.js';
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

import { initFiltering } from './components/filtering.js';
const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers   // передаём массив продавцов
});

// инициализация модуля пагинации
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {        // колбэк для настройки кнопки страницы
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
