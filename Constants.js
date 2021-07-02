const EVENTS={
    CONNECT:'connect',
    JOIN:'join',
    SEND_METADATA:'send-metadata',
    ICE_CANDIDATE:'ice-candidate',
    OFFER:'offer',
    ANSWER:'answer',
    DISCONNECT:'disconnect',
}

const URIS={
    CREATE_ROOM:'/createRoom',
    JOIN_ROOM:'/joinRoom',
}

const URLS={
    FRONTEND_ENDPOINT:'http://localhost:4200',
}

module.exports={EVENTS,URIS,URLS}