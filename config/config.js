//change port depending on which port is running

//PORT
process.env.PORT = process.env.PORT || 3000

//ENVIROMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//DATABASE
let urlBD

// if (process.env.NODE_ENV === 'dev') {
//     urlBD = 'mongodb://localhost:27017/cafe'
// }
// else {
// }
urlBD = 'mongodb+srv://tiktaktoe:35Kqmt7Q4OXDW6cK@cluster0-mh3ac.mongodb.net/cafe'

process.env.URLDB = urlBD