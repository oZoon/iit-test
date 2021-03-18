'use strict';

(function () {
    const data = [];
    const NUM_ROWS = 5;
    const ID_LENGTH = 10;
    const startDate = 1614240400;
    let filteredData;
    const maskPhone = '+7 (___) ___-__-__';


    const filter = {
        phone: '',
        dateMin: '',
        dateMax: '',
    }
    let newPartial = {
        name: '',
        text: '',
        phone: '',
    }
    let editPartial = {
        date: '',
        name: '',
        text: '',
        phone: '',
    }
    let filterPartial = {
        dateMin: '',
        dateMax: '',
        phone: '',
    }

    // вспомогательные функции
    const formatPhone = value => `+7 (${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 8)}-${value.slice(8, 10)}`;
    const randomId = length => {
        const allowSymbols = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'.split('');
        return Array(length).fill('').map(() => allowSymbols[(Math.floor(Math.random() * allowSymbols.length))]).join('');
    }
    const leadingZero = n => {
        return n < 10 ? '0' + n : n;
    }
    const timestampToDate = timestamp => {
        const timeDate = new Date(timestamp * 1000);
        const day = leadingZero(timeDate.getDate());
        const month = leadingZero(timeDate.getMonth() + 1);
        const year = timeDate.getFullYear();
        const hour = leadingZero(timeDate.getHours());
        const minutes = leadingZero(timeDate.getMinutes());
        return `${day}.${month}.${year} ${hour}:${minutes}`;
        // return day + '.' + month + '.' + year;
    }
    const dateToTimestamp = (date, type = null) => {
        // date = 31.12.2021 23:47
        const my = date.trim().split(' ');
        const myDate = my[0] ? my[0].split('.') : [1, 1, 1970];
        const myTime = my[1] && my[1].includes(':') ? my[1].split(':') : [0, 0];
        const newDate = new Date(myDate[2], myDate[1] - 1, myDate[0], myTime[0], myTime[1]);
        const resDate = +new Date(myDate[2], myDate[1] - 1, myDate[0], myTime[0], myTime[1]);
        const day = leadingZero(newDate.getDate());
        const month = leadingZero(newDate.getMonth() + 1);
        const year = newDate.getFullYear();
        const hour = leadingZero(newDate.getHours());
        const minutes = leadingZero(newDate.getMinutes());
        return type && type == 'filter' ? [`${day}.${month}.${year}`, resDate] : [`${day}.${month}.${year} ${hour}:${minutes}`, resDate];
    }
    const checkYear = date => {
        const my = date.split(' ');
        const myDate = my[0] ? my[0].split('.') : [1, 1, 1970];
        const newDate = new Date(myDate[2], myDate[1] - 1, myDate[0]);
        return newDate.getFullYear() > 1000;
    }
    const useFilter = () => {
        let result = JSON.parse(JSON.stringify(data));
        if (filter.phone) {
            result = result.filter(item => item.phone == filter.phone);
        }
        if (filter.dateMin) {
            result = result.filter(item => item.date > dateToTimestamp(filter.dateMin, 'filter')[1] / 1000);
        }
        if (filter.dateMax) {
            result = result.filter(item => item.date < dateToTimestamp(filter.dateMax, 'filter')[1] / 1000);
        }
        return result;
    }


    // компоненты
    const inputComponent = props => {
        return `<input
            class="${props.className} js-${props.className} js-to-remove"
            type="text"
            value="${props.value}"
            onkeyup="onChangeInput('js-${props.className}', this.value)"
            "autoComplete="off"
            />`
    }
    const buttonComponent = props => {
        return `<button
            class="${props.className} js-${props.className} js-to-remove"
            onclick="onBtnClick('js-${props.className}')"
                >
                ${props.innerText}
                </button>`;
    }
    const textComponent = props => {
        return `<span class="${props.className} js-to-remove">${props.innerText}</span>`;
    }
    const textareaComponent = props => {
        return `<textarea
            class="${props.className} js-${props.className} js-to-remove"
            onkeyup="onChangeInput('js-${props.className}', this.value)"
            >${props.value}</textarea>`;
    }


    // добавление элемента родителю
    const addElement = (elem, target) => {
        target.insertAdjacentHTML('beforeend', elem);
    }


    // сокрытие модального окна
    const hideModal = modals => {
        modals.forEach(item => {
            document.querySelector(item).style.display = 'none';
        })
    }

    const sortData = () => {
        data.sort((a, b) => {
            if (a.date > b.date) {
                return 1;
            }
            if (a.date < b.date) {
                return -1;
            }
            return 0;
        })
    }

    const initRow = (type, data = null) => {
        const result = {};
        COLUMNS.forEach(item => {
            switch (item.type) {
                case 'date':
                    if (type == 'new') {
                        result[item.colName] = parseInt(+Date.now() / 1000);
                    }
                    if (type == 'init') {
                        result[item.colName] = +new Date(startDate + parseInt(Math.random() * 86400 * 6));
                    }
                    // // result[item.colName] = i == 0 ? startDate : +new Date(startDate + parseInt(Math.random() * 86400 * 6));
                    // result[item.colName] = type == 'init' ?
                    //     +new Date(startDate + parseInt(Math.random() * 86400 * 6)) :
                    //     Date.now();
                    break;
                case 'string':
                    if (type == 'new') {
                        result[item.colName] = data[item.colName];
                    }
                    if (type == 'init') {
                        const index = parseInt(Math.random() * todo.length);
                        result[item.colName] = item.colName == 'name' ?
                            todo[index] :
                            tasks[index][parseInt(Math.random() * tasks[index].length)]
                    }
                    break;
                case 'phone':
                    if (type == 'new') {
                        result[item.colName] = data[item.colName];
                    }
                    if (type == 'init') {
                        result[item.colName] = `9${Array(9).fill('').map(() => parseInt(Math.random() * 10)).join('')}`;
                    }
                    break;
                case 'id':
                    result[item.colName] = randomId(ID_LENGTH);
                    break;
            }
        });
        return result;
    }

    // инициализация первичных данных
    const initData = () => {
        for (let i = 0; i < NUM_ROWS; i++) {
            data.push(initRow('init'));
        }
        sortData();
    }

    const saveNewRecord = () => {
        data.push(initRow('new', newPartial));
        sortData();
        filteredData = useFilter();
        removeChildren(document.querySelectorAll('.js-to-remove'));
        showRows();
        hideModal(['.js-add-modal']);
    }
    const cancelNewRecord = () => {
        newPartial = {}
        sortData();
        filteredData = useFilter();
        removeChildren(document.querySelectorAll('.js-to-remove'));
        showRows();
        hideModal(['.js-add-modal']);
    }
    const closeNewRecord = () => {
        newPartial = {}
        sortData();
        filteredData = useFilter();
        removeChildren(document.querySelectorAll('.js-to-remove'));
        showRows();
        hideModal(['.js-add-modal']);
    }

    const saveEditRecord = () => {
        editPartial.date = parseInt(dateToTimestamp(editPartial.date)[1] / 1000);
        data[data.findIndex(item => item.actions == editPartial.actions)] = editPartial;
        sortData();
        filteredData = useFilter();
        removeChildren(document.querySelectorAll('.js-to-remove'));
        showRows();
        hideModal(['.js-edit-modal']);
    }
    const cancelEditRecord = () => {
        editPartial = {};
        sortData();
        filteredData = useFilter();
        removeChildren(document.querySelectorAll('.js-to-remove'));
        showRows();
        hideModal(['.js-edit-modal']);
    }
    const closeEditRecord = () => {
        editPartial = {};
        sortData();
        filteredData = useFilter();
        removeChildren(document.querySelectorAll('.js-to-remove'));
        showRows();
        hideModal(['.js-edit-modal']);
    }

    const findFilterRecords = () => {
        filter.phone = filterPartial.phone;
        filter.dateMin = filterPartial.dateMin.trim();
        filter.dateMax = filterPartial.dateMax.trim();
        filteredData = useFilter();
        removeChildren(document.querySelectorAll('.js-to-remove'));
        showRows();
        hideModal(['.js-filter-modal']);
    }
    const dropFilterRecords = () => {
        filter.phone = '';
        filter.dateMin = '';
        filter.dateMax = '';
        filteredData = useFilter();
        removeChildren(document.querySelectorAll('.js-to-remove'));
        showRows();
        hideModal(['.js-filter-modal']);
    }
    const closeFilterRecords = () => {
        removeChildren(document.querySelectorAll('.js-to-remove'));
        showRows();
        hideModal(['.js-filter-modal']);
    }
    // подготовка строки к публикации
    const initTableRow = (i, filteredData) => {
        return `<tr class="row-data js-to-remove">${COLUMNS.map(item => {
            let value;
            switch (item.colName) {
                case 'date':
                    value = timestampToDate(filteredData[i][item.colName]);
                    break
                case 'actions':
                    value = `<span class="edit" onClick="onEditRecord('${filteredData[i][item.colName]}')">редактировать</span> | <span class="delete" onClick="onDeleteRecord('${filteredData[i][item.colName]}')">удалить</span>`;
                    break;
                case 'phone':
                    value = formatPhone(filteredData[i][item.colName]);
                    break;
                case 'name':
                    value = filteredData[i][item.colName];
                    break;
                case 'text':
                    value = filteredData[i][item.colName];
                    break;
                case 'order':
                    value = i + 1;
                    break;
            }
            return `<td>${value}</td>`;
        }).join('')}</tr>`;
    }

    const removeChildren = collection => {
        for (let item of collection) {
            item.remove();
        }
    }

    const showHead = () => {
        document.querySelector('.js-thead').insertAdjacentHTML('afterbegin', `<tr>${COLUMNS.map(item => `<td class="head-${item.colName}">${item.name}</td>`).join('')}</tr>`);
    }

    const showRows = () => {
        for (let i = 0; i < filteredData.length; i++) {
            document.querySelector('.js-tbody').insertAdjacentHTML('beforeend', initTableRow(i, filteredData));
        }
    }
    // публикация таблицы
    const showTable = () => {
        showHead();
        filteredData = useFilter();
        removeChildren(document.querySelectorAll('.js-to-remove'));
        showRows();
    }


    // событии: нажатие на кнопку
    window.onBtnClick = className => {
        // модалка новой записи
        switch (className) {
            case 'js-btn-new-save': saveNewRecord(); break;
            case 'js-btn-new-cancel': cancelNewRecord(); break;
            case 'js-btn-new-close': closeNewRecord(); break;

            case 'js-btn-edit-save': saveEditRecord(); break;
            case 'js-btn-edit-cancel': cancelEditRecord(); break;
            case 'js-btn-edit-close': closeEditRecord(); break;

            case 'js-btn-filter-find': findFilterRecords(); break;
            case 'js-btn-filter-drop': dropFilterRecords(); break;
            case 'js-btn-filter-close': closeFilterRecords(); break;

        }
    }

    const checkData = (obj, type = null) => {
        // console.log(obj);
        const result = [true, true, true, true, true, true];
        const array = Object.keys(obj);
        for (let i = 0; i < array.length; i++) {
            switch (array[i]) {
                case 'date': result[0] = obj[array[i]] == dateToTimestamp(obj[array[i]])[0] && checkYear(obj[array[i]]); break;
                case 'name': result[1] = Boolean(obj[array[i]].length); break;
                case 'text': result[2] = Boolean(obj[array[i]].length); break;
                case 'phone':
                    if (type && type == 'filter') {
                        result[3] = obj[array[i]].length == 10 || obj[array[i]].length == 0;
                    } else {
                        result[3] = obj[array[i]].length == 10;
                    }
                    break;
                case 'dateMin': result[4] = (obj[array[i]].trim() == dateToTimestamp(obj[array[i]], 'filter')[0] || obj[array[i]].trim().length == 0) && checkYear(obj[array[i]]); break;
                case 'dateMax': result[5] = (obj[array[i]].trim() == dateToTimestamp(obj[array[i]], 'filter')[0] || obj[array[i]].trim().length == 0) && checkYear(obj[array[i]]); break;
            }
            // console.log(result);
            if (result.includes(false)) {
                return false;
            }
        }
        return true;
    }

    // модалка новой записи
    const newChangeData = (className, data) => {
        switch (className) {
            case 'js-input-new-name':
                newPartial.name = data;
                break;
            case 'js-textarea-new-text':
                newPartial.text = data;
                break;
            case 'js-input-new-phone':
                newPartial.phone = data.replaceAll(/[^0-9]+/g, '').substring(1);
                break;
        }
        if (checkData(newPartial)) {
            document.querySelector('.js-btn-new-save').disabled = false; // включение
            // .content__create-todo__button[disabled] {
            //     cursor: not-allowed;
            //     opacity: .5;
            // }
        } else {
            document.querySelector('.js-btn-new-save').disabled = true; // выключение
        }
    }

    // модалка редактирования
    const editChangeData = (className, data) => {
        switch (className) {
            case 'js-input-edit-date':
                editPartial.date = data;
                break;
            case 'js-input-edit-name':
                editPartial.name = data;
                break;
            case 'js-input-edit-text':
                editPartial.text = data;
                break;
            case 'js-input-edit-phone':
                editPartial.phone = data.replaceAll(/[^0-9]+/g, '').substring(1);
                break;
        }
        if (checkData(editPartial)) {
            document.querySelector('.js-btn-edit-save').disabled = false; // включение
        } else {
            document.querySelector('.js-btn-edit-save').disabled = true; // выключение
        }
    }

    // модалка фильтров
    const filterChangeData = (className, data) => {
        switch (className) {
            case 'js-input-filter-date-min':
                filterPartial.dateMin = data;
                break;
            case 'js-input-filter-date-max':
                filterPartial.dateMax = data;
                break;
            case 'js-input-filter-phone':
                filterPartial.phone = data.replaceAll(/[^0-9]+/g, '').substring(1);
                break;
        }
        if (checkData(filterPartial, 'filter')) {
            document.querySelector('.js-btn-filter-find').disabled = false; // включение
        } else {
            document.querySelector('.js-btn-filter-find').disabled = true; // выключение
        }
    }

    // событие: изменение содержимого поля ввода
    window.onChangeInput = (className, data) => {
        const modalType = className.split('-');
        if (modalType.includes('new')) {
            newChangeData(className, data);
        }
        if (modalType.includes('edit')) {
            editChangeData(className, data);
        }
        if (modalType.includes('filter')) {
            filterChangeData(className, data);
        }
    }


    // инициализация и публикация таблицы
    window.initTable = () => {
        hideModal(['.js-add-modal', '.js-filter-modal', '.js-edit-modal']);
        initData();
        showTable();
    }

    // событие редактирование - публикация модалки редактирования
    window.onEditRecord = id => {
        editPartial = JSON.parse(JSON.stringify(data.find(item => item.actions == id)));
        const elem = document.querySelector('.js-edit-modal');
        addElement(inputComponent({
            className: 'input-edit-date',
            value: timestampToDate(editPartial.date),
        }), elem);
        addElement(inputComponent({
            className: 'input-edit-name',
            value: editPartial.name,
        }), elem);
        addElement(textareaComponent({
            className: 'textarea-edit-text',
            value: editPartial.text,
        }), elem);
        addElement(inputComponent({
            className: 'input-edit-phone',
            value: formatPhone(editPartial.phone),
        }), elem);
        editPartial.date = timestampToDate(editPartial.date);
        addElement(buttonComponent({
            className: 'btn-edit-save',
            innerText: 'СОХРАНИТЬ',
        }), elem);
        addElement(buttonComponent({
            className: 'btn-edit-cancel',
            innerText: 'ОТМЕНА',
        }), elem);
        addElement(buttonComponent({
            className: 'btn-edit-close',
            innerText: 'X',
        }), elem);

        addElement(textComponent({
            className: 'text-edit-date',
            innerText: 'дата создания',
        }), elem);
        addElement(textComponent({
            className: 'text-edit-name',
            innerText: 'название заявки',
        }), elem);
        addElement(textComponent({
            className: 'text-edit-text',
            innerText: 'текст заявки',
        }), elem);
        addElement(textComponent({
            className: 'text-edit-phone',
            innerText: 'телефон',
        }), elem);
        elem.style.display = 'block';
        window.maskPhone('.js-input-edit-phone', maskPhone);
        window.maskDateTime('.js-input-edit-date');
    }

    // событие удаления - простое удаление из данных
    window.onDeleteRecord = id => {
        data.splice(data.findIndex(item => item.actions == id), 1);
        sortData();
        filteredData = useFilter();
        removeChildren(document.querySelectorAll('.js-to-remove'));
        showRows();
    }


    // событие новой записи - публикация модалки новой записи
    window.onNewRecord = () => {
        const elem = document.querySelector('.js-add-modal');
        addElement(textComponent({
            className: 'text-new-title',
            innerText: 'добавление новой записи',
        }), elem);
        addElement(textComponent({
            className: 'text-new-name',
            innerText: 'название заявки',
        }), elem);
        addElement(textComponent({
            className: 'text-new-text',
            innerText: 'текст заявки',
        }), elem);
        addElement(textComponent({
            className: 'text-new-phone',
            innerText: 'номер телефона',
        }), elem);

        addElement(inputComponent({
            className: 'input-new-name',
            value: '',
        }), elem);
        addElement(textareaComponent({
            className: 'textarea-new-text',
            value: '',
        }), elem);
        addElement(inputComponent({
            className: 'input-new-phone',
            value: '',
        }), elem);

        addElement(buttonComponent({
            className: 'btn-new-save',
            innerText: 'СОХРАНИТЬ',
        }), elem);
        addElement(buttonComponent({
            className: 'btn-new-cancel',
            innerText: 'ОТМЕНА',
        }), elem);
        addElement(buttonComponent({
            className: 'btn-new-close',
            innerText: 'X',
        }), elem);
        document.querySelector('.js-btn-new-save').disabled = true; // выключение
        window.maskPhone('.js-input-new-phone', maskPhone);
        elem.style.display = 'block';
    }


    // событие фильтрации - публикация модалки фильтра
    window.onFilterRecords = () => {
        const elem = document.querySelector('.js-filter-modal');
        filterPartial = JSON.parse(JSON.stringify(filter));
        addElement(textComponent({
            className: 'text-filter-title',
            innerText: 'фильтры',
        }), elem);
        addElement(textComponent({
            className: 'text-filter-phone',
            innerText: 'номер телефона',
        }), elem);
        addElement(textComponent({
            className: 'text-filter-date',
            innerText: 'дата создания заявки',
        }), elem);
        addElement(textComponent({
            className: 'text-filter-date-from',
            innerText: 'от',
        }), elem);
        addElement(textComponent({
            className: 'text-filter-date-to',
            innerText: 'до',
        }), elem);
        editPartial.date = timestampToDate(editPartial.date);

        addElement(inputComponent({
            className: 'input-filter-date-min',
            value: filterPartial.dateMin ? filterPartial.dateMin : '',
        }), elem);
        addElement(inputComponent({
            className: 'input-filter-date-max',
            value: filterPartial.dateMax ? filterPartial.dateMax : '',
        }), elem);
        addElement(inputComponent({
            className: 'input-filter-phone',
            value: filterPartial.phone ? filterPartial.phone : '',
        }), elem);

        addElement(buttonComponent({
            className: 'btn-filter-find',
            innerText: 'НАЙТИ',
        }), elem);
        addElement(buttonComponent({
            className: 'btn-filter-drop',
            innerText: 'СБРОСИТЬ',
        }), elem);
        addElement(buttonComponent({
            className: 'btn-filter-close',
            innerText: 'X',
        }), elem);
        elem.style.display = 'block';
        window.maskPhone('.js-input-filter-phone', maskPhone);
        window.maskDateTime('.js-input-filter-date-min');
        window.maskDateTime('.js-input-filter-date-max');
    }

})();

initTable();
