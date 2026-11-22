const express = require('express');
const verifierJeton = require('../middlewares/jeton');
const controleur = require('../controllers/commentaires.controller');

const router = express.Router();

router.get('/articles/:id/commentaires', controleur.lister);                  
router.post('/articles/:id/commentaires', controleur.creer);               
router.get('/commentaires', controleur.parVisiteur);              
router.get('/commentaires/:id', controleur.trouver);                 
router.patch('/commentaires/:id', verifierJeton, controleur.modifier);         
router.delete('/commentaires/:id', verifierJeton, controleur.supprimer);

module.exports = router;