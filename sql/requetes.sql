-- =============================================================================
-- PARTIE A · Question 3 · Six requetes
-- Sous chaque question : votre requete, puis le resultat obtenu, en commentaire.
-- =============================================================================

-- R1. Les commentaires de l'article 2, du plus recent au plus ancien : nom, texte.
SELECT nom, texte
FROM commentaires
WHERE article_id = 2
ORDER BY cree_le DESC;
/*
2 rows returned
    nom     texte

1	Inès	Des photos de la pose seraient les bienvenues.
2	Hugo	Le noyer est magnifique. Combien de temps pour le séchage ?
*/

-- R2. Le nombre de commentaires de CHAQUE article, y compris ceux qui n'en ont aucun :
--     id, titre, nb_commentaires.
SELECT articles.id, articles.titre, COUNT(commentaires.id) AS nb_commentaires
FROM articles
LEFT JOIN commentaires ON commentaires.article_id = articles.id
GROUP BY articles.id, articles.titre;
/*
6 rows returned
    id  titre                                       nb_commentaires
1	4	Restaurer une chaise paillée	            2
2	6	Affûter ses ciseaux à bois	                0
3	2	Une bibliothèque sur mesure à Besançon	    2
4	3	Huile ou vernis : ce qui protège vraiment	0
5	5	Une cuisine en chêne massif à Dole	        1
6	1	Choisir son bois pour une table de jardin	3
*/

-- R3. Les articles qui n'ont aucun commentaire : id, titre.
SELECT articles.id, articles.titre
FROM articles
LEFT JOIN commentaires ON commentaires.article_id = articles.id
GROUP BY articles.id, articles.titre
HAVING COUNT(commentaires.id) = 0;
/*
2 rows returned
    id  titre
1	6	Affûter ses ciseaux à bois
2	3	Huile ou vernis : ce qui protège vraiment
*/

-- R4. Pour chaque auteur, le nombre total de commentaires recus sur ses articles,
--     du plus commente au moins commente.
SELECT auteurs.id, auteurs.prenom, COUNT(commentaires.id) AS nb_total_commentaires_sur_articles
FROM auteurs
JOIN articles ON articles.auteur_id = auteurs.id
JOIN commentaires ON commentaires.article_id = articles.id
GROUP BY auteurs.id, auteurs.prenom
ORDER BY nb_total_commentaires_sur_articles DESC;
/*
3 rows returned
    id  prenom  nb_total_commentaires_sur_articles
1	1	Marc	5
2	2	Sophie	2
3	3	Théo	1

*/

-- R5. Les visiteurs (nom) qui ont commente plus d'un article.
SELECT nom
FROM commentaires
GROUP BY nom
HAVING COUNT(DISTINCT article_id) > 1;
/*
1 row returned
    nom
1	Claire
*/

-- R6. Les trois commentaires les plus recents, avec le titre de leur article.
SELECT commentaires.nom, commentaires.texte, commentaires.cree_le, articles.titre
FROM commentaires 
JOIN articles ON articles.id = commentaires.article_id
ORDER BY commentaires.cree_le DESC
LIMIT 3;
/*
3 rows returned
    nom     texte                                                           cree_le                 titre
1	Karim	Superbe travail.	                                            2026-10-18 19:47:00+02	Une cuisine en chêne massif à Dole
2	Claire	Aucune vis visible : comment sont fixés les caissons ?	        2026-10-16 14:22:00+02	Restaurer une chaise paillée
3	Lucie	J'ai une chaise à faire refaire, vous prenez les commandes ?	2026-10-09 09:00:00+02	Restaurer une chaise paillée
*/