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

    def is_truefalse_question(self, question_div):
        """Vérifie si une question est de type vrai/faux"""
        # Vérification explicite de la classe truefalse
        if 'truefalse' in question_div.get('class', []):
            return True

        # Recherche des inputs radio spécifiques vrai/faux
        true_false_inputs = question_div.select('input[type="radio"]')
        if len(true_false_inputs) == 2:
            labels = [self.clean_text(inp.find_next('label').get_text()).lower() if inp.find_next('label') else ''
                      for inp in true_false_inputs]
            true_false_pairs = [
                {'vrai', 'faux'},
                {'oui', 'non'},
                {'true', 'false'},
                {'yes', 'no'}
            ]
            return set(labels) in true_false_pairs

        return False

    def determine_question_type(self, question_div):
        """Détermine le type de question de manière plus précise"""
        # D'abord vérifier les classes explicites
        question_classes = question_div.get('class', [])

        if 'match' in question_classes:
            return 'match'

        if 'truefalse' in question_classes:
            return 'truefalse'

        # Pour les questions multichoice, vérifier le type d'input
        if 'multichoice' in question_classes:
            if question_div.find('input', type='checkbox'):
                return 'multiple'
            elif question_div.find('input', type='radio'):
                return 'single'

        # Vérification supplémentaire pour les questions vrai/faux
        if self.is_truefalse_question(question_div):
            return 'truefalse'

        return 'unknown'

    def parse_truefalse_question(self, question_div):
        """Parse une question vrai/faux"""
        answers = []
        inputs = question_div.find_all('input', type='radio')

        for input_elem in inputs:
            label = input_elem.find_next_sibling('label')
            if not label:
                label = input_elem.find_next('label')

            if label:
                is_correct = 'correct' in (input_elem.find_parent('div') or {}).get('class', [])
                answers.append({
                    'text': self.clean_text(label.get_text()),
                    'correct': is_correct
                })
        return answers

    def parse_single_choice_question(self, question_div):
        """Parse une question à choix unique"""
        answers = []
        for div in question_div.select('.r0, .r1'):
            is_correct = 'correct' in div.get('class', [])
            answer_text = div.select_one('.flex-fill')
            if answer_text:
                answers.append({
                    'text': self.clean_text(answer_text.get_text()),
                    'correct': is_correct
                })
        return answers

    def parse_multiple_choice_question(self, question_div):
        """Parse une question à choix multiple"""
        answers = []
        for div in question_div.select('.r0, .r1'):
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
                control = row.select_one('.control')
                is_correct = 'correct' in control.get('class', []) if control else False
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
            question_type = self.determine_question_type(div)

            question_data = {
                'id': idx,
                'title': self.extract_question_title(div),
                'type': question_type,
                'answers': []
            }

            if question_type == 'match':
                question_data['answers'] = self.parse_match_question(div)
            elif question_type == 'truefalse':
                question_data['answers'] = self.parse_truefalse_question(div)
            elif question_type == 'single':
                question_data['answers'] = self.parse_single_choice_question(div)
            elif question_type == 'multiple':
                question_data['answers'] = self.parse_multiple_choice_question(div)

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
    parser = argparse.ArgumentParser(description='Convertit un fichier HTML d\'examen en JSON')
    parser.add_argument('input_file', help='Chemin vers le fichier HTML d\'entrée')
    parser.add_argument('-o', '--output', help='Chemin du fichier JSON de sortie (optionnel)')

    args = parser.parse_args()

    if not os.path.exists(args.input_file):
        print(f"Erreur: Le fichier {args.input_file} n'existe pas")
        return

    output_file = args.output if args.output else f"{os.path.splitext(args.input_file)[0]}.json"

    exam_parser = ExamParser(args.input_file)
    print(f"Analyse du fichier: {args.input_file}")

    if not exam_parser.read_file():
        print("Impossible de lire le fichier d'entrée")
        return

    if not exam_parser.parse_questions():
        print("Erreur lors de l'analyse des questions")
        return

    if exam_parser.save_json(output_file):
        print(f"\nAnalyse terminée avec succès!")
        print(f"Fichier de sortie: {output_file}")
        print(f"Nombre de questions trouvées: {len(exam_parser.questions)}")
        print(f"Types de questions: {list(set(q['type'] for q in exam_parser.questions))}")
    else:
        print("Erreur lors de la sauvegarde du fichier de sortie")


if __name__ == '__main__':
    main()