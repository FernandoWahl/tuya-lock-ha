/** @param { import('express').Express } app */
module.exports = app => {
    let _data = {};

    this.getData = () => _data
    this.setData = (data) => _data = data

    return this
};