import { createComparison, defaultRules } from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // --- #4.1 Заполняем select актуальными опциями ---
    Object.keys(indexes).forEach((elementName) => {
        const element = elements[elementName];
        element.append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    // Возвращаем функцию фильтрации
    return (data, state, action) => {
        // --- #4.2 Очистка полей ---
        if (action?.name === 'clear') {
            const field = action.dataset.field; 
            const input = action.parentElement.querySelector('input');
            if (input) input.value = '';
            state[field] = '';  // сброс значения в state
        }

        // --- #4.3 Создаём компаратор ---
        const compare = createComparison(defaultRules);

        

        // --- #4.5 Фильтруем данные ---
        return data.filter(row => {
            const filteredState = { ...state };
            if (filteredState.from) filteredState.from = Number(filteredState.from);
            if (filteredState.to) filteredState.to = Number(filteredState.to);
            return compare(row, filteredState);
        });
    }
}
