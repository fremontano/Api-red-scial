//Acciones
const publication = (req, res) => {
    return res.status(200).send({
        message: 'Test publication'
    });
};

// Exportar acciones
module.exports = {
    publication
};
