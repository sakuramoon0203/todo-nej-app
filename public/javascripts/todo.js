var f = function() {
    var _ = NEJ.P,
        _e = _('nej.e'),
        _o = NEJ.P('nej.o'),
        _v = NEJ.P('nej.v'),
        _ui = NEJ.P('nej.ui'),
        _u = NEJ.P('nej.u'),
        _p = _('nej.demo'),
        _j = _('nej.j'),
        _$ = NEJ.P('nej.$'),
        _todoListItem,
        _supTodoListItem;

    var _data = { todos: [] };
    var _todoListTpl = _e._$addNodeTemplate(
        _e._$html2node(`<li class="todo-item">
            <div class="view">
                <input class="toggle" type="checkbox">
                <label class="title">yrrr</label>
                <button class="delete"></button>
            </div>
            <input class="edit hidden">
        </li>`));
    _p._$$WorkerItem = NEJ.C();
    _todoListItem = _p._$$WorkerItem._$extend(_ui._$$Item, !0);
    _supTodoListItem = _ui._$$Item.prototype;

    /**
     * 控件初始化
     * @return {Void}
     */
    _todoListItem.__init = function(_opt) {
        this.__super(_opt);
        _opt = _opt || _o;
    };

    /**
     * 初始化节点，子类重写具体逻辑
     * @return {Void}
     */
    _todoListItem.__initNode = function() {
        this.__body = _e._$getNodeTemplate(_todoListTpl);
        this._todoCheck = _e._$getByClassName(this.__body, 'toggle')[0]; 
        this._todoTitle = _e._$getByClassName(this.__body, 'title')[0]; 
        this._todoDelete = _e._$getByClassName(this.__body, 'delete')[0]; 
        this._todoEdit = _e._$getByClassName(this.__body, 'edit')[0];
        this._todoView = _e._$getByClassName(this.__body, 'view')[0]; 
        _v._$addEvent(this._todoCheck, 'click', this.__onClickCheck._$bind(this));
        _v._$addEvent(this._todoTitle, 'dblclick', this.__onDoubleClickEdit._$bind(this));
        _v._$addEvent(this._todoEdit, 'blur enter', this.__onEditEnd._$bind(this));
        _v._$addEvent(this._todoDelete, 'click', this.__onClickDelete._$bind(this));
    };

    /**
     * 刷新项,子类实现具体逻辑
     * @return {Void}
     */
    _todoListItem.__doRefresh = function(_data) {
        this.__body['id'] = _data._id;
        this._todoCheck.checked = _data.finished;
        this._todoTitle.innerText = _data.title;
        this._todoView.style['text-decoration']=_data.finished?'line-through':'none';
    };

    /**
     * 点击复选框的响应函数
     * @param {Object} _event   事件对象
     */
    _todoListItem.__onClickCheck = function(_event) {
        var i = getTodoIndex(_event.target);
        _data.todos[i].finished = !_data.todos[i].finished;
        changeData(_data.todos[i]._id, _data.todos[i]);
    };

    /**
     * 双击input框的响应函数
     * @param {Object} _event   事件对象
     */
    _todoListItem.__onDoubleClickEdit = function(_event) {   
        _e._$addClassName(this._todoView,'hidden');
        _e._$replaceClassName(this._todoEdit,'hidden','');
        this._todoEdit.value = this._todoTitle.innerText;
        this._todoEdit.focus();
    }

    /**
     * input框输入完成的响应函数
     * @param {Object} _event   事件对象
     */
     _todoListItem.__onEditEnd = function(_event) {
        var i = getTodoIndex(_event.target);
        _data.todos[i].title = this._todoEdit.value;
        this._todoTitle.innerText = this._todoEdit.value;
        this.__data.title = this._todoEdit.value;
        _e._$addClassName(this._todoEdit,'hidden');
        _e._$replaceClassName(this._todoView,'hidden','');
        changeData(_data.todos[i]._id, _data.todos[i])   
    };

    /**
     * 点击删除的响应函数
     * @param {Object} _event   事件对象
     */
    _todoListItem.__onClickDelete = function(_event) {
        this.__destroy(_event);
    };

    /**
     * 控件销毁
     * @return {Void}
     */
    _todoListItem.__destroy = function(_event) {
        var _id = _e._$attr(_$(_event.target)._$parent('li')[0], 'id');
        var i = getTodoIndex(_event.target)
        deleteData(_data.todos[i]._id)
        _data.todos.splice(i, 1);
        _supTodoListItem.__destroy.apply(this, arguments);
        if(_data.todos.length <= 0) {
            _e._$addClassName('footer','hidden');           
        }
    };

    /**
     * check该项
     * @param {Boolean} _checked
     */
    _todoListItem._$check = function(_checked) {
        this._todoCheck.checked = !!_checked;
    };

    /**
     * 获取该项是否选中
     * @return  {Boolean} _checked  是否选中
     */
    _todoListItem._$checked = function() {
        return this._todoCheck.checked;
    };

    /**
     * 清空节点的所有子孙节点
     * @return  {Object} _element   
     */
    _e._$emptyChildren = function(_element) {
        if (!_element) return;
        while (_element.firstChild)
            _element.removeChild(_element.firstChild);
    };

    /**
     * 从数据库获取数据后初始化页面的函数
     * @param {Object} _data    获取到的数据
     */
    function init(data) {
        _data.todos = data
        if(data.length > 0) {
            _e._$replaceClassName('footer','hidden','');
        }
        _e._$get('toggle-all').checked = true;
        _data.todos.forEach(function(todoItem) {
            if(!todoItem.finished) {
                _e._$get('toggle-all').checked = false;
            }
        })
        _v._$addEvent('new-todo', 'enter', onAddTodo);
        _v._$addEvent('toggle-all', 'click', onClickSelectAll);
        _v._$addEvent('show-all', 'click', onClickShowAll);
        _v._$addEvent('show-active', 'click', onClickShowActive);
        _v._$addEvent('show-finished', 'click', onClickShowFinished);
        _v._$addEvent('clear-finished', 'click', onClickClearFinished);
        renderData(_data);
    }

    /**
     * 添加一个新的todo项的响应函数
     * @param {Object} _event   事件对象
     */
    function onAddTodo(_event) {
        var $input = _e._$get(_event.target);
        var newTodo = {
            title: $input.value.trim(),
            finished: false
        }
        _data.todos.push(newTodo);
        createData(newTodo);
        $input.value = '';
        if(_data.todos.length >= 0) {
            _e._$replaceClassName('footer','hidden','');            
        }
    }

    /**
     * 点击"全选"复选框的响应函数
     * @param {Object} _event   事件对象
     */
    function onClickSelectAll(_event) {
        var _checked = _v._$getElement(_event).checked;
        _u._$forEach(workItems, function(_worker){
            _worker._$check(_checked);
        });
        _data.todos.forEach(function(todoItem) {
            todoItem.finished = _checked;
            changeData(todoItem._id, todoItem);
        });
    }

    /**
     * 点击"All"的响应函数
     * @return {Void}
     */
    function onClickShowAll() {
        _e._$replaceClassName('show-active','selected','');
        _e._$replaceClassName('show-finished','selected','');
        _e._$replaceClassName('clear-finished','selected','');
        _e._$addClassName(this,'selected');
        var liItems = _e._$getChildren('todo-list');
        liItems.forEach(function(liItem) {
            _e._$replaceClassName(liItem,'hidden','');
        })
    }

    /**
     * 点击"Active"的响应函数
     * @return {Void}
     */
    function onClickShowActive() {
        _e._$replaceClassName('show-all','selected','');
        _e._$replaceClassName('show-finished','selected','');
        _e._$replaceClassName('clear-finished','selected','');
        _e._$addClassName(this,'selected');
        _data.todos.forEach(function(todoItem) {
            var id = todoItem._id;
            if(todoItem.finished) {
                _e._$addClassName(id,'hidden');
            } else {
                _e._$replaceClassName(id,'hidden','');
            }
        })
    }

    /**
     * 点击"Finished"的响应函数
     * @return {Void}
     */
    function onClickShowFinished() {
        _e._$replaceClassName('show-all','selected','');
        _e._$replaceClassName('show-active','selected','');
        _e._$replaceClassName('clear-finished','selected','');
        _e._$addClassName(this,'selected');
        _data.todos.forEach(function(todoItem) {
            var id = todoItem._id;
            if(todoItem.finished) {
                _e._$replaceClassName(id,'hidden','');
            } else {
                _e._$addClassName(id,'hidden');
            }
        })
    }

    /**
     * 点击"Clear Finished"的响应函数
     * @return {Void}
     */
    function onClickClearFinished() {
        _e._$replaceClassName('show-all','selected','');
        _e._$replaceClassName('show-active','selected','');
        _e._$replaceClassName('show-finished','selected','');
        _e._$addClassName(this,'selected');
        _u._$forEach(workItems, function(worker) {
            if (worker._$checked()) {
                worker._todoDelete.click();
            }
        });
        renderData(_data);
    }

    /**
     * 渲染所有todo项的函数
     * @param {Object} _data    todo的数据
     */
    function renderData(_data) {
        var _todoList = _e._$get('todo-list');
        _e._$emptyChildren(_todoList);
        workItems = _e._$getItemTemplate(_data.todos, _p._$$WorkerItem, {
            parent: _todoList,
        });
    }   

    /**
     * 获取被点击的todo的响应函数
     * @param {Object} _event   事件的target
     */
    function getTodoIndex(el) {
        var _id = _e._$attr(_$(el)._$parent('li')[0], 'id');
        var _index;
        _data.todos.forEach(function(todoItem, index) {
            if(todoItem._id === _id) {
                _index = index;
            }
        });
        return _index;
    }

    /**
     * 获取所有todo项的数据
     * @return  {Object}    数据
     */
    function getAllData() {
        _j._$request("http://localhost:3000/api/all", {
            sync: false,
            type: "json",
            data: null,
            method: "GET",
            onload: init,
            onerror: function(_error) {
                console.log(_error);
            }
        })
    }

    /**
     * 创建数据
     * @return  {Object}    数据
     * @param {Object} newTodo  新创建的todo
     */
    function createData(newTodo) {
        _j._$request("http://localhost:3000/api/create", {
            sync: false,
            type: "json",
            data: newTodo,
            method: "POST",
            onload: function(data) {
                _data.todos = data
                renderData(_data)
            },
            onerror: function(_error) {
                console.log(_error);
            }
        })
    }

    /**
     * 更新数据
     * @return  {Object}    数据
     * @param {String} _id  更新后的todo的id
     * @param {Object} currentData 更新后的todo
     */
    function changeData(_id, currentData) {
        var url = "http://localhost:3000/api/change/" + _id;
        _j._$request(url, {
            sync: false,
            type: "json",
            data: currentData,
            method: "PUT",
            onload: function(data) {
                _data.todos = data
                renderData(_data)
            },
            onerror: function(_error) {
                console.log(_error);
            }
        })
    }

    /**
     * 删除数据
     * @return  {Object}    数据
     * @param {String} _id  被删除的todo的id
     */
    function deleteData(_id) {
        var url = "http://localhost:3000/api/delete/" + _id;
        _j._$request(url, {
            sync: false,
            type: "json",
            method: "POST",
            onload: function(data) {
                _data.todos = data
                renderData(_data)
            },
            onerror: function(_error) {
                console.log(_error);
            }
        })
    }

    getAllData(); //先获取数据然后在初始化
};

define(['{lib}ui/item/item.js', '{lib}util/template/tpl.js', '{lib}util/chain/NodeList.js'], f);        
