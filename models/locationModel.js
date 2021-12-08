var pool = require("./connection");

module.exports.getAllLocations = async function() {
    try {
        let sql ="select * from localizacao "+
        "inner join regiao "+
        "on regiao_id_fk=regiao_id";
        let result = await pool.query(sql);
        let location = result.rows;
        return { status:200, result:location};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}

module.exports.getLocationById = async function(id) {
    try {
        let sql = "select * from localizacao "+
        "inner join regiao "+
        "on regiao_id_fk=regiao_id "+
        "where localizacao_id = $1;";
        let result = await pool.query(sql,[id]);
        if (result.rows.length > 0)  
            return {status: 200, result: result.rows[0] };
        else return {status: 404, result: {msg: "Localização não encontrada"}};
    } catch(err) {
        console.log(err);
        return {status:500, result: err};
    }
} 

