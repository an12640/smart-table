import { sortCollection, sortMap } from "../lib/sort.js";

/**
 * Инициализация сортировки для таблицы
 * @param {HTMLElement[]} columns — массив кнопок сортировки
 * @returns {function} — функция для применения сортировки к данным
 */
export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        // @todo: #3.1 — обработка клика по кнопке сортировки
        if (action && action.name === 'sort') {
            // Ротация значения кнопки через карту переходов
            action.dataset.value = sortMap[action.dataset.value];

            // Сохраняем поле и направление сортировки
            field = action.dataset.field;
            order = action.dataset.value;

            // @todo: #3.2 — сброс остальных кнопок
            columns.forEach(column => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            // @todo: #3.3 — определяем активную сортировку при перерисовке
            columns.forEach(column => {
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        // Применяем сортировку к данным
        return sortCollection(data, field, order);
    };
}
