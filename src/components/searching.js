import { createComparison, rules } from "../lib/compare.js";

export function initSearching(searchElement, searchField) {
    // создаём компаратор только для поиска
    const compare = createComparison([
        rules.skipEmptyTargetValues,
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    ]);

    return (data, state, action) => {
        // если есть действие поиска (например, ввод или кнопка)
        const searchValue = state[searchField] || '';
        if (!searchValue) return data; // ничего не фильтруем, если пусто

        return data.filter(row => compare(row, state));
    }
}
