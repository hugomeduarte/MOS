var pool = require("./connection");

module.exports.getAllHarbors = async function() {
    try {
        let sql ="select * from porto "+
        "inner join regiao "+
        "on regiao_id_fk=regiao_id;";
        let result = await pool.query(sql);
        let harbor = result.rows;
        return { status:200, result:harbor};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}

module.exports.getHarborById = async function(id) {
    try {
        let sql = "select * from porto "+
        "inner join regiao "+
        "on regiao_id_fk=regiao_id "+
        "where porto_id = $1;";
        let result = await pool.query(sql,[id]);
        if (result.rows.length > 0)  
            return {status: 200, result: result.rows[0] };
        else return {status: 404, result: {msg: "Porto não encontrado"}};
    } catch(err) {
        console.log(err);
        return {status:500, result: err};
    }
}