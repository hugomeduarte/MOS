var pool = require("./connection");

module.exports.getAllBuoys = async function() {
    try {
        let sql ="select * from boia "+
        "inner join regiao "+
        "on regiao_id_fk=regiao_id";
        let result = await pool.query(sql);
        let buoy = result.rows;
        return { status:200, result:buoy};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}

module.exports.getBuoyById = async function(id) {
    try {
        let sql = "select * from boia "+
        "inner join regiao "+
        "on regiao_id_fk=regiao_id "+
        "where boia_id = $1;";
        let result = await pool.query(sql,[id]);
        if (result.rows.length > 0)  
            return {status: 200, result: result.rows[0] };
        else return {status: 404, result: {msg: "Bóia não encontrada"}};
    } catch(err) {
        console.log(err);
        return {status:500, result: err};
    }
}

