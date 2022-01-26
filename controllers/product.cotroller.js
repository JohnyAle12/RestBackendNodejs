const { response } = require('express');
const Product = require('../models/product');

const index = async(req, res = response) => {
    let { limit = 5, since = 0 } = req.query;
    const query = { state:true };

    limit = Number(limit);
    since = Number(since);
    
    const [ total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('created_by', 'name')
            .populate('category', 'name')
            .skip(since)
            .limit(limit)
    ]);

    res.json({
        total,
        products
    });
}

const get = async(req, res = response) => {
    const id = req.params.id;
    const query = { _id:id, state:true };
    const product = await Product.findById(query)
        .populate('created_by', 'name')
        .populate('category', 'name');

    res.json({
        product
    });
}

const save = async(req, res = response) => {
    const { created_by, state, ...params}  = req.body;
    params.created_by = req.uid;
    const product = new Product(params);

    const productExist = await Product.findOne({ name:params.name });
    if(productExist){
        if(!productExist.state){
            await productExist.updateOne({ state:true });
            return res.status(201).json({
                msg: 'Success',
                productExist
            });
        }

        return res.status(400).json({
            msg: `El producto ${ productExist.name } ya existe`
        });
    }

    //Guarda el documento
    await product.save();

    res.status(201).json({
        msg: 'Success',
        product
    });
}

const update = async(req, res = response) => {
    const id = req.params.id;
    const { created_by, state, ...params }  = req.body;

    const productExist = await Product.findOne({ name:params.name });
    if(productExist){
        return res.status(400).json({
            msg: `El producto ${ productExist.name } ya existe`
        });
    }
    //new:true permite mostrar en la respuesta la categoria actualizada
    const product = await Product.findByIdAndUpdate(id, params, { new:true });

    res.json({
        msg: 'Product update success',
        product
    });
}

const remove = async(req, res = response) => {
    const id = req.params.id;

    await Product.findByIdAndUpdate(id, { state:false });

    res.json({
        msg: 'Product deleted success'
    });
}

module.exports = { 
    index,
    get,
    save,
    update,
    remove,
}