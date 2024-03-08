export default (req, res, next)=> {
    res.success = (data, info, statusCode = 200) => {
        res.json({
            statusCode: statusCode,
            data: data || {},
            info: info || {}
        })
    }
    next();
};