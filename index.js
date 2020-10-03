var db = require('./database_module');
db['location'] = `${__dirname}/xd.json`;
db['create']();

db['set']('ad', 'biri');

var pass = db['get']('ad');

db.cl(pass);
