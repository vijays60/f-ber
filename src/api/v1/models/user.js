var uniqid = require('uniqid');

//constructor
function User({ 
    id, name
}){
    this.id = id ? id : uniqid();
    this.name = name ? name : '';
}

User.prototype.toJSON = function(){
    return {
        id: this.id,
        name: this.name
    };
}

module.exports = User;
