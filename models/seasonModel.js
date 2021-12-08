var pool = require("./connection");

module.exports.getAllSeasons = async function() {
    try {
        let sql ="Select * from temporada";
        let result = await pool.query(sql);
        let season = result.rows;
        return { status:200, result:season};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}

module.exports.getSeasonByCURRENT_DATE = async function() {
    try {
        let sql = "select * from temporada where CURRENT_DATE between temporada_datainicio and temporada_datafim;";
        let result = await pool.query(sql);
        if (result.rows.length > 0)  
            return {status: 200, result: result.rows[0] };
        else return {status: 404, result: {msg: "Season não encontrada"}};
    } catch(err) {
        console.log(err);
        return {status:500, result: err};
    }
} 

