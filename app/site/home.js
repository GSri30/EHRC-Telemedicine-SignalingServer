function home(req,res){
    return res.json({
        'status':200,
        'msg':'Signaling Server for telecommunication is up'
    })
}

module.exports={home};