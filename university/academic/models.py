from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError
import re
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

class Department(models.Model):
    class Faculty(models.TextChoices):
        I_C = 'I&C', _('Information & Computing')
        E_T = 'E&T', _('Engineering & Technology')
        ISR = 'ISR', _('Interdisciplinary Studies & Research')
        LS = 'LS', _('Life Sciences')
        LAMS = 'LAMS', _('Liberal Arts & Media Studies')
        MS = 'MS', _('Management Studies')
        SC = 'SC', _('Sciences')
        CCSD = 'CCSD', _('Community College')

        def __str__(self):
            return self.label  # Or self.value

    name = models.CharField(max_length=100, unique=True, help_text=_("Enter the name of the department (e.g., Computer Science)."))
    faculty = models.CharField(max_length=50, choices=Faculty.choices, help_text=_("Select the faculty to which this department belongs."))
    slug = models.SlugField(max_length=100, blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Department")
        verbose_name_plural = _("Departments")
        constraints = [
            models.UniqueConstraint(fields=['name'], name='unique_department_name')
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def clean(self):
        if not re.match(r'^[a-zA-Z0-9\s]+$', self.name):  # Updated regex
            raise ValidationError(_("Department name can only contain letters, numbers, and spaces."))

    def get_absolute_url(self):
        return reverse('department-detail', args=[str(self.id)])