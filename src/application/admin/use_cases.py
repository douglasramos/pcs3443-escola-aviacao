from __future__ import print_function
import sys

from persistance.persistance import db
from core.models import Admin, Student

from flask import abort
from pony.orm import *

from fpdf import FPDF
from datetime import datetime

import os


@db_session
def register_admin(email: str, password: str):
    if((Admin.get(email=email)) != None):
        abort(400, 'Email já cadastrado')

    adm = Admin(email=email, password=password)
    commit()

    return{"endpoint": "/api/admins/" + str(adm.ID)}


@db_session
def license_Emit(id: int):

    try:
        stud = Student[id]
    except ObjectNotFound:
        abort(404)

    title = 'Certificado de Conclusão'
    nome_aluno = stud.name
    data_Nascimento = str(stud.birth_date)
    data_Nascimento = datetime.strptime(data_Nascimento, '%Y-%m-%d')
    data_Nascimento = data_Nascimento.strftime('%d/%m/%Y')
    data_Conclusao = datetime.now().strftime('%d/%m/%Y')
    hora_Curso = stud.courseDuration
    print(hora_Curso, file=sys.stderr)

    if(hora_Curso == 10):
        nome_Curso = 'Habilitação Básica de Pilotagem'
    elif(hora_Curso == 20):
        nome_Curso = 'Pilotagem Comercial'
    elif(hora_Curso == 30):
        nome_Curso = 'Pilotagem de Aviões de Grande Porte'
    elif(hora_Curso == 50):
        nome_Curso = 'Habilitação para Instrutores de Voo'
    else:
        nome_Curso = 'Aviação'

    directory = os.path.dirname(__file__)
    directory = str(os.path.join(directory, 'licenses'))
    pdf_name = r'\breve_' + str(id) + '.pdf'

    class PDF(FPDF):
        def header(self):
            # Times bold 30
            self.set_font('Times', 'B', 30)
            # Thickness of frame (1 mm)
            self.set_line_width(1)
            # Title
            self.cell(0, 24, title, 0, 1, 'C')
            # Logo
            # Se necessario, eh possivel indicar o caminho para a imagem ao inves de deixa-la na mesma pasta da funcao
            self.image('logo_aviacao.png', 10, 8, 60)
            # Line break
            self.ln(20)

        def footer(self):
            # Position at 1.5 cm from bottom
            self.set_y(-15)
            # Times 10
            self.set_font('Times', '', 10)
            # Text color in gray
            self.set_text_color(128)
            # Instituicao
            pdf.cell(60, 10, 'Escola de Formação de Pilotos Voe Mais', 0, 1, 'C')

        def certificate_body(self):
            # Times 14
            self.set_font('Times', '', 14)
            # Conteudo do certificado
            pdf.cell(
                10, 10, '              A Escola de Formação de Pilotos Voe Mais certifica para os devidos fins que,', 0, 1, 'L')
            # Alterar letra para enfase no nome do aluno
            self.set_font('Times', 'B', 26)
            pdf.cell(0, 10, nome_aluno, 0, 1, 'C')
            # Retornar ao normal
            self.set_font('Times', '', 14)
            pdf.cell(43, 10, '              Nascido em ', 0, 0)
            pdf.cell(23, 10, data_Nascimento, 0, 0)
            # Mudar o nome do curso se for apropriado
            pdf.cell(64, 10, ', concluiu com êxito o curso de ', 0, 0)
            w = self.get_string_width(nome_Curso) + 2
            pdf.cell(w, 10, nome_Curso, 0, 0)
            pdf.cell(25, 10, 'em ' + data_Conclusao, 0, 0)
            # Assinatura do Diretor
            self.ln(70)
            pdf.cell(0, 10, '___________________                ', 0, 1, 'R')
            pdf.cell(0, 10, 'Diretor                            ', 0, 0, 'R')
            # Line break
            self.ln()

        def print_certificate(self):
            self.add_page('L')
            self.certificate_body()

    pdf = PDF()
    pdf.set_title(title)
    pdf.print_certificate()
    pdf.output(directory + pdf_name, 'F')

    return [directory, pdf_name[1:]]
