import json
import os
from pathlib import Path


def read_template_js():
    """Lit le fichier template JS et extrait la partie après QUIZ_MODULES"""
    with open('quiz-autofill-script.user.js', 'r', encoding='utf-8') as f:
        content = f.read()
        # Trouve l'index après la définition de QUIZ_MODULES
        start = content.find('/**')
        if start == -1:
            raise Exception("Impossible de trouver le point d'insertion dans le template JS")
        return content[start:]


def create_module_config(module_number, questions):
    """Crée la configuration d'un module"""
    return {
        f'module{module_number}': {
            'moduleIdentifiers': [
                f'MODULE {module_number}',
                'RGPD ET SES NOTIONS CLÉS',
                'LE RGPD ET SES NOTIONS'
            ],
            'questions': questions
        }
    }


def generate_full_js(modules_config, template_end):
    """Génère le fichier JavaScript complet"""
    js_header = """// ==UserScript==
// @name         Cnull Script - RGPD Quiz AutoFill
// @namespace    https://github.com/Pixnop/Cnull
// @version      1.0
// @description  Automatise le remplissage des questionnaires du cours RGPD de la CNIL avec support multi-modules et auto-navigation
// @author       Léon Fievet
// @match        https://atelier-rgpd.cnil.fr/mod/quiz/*
// @icon         https://raw.githubusercontent.com/Pixnop/Cnull/main/logo/CNULL.png
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Configuration des modules
"""

    # Formater le JSON des modules avec une indentation de 4 espaces
    modules_json = json.dumps(modules_config, ensure_ascii=False, indent=4)

    # Formater la déclaration de QUIZ_MODULES
    modules_declaration = f"    const QUIZ_MODULES = {modules_json};\n\n"

    # Assembler le fichier complet
    return js_header + modules_declaration + template_end


def main():
    # Vérifier si le fichier template existe
    if not os.path.exists('quiz-autofill-script.user.js'):
        print("Erreur: Le fichier quiz-autofill-script.js est requis comme template!")
        return

    # Dossier contenant les fichiers JSON
    json_dir = Path('json_files')
    if not json_dir.exists():
        print(f"Le dossier {json_dir} n'existe pas. Création...")
        json_dir.mkdir(parents=True)
        print("Veuillez placer vos fichiers JSON (M1.json, M2.json, etc.) dans ce dossier.")
        return

    # Lire la partie template du fichier JS
    try:
        template_end = read_template_js()
    except Exception as e:
        print(f"Erreur lors de la lecture du template: {e}")
        return

    # Récupérer tous les fichiers JSON
    modules_config = {}
    for json_file in sorted(json_dir.glob('M*.json')):
        try:
            module_number = int(json_file.stem[1:])  # Enlève le 'M' et convertit en nombre
            print(f"Traitement de {json_file.name}...")

            with open(json_file, 'r', encoding='utf-8') as f:
                questions = json.load(f)

            modules_config.update(create_module_config(module_number, questions))

        except Exception as e:
            print(f"Erreur lors du traitement de {json_file}: {e}")
            continue

    if not modules_config:
        print("Aucun fichier JSON valide trouvé!")
        return

    # Générer le nouveau fichier JavaScript
    output_file = 'quiz-autofill-script-generated.user.js'
    full_js_content = generate_full_js(modules_config, template_end)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(full_js_content)

    print(f"\nScript généré avec succès: {output_file}")
    print(f"Modules inclus: {', '.join(sorted(modules_config.keys()))}")


if __name__ == '__main__':
    main()