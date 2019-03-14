const source = [
    {
        image: 'https://s3.amazonaws.com/uifaces/faces/twitter/mrebay007/128.jpg',
        name: 'Melvin chipimo',
        subheader: 'Computer Programmer',
        date: 'January 11, 2014',
        email: 'ubncmrfm@gmail.com',
        state: 'online'
    },
    {
        image: 'https://s3.amazonaws.com/uifaces/faces/twitter/mrebay007/128.jpg',
        name: 'Kelvin chipimo',
        subheader: 'Computer Programmer',
        date: 'January 11, 2014',
        email: 'ubncmrfm@gmail.com',
        state: 'offline'
    },
    {
        image: 'https://s3.amazonaws.com/uifaces/faces/twitter/mrebay007/128.jpg',
        name: 'Wendy Muyumbwe',
        subheader: 'Computer Programmer',
        date: 'January 11, 2014',
        email: 'wendyfmchipimo@gmail.com',
        state: 'online'
    }
]

function ClientQuery(params, callback) {
    callback(source)
}

module.exports = {
    ClientQuery
}