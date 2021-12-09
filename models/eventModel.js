var pool = require("./connection");

module.exports.getAllEvents = async function() {
    try {
        let sql ="Select * from eventos";
        let result = await pool.query(sql);
        let events = result.rows;
        return { status:200, result:events};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}

module.exports.insertEvent = async function(event) {
    try {
        let todaydate = new Date();
        let eventdate = new Date(event.date);
        if(eventdate.getTime() < todaydate.getTime()) {
            return { status:400, result: {err: "Data inválida"}};
        }
        let eventexists = "select * from eventos "+
        "inner join boia "+
        "on boia_id_fk = boia_id "+
        "where boia_id = $1 and evento_data > CURRENT_DATE;";
        let resulteventexists = await pool.query(eventexists,[event.buoyId]);
            if(resulteventexists.rows.length > 0) {
                return { status:400, result: {err: "Evento já existe"}};
            }
        if(event.vacancies < 5) {
            return { status:400, result: {err: "Número de vagas inválidas"}};
        }
        let sql ="Insert into eventos (evento_data,evento_vagas,boia_id_FK,porto_id_FK, temporada_id_FK) values ($1,$2,$3,$4,$5);";
        let result = await pool.query(sql,[event.date,event.vacancies,event.buoyId,event.harborId,event.seasonId]);
        return { status:200, result:result.rows};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}

module.exports.getAllAvailableEvents = async function() {
    try {
        let sql ="select * from eventos "+
        "inner join boia "+
        "on boia_id_fk = boia_id "+
        "inner join porto "+
        "on porto_id_fk = porto_id "+
        "where evento_data > CURRENT_DATE;";
        let result = await pool.query(sql);
        let events = result.rows;
        return { status:200, result:events};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}

module.exports.getParticipantsByEventId = async function(evento_id_FK) {
    try {
        let sql ="select participacao_id,util_id, util_nome, util_admin, licenca_id, licenca_nome, licenca_profundidade from utilizador "+
        "inner join licenca "+
        "on licenca_id_fk=licenca_id "+
        "inner join participacao "+
        "on utilizador_id_FK=util_id "+
        "where evento_id_fk = $1 "+
        "order by participacao_id;";
        let result = await pool.query(sql,[evento_id_FK]);
        let events = result.rows;
        return { status:200, result:events};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}

module.exports.getAvailableEventsCountbyBuoyId = async function(buoyId) {
    try {
        let sql ="select count(*) from eventos "+
        "inner join boia "+
        "on boia_id_fk = boia_id "+
        "where boia_id = $1 and evento_data > CURRENT_DATE;";
        let result = await pool.query(sql,[buoyId]);
        if (result.rows.length > 0)  
            return {status: 200, result: result.rows[0] };
        else return {status: 404, result: {msg: "Evento não encontrado"}};
    } catch(err) {
        console.log(err);
        return {status:500, result: err};
    }
} 

module.exports.RemoveEventById = async function(id) {
    try {
        let event ="select evento_data from eventos "+
        "where evento_id = $1;";
        let eventresult = await pool.query(event,[id]);

        let todaydate = new Date().getDate();
        let yesterdayeventdate = new Date(eventresult.rows[0].evento_data).getDate()-1;
        if(todaydate === yesterdayeventdate) {
            return { status:400, result: {err: "Não pode cancelar um dia antes do evento!"}};
        }
        let sql ="DELETE FROM eventos "+
        "WHERE evento_id = $1;";
        let result = await pool.query(sql,[id]);
        return { status:200, result:result.rows[0]};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}

module.exports.getLastEventId = async function() {
    try {
        let sql ="SELECT max(evento_id) "+
        "FROM eventos "+
        "LIMIT 1;";
        let result = await pool.query(sql);
        if (result.rows.length > 0)  
            return {status: 200, result: result.rows[0] };
        else return {status: 404, result: {msg: "Evento não encontrado"}};
    } catch(err) {
        console.log(err);
        return {status:500, result: err};
    }
} 
