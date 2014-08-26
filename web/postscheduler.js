// Requires
var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var snuownd = require('snuownd');
var swig = require('swig');
var fibrous = require('fibrous');
var url = require('url');

var app = express();
app.use(express.bodyParser());
app.use(fibrous.middleware);

// EDIT THIS USERNAME/PASSWORD
app.use(express.basicAuth('user', 'password'));

// Static directory
app.use('/static', express.static('static'));

var db = new sqlite3.Database("../posts.db");

function getFlairs() {
    return db.sync.all("SELECT * FROM flair ORDER BY `text` ASC");
}

app.get('/', function(req, res) {
    schedposts = db.sync.all("SELECT * FROM posts WHERE posted = 0 ORDER BY datetime(posttime) ASC");
    pastposts = db.sync.all("SELECT * FROM posts WHERE posted = 1 ORDER BY datetime(posttime) DESC LIMIT 50");

    res.send(swig.renderFile('templates/index.thtml',
        { pagetitle: 'Reddit Post Scheduler', schedposts: schedposts, pastposts: pastposts}
    ));
});

app.get('/new', function(req, res) {
    flair = getFlairs();
    res.send(swig.renderFile('templates/edit.thtml',
        {
            pagetitle: 'Schedule a New Reddit Post',
            id: 0,
            content: '',
            flairs: flair
        }
    ));
});

app.get('/new/from/:fromid', function(req, res) {
    frompost = db.sync.get("SELECT * FROM posts WHERE id = " + req.params.fromid);
    flair = getFlairs();
    if (frompost === undefined) {
        res.setHeader('Location', '/');
        res.send(302);
    }
    res.send(swig.renderFile('templates/edit.thtml',
        {
            pagetitle: 'Schedule a New Reddit Post',
            title: frompost.title,
            id: 0,
            content: frompost.content,
            flairs: flair,
            sflair: frompost.flairid
        }
    ));
});

app.get('/edit/:editid', function(req, res) {
    editpost = db.sync.get("SELECT * FROM posts WHERE id = " + req.params.editid);
    flair = getFlairs();
    if (editpost === undefined) {
        res.setHeader('Location', '/');
        res.send(302);
    }
    res.send(swig.renderFile('templates/edit.thtml',
        {
            pagetitle: 'Edit Scheduled Post',
            title: editpost.title,
            id: editpost.id,
            content: editpost.content,
            posttime: editpost.posttime,
            flairs: flair,
            sflair: editpost.flairid
        }
    ));
});

app.get('/pastpost/:pastid', function(req, res) {
    editpost = db.sync.get("SELECT * FROM posts WHERE id = " + req.params.pastid);
    flair = getFlairs();
    if (editpost === undefined) {
        res.setHeader('Location', '/');
        res.send(302);
    }
    res.send(swig.renderFile('templates/edit.thtml',
        {
            pagetitle: 'View Past Post',
            title: editpost.title,
            id: editpost.id,
            content: editpost.content,
            posttime: editpost.posttime,
			readonly: true,
            flairs: flair,
            sflair: editpost.flairid
        }
    ));
});

// New post / Edit post
app.post('/edit', function(req, res) {
    var dtre = /^20\d{2}-((0[1-9])|(1[0-2]))-((0[1-9])|([1-2][0-9])|(3[0-1]))\s(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])$/
    if (!dtre.test(req.body.posttime)) {
        res.send(400, "I don't like that date/time. Care to go back and try again?");
        return;
    }
    flair = req.body.flair;
    if (flair == "") { flair = null; }
    if (req.body.id == 0) {
        db.run("INSERT INTO posts (title, content, time, posttime, flairid) VALUES " +
            "(?, ?, datetime('now', 'localtime'), ?, ?)",
            [req.body.title, req.body.content, req.body.posttime, flair]
        );
    }
    else {
        db.run("UPDATE posts SET title = ?, content = ?, posttime = ?, flairid = ?" +
            "WHERE id = " + req.body.id,
            [req.body.title, req.body.content, req.body.posttime, flair]
        );
    }
    
    res.setHeader('Location', '/');
    res.send(302);
});

// Delete post
app.get('/delete/:deleteid', function(req, res) {
    db.sync.run("DELETE FROM posts WHERE id = ?", [req.params.deleteid]);
    res.setHeader('Location', '/');
    res.send(302);
});

// Markup parser for previews
app.get('/rmarkup', function(req, res) {
    params = url.parse(req.url, true).query;
    if (params.text) {
        output = snuownd.getParser().render(params.text);
        res.setHeader('Content-Type', 'text/html');
        res.send(output);
    }
    else {
        res.send(400);
    }
});

// Handy redirect for subreddits/users (this was just for lols)
app.get('/r/:subreddit', function(req, res) {
    res.setHeader('Location', 'http://reddit.com/r/' + req.params.subreddit);
    res.send(302);
});

app.get('/u/:user', function(req, res) {
    res.setHeader('Location', 'http://reddit.com/u/' + req.params.user);
    res.send(302);
});

app.listen(3000);
