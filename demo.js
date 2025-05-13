const bcrypt = require('bcrypt');
console.log(bcrypt.hashSync('123456a', 10))