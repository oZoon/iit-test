function maskPhone(selector, masked = '+7 (___) ___-__-__') {
    const elems = document.querySelectorAll(selector);

    function mask(event) {
        const keyCode = event.keyCode;
        const template = masked;
        const def = template.replace(/\D/g, "");
        const val = this.value.replace(/\D/g, "");
        // console.log(template);
        let i = 0;
        let newValue = template.replace(/[_\d]/g, function (a) {
            return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
        });
        i = newValue.indexOf("_");
        if (i !== -1) {
            newValue = newValue.slice(0, i);
        }
        let reg = template.substr(0, this.value.length).replace(/_+/g,
            function (a) {
                return "\\d{1," + a.length + "}";
            }).replace(/[+()]/g, "\\$&");
        reg = new RegExp("^" + reg + "$");
        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
            this.value = newValue;
        }
        if (event.type === "blur" && this.value.length < 5) {
            this.value = "";
        }
    }

    for (const elem of elems) {
        elem.addEventListener("input", mask);
        elem.addEventListener("focus", mask);
        elem.addEventListener("blur", mask);
    }

}

function maskDateTime(selector) {
    const elems = document.querySelectorAll(selector);
    const allow = '0123456789'.split('');
    const dateLength = [2, 2, 4, 2, 2];

    function mask(event) {
        const key = event.data;
        if (event.target.value.length < 16) {
            if (allow.includes(key) || key === null) {
                const value = event.target.value.replace(/[^0-9]/g, '');
                const date = [];
                date[0] = value.slice(0, 2);
                date[1] = value.slice(2, 4);
                date[2] = value.slice(4, 8);
                date[3] = value.slice(8, 10);
                date[4] = value.slice(10, 12);
                let d = date[0].length == dateLength[0] ? date[0] + '.' : date[0];
                d += date[1].length == dateLength[1] ? date[1] + '.' : date[1];
                d += date[2].length == dateLength[2] ? date[2] + ' ' : date[2];
                d += date[3].length == dateLength[3] ? date[3] + ':' : date[3];
                d += date[4];
                if(key === null && [2, 4, 8, 10].includes(value.length)){
                    d = d.substring(0, d.length - 1);
                }
                event.target.value = d;
            } else {
                event.target.value = event.target.value.substring(0, event.target.value.length - 1);
                event.preventDefault();
            }
        } else {
            event.target.value = event.target.value.substring(0, 16);
            event.preventDefault();
        }
    }

    for (const elem of elems) {
        elem.addEventListener("input", mask);
    }
};
