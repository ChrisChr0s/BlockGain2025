import ratelimiter from "../config/upstash.js";

const RateLimite = async (req, res, next )=>{
    try {
        const {success} = await ratelimiter.limit(req.ip)

        if(!success){
            return res.status(429).json({message:"Too many resquests, please try again later"});
        }

        next();
    } catch (error) {
        console.log("Rate limit error", error)
        next(error);
    }
}

export default RateLimite;