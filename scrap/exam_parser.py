from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
import argparse
import os


class ExamParser:
    def __init__(self, file_path):
        self.file_path = file_path
        self.soup = None
        self.questions = []

    def read_file(self):
        """Lit le fichier HTML"""
        try:
            with open(self.file_path, 'r', encoding='utf-8') as file:
                content = file.read()
            self.soup = BeautifulSoup(content, 'html.parser')
            return True
        except Exception as e:
            print(f"Erreur lors de la lecture du fichier: {e}")
            return False

    def clean_text(self, text):
        """Nettoie le texte des espaces et retours à la ligne superflus"""
        if text:
            text = re.sub(r'\s+', ' ', text)
            text = text.strip()
            return text
        return ""

    def extract_question_title(self, question_div):
        """Extrait le titre de la question"""
        qtext = question_div.select_one('.qtext')
        if qtext:
            return self.clean_text(qtext.get_text())
        return ""

    def parse_truefalse_question(self, question_div):
        """Parse une question vrai/faux"""
        answers = []
        for input_radio in question_div.find_all('input', type='radio'):
            label = input_radio.find_next_sibling()
            is_correct = 'correct' in input_radio.parent.get('class', [])
            if label:
                answers.append({
                    'text': self.clean_text(label.get_text()),
                    'correct': is_correct
                })
        return answers

    def parse_multichoice_question(self, question_div):
        """Parse une question à choix unique ou multiple"""
        answers = []
        answer_divs = question_div.select('.answer .r0, .answer .r1')

        for div in answer_divs:
            is_correct = 'correct' in div.get('class', [])
            answer_text = div.select_one('.flex-fill')
            if answer_text:
                answers.append({
                    'text': self.clean_text(answer_text.get_text()),
                    'correct': is_correct
                })
        return answers

    def parse_match_question(self, question_div):
        """Parse une question d'appariement"""
        answers = []
        rows = question_div.select('table.answer tr')

        for row in rows:
            text_cell = row.select_one('.text')
            if text_cell:
                is_correct = 'correct' in row.select_one('.control').get('class', [])
                selected_option = row.select_one('select option[selected]')
                answers.append({
                    'text': self.clean_text(text_cell.get_text()),
                    'correct': is_correct,
                    'match': selected_option.get_text() if selected_option else ""
                })
        return answers

    def parse_questions(self):
        """Parse toutes les questions de l'examen"""
        if not self.soup:
            return False

        question_divs = self.soup.select('div[id^="question-"]')
        for idx, div in enumerate(question_divs, 1):
            question_data = {
                'id': idx,
                'title': self.extract_question_title(div),
                'type': 'unknown',
                'answers': []
            }

            # Détermine le type de question
            if 'truefalse' in div.get('class', []):
                question_data['type'] = 'truefalse'
                question_data['answers'] = self.parse_truefalse_question(div)
            elif 'multichoice' in div.get('class', []):
                is_multiple = div.find('input', type='checkbox') is not None
                question_data['type'] = 'multiple' if is_multiple else 'single'
                question_data['answers'] = self.parse_multichoice_question(div)
            elif 'match' in div.get('class', []):
                question_data['type'] = 'match'
                question_data['answers'] = self.parse_match_question(div)

            if question_data['title'] and question_data['answers']:
                self.questions.append(question_data)

        return True

    def get_json(self):
        """Retourne les résultats au format JSON"""
        result = {
            'questions': self.questions,
            'metadata': {
                'totalQuestions': len(self.questions),
                'types': list(set(q['type'] for q in self.questions)),
                'timestamp': datetime.now().isoformat(),
                'sourceFile': os.path.basename(self.file_path)
            }
        }
        return json.dumps(result, ensure_ascii=False, indent=2)

    def save_json(self, output_file):
        """Sauvegarde les résultats dans un fichier JSON"""
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(self.get_json())
            return True
        except Exception as e:
            print(f"Erreur lors de la sauvegarde du fichier JSON: {e}")
            return False


def main():
    # Configuration du parser d'arguments
    parser = argparse.ArgumentParser(description='Convertit un fichier HTML d\'examen en JSON')
    parser.add_argument('input_file', help='Chemin vers le fichier HTML d\'entrée')
    parser.add_argument('-o', '--output', help='Chemin du fichier JSON de sortie (optionnel)')

    # Parse les arguments
    args = parser.parse_args()

    # Vérifie si le fichier d'entrée existe
    if not os.path.exists(args.input_file):
        print(f"Erreur: Le fichier {args.input_file} n'existe pas")
        return

    # Détermine le nom du fichier de sortie
    if args.output:
        output_file = args.output
    else:
        # Utilise le même nom que le fichier d'entrée mais avec extension .json
        base_name = os.path.splitext(args.input_file)[0]
        output_file = f"{base_name}.json"

    # Création et exécution du parser
    exam_parser = ExamParser(args.input_file)

    print(f"Analyse du fichier: {args.input_file}")

    if not exam_parser.read_file():
        print("Impossible de lire le fichier d'entrée")
        return

    if not exam_parser.parse_questions():
        print("Erreur lors de l'analyse des questions")
        return

    # Sauvegarde le résultat
    if exam_parser.save_json(output_file):
        print(f"\nAnalyse terminée avec succès!")
        print(f"Fichier de sortie: {output_file}")
        print(f"Nombre de questions trouvées: {len(exam_parser.questions)}")
        print(f"Types de questions: {list(set(q['type'] for q in exam_parser.questions))}")
    else:
        print("Erreur lors de la sauvegarde du fichier de sortie")


if __name__ == '__main__':
    main()