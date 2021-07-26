function home(req,res){
    return res.json({
        'status':200,
        'msg':'Signaling Server for EHRC-Telemedicine application is up'
    })
}

module.exports={home};