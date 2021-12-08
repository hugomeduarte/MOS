var pool = require("./connection");

module.exports.getAllUsers = async function() {
    try {
        let sql ="Select * from utilizador";
        let result = await pool.query(sql);
        let users = result.rows;
        return { status:200, result:users};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}

module.exports.login = async function(nome,password) {
    try {
        let sql ="Select * from utilizador where util_nome = $1 and util_password = $2";
        let result = await pool.query(sql,[nome,password]);
        if (result.rows.length > 0)
            return { status:200, result:result.rows[0]};
        else return { status:401, result: {msg: "Nome ou password errada"}};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}

module.exports.getUserById = async function(id) {
    try {
        let sql = "select * from utilizador "+
        "inner join licenca "+
        "on licenca_id_fk=licenca_id "+
        "where util_id = $1;";
        let result = await pool.query(sql,[id]);
        if (result.rows.length > 0)  
            return {status: 200, result: result.rows[0] };
        else return {status: 404, result: {msg: "Utilizador não encontrado"}};
    } catch(err) {
        console.log(err);
        return {status:500, result: err};
    }
} 

module.exports.getUserPointsBySeason = async function(id,season) {
    try {
        let sql = "select SUM(participacao_pontos) "+
        "from participacao "+
        "inner join eventos "+
        "on evento_id_FK=evento_id "+
        "inner join temporada "+
        "on temporada_id_FK=temporada_id "+
        "where utilizador_id_FK = $1 and temporada_numero = $2;";
        let result = await pool.query(sql,[id,season]);
        if (result.rows.length > 0)  
            return {status: 200, result: result.rows[0] };
        else return {status: 404, result: {msg: "Pontos não encontrados"}};
    } catch(err) {
        console.log(err);
        return {status:500, result: err};
    }
} 

module.exports.getUserParticipations = async function(userId,seasonId,filter) {
    try {
        let sql;
        if(filter == "all") {
        sql = "select * from participacao "+
        "inner join eventos "+
        "on evento_id_fk = evento_id "+
        "inner join boia "+
        "on boia_id_fk = boia_id "+
        "where utilizador_id_fk = $1 and temporada_id_fk = $2"+
        "group by evento_id,evento_data,participacao_id,boia_id "+
        "order by evento_data < CURRENT_DATE;";
        }
        if(filter == "future") {
            sql = "select * from participacao "+
            "inner join eventos "+
            "on evento_id_fk = evento_id "+
            "inner join boia "+
            "on boia_id_fk = boia_id "+
            "where utilizador_id_fk = $1 and temporada_id_fk = $2 and evento_data > CURRENT_DATE "+
            "group by evento_id,evento_data,participacao_id,boia_id "+
            "order by evento_data < CURRENT_DATE;";
        }
        if(filter == "past") {
            sql = "select * from participacao "+
            "inner join eventos "+
            "on evento_id_fk = evento_id "+
            "inner join boia "+
            "on boia_id_fk = boia_id "+
            "where utilizador_id_fk = $1 and temporada_id_fk = $2 and evento_data < CURRENT_DATE "+
            "group by evento_id,evento_data,participacao_id,boia_id "+
            "order by evento_data < CURRENT_DATE;";
        }
        let result = await pool.query(sql,[userId,seasonId]);
        return { status:200, result:result.rows};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
} 