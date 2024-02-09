const fs = require('fs').promises;


const FILENAME = "properties.json";

let load = async () => {
    try {
        const data = await fs.readFile(FILENAME);
        return JSON.parse(data); 
    } catch (error) {
        return {}
    }
};

let save = async (obj) => {
    await fs.writeFile(FILENAME, JSON.stringify(obj));
};

let saveProperties = async (name, value) => {
    let obj = await load();
    obj[name] = value;
    await save(obj);
};


let removeProperties = async (name) => {
    let obj = await load();
    delete obj[name]
    await save(obj);
};

let loadProperties = async (name) => {
    const obj = await load();
    return obj[name];
};

module.exports = {save, load, saveProperties, removeProperties, loadProperties}
