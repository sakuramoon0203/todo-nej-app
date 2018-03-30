var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'), //mongo连接
Todo = mongoose.model('Todo')

//返回主页
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// api ---------------------------------------------------------------------
//返回所有todo项数据
router.get('/api/all', function (req, res) {
    getTodos(res);
});

//创建一个新的todo项，创建完成以后返回todo项数据
router.post('/api/create', function (req, res) {
    Todo.create({
        title: req.body.title,
        finished: false
    }, function (err, todo) {
        if (err)
            res.send(err);
        getTodos(res);
    });

});

//更新todo项数据
router.put('/api/change/:todo_id', function (req, res) {
    Todo.findById(req.params.todo_id, function (err, todo) {
        todo.title = req.body.title;
        todo.finished = req.body.finished;
        todo.save(function (err, todoID) {
            if (err)
                res.send(err);
            getTodos(res);
        })
    });

});


//删除todo项
router.post('/api/delete/:todo_id', function (req, res) {
    Todo.remove({
        _id: req.params.todo_id
    }, function (err, todo) {
        if (err)
            res.send(err);
        getTodos(res);
    });
});

//获取所有todo项数据函数
function getTodos(res) {
    Todo.find(function (err, todos) {
        if (err) {
            res.send(err);
        }
        res.json(todos); //返回json格式的所有todo项数据
    });
};

module.exports = router;
