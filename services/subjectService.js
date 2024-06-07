if(!subjectName || !image){
    throw new CustomError.BadRequestError('All fields are required');
}

const subjectExist = await Subject.findOne({ subjectName });

if (subjectExist) {
    throw new CustomError.BadRequestError('Subject name already exist');
}

const subject = await Subject.create({ subjectName, createdBy: req.userId});

res.status(201).json({ data: subject, message: 'Subject created successfully' });