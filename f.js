/** Функция для получения паарметров URI **/
var URLParameters = function(){ 
    var u = window.location.href; 
    u = u.split('#')[0]; 
    u = u.indexOf('?') > -1 ? u.split('?')[1] : ''; 
    u = u.indexOf('&') > -1 ? u.split('&') : [u]; 
    if(u instanceof Array && u.length){ 
        var parameters = {}; 
        for(var i in u){ 
            var x = u[i].split('='); 
            parameters[x[0]] = decodeURIComponent(x[1]); 
        } 
        return parameters; 
    } 
};
/** Вся магия с ионами тут **/ 
var IONES = {
    //Хранилище для ионов
    storage:[]
};
//Добавление ионов
IONES.add = function(){
    var arr = [];
    for(var i in arguments) arr.push(arguments[i]);
    //Просто кидаем в хранилище все аргументы (всю информацию о ионе)
    this.storage.push(arr);
}
//Получение иона по русскому названию
IONES.getByRus = function(rus){
    rus = rus.trim().toLocaleLowerCase();
    var data;
    //Просто проходим по хранилищу и смотрим, если название совпало - запоминаем данные иона
    for(var i = 0; i < this.storage.length && !data; ++i){
        var e = this.storage[i], m = rus.match(e[0]);
        if(m && m.index === 0 && m[0] === m.input){
            data = e;
        }
    }
    //Возвращаем данные иона
    return data;
}
//Уравнитель для двух ионов (самая главная вещь)
//На вход получаем два иона и степень окисления для иона с переменной степенью
IONES.equalify = function(ion1, ion2, degree){
    //Просто несколько переменных и функций
    var plus = 0, minus = 0, nod = function(a, b){
        if(a<b){
            var t = a;
            a = b;
            b = t;
        }
        if(a%b) return nod(a%b, b);
        return b;
    }, nok = function(a, b){
        return a*b / nod(a, b);
    }, iones = [ion1, ion2];
    //Если на вход получил два иона с переменной степенью, то такие обрабатывать не умеет и выходит
    if(!ion1[4] && !ion2[4]) return;
    //Проходит по ионам
    for(var i in iones){
        var e = iones[i];
        //Работа с указанной степенью
        if(!e[4] && degree){
            //Если степень недопустима, то выходит
            if(e[6].indexOf(degree) == -1) return false; 
            //Устанавливает данную в условии степень в данные об ионе
            e[2] = degree;
        }
        //Получает степень и кидает ее в нужный знак
        var z = e[2];
        if(z > 0) plus += z;
        else minus += z;
    }
    //Ищет НОК степеней двух ионов (как учила Людмила Николавна)
    var n = nok(plus, -1*minus);
    //Опять проходит по ионам и определеят индексы для них
    for(var i in iones){
        var e = iones[i], z = e[2];
        var z = Math.abs(e[2]);
        iones[i][3] = n / z;
    }
    //Обмен ионов при необходимости (на первом месте всегла ион с положительной степенью)
    if(iones[0][2] < 0){
        var t = iones[0];
        iones[0] = iones[1];
        iones[1] = t;
    }
    //Если не выполняется парвило по степеням окисления (их сумма равна нулю), то выходит, такого вещества нет
    if(iones[0][2]*iones[0][3] + iones[1][2]*iones[1][3] !== 0){
        return false;
    }
    //Возвращает пару ионов
    return iones;
}
//Инициализация (просто добавляет все ионы (в будущем кинуть в БД и делать это на сервере, а не на клиенте))
IONES.init = function(){
  //Вот структура хранилища для ионов
  //this.add(русский шаблон иона, форумула иона, степень окисления, 0, постоянная степень?[, 0, [варианты степени окисления](для непостоянных)])
    this.add('дигидрофосфат', 'H2PO4', -1, 0, true);
    this.add('гидрофосфат', 'HPO4', -2, 0, true);
    this.add('натри[й|я]', 'Na', 1, 0, true);
    this.add('кали[й|я]', 'K', 1, 0, true);
    this.add('бари[й|я]', 'Ba', 2, 0, false, 0, [1, 2]);
    this.add('кальци[й|я]', 'Ca', 2, 0, true);
    this.add('магни[й|я]', 'Mg', 2, 0, true);
    this.add('фторид|фтороводородная', 'F', -1, 0, true);
    this.add('гидрид', 'H', -1, 0, true);
    this.add('алюмини[й|я]', 'Al', 3, 0, false, 0, [2, 3]);
    this.add('цинк[а]?', 'Zn', 3, 0, false, 0, [2, 3]);
    this.add('аммони[й|я]', 'NH4', 1, 0, true);
    this.add('нитрат|азотная', 'NO3', -1, 0, true);
    this.add('сульфит|сернистая', 'SO3', -2, 0, true);
    this.add('гидросульфит', 'HSO3', -1, 0, true);
    this.add('хлорид|соляная', 'Cl', -1, 0, true);
    this.add('карбонат|угольная', 'CO3', -2, 0, true);
    this.add('фосфат|фосфорная', 'PO4', -3, 0, true);
    this.add('сульфат|серная', 'SO4', -2, 0, true);
    this.add('гидросульфат', 'HSO4', -1, 0, true);
    this.add('гидроксид', 'OH', -1, 0, true);
    this.add('оксид', 'O', -2, 0, true);
    this.add('сер[а|ы]', 'S', -2, 0, false, 0, [-2, 2, 4, 6]);
    this.add('сульфид|сероводородная', 'S', -2, 0, true);
    this.add('мед[ь|и]', 'Cu', 2, 0, false, 0, [1, 2]);
    this.add('желез[о|а]', 'Fe', 3, 0, false, 0, [2, 3]);
    this.add('кислород', 'O2', 0, 0, true);
    this.add('углерод[а]?', 'C', 4, 0, false, 0, [4, 3, 2, 1, 0, -1, -2, -3, -4]);
    this.add('цинкат|цинковая', 'ZnO2', -2, 0, true);
    this.add('кислота', 'H', 1, 0, true);
    this.add('кислорода', 'O', 2, 0, true);
    this.add('лити[й|я]', 'Li', 1, 0, true);
}
//Получает формулу по русскому названию
IONES.getFormula = function(rus){
    //Разбивает на слова
    var p = rus.trim().split(' '), iones;
    //Может обрабатьывать только вещества вида "карбонат кальция" или "оксид меди (2)", если дали на вход не то, выходит
    if(p.length < 1 || p.length > 3){
        console.warn(rus + ': вещество не поддерживается'); 
        return 'Вещество не поддерживается';
    }else if(p.length == 1){
        iones = [this.getByRus(p[0])];
    }else {
        //Ищет ионы и установленную в условии степень для переменного иона
        var ion1 = this.getByRus(p[1]),
            ion2 = this.getByRus(p[0]), 
            degreeMatch = rus.match(/\(([\-]?[0-9])\)/),
            degree;
        degree = degreeMatch && !isNaN(+(degreeMatch[1])) ? +degreeMatch[1] : false;
        //Если не нашел таких ионов, значит их еще нет в хранилище, и надо будет их потом доабавить, а пока просто выходит
        if(typeof ion1 === 'undefined' || typeof ion2 === 'undefined'){
            console.warn(rus + ': вещество не поддерживается'); 
            return 'Вещество не поддерживается';
        }
        //Уравнивает ионы уравнивателем, функции для определения количества элементов в ионе и получения заряда (2-) из степени окисления
        iones = this.equalify(ion1, ion2, degree);
    }
    var ionesCounter = function(s){ return s.match(/[A-Z]/g).length; }, 
        chargeFromDegreeGetter = function(d){
            d = d < 0 ? d : '+' + d;
            return ("" + d).split("").reverse().join("").replace(/1/, "");
        },
        formula = '';
    //Если уравниватель что-то нашел, тогда будет результат
    if(typeof iones === "object"){
        //Проходим по ионам и собираем формулу
    for(var i in iones){
        var e = iones[i], z = e[2];
        //Если надо заряд, добавим его к иону
        if(+URLParameters().charges === 1){
            e[1] += '<sup>' + chargeFromDegreeGetter(e[2]) + '</sup>';
        }
        //Если индекс больше 1, обработаем его
        if(e[3] > 1){
            //Если ион вида (NH4) то возьмем в скобки
            if(ionesCounter(e[1]) > 1){
                formula += '(' + e[1] + ')';
                //Или просто ион, если из одного элемента
            }else{
                formula += e[1];
            }
            //Допишем индекс
            formula += e[3];
        //Если индекс равен 1, пишем просто ион
        }else formula += e[1];
    }
    //Сделаем индексы как индексы
    formula = formula.replace(/([0-9]+)/g, "<sub>$1</sub>");
    //Вернем результат
    return formula;
        //Если уравниватель определил, что результата нет
    }else if(iones === false){
        console.error(rus + ': вещество не существует');
        return 'Вещество не существует';
    }else{
        //Если уравниватель не определил ничего
        console.warn(rus + ': вещество не поддерживается'); 
        return 'Вещество не поддерживается';
    }
}
//Запуск кодировщика
IONES.init();
//Обеспечение работы формы
window.onload = function(){
    document.querySelector('h1').innerHTML = window.location.hostname;
    if(URLParameters().name){
        document.getElementById("text").value = URLParameters().name.trim().replace(/\+/g, ' ');
        document.getElementById("results").innerHTML = '<div id="formula">' + IONES.getFormula(URLParameters().name.trim().replace(/\+/g, ' ')) + '</div><div id="name">' + URLParameters().name.trim().replace(/\+/g, ' ') + '</div>';
    }
}
