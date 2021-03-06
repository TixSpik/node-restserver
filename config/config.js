//change port depending on which port is running

//PORT
process.env.PORT = process.env.PORT || 3000

//ENVIROMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//TOKEN EXPIRATION
process.env.TOKEN_EXPIRATION = '48h'

//SEED
process.env.SEED = process.env.SEED || 'seed-dev'

//DATABASE
let urlBD

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe'
}
else {
    urlBD = process.env.URIDB
}

process.env.URLDB = urlBD

//GOOGLE CLIENT_ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '653861652908-ni6umsd0hq5buffbtkad913dtk80er26.apps.googleusercontent.com'