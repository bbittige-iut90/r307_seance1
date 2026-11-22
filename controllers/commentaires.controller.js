
const service = require('../services/commentaires.service');
const ErreurHttp = require('../utils/erreur-http');

function lister(req, res, next) {
  const id = Number(req.params.id);
  service.lister(id)
    .then((commentaires) => res.json(commentaires))
    .catch(next);
}

function creer(req, res, next) {
  const articleId = Number(req.params.id);
  const { nom, texte } = req.body || {};
  if (!nom || !texte) {
    return next(new ErreurHttp(400, 'CHAMP_MANQUANT', 'Les champs nom et texte sont obligatoires.'));
  }
  service.creer(articleId, { nom, texte })
    .then((commentaire) => res.status(201).json(commentaire))
    .catch(next);
}

function parVisiteur(req, res, next) {
  const { nom } = req.query;
  if (!nom || typeof nom !== 'string') {
    return next(new ErreurHttp(400, 'NOM_MANQUANT', 'Le paramètre nom est obligatoire : ?nom=Claire.'));
  }
  service.parVisiteur(nom)
    .then((commentaires) => res.json(commentaires))
    .catch(next);
}

function trouver(req, res, next) {
  const id = Number(req.params.id);
  service.trouver(id)
    .then((commentaire) => res.json(commentaire))
    .catch(next);
}

function modifier(req, res, next) {
  const id = Number(req.params.id);
  const { texte } = req.body || {};
  if (!texte) {
    return next(new ErreurHttp(400, 'TEXTE_MANQUANT', 'Le champ texte est obligatoire.'));
  }
  service.modifier(id, { texte })
    .then((commentaire) => res.json(commentaire))
    .catch(next);
}

function supprimer(req, res, next) {
  const id = Number(req.params.id);
  service.supprimer(id)
    .then(() => res.status(204).end())
    .catch(next);
}

module.exports = { lister, creer, parVisiteur, trouver, modifier, supprimer };
