var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var ToDo = mongoose.model('ToDo',{
    text: String
})


mongoose.connect('mongodb://127.0.0.1:27017/demo_connection');

app.use(express.static(__dirname + 'public'));

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({'extended': 'true'}));

app.use(bodyParser.json());

app.use(bodyParser.json({type : 'application/vnd.api+json'}));

app.use(methodOverride());

app.use(express.static(__dirname + '/public'));

app.get('/api/todos', function(req, res){
    ToDo.find(function(err,todos){
        if(err){
            res.send(err);
        }
        res.json(todos);
    });
});

app.post('/api/todos', function(req, res){
    console.log('POST REQUEST RECIEVED');
    ToDo.create({
        text:req.body.text,
        done: false
    }, function(err, todos){
        if(err){
            res.send(err);
        }
        ToDo.find(function(err, todos){
            if(err){
                res.send(err);
            }
            res.json(todos);
        });
    });
});

app.delete('/api/todos/:todo_id', function(req, res){
    ToDo.remove({
        _id: req.params.todo_id
    }, function(err, todo){
        if(err){
            res.send(err);
        }

        ToDo.find(function(err, todos){
            if(err){
                res.send(err);
            }
            res.json(todos)
        });
    });
});

app.get('*', function(req, res){
    res.sendFile(__dirname+ '/public/index.html');
})


app.listen(3000);

console.log('The web server is liestening to the poret no 3000');
