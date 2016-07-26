/*
*  instructions ：DatePicker  
*  date : 2015-04-17
*  author : 张文书
*  Last Modified 
*  By 张文书
*/

(function () {

    /*
    //定义公共操作
    Function.prototype.delegate = function (context, params) {
        var func = this;
        return function () {
            if (params == null) {
                return func.apply(context);
            }
            return func.apply(context, params);
        };
    };

    window.commonOp = {
        coverObject: function (obj1, obj2) {
            var o = this.cloneObject(obj1, false);
            var name;
            for (name in obj2) {
                if (obj2.hasOwnProperty(name)) {
                    o[name] = obj2[name];
                }
            }
            return o;
        },

        cloneObject: function (obj, deep) {
            if (obj === null) {
                return null;
            }
            var con = new obj.constructor();
            var name;
            for (name in obj) {
                if (!deep) {
                    con[name] = obj[name];
                } else {
                    if (typeof (obj[name]) == "object") {
                        con[name] = commonOp.cloneObject(obj[name], deep);
                    } else {
                        con[name] = obj[name];
                    }
                }
            }
            return con;
        },

        ///说明：
        ///      创建委托
        delegate: function (func, context, params) {
            if ((typeof (eval(func)) == "function")) {
                return func.delegate(context, params);
            } else {
                return function () { };
            }
        },

        getParam: function (param) {
            if (typeof (param) == "undefined") {
                return "";
            } else {
                return param;
            }
        },

        //说明：
        //  判断元素是否存在某个属性   true：不包含   false:包含 
        boolHasAttr: function (id, attr) {

            if (typeof (document.getElementById(id).attributes[attr]) != "undefined") {
                return false;
            }
            return true;
        },

        IsNull: function (str) {
            if (str.trim() == "" || isNaN(str)) {
                return true;
            }
            return false;
        },

        //说明：
        //  是否存在指定函数 
        isExitsFunction: function (funcName) {
            try {
                if (typeof (eval(funcName)) == "function") {
                    return true;
                }
            }
            catch (e) { }
            return false;
        },

        //说明：
        //  是否存在指定变量 
        isExitsVariable: function (variableName) {
            try {
                if (typeof (variableName) == "undefined") {
                    return false;
                } else {
                    return true;
                }
            } catch (e) { }
            return false;
        },

        //说明：
        //  判断输入框中输入的日期格式为yyyy-mm-dd和正确的日期   短日期，形如 (2008-07-22)
        IsDate: function (str) {
            var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
            if (r == null) {
                return false;
            }
            var d = new Date(r[1], r[3] - 1, r[4]);
            return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
        },

        //说明：
        //      将字符串转换成date  格式：yyyy-mm-dd
        stringToDate: function (str) {
            if (!commonOp.IsDate(str)) {
                return null;
            }
            var tempStrs = str.split("-");
            var year = parseInt(tempStrs[0]);
            var month = parseInt(tempStrs[1]) - 1;
            var day = parseInt(tempStrs[2]);
            return new Date(year, month, day);
        },

        //判断样式是否存在
        hasClass: function (obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },

        //为指定的dom元素添加样式
        addClass: function (obj, cls) {
            if (!this.hasClass(obj, cls)) {
                obj.className += " " + cls;
            }
        },

        //删除指定dom元素的样式
        removeClass: function (obj, cls) {
            if (this.hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        },

        //如果存在(不存在)，就删除(添加)一个样式
        toggleClass: function (obj, cls) {
            if (this.hasClass(obj, cls)) {
                this.removeClass(obj, cls);
            } else {
                this.addClass(obj, cls);
            }
        }

    };

    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };
    String.prototype.lTrim = function () {
        return this.replace(/(^\s*)/g, "");
    };
    String.prototype.rTrim = function () {
        return this.replace(/(\s*$)/g, "");
    };

    */
    
    //定义星期枚举
    var dayOfWeekEnum = {
        Monday: "星期一",
        Tuesday: "星期二",
        Wednesday: "星期三",
        Thursday: "星期四",
        Friday: "星期五",
        Saturday: "星期六",
        Sunday: "星期日"
    };

    //定义table中,日期枚举，属于哪一个月
    var dpMonthPositionEnum = {
        LastMonth: 0,    //上月
        CurrentMonth: 1, //当前月
        NextMonth: 2     //下一月
    };

    var datepicker = function () {
        //参数定义
        this.defaultParams = {
            id: "", //显示时间input的id
            mindate: "", //最小日期
            maxdate: ""//最大日期
        };
    };

    datepicker.prototype = {

        constructor: datepicker,

        init: function (params) {
            this.options = commonOp.coverObject(this.defaultParams, params);
            this._init();
        },

        _init: function () {
            if (!this.validateParams()) {
                return;
            }
            //注册datepicker点击事件
            this._registerDatePickerElementClick();
        },

        //验证参数有效性
        validateParams: function () {
            var id = this.options.id;
            if(!document.getElementById(id)){
            	alert("使用日期插件元素不存在！");
            	return false;
            }
            var inputObj=document.getElementById(id);
            inputObj.className="datepicker-skin1-input";
            
            if (commonOp.boolHasAttr(id, "datepicker")) {
                alert("使用日期插件缺少datepicker属性");
                return false;
            }
            if (this.options.mindate != "") {
                if (!commonOp.IsDate(this.options.mindate)) {
                    alert("使用日期插件的mindate参数格式不正确！");
                    return false;
                }
            }
            if (this.options.maxdate != "") {
                if (!commonOp.IsDate(this.options.maxdate)) {
                    alert("使用日期插件的maxdate参数格式不正确！");
                    return false;
                }
            }
            var mindate = new Date(Date.parse(this.options.mindate.replace(/-/g, "/"))); //转换成Data();
            var maxdate = new Date(Date.parse(this.options.maxdate.replace(/-/g, "/"))); //转换成Data();
            if (mindate > maxdate) {
                alert("使用日期插件的mindate不能大于maxdate！");
                return false;
            }
            return true;
        },

        //获取元素位置  定位
        getPosition: function () {
            var obj = document.getElementById(this.options.id);
            var left = obj.offsetLeft;
            var top = obj.offsetTop + obj.offsetHeight - 1;
            document.getElementById("dpcontrol").style.left = left + "px";
            document.getElementById("dpcontrol").style.top = top + "px";
        },

        //获取显示日期的数据源
        getTimeData: function (year, month) {

            var timedayJsonList = [];
            var dayofweek = this.getFirstDayOfCurrentMonth(year, month);
            var daycount = this.getCurrentMonthDays(year, month);
            var dayoflastmonthcount = 0; //上个月应该显示几天
            switch (dayofweek) {
                case dayOfWeekEnum.Sunday:
                    dayoflastmonthcount = 0;
                    break;
                case dayOfWeekEnum.Monday:
                    dayoflastmonthcount = 1;
                    break;
                case dayOfWeekEnum.Tuesday:
                    dayoflastmonthcount = 2;
                    break;
                case dayOfWeekEnum.Wednesday:
                    dayoflastmonthcount = 3;
                    break;
                case dayOfWeekEnum.Thursday:
                    dayoflastmonthcount = 4;
                    break;
                case dayOfWeekEnum.Friday:
                    dayoflastmonthcount = 5;
                    break;
                case dayOfWeekEnum.Saturday:
                    dayoflastmonthcount = 6;
                    break;
            }
            var dayofnextmonthcount = 42 - daycount - dayoflastmonthcount; //下个月应该显示几天

            for (var i = 0; i < dayoflastmonthcount; i++) {
                var dayNo = this.getLastNonthLastSomeDay(year, month, 1, (dayoflastmonthcount - i));

                var dayLastMonth = new Date(year, month - 2, dayNo);
                var dayLastMonthIsSelected = this.boolTheDayIsSelected(this.options.mindate, this.options.maxdate, dayLastMonth);


                var timeDayLastMonth = { "dpyear": year, "dpmonth": (month - 1), "dpday": dayNo, "dpmonthposition": dpMonthPositionEnum.LastMonth, "dpdayIsSelected": dayLastMonthIsSelected };
                timedayJsonList.push(timeDayLastMonth);
            }

            for (var j = 0; j < daycount; j++) {
                var dayThisMonth = new Date(year, month - 1, j + 1);
                var dayThisMonthIsSelected = this.boolTheDayIsSelected(this.options.mindate, this.options.maxdate, dayThisMonth);

                var timeDayMonth = { "dpyear": year, "dpmonth": (month), "dpday": (j + 1), "dpmonthposition": dpMonthPositionEnum.CurrentMonth, "dpdayIsSelected": dayThisMonthIsSelected };

                timedayJsonList.push(timeDayMonth);
            }

            for (var k = 0; k < dayofnextmonthcount; k++) {
                var dayNextMonth = new Date(year, month, k + 1);
                var dayNextMonthIsSelected = this.boolTheDayIsSelected(this.options.mindate, this.options.maxdate, dayNextMonth);

                var timeDayNextMonth = { "dpyear": year, "dpmonth": (month + 1), "dpday": (k + 1), "dpmonthposition": dpMonthPositionEnum.NextMonth, "dpdayIsSelected": dayNextMonthIsSelected };
                timedayJsonList.push(timeDayNextMonth);
            }

            return timedayJsonList;

        },

        //判断该天是不是可以选
        boolTheDayIsSelected: function (mindate, maxdate, day) {

            var ret = false;
            var dpmindate, dpmaxdate;
            if (mindate != "") {
                dpmindate = new Date(Date.parse(mindate.replace(/-/g, "/"))); //转换成Data();    
            }

            if (maxdate != "") {
                dpmaxdate = new Date(Date.parse(maxdate.replace(/-/g, "/"))); //转换成Data();
            }

            if (mindate != "" && maxdate == "") {
                if (dpmindate <= day) {
                    ret = true;
                }
                return ret;
            }
            if (mindate == "" && maxdate != "") {
                if (day <= dpmaxdate) {
                    ret = true;
                }
                return ret;
            }
            if (mindate != "" && maxdate != "") {
                if (dpmindate <= day && day <= dpmaxdate) {
                    ret = true;
                }
                return ret;
            }
            if (mindate == "" && maxdate == "") {
                ret = true;
            }
            return ret;
        },

        //获取上个月的最后几天
        getLastNonthLastSomeDay: function (year, month, day, num) {
            var today = new Date(year, month - 1, day);
            var yesterdayMilliseconds = today.getTime() - 1000 * 60 * 60 * 24 * num;

            var lastday = new Date();
            lastday.setTime(yesterdayMilliseconds);

            var strDay = lastday.getDate();
            return strDay;
        },

        //获取当前月共有多少天
        getCurrentMonthDays: function (year, month) {
            if (month == 2) {
                return year % 4 == 0 ? 29 : 28;
            }
            else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                return 31;
            }
            else {
                return 30;
            }
        },

        //获取当前月的第一天是星期几
        getFirstDayOfCurrentMonth: function (year, month) {
            var date = new Date(year, month - 1);
            date.setDate(1);
            var weekday = new Array(7);
            weekday[0] = dayOfWeekEnum.Sunday;
            weekday[1] = dayOfWeekEnum.Monday;
            weekday[2] = dayOfWeekEnum.Tuesday;
            weekday[3] = dayOfWeekEnum.Wednesday;
            weekday[4] = dayOfWeekEnum.Thursday;
            weekday[5] = dayOfWeekEnum.Friday;
            weekday[6] = dayOfWeekEnum.Saturday;
            return weekday[date.getDay()];
        },

        //生成datepicker的html控件
        createDatePickerHtml: function (year, month, day) {
            if (document.getElementById("dpcontrol")) {
                return;
            }
            var dpHtml = "";
            dpHtml += "<div class='datepicker-head'>";
            dpHtml += "     <div class='datepicker-head-div'>";
            dpHtml += "         <div id='lastyear' class='datepicker-head-left'>";
            dpHtml += "             <div class='datepicker-img-left'></div>";
            dpHtml += "         </div>";
            dpHtml += "         <div class='datepicker-head-txtarea'>";
            dpHtml += "             <input type='text' id='dpyear' class='datepicker-head-txt' readonly='readonly'/>";
            dpHtml += "         </div>";
            dpHtml += "         <div id='nextyear' class='datepicker-head-right'>";
            dpHtml += "             <div class='datepicker-img-right'></div>";
            dpHtml += "         </div>";
            dpHtml += "     </div>";
            dpHtml += "     <div class='datepicker-head-div'>";
            dpHtml += "          <div id='lastmonth' class='datepicker-head-left'>";
            dpHtml += "              <div class='datepicker-img-left'></div>";
            dpHtml += "          </div>";
            dpHtml += "          <div class='datepicker-head-txtarea'>";
            dpHtml += "              <input type='text' id='dpmonth' class='datepicker-head-txt' readonly='readonly'/>";
            dpHtml += "          </div>";
            dpHtml += "          <div id='nextmonth' class='datepicker-head-right'>";
            dpHtml += "              <div class='datepicker-img-right'></div>";
            dpHtml += "          </div>";
            dpHtml += "      </div>";
            dpHtml += "</div>";
            dpHtml += "<div id='dpbody' class='datepicker-body'>";
            dpHtml += "     <table>";
            dpHtml += "         <thead>";
            dpHtml += "             <tr>";
            dpHtml += "                 <td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td>";
            dpHtml += "             </tr>";
            dpHtml += "         </thead>";
            dpHtml += "         <tbody>";

            dpHtml += this.getTbodyHtml(year, month);

            dpHtml += "        </tbody>";
            dpHtml += "     </table>";
            dpHtml += "</div>";
            dpHtml += "<div class='datepicker-foot'>";
            dpHtml += "    <div id='btnClose' class='datepicker-op'>关闭</div>";
            dpHtml += "    <div id='btnToday' class='datepicker-op'>今天</div>";
            dpHtml += "    <div id='btnClear' class='datepicker-op'>清空</div>";
            dpHtml += "</div>";

            var el = document.createElement("div");
            el.className = "datepicker";
            el.id = "dpcontrol";
            el.innerHTML = dpHtml;
            document.body.appendChild(el);

        },

        getTbodyHtml: function (year, month) {

            var timeDataJson = this.getTimeData(year, month);
            var dpTbodyHtml = "";
            for (var i = 0; i < timeDataJson.length; i++) {
                if (i % 7 === 0) {
                    dpTbodyHtml += "<tr>";
                }
                var monthStyle = "";
                switch (timeDataJson[i].dpmonthposition) {
                    case dpMonthPositionEnum.LastMonth:
                        if (timeDataJson[i].dpdayIsSelected) {
                            monthStyle = "datepicker-notcurrentmonth";
                        } else {
                            monthStyle = "datepicker-datedisabled";
                        }
                        break;
                    case dpMonthPositionEnum.CurrentMonth:
                        if (timeDataJson[i].dpdayIsSelected) {
                            monthStyle = "";
                        } else {
                            monthStyle = "datepicker-datedisabled";
                        }
                        break;
                    case dpMonthPositionEnum.NextMonth:
                        if (timeDataJson[i].dpdayIsSelected) {
                            monthStyle = "datepicker-notcurrentmonth";
                        } else {
                            monthStyle = "datepicker-datedisabled";
                        }
                        break;
                }

                dpTbodyHtml += "<td class='" + monthStyle + "' dpMonthPosition='" + timeDataJson[i].dpmonthposition + "' dpyear='" + timeDataJson[i].dpyear
                    + "' dpmonth='" + timeDataJson[i].dpmonth + "' dpday='" + timeDataJson[i].dpday + "' dpdayIsSelected='" + timeDataJson[i].dpdayIsSelected + "'>" + timeDataJson[i].dpday + "</td>";

                if ((i + 1) % 7 === 0) {
                    dpTbodyHtml += "</tr>";
                }
            }
            return dpTbodyHtml;
        },

        //给年、月文本框赋值  并且  设置被选中td的样式
        setdpvalueAndSelectedTdStyle: function (year, month, day) {

            document.getElementById("dpyear").value = year + " 年";
            document.getElementById("dpmonth").value = month + " 月";

            var dpdays = document.getElementById("dpcontrol").getElementsByTagName("tbody")[0].getElementsByTagName("td");
            for (var i = 0; i < dpdays.length; i++) {
                if (dpdays[i].getAttribute("dpyear") == year && dpdays[i].getAttribute("dpmonth") == month && dpdays[i].getAttribute("dpday") == day) {
                    dpdays[i].className += " datepicker-dateselected";
                }
            }
        },

        /******************************(注册事件 begin)******************************/

        //注册datepicker元素click事件
        _registerDatePickerElementClick: function () {
            var handleEvent = commonOp.delegate(this._handleDatePickerElementClick, this);
            document.getElementById(this.options.id).onclick = handleEvent;
        },

        //注册Tobody Td的click事件
        _registerTbodyTdClick: function () {
            var options = this.options;
            var tdList = document.getElementById("dpcontrol").getElementsByTagName("tbody")[0].getElementsByTagName("td");
            for (var i = 0; i < tdList.length; i++) {
                var td = tdList[i];
                var handleEvent = commonOp.delegate(datepicker.prototype._handleTbodyTdClick, this, [{ options: options, td: td }]);
                tdList[i].onclick = handleEvent;
            }
        },

        //注册清空事件
        _registerBtnClear: function () {
            var handleEvent = commonOp.delegate(this._handleBtnClear, this);
            document.getElementById("btnClear").onclick = handleEvent;
        },
        //注册关闭事件
        _registerBtnClose: function () {
            var handleEvent = commonOp.delegate(this._handleBtnClose, this);
            document.getElementById("btnClose").onclick = handleEvent;
        },

        //注册选择今天按钮的事件
        _registerBtnToday: function () {
            var handleEvent = commonOp.delegate(this._handleBtnToday, this);
            document.getElementById("btnToday").onclick = handleEvent;
        },

        //注册关闭datepicker事件
        _registerDocumentClick: function () {
            var options = this.options;

            document.onclick = function (event) {
                var handleEvent = commonOp.delegate(datepicker.prototype._handleDocumentClick, this, [{ event: event, options: options }]);
                handleEvent();
            };

        },

        //注册上一年事件
        _registerBtnLastYear: function () {
            var handleEvent = commonOp.delegate(this._handleBtnLastYear, this);
            document.getElementById("lastyear").onclick = handleEvent;
        },

        //注册下一年事件
        _registerBtnNextYear: function () {
            var handleEvent = commonOp.delegate(this._handleBtnNextYear, this);
            document.getElementById("nextyear").onclick = handleEvent;
        },

        //注册上一月事件
        _registerBtnLastMonth: function () {
            var handleEvent = commonOp.delegate(this._handleBtnLastMonth, this);
            document.getElementById("lastmonth").onclick = handleEvent;
        },

        //注册下一月事件
        _registerBtnNextMonth: function () {
            var handleEvent = commonOp.delegate(this._handleBtnNextMonth, this);
            document.getElementById("nextmonth").onclick = handleEvent;
        },

        /******************************(注册事件 end)******************************/


        /******************************(事件句柄 begin)******************************/

        _handleDatePickerElementClick: function () {
            var docdpcontrol = document.getElementById("dpcontrol");
            if (docdpcontrol) {
                document.body.removeChild(docdpcontrol);
            }
            var year, month, day;
            var dpvalue = document.getElementById(this.options.id).value.trim();
            if (dpvalue === "") {
                var curDate = new Date();
                year = curDate.getFullYear();
                month = curDate.getMonth() + 1;
                day = curDate.getDate();
            } else {

                if (!commonOp.IsDate(dpvalue)) {
                    alert("输入的日期格式不正确！正确格式为'yyyy-MM-dd'！");
                    document.getElementById(this.options.id).value = "";
                    return;
                }
                var strlist = new Array(); //定义一数组 
                strlist = dpvalue.split("-"); //字符分割 
                year = strlist[0].trim();
                month = strlist[1].trim();
                day = strlist[2].trim();
            }

            this.createDatePickerHtml(parseInt(year), parseInt(month), parseInt(day));

            //定位
            this.getPosition();
            this.getPosition(); //调用2次是为了解决当不是全屏显示的时候要重定位
            //注册事件
            this._registerTbodyTdClick();
            this._registerBtnToday();
            this._registerBtnClear();
            this._registerBtnClose();
            this._registerDocumentClick();

            this._registerBtnLastYear();
            this._registerBtnLastMonth();
            this._registerBtnNextMonth();
            this._registerBtnNextYear();

            this.setdpvalueAndSelectedTdStyle(year, month, day);
        },

        _handleTbodyTdClick: function (params) {
            var tdList = document.getElementById("dpcontrol").getElementsByTagName("tbody")[0].getElementsByTagName("td");
            for (var i = 0; i < tdList.length; i++) {
                commonOp.removeClass(tdList[i], "datepicker-dateselected");
            }
            commonOp.addClass(params.td, "datepicker-dateselected");

            var options = params.options;
            var id = options.id;
            var isSelected = params.td.getAttribute("dpdayIsSelected");
            if (isSelected != "true") {
                return;
            }
            var dpyear = params.td.getAttribute("dpyear");
            var dpmonth = params.td.getAttribute("dpmonth");
            var dpday = params.td.getAttribute("dpday");
            document.getElementById(id).value = dpyear.trim() + "-" + dpmonth.trim() + "-" + dpday;

            var dpcontrol = document.getElementById("dpcontrol");
            document.body.removeChild(dpcontrol);
        },

        _handleBtnClear: function () {
            var tdList = document.getElementById("dpcontrol").getElementsByTagName("tbody")[0].getElementsByTagName("td");
            for (var i = 0; i < tdList.length; i++) {
                commonOp.removeClass(tdList[i], "datepicker-dateselected");
            }
            document.getElementById(this.options.id).value = "";
        },

        _handleBtnClose: function () {
            var dpcontrol = document.getElementById("dpcontrol");
            if (dpcontrol) {
                document.body.removeChild(dpcontrol);
            }
        },

        _handleBtnToday: function () {
            var curDate = new Date();
            if (!this.boolTheDayIsSelected(this.options.mindate, this.options.maxdate, curDate)) {
                return;
            }
            var dpyear = curDate.getFullYear(); //获取完整的年份(4位,1970-????)
            var dpmonth = curDate.getMonth() + 1;
            var dpday = curDate.getDate(); //获取当前日(1-31)

            document.getElementById(this.options.id).value = dpyear + "-" + dpmonth + "-" + dpday;
            var dpcontrol = document.getElementById("dpcontrol");
            document.body.removeChild(dpcontrol);
        },

        _handleDocumentClick: function (params) {

            var e = params.event || window.event;
            var elem = e.srcElement || e.target;
            while (elem) {
                if (elem.id == "dpcontrol" || elem.id == params.options.id) {
                    return;
                }
                elem = elem.parentNode;
            }
            //验证日期格式及有效性
            var dateselected = document.getElementById(params.options.id);
            var dateselectedValue = dateselected.value;
            if (dateselectedValue.trim() != "") {
                if (!commonOp.IsDate(dateselectedValue)) {
                    alert("输入的日期格式不正确！正确格式为'yyyy-MM-dd'！");
                    document.getElementById(params.options.id).value = "";
                    return;
                }
                var dateList = dateselectedValue.split("-");
                var selectedday = new Date(parseInt(dateList[0]), parseInt(dateList[1]) - 1, parseInt(dateList[2]));

                if (!datepicker.prototype.boolTheDayIsSelected(params.options.mindate, params.options.maxdate, selectedday)) {
                    alert("该日期不在有效范围内！请重新选择！");
                    document.getElementById(params.options.id).value = "";
                    return;
                }
            }
            var dpcontrol = document.getElementById("dpcontrol");
            if (dpcontrol) {
                document.body.removeChild(dpcontrol);
            }

        },

        //上一年事件句柄
        _handleBtnLastYear: function () {
            var yearandmonthObj = this.getdpyearandmonthbytxt();
            this.showdpByDirectionBtnClick(yearandmonthObj.dpyear - 1, yearandmonthObj.dpmonth);
        },

        //下一年事件句柄
        _handleBtnNextYear: function () {
            var yearandmonthObj = this.getdpyearandmonthbytxt();
            this.showdpByDirectionBtnClick(yearandmonthObj.dpyear + 1, yearandmonthObj.dpmonth);
        },

        //上一月事件句柄
        _handleBtnLastMonth: function () {
            var yearandmonthObj = this.getdpyearandmonthbytxt();
            this.showdpByDirectionBtnClick(yearandmonthObj.dpyear, yearandmonthObj.dpmonth - 1);
        },

        //下一月事件句柄
        _handleBtnNextMonth: function () {

            var yearandmonthObj = this.getdpyearandmonthbytxt();

            this.showdpByDirectionBtnClick(yearandmonthObj.dpyear, yearandmonthObj.dpmonth + 1);
        },

        /******************************(事件句柄 end)******************************/

        //获取文本框中的年月
        getdpyearandmonthbytxt: function () {
            var year = parseInt(document.getElementById("dpyear").value.replace("年", "").trim());
            var month = parseInt(document.getElementById("dpmonth").value.replace("月", "").trim());
            return {
                "dpyear": year,
                "dpmonth": month
            };
        },

        //上一月、下一月、上一年、下一年 四个按钮公用部分
        showdpByDirectionBtnClick: function (year, month) {

            var divlist = document.getElementById("dpcontrol").getElementsByTagName("div");
            var divobj;
            for (var i = 0; i < divlist.length; i++) {
                if (divlist[i].id == "dpbody") {
                    divobj = divlist[i];
                    divobj.innerHTML = "";
                }
            }
            var dpHtml = "";
            dpHtml += "<table>";
            dpHtml += "    <thead>";
            dpHtml += "        <tr>";
            dpHtml += "            <td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td>";
            dpHtml += "        </tr>";
            dpHtml += "    </thead>";
            dpHtml += "    <tbody>";

            dpHtml += this.getTbodyHtml(year, month);

            dpHtml += "   </tbody>";
            dpHtml += "</table>";

            var date = new Date(year, month - 1);
            document.getElementById("dpyear").value = date.getFullYear() + " 年";
            document.getElementById("dpmonth").value = (date.getMonth() + 1) + " 月";

            divobj.innerHTML = dpHtml;

            //注册事件
            this._registerTbodyTdClick();
        }

    };
    window.dpzws = datepicker;
})();