// ==UserScript==
// @name         RGPD Quiz AutoFill Multi-Modules
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto-remplissage des quiz RGPD pour tous les modules
// @author       leonFvt
// @match        https://atelier-rgpd.cnil.fr/mod/quiz/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Configuration des modules
    const QUIZ_MODULES = {
    "module1": {
        "moduleIdentifiers": [
            "MODULE 1",
            "RGPD ET SES NOTIONS CLÉS",
            "LE RGPD ET SES NOTIONS"
        ],
        "questions": {
            "questions": [
                {
                    "id": 1,
                    "title": "Sélectionner l’institution qui répond à la définition :",
                    "type": "match",
                    "answers": [
                        {
                            "text": "Veille à ce que la législation de l’UE soit interprétée et appliquée de la même manière dans tous les pays de l’UE et garantit que les pays et les institutions de l’UE respectent la législation européenne.",
                            "correct": true,
                            "match": "CJUE"
                        },
                        {
                            "text": "Coordonne l’action des autorités de protection des données des États membres.",
                            "correct": true,
                            "match": "EDPB"
                        },
                        {
                            "text": "Aide les particuliers à maîtriser leurs droits, accompagne les professionnels dans leur mise en conformité et sanctionne les organismes qui ne respectent pas la réglementation.",
                            "correct": true,
                            "match": "CNIL"
                        }
                    ]
                },
                {
                    "id": 2,
                    "title": "Qui est le responsable de traitement pour la gestion du dossier professionnel des salariés ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "L'entreprise",
                            "correct": true
                        },
                        {
                            "text": "Le directeur des ressources humaines",
                            "correct": false
                        },
                        {
                            "text": "Le dirigeant",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 3,
                    "title": "Parmi les données suivantes se rapportant à une personne physique, quelles sont celles qui, prises isolément, sont qualifiables de « données à caractère personnel » ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Code postal",
                            "correct": false
                        },
                        {
                            "text": "Numéro de téléphone direct",
                            "correct": true
                        },
                        {
                            "text": "Photographie",
                            "correct": true
                        },
                        {
                            "text": "Numéro d’immatriculation du véhicule",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 4,
                    "title": "Une personne physique utilise une application de stockage et d’échange de documents pour partager ses photos de famille, est-elle soumise aux obligations du RGPD ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Oui",
                            "correct": false
                        },
                        {
                            "text": "Non",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 5,
                    "title": "Julie est interrogée au hasard dans la rue par un organisme de sondage. En tout 3 questions lui sont posées : Regardez-vous la télévision ? La regardez-vous tous les jours ? Combien de temps par jour ? L’organisme de sondage ne collecte pas d’informations supplémentaires.S’agit-il d’un sondage anonyme ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Oui",
                            "correct": true
                        },
                        {
                            "text": "Non",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 6,
                    "title": "Parmi ces organismes, lesquels sont concernés par le RGPD ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Une administration publique",
                            "correct": true
                        },
                        {
                            "text": "Une école",
                            "correct": true
                        },
                        {
                            "text": "Une association",
                            "correct": true
                        },
                        {
                            "text": "Un auto-entrepreneur",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 7,
                    "title": "Parmi ces organismes, lesquels sont soumis au RGPD ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Un organisme établi en dehors de l’UE qui propose des biens ou services à des personnes qui se trouvent sur le territoire de l’UE",
                            "correct": true
                        },
                        {
                            "text": "Un organisme établi dans l’UE qui traite des données personnelles",
                            "correct": true
                        },
                        {
                            "text": "Un organisme établi en dehors de l’UE qui ne traite que des données personnelles de personnes situées en dehors de l’UE.",
                            "correct": false
                        },
                        {
                            "text": "Un organisme établi dans l’Union européenne qui traite des données de personnes qui se trouvent sur le territoire de l’UE.",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 8,
                    "title": "Une entreprise dispose d’un fichier de ses fournisseurs dans lequel figurent des adresses électroniques de contacts. Le RGPD ne s’applique pas à ce fichier car il s’agit d’informations collectées dans un cadre professionnel.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 9,
                    "title": "Parmi ces affirmations concernant la CNIL, lesquelles sont correctes ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "La CNIL a été créée en 1978",
                            "correct": true
                        },
                        {
                            "text": "Elle est investie d’un pouvoir de sanction depuis le RGPD",
                            "correct": false
                        },
                        {
                            "text": "La CNIL est une autorité administrative indépendante",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 10,
                    "title": "Un organisme peut être à la fois responsable de traitement et sous-traitant",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": true
                        },
                        {
                            "text": "Faux",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 11,
                    "title": "Une entreprise japonaise met en œuvre au Japon un dispositif de gestion du personnel de ses salariés, parmi lesquels figurent des expatriés français. Ce traitement est soumis au RGPD car des ressortissants européens sont concernés.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 12,
                    "title": "Une association culturelle a pour habitude de faire compléter à ses adhérents une fiche de renseignement. Chaque fiche est classée par ordre alphabétique dans un classeur dédié. Le RGPD s’applique-t-il ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Oui",
                            "correct": true
                        },
                        {
                            "text": "Non",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 13,
                    "title": "Le fichier de pointage des horaires des agents d’une collectivité est-il un traitement de données soumis au RGPD ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Oui",
                            "correct": true
                        },
                        {
                            "text": "Non",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 14,
                    "title": "Le responsable de traitement d’un site de vente en ligne est :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "L’entreprise qui héberge le site",
                            "correct": false
                        },
                        {
                            "text": "L’organisme à l’initiative de la création du site",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 15,
                    "title": "Une donnée publique n’est jamais considérée comme une donnée personnelle.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                }
            ],
            "metadata": {
                "totalQuestions": 15,
                "types": [
                    "truefalse",
                    "multiple",
                    "match"
                ],
                "timestamp": "2024-12-23T12:34:25.698310",
                "sourceFile": "M1.html"
            }
        }
    },
    "module2": {
        "moduleIdentifiers": [
            "MODULE 2",
            "RGPD ET SES NOTIONS CLÉS",
            "LE RGPD ET SES NOTIONS"
        ],
        "questions": {
            "questions": [
                {
                    "id": 1,
                    "title": "L’archivage intermédiaire des données doit obligatoirement se concrétiser par un stockage des données sur un support totalement distinct de la base active.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 2,
                    "title": "Lorsqu’une personne s’oppose au traitement de ses données auprès d’un organisme, celui-ci :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Peut refuser de donner une suite favorable à la demande si une disposition légale rend obligatoire le traitement",
                            "correct": true
                        },
                        {
                            "text": "Peut demander à la personne de justifier sa demande si le traitement en cause n’a pas pour objectif la prospection",
                            "correct": true
                        },
                        {
                            "text": "Doit nécessairement apporter une suite favorable à la requête si le motif présenté est légitime",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 3,
                    "title": "Le responsable de traitement peut refuser de donner suite à l’exercice d’un droit si :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Donner suite demande un effort disproportionné",
                            "correct": false
                        },
                        {
                            "text": "La personne a déjà exercé ce droit plusieurs fois et sa demande est manifestement infondée ou excessive.",
                            "correct": true
                        },
                        {
                            "text": "Il peut prouver que les données sont anonymes",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 4,
                    "title": "L’actualisation des données contenues dans les fichiers vient satisfaire le principe de minimisation des données.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 5,
                    "title": "Dans le cadre de transferts de données vers un pays « non adéquat », l’organisme n’as pas besoin d’autorisation si :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Il recourt aux clauses contractuelles types (CCT) adoptées par la Commission européenne",
                            "correct": true
                        },
                        {
                            "text": "Il met en place des clauses contractuelles spécifiques",
                            "correct": false
                        },
                        {
                            "text": "Il met en place des règles d’entreprise contraignantes (BCR)",
                            "correct": true
                        },
                        {
                            "text": "La personne a donné son consentement",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 6,
                    "title": "Parmi ces données, lesquelles font l’objet d’un encadrement particulier par les dispositions légales européennes et nationales ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Les opinions politiques",
                            "correct": true
                        },
                        {
                            "text": "Les coordonnées bancaires",
                            "correct": false
                        },
                        {
                            "text": "Les données de santé",
                            "correct": true
                        },
                        {
                            "text": "Les données génétiques",
                            "correct": true
                        },
                        {
                            "text": "L’appartenance syndicale",
                            "correct": true
                        },
                        {
                            "text": "Les données relatives aux infractions",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 7,
                    "title": "La situation suivante présente-t-elle un détournement de finalité ? L’utilisation par une commune, à des fins de mise à jour de ses fichiers d’usagers, des données collectées pour le compte de l’INSEE dans le cadre du recensement de la population.",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Oui",
                            "correct": true
                        },
                        {
                            "text": "Non",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 8,
                    "title": "L’obligation de veiller à la sécurité des données personnelles impose le chiffrement systématique de celles-ci .",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 9,
                    "title": "La loi autorise les autorités publiques à accéder aux données personnelles détenues par les organismes sans devoir fournir de justificatif.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 10,
                    "title": "Les organismes saisis de demandes de personnes exerçant leurs droits doivent répondre à celles-ci dans le délai d’un mois.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": true
                        },
                        {
                            "text": "Faux",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 11,
                    "title": "Quelles catégories de données peuvent être placées en archivage intermédiaire ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Toutes les autres données susceptibles de présenter un intérêt dans l’avenir",
                            "correct": false
                        },
                        {
                            "text": "Les données soumises à une obligation légale de conservation",
                            "correct": true
                        },
                        {
                            "text": "Les données utiles en cas de contentieux",
                            "correct": true
                        },
                        {
                            "text": "Toutes autres données",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 12,
                    "title": "Le droit à la portabilité n’existe que pour les traitements fondés sur un contrat ou le consentement des personnes concernées.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": true
                        },
                        {
                            "text": "Faux",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 13,
                    "title": "Les données personnelles qui ne sont plus d’utilisation courante par les services opérationnels concernés doivent être nécessairement détruites ou anonymisées si elles ne présentent pas un intérêt historique, statistique ou scientifique.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 14,
                    "title": "En France, à partir de quel âge un mineur peut-il consentir lui-même à un traitement ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "16 ans",
                            "correct": false
                        },
                        {
                            "text": "14 ans",
                            "correct": false
                        },
                        {
                            "text": "15 ans",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 15,
                    "title": "Les personnes concernées doivent nécessairement être informées :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Du droit de saisir la CNIL d’une réclamation",
                            "correct": true
                        },
                        {
                            "text": "De la durée de conservation des données",
                            "correct": true
                        },
                        {
                            "text": "Du fondement juridique du traitement",
                            "correct": true
                        },
                        {
                            "text": "De l’identité du représentant légal de l’organisme ou de la personne responsable du service chargé de traiter les données",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 16,
                    "title": "L’encadrement d’un transfert de données vers un pays « non adéquat » par des clauses contractuelles types est en soi suffisant pour s’assurer que les données des personnes concernées seront protégées.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 17,
                    "title": "Puis-je transférer des données vers un pays non adéquat si les personnes concernées ont donné leur consentement ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Occasionnellement, si le transfert n’est pas répétitif et en cas de nécessité.",
                            "correct": true
                        },
                        {
                            "text": "Oui, cela est utile si je ne parviens pas à trouver de mesures supplémentaires pour garantir le niveau de protection garanti par les CCT ;",
                            "correct": false
                        }
                    ]
                }
            ],
            "metadata": {
                "totalQuestions": 17,
                "types": [
                    "multiple",
                    "truefalse"
                ],
                "timestamp": "2024-12-23T13:52:26.981727",
                "sourceFile": "M2.html"
            }
        }
    },
    "module3": {
        "moduleIdentifiers": [
            "MODULE 3",
            "RGPD ET SES NOTIONS CLÉS",
            "LE RGPD ET SES NOTIONS"
        ],
        "questions": {
            "questions": [
                {
                    "id": 1,
                    "title": "Documenter les activités de traitement consiste à réunir et à tenir à jour les documents suivants :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Analyses d’impact réalisées",
                            "correct": true
                        },
                        {
                            "text": "Registre des violations",
                            "correct": true
                        },
                        {
                            "text": "Formulaires de recueil du consentement",
                            "correct": true
                        },
                        {
                            "text": "Registre des traitements mis en œuvre",
                            "correct": true
                        },
                        {
                            "text": "Mentions d’information utilisées",
                            "correct": true
                        },
                        {
                            "text": "Contrats de sous-traitance en cours",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 2,
                    "title": "Le registre des activités de traitement doit être tenu par :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Les responsables de traitement et les sous-traitants",
                            "correct": true
                        },
                        {
                            "text": "Les sous-traitants uniquement",
                            "correct": false
                        },
                        {
                            "text": "Les responsables de traitement uniquement",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 3,
                    "title": "Le principe d’Accountability est défini par le fait de devoir :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Documenter les mesures prises pour respecter le RGPD",
                            "correct": true
                        },
                        {
                            "text": "Prendre en compte la sécurité des données dès la conception et par défaut",
                            "correct": true
                        },
                        {
                            "text": "Déclarer à la CNIL les traitements de données personnelles",
                            "correct": false
                        },
                        {
                            "text": "Améliorer sans cesse les mesures mises en place pour assurer une conformité dynamique",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 4,
                    "title": "La CNIL peut prononcer une sanction seulement si l’organisme concerné n’a pas respecté une mise en demeure de se conformer au RGPD.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 5,
                    "title": "Désigner une autorité chef de file sert à gérer plus facilement les échanges avec les autorités de contrôle en cas de :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Sous-traitance ultérieure",
                            "correct": false
                        },
                        {
                            "text": "Co-responsabilité sur un traitement",
                            "correct": false
                        },
                        {
                            "text": "Traitements transfrontaliers",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 6,
                    "title": "Concernant les opérations de traitement, les sous-traitants doivent s’en tenir aux instructions données par le responsable de traitement sous forme documentée.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": true
                        },
                        {
                            "text": "Faux",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 7,
                    "title": "Les personnes victimes d’un préjudice peuvent être représentées par une association pour exercer une action en leur nom",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": true
                        },
                        {
                            "text": "Faux",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 8,
                    "title": "Toute personne considérant qu’un traitement de données la concernant ne respecte pas le RGPD peut effectuer une réclamation auprès de l’autorité de contrôle de l’Etat membre où la violation du RGPD aurait été commise :",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": true
                        },
                        {
                            "text": "Faux",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 9,
                    "title": "Lorsqu’une personne exerce un de ses droits (droit d’accès par exemple) auprès d’un coresponsable de traitement qui n’est pas en charge de traiter ce genre de demande, celui-ci doit :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Informer le coresponsable de traitement de la demande afin qu’une réponse soit apportée à la personne concernée",
                            "correct": true
                        },
                        {
                            "text": "Donner à la personne les coordonnées du coresponsable en charge du traitement de ces demandes",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 10,
                    "title": "Les sanctions liées au non-respect des principes fondamentaux du RGPD (finalité, minimisation, durée de conservation…) ou des droits des personnes peuvent s’élever jusqu’à :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "4% du chiffre d’affaire ou 20 millions d’euros",
                            "correct": true
                        },
                        {
                            "text": "2% du chiffre d’affaire ou 10 millions d’euros",
                            "correct": false
                        },
                        {
                            "text": "6% du chiffre d’affaire ou 40 millions d’euros",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 11,
                    "title": "La mise en demeure et la sanction sont des procédures confidentielles qui ne peuvent pas être portées à la connaissance du public.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 12,
                    "title": "En cas de \"sous-traitance ultérieure\", le sous-traitant peut être sanctionné pour une faute commise par le \"sous-traitant ultérieur\" qu’il a choisi.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": true
                        },
                        {
                            "text": "Faux",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 13,
                    "title": "En cas de traitement transfrontalier les autorités de protection des données concernées peuvent être amenées à s’entendre pour que, selon le cas d’espèce, une seule décision de sanction soit prise au nom de toutes les autorités.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": true
                        },
                        {
                            "text": "Faux",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 14,
                    "title": "Au sein d'un groupe de sociétés, une société peut être le sous-traitant d'une autre société, cette dernière agissant en tant que responsable du traitement",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": true
                        },
                        {
                            "text": "Faux",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 15,
                    "title": "On parle de responsabilité conjointe dès lors que 2 responsables de traitements ont déterminé la finalité et les moyens du traitement de façon égalitaire :",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                }
            ],
            "metadata": {
                "totalQuestions": 15,
                "types": [
                    "multiple",
                    "truefalse"
                ],
                "timestamp": "2024-12-23T13:52:31.182704",
                "sourceFile": "M3.html"
            }
        }
    },
    "module4": {
        "moduleIdentifiers": [
            "MODULE 4",
            "RGPD ET SES NOTIONS CLÉS",
            "LE RGPD ET SES NOTIONS"
        ],
        "questions": {
            "questions": [
                {
                    "id": 1,
                    "title": "Il y a violation de données personnelles lorsque les données ont fait l’objet d’une perte de :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Disponibilité",
                            "correct": false
                        },
                        {
                            "text": "D’intégrité",
                            "correct": false
                        },
                        {
                            "text": "Confidentialité",
                            "correct": false
                        },
                        {
                            "text": "Les 3 réponses possibles",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 2,
                    "title": "Un organisme public doit obligatoirement désigner un délégué à la protection des données.",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Faux, cela dépend de la nature de ses traitements",
                            "correct": false
                        },
                        {
                            "text": "Vrai",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 3,
                    "title": "Les missions du délégué à la protection des données sont :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Sanctionner",
                            "correct": false
                        },
                        {
                            "text": "Réaliser l’analyse d’impact",
                            "correct": false
                        },
                        {
                            "text": "Contrôler",
                            "correct": true
                        },
                        {
                            "text": "Informer et conseiller",
                            "correct": true
                        },
                        {
                            "text": "Coopérer avec la CNIL",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 4,
                    "title": "En cas de violation de données représentant un risque élevé pour la vie privée des personnes, le responsable de traitement doit :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Informer la CNIL",
                            "correct": false
                        },
                        {
                            "text": "Informer directement les personnes concernées",
                            "correct": false
                        },
                        {
                            "text": "Les deux",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 5,
                    "title": "Le traitement suivant nécessite-t-il de réaliser une analyse d’impact ? Vidéosurveillance d’un entrepôt stockant des biens de valeurs au sein duquel travaillent des manutentionnaires.",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Oui",
                            "correct": true
                        },
                        {
                            "text": "Non",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 6,
                    "title": "Le responsable de la sécurité des systèmes d’informations (RSSI) d’une société peut-il être désigné DPO de cette société ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Oui",
                            "correct": false
                        },
                        {
                            "text": "Non",
                            "correct": false
                        },
                        {
                            "text": "Ça dépend",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 7,
                    "title": "Il n’est pas nécessaire de réaliser une analyse d’impact lorsque les traitements ne représentent pas un risque élevé pour les droits et libertés des personnes",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": true
                        },
                        {
                            "text": "Faux",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 8,
                    "title": "La certification est obligatoire pour les organismes soumis au RGPD",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 9,
                    "title": "Le responsable de traitement d’une société doit-il obligatoirement communiquer le registre de sa société si une personne le lui demande ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Oui",
                            "correct": false
                        },
                        {
                            "text": "Non",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 10,
                    "title": "Quel est le délai maximal pour notifier une violation de données à la CNIL ?",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "24h",
                            "correct": false
                        },
                        {
                            "text": "45h",
                            "correct": false
                        },
                        {
                            "text": "72h",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 11,
                    "title": "La certification des « compétences du DPO » est délivrée",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Sans limitation de durée",
                            "correct": false
                        },
                        {
                            "text": "Pour 3 ans",
                            "correct": true
                        },
                        {
                            "text": "Pour 10 ans",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 12,
                    "title": "Le registre doit obligatoirement être tenu par le responsable de l’organisme.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                },
                {
                    "id": 13,
                    "title": "Les entreprises ayant adhéré à ces codes de conduite doivent obligatoirement les appliquer.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": true
                        },
                        {
                            "text": "Faux",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 14,
                    "title": "La certification des « compétences du DPO » est délivrée par :",
                    "type": "multiple",
                    "answers": [
                        {
                            "text": "Un organisme certificateur",
                            "correct": true
                        },
                        {
                            "text": "La CNIL",
                            "correct": false
                        },
                        {
                            "text": "Une université",
                            "correct": false
                        }
                    ]
                },
                {
                    "id": 15,
                    "title": "Le responsable de traitement peut donner des instructions au délégué à la protection des données sur la manière d’analyser les résultats d’un audit.",
                    "type": "truefalse",
                    "answers": [
                        {
                            "text": "Vrai",
                            "correct": false
                        },
                        {
                            "text": "Faux",
                            "correct": true
                        }
                    ]
                }
            ],
            "metadata": {
                "totalQuestions": 15,
                "types": [
                    "truefalse",
                    "multiple"
                ],
                "timestamp": "2024-12-23T13:52:37.343494",
                "sourceFile": "M4.html"
            }
        }
    }
};

// Styles CSS
    GM_addStyle(`
        .quiz-control-panel {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            min-width: 250px;
        }
        .quiz-control-panel h3 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
            color: #333;
        }
        .quiz-control-panel button {
            margin: 5px 0;
            padding: 8px 15px;
            width: 100%;
            cursor: pointer;
        }
        .module-info {
            font-size: 12px;
            margin-bottom: 10px;
            padding: 5px;
            background: #f5f5f5;
            border-radius: 4px;
        }
        .debug-info {
            font-size: 11px;
            color: #666;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #eee;
        }
        .controls-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        .checkbox-container {
            display: flex;
            align-items: center;
            padding: 5px;
            background: #f8f8f8;
            border-radius: 4px;
            flex-shrink: 0;
        }
        .auto-next-checkbox {
            margin-right: 8px;
        }
        .checkbox-container label {
            font-size: 12px;
            color: #666;
            user-select: none;
            cursor: pointer;
        }
    `);

    function log(...args) {
        console.log('[RGPD Quiz]', ...args);
    }

    function saveAutoNextState(state) {
    localStorage.setItem('rgpdQuizAutoNext', state);
    }

    function getAutoNextState() {
        return localStorage.getItem('rgpdQuizAutoNext') === 'true';
    }

    function triggerEvent(element, eventType) {
        const event = document.createEvent('HTMLEvents');
        event.initEvent(eventType, true, false);
        element.dispatchEvent(event);
    }

    function detectCurrentModule() {
        const pageContent = [
            ...Array.from(document.querySelectorAll('h1, h2, .page-header-headings')).map(el => el.textContent),
            ...Array.from(document.querySelectorAll('.breadcrumb li')).map(el => el.textContent),
        ].join(' ').toUpperCase();

        log('Page content:', pageContent);

        for (const [moduleId, moduleData] of Object.entries(QUIZ_MODULES)) {
            for (const identifier of moduleData.moduleIdentifiers) {
                if (pageContent.includes(identifier.toUpperCase())) {
                    log('Module found:', moduleId, 'via identifier:', identifier);
                    return moduleId;
                }
            }
        }
        return null;
    }

    function findQuestionByTitle(questions, title) {
    // Nettoyer le titre de la question actuelle
    const cleanTitle = title.replace(/\s+/g, ' ')  // Normaliser les espaces
                           .replace(/[?!.,;:«»"*]/g, '') // Enlever la ponctuation
                           .replace(/&nbsp;/g, ' ')  // Remplacer les &nbsp;
                           .replace(/^[0-9]+\.\s*/, '') // Enlever les numéros au début
                           .replace(/\s*:\s*$/, '')  // Enlever les deux points à la fin
                           .toLowerCase()
                           .trim();

    log('Looking for question:', cleanTitle);

    const question = questions.find(q => {
        // Nettoyer le titre de la question dans la base
        const cleanQTitle = q.title.replace(/\s+/g, ' ')
                                 .replace(/[?!.,;:«»"*]/g, '')
                                 .replace(/&nbsp;/g, ' ')
                                 .replace(/^[0-9]+\.\s*/, '')
                                 .replace(/\s*:\s*$/, '')
                                 .toLowerCase()
                                 .trim();

        // Vérifier si les titres correspondent de manière souple
        const match = cleanQTitle === cleanTitle ||
                     cleanTitle.includes(cleanQTitle) ||
                     cleanQTitle.includes(cleanTitle) ||
                     // Comparer les mots significatifs
                     (cleanTitle.split(' ')
                              .filter(word => word.length > 3 && !['dans', 'pour', 'avec', 'les'].includes(word))
                              .every(word => cleanQTitle.includes(word)));

        if (match) {
            log('Question match found:', {original: q.title, cleaned: cleanQTitle});
        }
        return match;
    });

    return question;
}

    function handleMatchQuestion(questionDiv, answers) {
        log('Handling match question');

        // Vérifier si c'est une question d'appariement avec des selects
        const selects = questionDiv.querySelectorAll('select');
        if (selects.length > 0) {
            // Code existant pour les selects
            selects.forEach(select => {
                const questionText = select.closest('tr').querySelector('.text')?.textContent.trim();
                log('Looking for answer for:', questionText);

                const answer = answers.find(a => {
                    const cleanText = questionText.replace(/\s+/g, ' ').trim();
                    return cleanText.includes(a.text) || a.text.includes(cleanText);
                });

                if (answer) {
                    log('Found answer match:', answer.match);
                    const options = Array.from(select.options);
                    const correctOption = options.find(opt =>
                        opt.text.trim() === answer.match.trim()
                    );
                    if (correctOption) {
                        select.value = correctOption.value;
                        triggerEvent(select, 'change');
                    }
                }
            });
        } else {
            // Si pas de selects, traiter comme une question à choix multiple
            handleMultiChoiceQuestion(questionDiv, answers);
        }
    }

    function cleanAnswerText(text) {
        return text.replace(/\s+/g, ' ')
                  .replace(/[?!.,;:«»"*]/g, '')
                  .replace(/^[0-9]+\.\s*/, '')
                  .replace(/\s*:\s*$/, '')
                  .toLowerCase()
                  .trim();
    }

    function answersMatch(text1, text2) {
        const clean1 = cleanAnswerText(text1);
        const clean2 = cleanAnswerText(text2);
        return clean1 === clean2 ||
               clean1.includes(clean2) ||
               clean2.includes(clean1);
    }

    function handleMultiChoiceQuestion(questionDiv, answers) {
        log('Handling multichoice question');

        // Détecte le type réel d'input dans le DOM
        const hasCheckboxes = questionDiv.querySelector('input[type="checkbox"]') !== null;
        const hasRadios = questionDiv.querySelector('input[type="radio"]') !== null;

        log(`Input types detected - Checkboxes: ${hasCheckboxes}, Radio buttons: ${hasRadios}`);

        // Compte les réponses correctes pour validation
        const correctAnswersCount = answers.filter(a => a.correct).length;
        log(`Number of correct answers: ${correctAnswersCount}`);

        if (hasRadios) {
        // Gérer comme des radio buttons
        log('Handling as radio buttons');
        const choices = questionDiv.querySelectorAll('input[type="radio"]');
        choices.forEach(radio => {
            const label = radio.closest('.d-flex')?.querySelector('.flex-fill')?.textContent.trim() ||
                         radio.nextElementSibling?.textContent.trim();

            if (!label) return;

            log('Checking radio option:', label);
            const answer = answers.find(a => answersMatch(label, a.text));

            if (answer?.correct) {
                log('Found correct radio answer:', label);
                setTimeout(() => {
                    radio.checked = true;
                    triggerEvent(radio, 'change');
                    triggerEvent(radio, 'input');
                }, 100);
            }
        });
    } else if (hasCheckboxes) {
            // Gérer comme des checkboxes
            log('Handling as checkboxes');
            const choices = questionDiv.querySelectorAll('.answer > div');
            choices.forEach(choice => {
                const answerText = choice.querySelector('.flex-fill')?.textContent.trim();
                if (!answerText) return;

                log('Checking checkbox option:', answerText);
                const answer = answers.find(a => {
                    const cleanLabel = answerText.replace(/\s+/g, ' ').trim().toLowerCase();
                    const cleanAnswer = a.text.replace(/\s+/g, ' ').trim().toLowerCase();
                    return cleanLabel === cleanAnswer ||
                        cleanLabel.includes(cleanAnswer) ||
                        cleanAnswer.includes(cleanLabel);
                });

                if (answer) {
                    const hiddenInput = choice.querySelector('input[type="hidden"]');
                    const checkbox = choice.querySelector('input[type="checkbox"]');

                    if (hiddenInput && checkbox) {
                        setTimeout(() => {
                            hiddenInput.value = answer.correct ? "1" : "0";
                            checkbox.checked = answer.correct;
                            triggerEvent(checkbox, 'change');
                            triggerEvent(checkbox, 'input');
                        }, 100);
                    }
                }
            });
        }
    }

    function handleTrueFalseQuestion(questionDiv, answers) {
        log('Handling true/false question');
        const inputs = questionDiv.querySelectorAll('input[type="radio"]');
        inputs.forEach(input => {
            const label = input.nextElementSibling?.textContent.trim();
            if (label) {
                log('Checking answer:', label);
                const answer = answers.find(a => a.text.trim() === label);
                if (answer?.correct) {
                    setTimeout(() => {
                        input.checked = true;
                        triggerEvent(input, 'change');
                        triggerEvent(input, 'input');
                    }, 100);
                }
            }
        });
    }

    function autoFillQuestions(moduleId = null, autoNext = false) {
        log('Starting auto-fill process');
        if (!moduleId) {
            moduleId = detectCurrentModule();
        }

        if (!moduleId || !QUIZ_MODULES[moduleId]) {
            alert('Module non reconnu ! Vérifiez la console pour plus de détails.');
            return;
        }

        const questions = QUIZ_MODULES[moduleId].questions.questions;
        log('Found questions for module:', questions.length);

        const questionDivs = document.querySelectorAll('div[id^="question-"]');
        log('Found question divs on page:', questionDivs.length);

        questionDivs.forEach((questionDiv, index) => {
            log(`Processing question div ${index + 1}`);
            const titleElement = questionDiv.querySelector('.qtext');
            if (!titleElement) {
                log('No title element found for question');
                return;
            }

            const title = titleElement.textContent.trim();
            log('Question title:', title);
            const question = findQuestionByTitle(questions, title);

            if (!question) {
                log('No matching question found in answers');
                return;
            }

            setTimeout(() => {
                log('Question type:', question.type);
                if (questionDiv.classList.contains('match')) {
                    handleMatchQuestion(questionDiv, question.answers);
                } else if (questionDiv.classList.contains('multichoice')) {
                    handleMultiChoiceQuestion(questionDiv, question.answers);
                } else if (questionDiv.classList.contains('truefalse')) {
                    handleTrueFalseQuestion(questionDiv, question.answers);
                }

                // Si c'est la dernière question et autoNext est activé
                if (index === questionDivs.length - 1 && autoNext) {
                    setTimeout(() => {
                        const nextButton = document.querySelector('.mod_quiz-next-nav');
                        if (nextButton) {
                            log('Auto-navigating to next page...');
                            nextButton.click();
                        }
                    }, 500);
                }
            }, index * 200);
        });
    }

    function createControlPanel() {
    const panel = document.createElement('div');
    panel.className = 'quiz-control-panel';

    const title = document.createElement('h3');
    title.textContent = 'Auto-remplissage Quiz RGPD';
    panel.appendChild(title);

    const currentModule = detectCurrentModule();
    const moduleInfo = document.createElement('div');
    moduleInfo.className = 'module-info';
    moduleInfo.textContent = currentModule ?
        `Module détecté : Module ${currentModule.replace('module', '')}` :
        'Module non reconnu';
    panel.appendChild(moduleInfo);

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls-container';

    const fillButton = document.createElement('button');
    fillButton.className = 'btn btn-primary';
    fillButton.textContent = 'Remplir les réponses';
    fillButton.disabled = !currentModule;
    controlsContainer.appendChild(fillButton);

    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkbox-container';

    const autoNextCheckbox = document.createElement('input');
    autoNextCheckbox.type = 'checkbox';
    autoNextCheckbox.id = 'autoNextCheckbox';
    autoNextCheckbox.className = 'auto-next-checkbox';
    // Restaurer l'état précédent
    autoNextCheckbox.checked = getAutoNextState();

    const checkboxLabel = document.createElement('label');
    checkboxLabel.htmlFor = 'autoNextCheckbox';
    checkboxLabel.textContent = 'Auto';

    // Sauvegarder l'état quand la case est cochée/décochée
    autoNextCheckbox.addEventListener('change', () => {
        saveAutoNextState(autoNextCheckbox.checked);
    });

    checkboxContainer.appendChild(autoNextCheckbox);
    checkboxContainer.appendChild(checkboxLabel);
    controlsContainer.appendChild(checkboxContainer);

    fillButton.onclick = () => autoFillQuestions(currentModule, autoNextCheckbox.checked);

    panel.appendChild(controlsContainer);

    const debugInfo = document.createElement('div');
    debugInfo.className = 'debug-info';
    debugInfo.textContent = `État: ${currentModule ? 'Module trouvé' : 'Module non trouvé'}\nVérifiez la console pour plus de détails`;
    panel.appendChild(debugInfo);

    document.body.appendChild(panel);
}

    window.addEventListener('load', () => {
        createControlPanel();
    });
})();