var pool = require("./connection");

module.exports.getAllParticipations = async function() {
    try {
        let sql ="Select * from participacao";
        let result = await pool.query(sql);
        let participations = result.rows;
        return { status:200, result:participations};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}

module.exports.insertParticipation = async function(participation) {
    try {
        let capacity = "select coalesce((select count(*) from participacao "+
        "inner join eventos "+
        "on evento_id_FK = evento_id "+
        "where evento_id_fk = $1 "+
        "group by evento_vagas),0);";
        let resultcapacity = await pool.query(capacity,[participation.eventId]);
        let eventvacancies = "select evento_vagas from eventos "+
		"where evento_id=$1;";
        console.log(participation.eventId);
        let resulteventvacancies = await pool.query(eventvacancies,[participation.eventId]);
            if(resultcapacity.rows[0].coalesce >= resulteventvacancies.rows[0].evento_vagas) {
                return { status:400, result: {err: "Não há vagas disponíveis"}};
            }
        let alreadysign = "select utilizador_id_fk from participacao "+
        "where evento_id_fk = $1 and utilizador_id_fk = $2;";
        let resultalreadysign = await pool.query(alreadysign,[participation.eventId,participation.userId]);
            if(resultalreadysign.rows.length > 0) {
                return { status:400, result: {err: "Já está inscrito no evento"}};
            }
        let eventdepth = "select * from eventos "+
        "inner join boia "+
        "on boia_id_fk = boia_id "+
        "where evento_id = $1;";
        let resulteventdepth = await pool.query(eventdepth,[participation.eventId]);
        let userlicense = "select * from utilizador "+
        "inner join licenca "+
        "on licenca_id_fk=licenca_id "+
        "where util_id = $1;";
        let resultuserlicense = await pool.query(userlicense,[participation.userId]);
            if(resulteventdepth.rows[0].boia_profundidade > resultuserlicense.rows[0].licenca_profundidade) {
                return { status:400, result: {err: "Não tem os requisitos de certificação"}};
            }
        let sql ="insert into participacao (participacao_validar, participacao_pontos, utilizador_id_FK ,evento_id_FK) values (false, 0, $1 ,$2);";
        let result = await pool.query(sql,[participation.userId,participation.eventId]);
        return { status:200, result:result.rows[0]};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}

module.exports.RemoveParticipationById = async function(id) {
    try {
        let event ="select * from participacao "+
        "inner join eventos "+
        "on evento_id_fk = evento_id "+
        "where participacao_id = $1;";
        let eventresult = await pool.query(event,[id]);

        let todaydate = new Date().getDate();
        let yesterdayeventdate = new Date(eventresult.rows[0].evento_data).getDate()-1;
        if(todaydate === yesterdayeventdate) {
            return { status:400, result: {err: "Não pode cancelar um dia antes do evento!"}};
        }

        let sql ="DELETE FROM participacao "+
        "WHERE participacao_id = $1;";
        let result = await pool.query(sql,[id]);
        return { status:200, result:result.rows[0]};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}