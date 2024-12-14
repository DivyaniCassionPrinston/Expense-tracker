const { config } = require('dotenv');
const IncomeSchema = require('../models/incomeModel');

exports.addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    console.log('Received data:', req.body);

    if (!title || !category || !description || !date) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
        return res.status(400).json({ message: 'Invalid date format!' });
    }
    const income = new IncomeSchema({
        title,
        amount,
        category,
        description,
        date: parsedDate, 
    });

    try {
        await income.save();
        res.status(200).json({ message: 'Income Added' });
        console.log('Income Added:', income);
    } catch (error) {
        console.error('Error Saving Income:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getIncomes = async (req, res) =>{
    try {
        const incomes = await IncomeSchema.find().sort({createdAt: -1})
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
};


exports.deleteIncome = async (req, res) =>{
    const {id} = req.params;
    IncomeSchema.findByIdAndDelete(id)
        .then((income) =>{
            res.status(200).json({message: 'Income Deleted'})
        })
        .catch((err) =>{
            res.status(500).json({message: 'Server Error'})
        })
};