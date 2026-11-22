# Adiciona a pontuação de desempenho à GPU (escala 0–100, RTX 5080 = 100).
# Decisão da equipe: só VRAM e preço não bastavam para o motor diferenciar as
# placas de vídeo nos três níveis de setup. Os valores das peças já cadastradas
# são preenchidos pelo comando "python manage.py carregar_pecas".

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("componentes", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="gpu",
            name="pontuacao_desempenho",
            field=models.IntegerField(
                default=0,
                help_text="Escala 0–100 (RTX 5080 = 100). Usada pelo motor de recomendação",
            ),
            preserve_default=False,
        ),
    ]
