const jwt = require('jsonwebtoken')

const authMiddleWare = async(req,res,next)=>{
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(401).json({
            success : false,
            message : 'No token provided'
        })
    }

    try{

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        req.userInfo = decodedToken

        next()
    }

    catch(e){
        console.log('Error from authMiddleware')
        res.status(403).json({
            success : false,
            message : 'No token provided'
        })
    }
}

module.exports = authMiddleWare