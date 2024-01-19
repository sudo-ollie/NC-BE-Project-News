const fs = require('fs/promises')

exports.fetchEndpoints = () => {
    return fs.readFile('./endpoints.json' , 'utf-8')
    .then((jsonContents) => {
        const parsedContents = JSON.parse(jsonContents)
        return parsedContents
    })
    .catch((err) => {
        throw new Error("File Doesn't Exist" , err) 
    })
}