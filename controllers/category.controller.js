const { response } = require('express');

const Category = require('../models/category');

const index = async(req, res = response) => {
    let { limit = 5, since = 0 } = req.query;
    const query = { state:true };

    limit = Number(limit);
    since = Number(since);
    
    const [ total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('created_by', 'name')
            .skip(since)
            .limit(limit)
    ]);

    res.json({
        total,
        categories
    });
}

const get = async(req, res = response) => {
    const id = req.params.id;
    const query = { _id:id, state:true };
    const category = await Category.findById(query).populate('created_by', 'name');

    res.json({
        category
    });
}

const save = async(req, res = response) => {
    const name  = req.body.name.toUpperCase();

    const data = { name, created_by: req.uid }
    const category = new Category(data);

    const cat = await Category.findOne({ name });
    if(cat){
        if(!cat.state){
            await cat.updateOne({ state:true });
            return res.status(201).json({
                msg: 'Success',
                category
            });
        }

        return res.status(400).json({
            msg: `La categoria ${ cat.name } ya existe`
        });
    }

    //Guarda el documento
    await category.save();

    res.status(201).json({
        msg: 'Success',
        category
    });
}

const update = async(req, res = response) => {
    const id = req.params.id;
    const name  = req.body.name.toUpperCase();

    const cat = await Category.findOne({ name });
    if(cat){
        return res.status(400).json({
            msg: `La categoria ${ cat.name } ya existe`
        });
    }
    //new:true permite mostrar en la respuesta la categoria actualizada
    const category = await Category.findByIdAndUpdate(id, { name }, { new:true });

    res.json({
        msg: 'Category update success',
        category
    });
}

const remove = async(req, res = response) => {
    const id = req.params.id;

    await Category.findByIdAndUpdate(id, { state:false });

    res.json({
        msg: 'Category deleted success'
    });
}

module.exports = { 
    index,
    get,
    save,
    update,
    remove,
}