const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signUp = async(req,res)=>{
    try{
        const {username,email,password} = req.body;

        const checkIfExistingUser = await User.findOne({$or:[{username},{email}]});

        if(checkIfExistingUser){
            return res.status(400).json({
                success : false,
                message : 'User already exists with either email or name'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt)


        const newUser = new User({
            username,
            email,
            password : hashPassword
        })

        await newUser.save()

        if(newUser){
            res.status(201).json({
                success : true,
                message : 'User has been created'
            })
        }
        else{
            res.status(400).json({
                success : false,
                message : 'Unable to registre user.Please try again'
            })
        }

    }
    catch(e){
        console.log('Error from sign up\n',e)
        res.status(500).json({
            success : false,
            message : 'Somthing went wrong with signup'
        })
    }
}

const login = async(req,res)=>{
    try{
        const {username,password} = req.body;

        const existingUser = await User.findOne({username});

        if(!existingUser){
            return res.status(400).json({
                success : false,
                message : 'User does not exist'
            })
        }

        const isPasswordMtach = await bcrypt.compare(password,existingUser.password)

        if(!isPasswordMtach){
            return res.status(400).json({
                success : false,
                message : 'Wrong password,please try again'
            })
        }
        
        const token = jwt.sign(
            { 
                userId : existingUser._id,
                username : existingUser.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn : '1h'
            }
        )

        res.status(200).json({
            success : true,
            message : 'Logged in successful',
            token : token
        })
    }

    catch(e){
        console.log('Error from log in\n',e)
        res.status(500).json({
            success : false,
            message : 'Somthing went wrong with login'
        })
    }
}

module.exports = {
    signUp,
    login
}