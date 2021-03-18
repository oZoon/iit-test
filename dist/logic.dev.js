'use strict';

(function () {
  var data = [];
  var NUM_ROWS = 5;
  var ID_LENGTH = 10;
  var startDate = 1614240400;
  var filteredData;
  var maskPhone = '+7 (___) ___-__-__';
  var filter = {
    phone: '',
    dateMin: '',
    dateMax: ''
  };
  var newPartial = {
    name: '',
    text: '',
    phone: ''
  };
  var editPartial = {
    date: '',
    name: '',
    text: '',
    phone: ''
  };
  var filterPartial = {
    dateMin: '',
    dateMax: '',
    phone: ''
  }; // вспомогательные функции

  var formatPhone = function formatPhone(value) {
    return "+7 (".concat(value.slice(0, 3), ") ").concat(value.slice(3, 6), "-").concat(value.slice(6, 8), "-").concat(value.slice(8, 10));
  };

  var randomId = function randomId(length) {
    var allowSymbols = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'.split('');
    return Array(length).fill('').map(function () {
      return allowSymbols[Math.floor(Math.random() * allowSymbols.length)];
    }).join('');
  };

  var leadingZero = function leadingZero(n) {
    return n < 10 ? '0' + n : n;
  };

  var timestampToDate = function timestampToDate(timestamp) {
    var timeDate = new Date(timestamp * 1000);
    var day = leadingZero(timeDate.getDate());
    var month = leadingZero(timeDate.getMonth() + 1);
    var year = timeDate.getFullYear();
    var hour = leadingZero(timeDate.getHours());
    var minutes = leadingZero(timeDate.getMinutes());
    return "".concat(day, ".").concat(month, ".").concat(year, " ").concat(hour, ":").concat(minutes); // return day + '.' + month + '.' + year;
  };

  var dateToTimestamp = function dateToTimestamp(date) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    // date = 31.12.2021 23:47
    var my = date.trim().split(' ');
    var myDate = my[0] ? my[0].split('.') : [1, 1, 1970];
    var myTime = my[1] && my[1].includes(':') ? my[1].split(':') : [0, 0];
    var newDate = new Date(myDate[2], myDate[1] - 1, myDate[0], myTime[0], myTime[1]);
    var resDate = +new Date(myDate[2], myDate[1] - 1, myDate[0], myTime[0], myTime[1]);
    var day = leadingZero(newDate.getDate());
    var month = leadingZero(newDate.getMonth() + 1);
    var year = newDate.getFullYear();
    var hour = leadingZero(newDate.getHours());
    var minutes = leadingZero(newDate.getMinutes());
    return type && type == 'filter' ? ["".concat(day, ".").concat(month, ".").concat(year), resDate] : ["".concat(day, ".").concat(month, ".").concat(year, " ").concat(hour, ":").concat(minutes), resDate];
  };

  var checkYear = function checkYear(date) {
    var my = date.split(' ');
    var myDate = my[0] ? my[0].split('.') : [1, 1, 1970];
    var newDate = new Date(myDate[2], myDate[1] - 1, myDate[0]);
    return newDate.getFullYear() > 1000;
  };

  var useFilter = function useFilter() {
    var result = JSON.parse(JSON.stringify(data));

    if (filter.phone) {
      result = result.filter(function (item) {
        return item.phone == filter.phone;
      });
    }

    if (filter.dateMin) {
      result = result.filter(function (item) {
        return item.date > dateToTimestamp(filter.dateMin, 'filter')[1] / 1000;
      });
    }

    if (filter.dateMax) {
      result = result.filter(function (item) {
        return item.date < dateToTimestamp(filter.dateMax, 'filter')[1] / 1000;
      });
    }

    return result;
  }; // компоненты


  var inputComponent = function inputComponent(props) {
    return "<input\n            class=\"".concat(props.className, " js-").concat(props.className, " js-to-remove\"\n            type=\"text\"\n            value=\"").concat(props.value, "\"\n            onkeyup=\"onChangeInput('js-").concat(props.className, "', this.value)\"\n            \"autoComplete=\"off\"\n            />");
  };

  var buttonComponent = function buttonComponent(props) {
    return "<button\n            class=\"".concat(props.className, " js-").concat(props.className, " js-to-remove\"\n            onclick=\"onBtnClick('js-").concat(props.className, "')\"\n                >\n                ").concat(props.innerText, "\n                </button>");
  };

  var textComponent = function textComponent(props) {
    return "<span class=\"".concat(props.className, " js-to-remove\">").concat(props.innerText, "</span>");
  };

  var textareaComponent = function textareaComponent(props) {
    return "<textarea\n            class=\"".concat(props.className, " js-").concat(props.className, " js-to-remove\"\n            onkeyup=\"onChangeInput('js-").concat(props.className, "', this.value)\"\n            >").concat(props.value, "</textarea>");
  }; // добавление элемента родителю


  var addElement = function addElement(elem, target) {
    target.insertAdjacentHTML('beforeend', elem);
  }; // сокрытие модального окна


  var hideModal = function hideModal(modals) {
    modals.forEach(function (item) {
      document.querySelector(item).style.display = 'none';
    });
  };

  var sortData = function sortData() {
    data.sort(function (a, b) {
      if (a.date > b.date) {
        return 1;
      }

      if (a.date < b.date) {
        return -1;
      }

      return 0;
    });
  };

  var initRow = function initRow(type) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var result = {};
    COLUMNS.forEach(function (item) {
      switch (item.type) {
        case 'date':
          if (type == 'new') {
            result[item.colName] = parseInt(+Date.now() / 1000);
          }

          if (type == 'init') {
            result[item.colName] = +new Date(startDate + parseInt(Math.random() * 86400 * 6));
          } // // result[item.colName] = i == 0 ? startDate : +new Date(startDate + parseInt(Math.random() * 86400 * 6));
          // result[item.colName] = type == 'init' ?
          //     +new Date(startDate + parseInt(Math.random() * 86400 * 6)) :
          //     Date.now();


          break;

        case 'string':
          if (type == 'new') {
            result[item.colName] = data[item.colName];
          }

          if (type == 'init') {
            var index = parseInt(Math.random() * todo.length);
            result[item.colName] = item.colName == 'name' ? todo[index] : tasks[index][parseInt(Math.random() * tasks[index].length)];
          }

          break;

        case 'phone':
          if (type == 'new') {
            result[item.colName] = data[item.colName];
          }

          if (type == 'init') {
            result[item.colName] = "9".concat(Array(9).fill('').map(function () {
              return parseInt(Math.random() * 10);
            }).join(''));
          }

          break;

        case 'id':
          result[item.colName] = randomId(ID_LENGTH);
          break;
      }
    });
    return result;
  }; // инициализация первичных данных


  var initData = function initData() {
    for (var i = 0; i < NUM_ROWS; i++) {
      data.push(initRow('init'));
    }

    sortData();
  };

  var saveNewRecord = function saveNewRecord() {
    data.push(initRow('new', newPartial));
    sortData();
    filteredData = useFilter();
    removeChildren(document.querySelectorAll('.js-to-remove'));
    showRows();
    hideModal(['.js-add-modal']);
  };

  var cancelNewRecord = function cancelNewRecord() {
    newPartial = {};
    sortData();
    filteredData = useFilter();
    removeChildren(document.querySelectorAll('.js-to-remove'));
    showRows();
    hideModal(['.js-add-modal']);
  };

  var closeNewRecord = function closeNewRecord() {
    newPartial = {};
    sortData();
    filteredData = useFilter();
    removeChildren(document.querySelectorAll('.js-to-remove'));
    showRows();
    hideModal(['.js-add-modal']);
  };

  var saveEditRecord = function saveEditRecord() {
    editPartial.date = parseInt(dateToTimestamp(editPartial.date)[1] / 1000);
    data[data.findIndex(function (item) {
      return item.actions == editPartial.actions;
    })] = editPartial;
    sortData();
    filteredData = useFilter();
    removeChildren(document.querySelectorAll('.js-to-remove'));
    showRows();
    hideModal(['.js-edit-modal']);
  };

  var cancelEditRecord = function cancelEditRecord() {
    editPartial = {};
    sortData();
    filteredData = useFilter();
    removeChildren(document.querySelectorAll('.js-to-remove'));
    showRows();
    hideModal(['.js-edit-modal']);
  };

  var closeEditRecord = function closeEditRecord() {
    editPartial = {};
    sortData();
    filteredData = useFilter();
    removeChildren(document.querySelectorAll('.js-to-remove'));
    showRows();
    hideModal(['.js-edit-modal']);
  };

  var findFilterRecords = function findFilterRecords() {
    filter.phone = filterPartial.phone;
    filter.dateMin = filterPartial.dateMin.trim();
    filter.dateMax = filterPartial.dateMax.trim();
    filteredData = useFilter();
    removeChildren(document.querySelectorAll('.js-to-remove'));
    showRows();
    hideModal(['.js-filter-modal']);
  };

  var dropFilterRecords = function dropFilterRecords() {
    filter.phone = '';
    filter.dateMin = '';
    filter.dateMax = '';
    filteredData = useFilter();
    removeChildren(document.querySelectorAll('.js-to-remove'));
    showRows();
    hideModal(['.js-filter-modal']);
  };

  var closeFilterRecords = function closeFilterRecords() {
    removeChildren(document.querySelectorAll('.js-to-remove'));
    showRows();
    hideModal(['.js-filter-modal']);
  }; // подготовка строки к публикации


  var initTableRow = function initTableRow(i, filteredData) {
    return "<tr class=\"row-data js-to-remove\">".concat(COLUMNS.map(function (item) {
      var value;

      switch (item.colName) {
        case 'date':
          value = timestampToDate(filteredData[i][item.colName]);
          break;

        case 'actions':
          value = "<span class=\"edit\" onClick=\"onEditRecord('".concat(filteredData[i][item.colName], "')\">\u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C</span> | <span class=\"delete\" onClick=\"onDeleteRecord('").concat(filteredData[i][item.colName], "')\">\u0443\u0434\u0430\u043B\u0438\u0442\u044C</span>");
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

      return "<td>".concat(value, "</td>");
    }).join(''), "</tr>");
  };

  var removeChildren = function removeChildren(collection) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = collection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        item.remove();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };

  var showHead = function showHead() {
    document.querySelector('.js-thead').insertAdjacentHTML('afterbegin', "<tr>".concat(COLUMNS.map(function (item) {
      return "<td class=\"head-".concat(item.colName, "\">").concat(item.name, "</td>");
    }).join(''), "</tr>"));
  };

  var showRows = function showRows() {
    for (var i = 0; i < filteredData.length; i++) {
      document.querySelector('.js-tbody').insertAdjacentHTML('beforeend', initTableRow(i, filteredData));
    }
  }; // публикация таблицы


  var showTable = function showTable() {
    showHead();
    filteredData = useFilter();
    removeChildren(document.querySelectorAll('.js-to-remove'));
    showRows();
  }; // событии: нажатие на кнопку


  window.onBtnClick = function (className) {
    // модалка новой записи
    switch (className) {
      case 'js-btn-new-save':
        saveNewRecord();
        break;

      case 'js-btn-new-cancel':
        cancelNewRecord();
        break;

      case 'js-btn-new-close':
        closeNewRecord();
        break;

      case 'js-btn-edit-save':
        saveEditRecord();
        break;

      case 'js-btn-edit-cancel':
        cancelEditRecord();
        break;

      case 'js-btn-edit-close':
        closeEditRecord();
        break;

      case 'js-btn-filter-find':
        findFilterRecords();
        break;

      case 'js-btn-filter-drop':
        dropFilterRecords();
        break;

      case 'js-btn-filter-close':
        closeFilterRecords();
        break;
    }
  };

  var checkData = function checkData(obj) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    // console.log(obj);
    var result = [true, true, true, true, true, true];
    var array = Object.keys(obj);

    for (var i = 0; i < array.length; i++) {
      switch (array[i]) {
        case 'date':
          result[0] = obj[array[i]] == dateToTimestamp(obj[array[i]])[0] && checkYear(obj[array[i]]);
          break;

        case 'name':
          result[1] = Boolean(obj[array[i]].length);
          break;

        case 'text':
          result[2] = Boolean(obj[array[i]].length);
          break;

        case 'phone':
          if (type && type == 'filter') {
            result[3] = obj[array[i]].length == 10 || obj[array[i]].length == 0;
          } else {
            result[3] = obj[array[i]].length == 10;
          }

          break;

        case 'dateMin':
          result[4] = (obj[array[i]].trim() == dateToTimestamp(obj[array[i]], 'filter')[0] || obj[array[i]].trim().length == 0) && checkYear(obj[array[i]]);
          break;

        case 'dateMax':
          result[5] = (obj[array[i]].trim() == dateToTimestamp(obj[array[i]], 'filter')[0] || obj[array[i]].trim().length == 0) && checkYear(obj[array[i]]);
          break;
      } // console.log(result);


      if (result.includes(false)) {
        return false;
      }
    }

    return true;
  }; // модалка новой записи


  var newChangeData = function newChangeData(className, data) {
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
  }; // модалка редактирования


  var editChangeData = function editChangeData(className, data) {
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
  }; // модалка фильтров


  var filterChangeData = function filterChangeData(className, data) {
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
  }; // событие: изменение содержимого поля ввода


  window.onChangeInput = function (className, data) {
    var modalType = className.split('-');

    if (modalType.includes('new')) {
      newChangeData(className, data);
    }

    if (modalType.includes('edit')) {
      editChangeData(className, data);
    }

    if (modalType.includes('filter')) {
      filterChangeData(className, data);
    }
  }; // инициализация и публикация таблицы


  window.initTable = function () {
    hideModal(['.js-add-modal', '.js-filter-modal', '.js-edit-modal']);
    initData();
    showTable();
  }; // событие редактирование - публикация модалки редактирования


  window.onEditRecord = function (id) {
    editPartial = JSON.parse(JSON.stringify(data.find(function (item) {
      return item.actions == id;
    })));
    var elem = document.querySelector('.js-edit-modal');
    addElement(inputComponent({
      className: 'input-edit-date',
      value: timestampToDate(editPartial.date)
    }), elem);
    addElement(inputComponent({
      className: 'input-edit-name',
      value: editPartial.name
    }), elem);
    addElement(textareaComponent({
      className: 'textarea-edit-text',
      value: editPartial.text
    }), elem);
    addElement(inputComponent({
      className: 'input-edit-phone',
      value: formatPhone(editPartial.phone)
    }), elem);
    editPartial.date = timestampToDate(editPartial.date);
    addElement(buttonComponent({
      className: 'btn-edit-save',
      innerText: 'СОХРАНИТЬ'
    }), elem);
    addElement(buttonComponent({
      className: 'btn-edit-cancel',
      innerText: 'ОТМЕНА'
    }), elem);
    addElement(buttonComponent({
      className: 'btn-edit-close',
      innerText: 'X'
    }), elem);
    addElement(textComponent({
      className: 'text-edit-date',
      innerText: 'дата создания'
    }), elem);
    addElement(textComponent({
      className: 'text-edit-name',
      innerText: 'название заявки'
    }), elem);
    addElement(textComponent({
      className: 'text-edit-text',
      innerText: 'текст заявки'
    }), elem);
    addElement(textComponent({
      className: 'text-edit-phone',
      innerText: 'телефон'
    }), elem);
    elem.style.display = 'block';
    window.maskPhone('.js-input-edit-phone', maskPhone);
    window.maskDateTime('.js-input-edit-date');
  }; // событие удаления - простое удаление из данных


  window.onDeleteRecord = function (id) {
    data.splice(data.findIndex(function (item) {
      return item.actions == id;
    }), 1);
    sortData();
    filteredData = useFilter();
    removeChildren(document.querySelectorAll('.js-to-remove'));
    showRows();
  }; // событие новой записи - публикация модалки новой записи


  window.onNewRecord = function () {
    var elem = document.querySelector('.js-add-modal');
    addElement(textComponent({
      className: 'text-new-title',
      innerText: 'добавление новой записи'
    }), elem);
    addElement(textComponent({
      className: 'text-new-name',
      innerText: 'название заявки'
    }), elem);
    addElement(textComponent({
      className: 'text-new-text',
      innerText: 'текст заявки'
    }), elem);
    addElement(textComponent({
      className: 'text-new-phone',
      innerText: 'номер телефона'
    }), elem);
    addElement(inputComponent({
      className: 'input-new-name',
      value: ''
    }), elem);
    addElement(textareaComponent({
      className: 'textarea-new-text',
      value: ''
    }), elem);
    addElement(inputComponent({
      className: 'input-new-phone',
      value: ''
    }), elem);
    addElement(buttonComponent({
      className: 'btn-new-save',
      innerText: 'СОХРАНИТЬ'
    }), elem);
    addElement(buttonComponent({
      className: 'btn-new-cancel',
      innerText: 'ОТМЕНА'
    }), elem);
    addElement(buttonComponent({
      className: 'btn-new-close',
      innerText: 'X'
    }), elem);
    document.querySelector('.js-btn-new-save').disabled = true; // выключение

    window.maskPhone('.js-input-new-phone', maskPhone);
    elem.style.display = 'block';
  }; // событие фильтрации - публикация модалки фильтра


  window.onFilterRecords = function () {
    var elem = document.querySelector('.js-filter-modal');
    filterPartial = JSON.parse(JSON.stringify(filter));
    addElement(textComponent({
      className: 'text-filter-title',
      innerText: 'фильтры'
    }), elem);
    addElement(textComponent({
      className: 'text-filter-phone',
      innerText: 'номер телефона'
    }), elem);
    addElement(textComponent({
      className: 'text-filter-date',
      innerText: 'дата создания заявки'
    }), elem);
    addElement(textComponent({
      className: 'text-filter-date-from',
      innerText: 'от'
    }), elem);
    addElement(textComponent({
      className: 'text-filter-date-to',
      innerText: 'до'
    }), elem);
    editPartial.date = timestampToDate(editPartial.date);
    addElement(inputComponent({
      className: 'input-filter-date-min',
      value: filterPartial.dateMin ? filterPartial.dateMin : ''
    }), elem);
    addElement(inputComponent({
      className: 'input-filter-date-max',
      value: filterPartial.dateMax ? filterPartial.dateMax : ''
    }), elem);
    addElement(inputComponent({
      className: 'input-filter-phone',
      value: filterPartial.phone ? filterPartial.phone : ''
    }), elem);
    addElement(buttonComponent({
      className: 'btn-filter-find',
      innerText: 'НАЙТИ'
    }), elem);
    addElement(buttonComponent({
      className: 'btn-filter-drop',
      innerText: 'СБРОСИТЬ'
    }), elem);
    addElement(buttonComponent({
      className: 'btn-filter-close',
      innerText: 'X'
    }), elem);
    elem.style.display = 'block';
    window.maskPhone('.js-input-filter-phone', maskPhone);
    window.maskDateTime('.js-input-filter-date-min');
    window.maskDateTime('.js-input-filter-date-max');
  };
})();

initTable();