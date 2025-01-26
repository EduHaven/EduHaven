const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler (req,res,next);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
            
        }
    }
};

export default TryCatch