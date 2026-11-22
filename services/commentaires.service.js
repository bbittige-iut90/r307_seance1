// SERVICE des commentaires · VERSION FICHIER JSON (celle de depart).
// Elle respecte le contrat (CONTRAT.md) : le cote API peut s'en servir tout de suite pour tester
// ses routes. Le cote base la remplace par une version PostgreSQL, avec les MEMES fonctions.
// Les articles, eux, sont deja dans PostgreSQL (services/articles.service.js).
const pool = require('../db/pool');
const ErreurHttp = require('../utils/erreur-http');

const introuvable = (id) => new ErreurHttp(404, 'COMMENTAIRE_INTROUVABLE', `Le commentaire ${id} n'existe pas.`);
const articleIntrouvable = (id) => new ErreurHttp(404, 'ARTICLE_INTROUVABLE', `L'article ${id} n'existe pas.`);

function traduire(err) {
  if (err.code === '23514' || err.code === '23502') return new ErreurHttp(400, 'VALEUR_REFUSEE', `Valeur refusée par la base (${err.constraint}).`);
  if (err.code === '22P02') return new ErreurHttp(400, 'TYPE_INVALIDE', 'Une valeur n’a pas le bon type.');
  return err;
}


async function lister(articleId) {
  //await articles.trouver(articleId); // 404 si l'article n'existe pas
  //const tous = await lire();
  //return tous.filter((c) => c.article_id === articleId).sort((a, b) => a.cree_le.localeCompare(b.cree_le));
  
  if (!Number.isInteger(id)) throw articleIntrouvable(id);
  //JOIN articles ON articles.id = commentaires.article_id
  const article = await pool.query(
    `SELECT id FROM articles WHERE id = $1`,[articleId]
  );
  if (article.rowCount === 0) throw articleIntrouvable(articleId);
  const resultat = await pool.query(
    `SELECT id, article_id, nom, texte, cree_le 
    FROM commentaires 
    WHERE article_id = $1 
    ORDER BY cree_le ASC`, [articleId]
  );
  return resultat.rows;
}

async function trouver(id) {
  //const commentaire = (await lire()).find((c) => c.id === id);
  //if (!commentaire) throw introuvable(id);
  //return commentaire;

  if (!Number.isInteger(id)) throw introuvable(id);
  const resultat = await pool.query(
    `SELECT id, article_id, nom, texte, cree_le
    FROM commentaires
    WHERE id = $1`,[id]
  );
  if (resultat.rowCount === 0) throw introuvable(id);
  return resultat.rows[0];
}

async function parVisiteur(nom) {
  //const siens = (await lire()).filter((c) => c.nom === nom).sort((a, b) => b.cree_le.localeCompare(a.cree_le));
  //const resultat = [];
  //for (const c of siens) {
  //  const article = await articles.trouver(c.article_id);
  //  resultat.push({ id: c.id, article_id: c.article_id, titre: article.titre, texte: c.texte, cree_le: c.cree_le });
  //}
  //return resultat;

  const resultat = await pool.query(
    `SELECT commentaires.id, commentaires.article_id, commentaires.texte, commentaires.cree_le, articles.titre
    FROM commentaires
    JOIN articles ON articles.id = commentaires.article_id
    WHERE commentaires.nom = $1
    ORDER BY commentaires.cree_le DESC`,[nom]
  );
  return resultat.rows;
}

async function creer(articleId, { nom, texte }) {
  //await articles.trouver(articleId);
  //const tous = await lire();
  //const id = tous.length === 0 ? 1 : Math.max(...tous.map((c) => c.id)) + 1;
  //const commentaire = { id, article_id: articleId, nom, texte, cree_le: new Date().toISOString() };
  //tous.push(commentaire);
  //await ecrire(tous);
  //return commentaire;

  if (!Number.isInteger(articleId)) throw articleIntrouvable(articleId);
  try {
    const resultat = await pool.query(
      `INSERT INTO commentaires (article_id, nom, texte)
      VALUES ($1, $2, $3)
      RETURNING id, article_id, nom, texte, cree_le`,[articleId,nom,texte]
    );
    if (resultat.rowCount === 0) {
      throw new ErreurHttp(400, 'AUTEUR_INCONNU', `Aucun auteur ne s'appelle ${donnees.auteur}.`);
    }
    return resultat.rows[0];
  } catch (err) {
    throw traduire(err);
  }
}

// https://docs.postgresql.fr/12/dml-returning.html
async function modifier(id, { texte }) {
  //const tous = await lire();
  //const commentaire = tous.find((c) => c.id === id);
  //if (!commentaire) throw introuvable(id);
  //commentaire.texte = texte;
  //await ecrire(tous);
  //return commentaire;
  
  if (!Number.isInteger(id)) throw introuvable(id);
  try {
    const resultat = await pool.query(
    `UPDATE commentaires
    SET texte = $1
    WHERE id = $2
    RETURNING id, article_id, nom, texte, cree_le`,[texte,id]
    );
  } catch (err) {
    throw traduire(err)
  }
}

async function supprimer(id) {
  //const tous = await lire();
  //const restants = tous.filter((c) => c.id !== id);
  //if (restants.length === tous.length) throw introuvable(id);
  //await ecrire(restants);

  if (!Number.isInteger(id)) throw introuvable(id);
  const resultat = await pool.query(
    `DELETE FROM commentaires WHERE id = $1`,[id]
  );
  if (resultat.rowCount === 0) throw introuvable(id);
}

module.exports = { lister, trouver, parVisiteur, creer, modifier, supprimer };
