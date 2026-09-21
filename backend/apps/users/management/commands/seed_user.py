from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from apps.scopes.models import Scope
from apps.tasks.models import Tag


DEFAULT_SCOPES = [
    {'name': 'Trabajo', 'color': '#3b82f6', 'icon': 'briefcase', 'position': 0},
    {'name': 'Casa', 'color': '#22c55e', 'icon': 'home', 'position': 1},
    {'name': 'Empresa', 'color': '#f97316', 'icon': 'building', 'position': 2},
]

DEFAULT_TAGS = {
    'Trabajo': ['UTP', 'Dirección', 'Docentes', 'Estudiantes', 'Prácticas', 'Titulación', 'Reuniones', 'Informes'],
    'Casa': ['Compras', 'Mantención', 'Pagos', 'Limpieza', 'Mascotas'],
    'Empresa': ['Finanzas', 'Proveedores', 'Clientes', 'Ventas', 'Administración', 'Marketing'],
}


class Command(BaseCommand):
    help = 'Create initial user with default scopes and tags'

    def add_arguments(self, parser):
        parser.add_argument('--username', default='admin')
        parser.add_argument('--password', default='admin123')
        parser.add_argument('--email', default='admin@nexo.local')

    def handle(self, *args, **options):
        username = options['username']
        password = options['password']
        email = options['email']

        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': email, 'is_staff': True, 'is_superuser': True},
        )
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'User "{username}" created'))
        else:
            self.stdout.write(f'User "{username}" already exists')

        # Create scopes
        for scope_data in DEFAULT_SCOPES:
            scope, sc_created = Scope.objects.get_or_create(
                user=user,
                name=scope_data['name'],
                defaults=scope_data,
            )
            if sc_created:
                self.stdout.write(f'  Scope "{scope.name}" created')

        # Create tags
        for scope_name, tag_names in DEFAULT_TAGS.items():
            for tag_name in tag_names:
                tag, tg_created = Tag.objects.get_or_create(
                    user=user,
                    name=tag_name,
                )
                if tg_created:
                    self.stdout.write(f'  Tag "{tag_name}" created')

        self.stdout.write(self.style.SUCCESS('Seed complete!'))
