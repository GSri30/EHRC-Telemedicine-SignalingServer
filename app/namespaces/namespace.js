var {contains_namespace,create_namespace,remove_namespace, check_availability} = require('../socket/socket');

function createNamespace(req,res){
    let namespace_id = req.query['namespaceId'];
    
    if (contains_namespace(namespace_id)) {
        return res.json({
            'status': 200,
            'msg': 'Namespeace already exists.'
        });
    } 
    
    create_namespace(namespace_id)
    return res.json({
        'status': 200,
        'msg': 'Namespace added successfully.'
    });
}

function removeNamespace(req,res){
    let namespace_id = req.query['namespaceId'];
    remove_namespace(namespace_id);
    return res.json({
        'status': 200,
        'msg': 'Namespace removed successfully'
    });
}

function checkAvailability(req,res){
    let namespace_id = req.query['namespaceId'];
    if(check_availability(namespace_id)){
        return res.json({
            'status': 200,
            'msg': 'Doctor is available',
            'availability': true
        });
    }
    return res.json({
        'status': 200,
        'msg': 'Doctor is not available',
        'availability': false
    });
}

module.exports = {createNamespace,removeNamespace,checkAvailability};