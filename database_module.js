let fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Database {

    isDbCreatedDefault = false;
    isDbCreated = false;
    default_location = {
        location: `${__dirname}/db/db.json`,
        folder: "db",
        fileName: "db.json",
    }
    location = this.default_location['location'];

    //Can be used for logging, I use it for testing. ( this.cl() )
    cl = console.log

    prompt(x) {
        rl.question(x, answ => {
            if (["y", "yes"].some(x => x == answ) && !this.isDbCreated) {
                fs.mkdir(this.default_location['folder'], err => {
                    if (err) return `An err occured! ${err}`
                    fs.appendFile(this.default_location['location'], '{"keys":[]}', (err) => {
                        if (err) return `An err occured! ${err}`
                        this.isDbCreated = true;
                        this.isDbCreatedDefault = true;
                    })
                })
                return this.cl(`Directory Added! (${this.default_location['location']})`)
            }
        })
        return this.isDbCreated;
    }

    load() {
        var location = this.location
        if (this.isDbCreatedDefault) location = this.default_location['location'];
        return fs.readFileSync(location, "utf8", (err, data) => {
            if (err) {
                if (!this.isDbCreated) return `Error! Please create database, to get info Invoke db.help()`
                this.cl(`Error! file (${location}) unknown.`)
                return
            }
            return data
        })
    }

    save(userData) {
        var location = this.location
        if (this.isDbCreatedDefault) location = this.default_location['location'];

        try {
            var data = JSON.parse(this.load())
            var isFounded = data['keys'].findIndex(keys => keys.key == userData.key);
            if (isFounded != -1) {
                data['keys'][isFounded].index = userData.index;
            } else {
                data['keys'].push(userData)
            }
            return fs.writeFile(location, JSON.stringify(data), err => {
                if (err) return err
            })
        } catch {
            return this.cl('Saving Error!')
        }
    }

    create(directory, fileName) {
        if (this.isDbCreated) return this.cl(`Database declared already!`)

        try {
            return fs.mkdir(directory, err => {
                if (err) return `An err occured! ${err}`
                return fs.appendFile(`${directory}/${fileName}`, '{"keys":[]}', (err) => {
                    if (err) return `An err occured! ${err}`
                    this.isDbCreated = true;
                    return true
                })
            })
        } catch {
            if (fs.existsSync(directory)) return this.isDbCreated = true;
            if (fs.existsSync(`${__dirname}/${this.default_location['folder']}`)) {
                this.isDbCreatedDefault = true;
                this.isDbCreated = true;
                return this.cl('Database Connected!')
            }
            this.prompt(`Do you want to create file with default directory? (y/n)\n>> `);
        }
    }

    get(userKey) {
        var db = this;

        function recursion(x) {
            if (db.isDbCreated == false) {
                setTimeout(() => {
                    recursion();
                }, 1000)
            } else {
                try {
                    return JSON.parse(db.load())['keys'].find(keys => keys.key == userKey)['index']
                } catch {
                    db.cl(`Error! No keys found.`)
                }
            }
        }

        return recursion()
    }

    set(userKey, userIndex) {

        let promise = new Promise((resolve, reject) => {
            if (this.isDbCreated == false) {
                setTimeout(() => {
                    resolve(true)
                }, 1000)
            } else {
                setTimeout(() => {
                    reject()
                }, 2000)
            }
        })

        promise.then(result => {
            if (result) return this.set(userKey, userIndex)
        }).catch(() => {
            return this.save({
                key: userKey,
                index: userIndex
            })
        })

    }

}

var database = new Database;

module.exports = database;