-- =============================================================================
-- PARTIE A · Question 3 · Six requetes
-- Sous chaque question : votre requete, puis le resultat obtenu, en commentaire.
-- =============================================================================

-- R1. Les commentaires de l'article 2, du plus recent au plus ancien : nom, texte.
SELECT nom, texte
FROM commentaires
WHERE article_id = 2
ORDER BY cree_le DESC;

-- R2. Le nombre de commentaires de CHAQUE article, y compris ceux qui n'en ont aucun :
--     id, titre, nb_commentaires.
SELECT articles.id, articles.titre, COUNT(commentaires.id) AS nb_commentaires
FROM articles
LEFT JOIN commentaires ON commentaires.article_id = articles.id
GROUP BY articles.id, articles.titre;

-- R3. Les articles qui n'ont aucun commentaire : id, titre.
SELECT articles.id, articles.titre
FROM articles
LEFT JOIN commentaires ON commentaires.article_id = articles.id
HAVING COUNT(commentaires.id) = 0;

-- R4. Pour chaque auteur, le nombre total de commentaires recus sur ses articles,
--     du plus commente au moins commente.
SELECT auteurs.id, auteurs.nom, COUNT(commentaires.id) AS nb_total_commentaires_sur_articles
FROM auteurs
JOIN articles ON articles.auteur_id = auteurs.id
JOIN commentaires ON commentaires.article_id = articles.id
GROUP BY auteurs.id, auteurs.nom
ORDER BY nb_total_commentaires_sur_articles DESC;


-- R5. Les visiteurs (nom) qui ont commente plus d'un article.
SELECT nom
FROM commentaires
GROUP BY nom
HAVING COUNT(DISTINCT article_id) > 1;

-- R6. Les trois commentaires les plus recents, avec le titre de leur article.
