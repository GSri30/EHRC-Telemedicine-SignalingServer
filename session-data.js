class SessionData{
    static namespaces = {};
    static socket_namespace = {};
    static io;

    static setNamespace(namespace_id,namespace){
        SessionData.namespaces[namespace_id] = namespace;
    }

    static setSocketNamespace(namespace_id,namespace){
        SessionData.socket_namespace[namespace_id]=namespace;
    }

    static setIO(newIO){
        SessionData.io=newIO;
    }

    static removeNamespace(namespace_id){
        delete SessionData.namespaces[namespace_id];
    }

    static getSocketNamespace(namespace_id){
        return SessionData.socket_namespace[namespace_id]
    }
    static removeSocketNamespace(namespace_id){
        delete SessionData.socket_namespace[namespace_id];
    }
}

module.exports={SessionData};