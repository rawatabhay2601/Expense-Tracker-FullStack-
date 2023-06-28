const ListOfFiles = require('../models/listDownloadFile');

exports.listOfFiles = async (req,res,next) => {
    try{
        const userId = req.user._id;
        const response = await ListOfFiles.find({ userId : userId });
        return res.status(201).json({success: response, message:'Successful'});
    }
    catch(err){
        return res.status(500).json({message:'Failed'});
    }
};

exports.addFileUrl = async (req,res) => {
    
    try{
        const fileUrl = req.fileUrl;
        const userId = req.user._id;
        await ListOfFiles.create({url: fileUrl, userId: userId});
        return res.status(201).json({success : fileUrl, message : "Successful"});
    }
    catch(err){
        return res.status(500).json({message : "Failed"});
    }
};