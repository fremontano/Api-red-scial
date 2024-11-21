//Acciones
const follow = (req, res) => {
    return res.status(200).send({
        message: 'Test follow'
    });
};




// Exportar acciones
module.exports = {
    follow
};
